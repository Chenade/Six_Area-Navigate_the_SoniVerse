/******************************************************************************
 * This program is protected under international and U.S. copyright laws as
 * an unpublished work. This program is confidential and proprietary to the
 * copyright owners. Reproduction or disclosure, in whole or in part, or the
 * production of derivative works therefrom without the express permission of
 * the copyright owners is prohibited.
 *
 *                Copyright (C) 2021-2022 by Dolby Laboratories.
 *                            All rights reserved.
 ******************************************************************************/

#include "DolbyAtmosSoundfield.h"

#define _USE_MATH_DEFINES

#include <math.h>

#include "SoundFieldRendering.h"
#include "Modules/ModuleManager.h"

#include "DolbyAtmosSoundfieldSettings.h"
#include "DolbyAtmosPluginModule.h"
#include "DolbyCoordinates.h"

#define DEBUG_SOUNDFIELDS 0

namespace DolbyGameKit
{
    bool streamStartedEncoding = false;
    bool streamStartedTranscoding = false;

    class FDolbySoundfieldEncoder : public ISoundfieldEncoderStream
    {
    private:
        Audio::FDeviceId mDeviceID { 0 };
        FDolbyGameKitUnrealModule* mDolbyGameKitUnrealModule;

    public:

        FDolbySoundfieldEncoder(Audio::FDeviceId deviceId, int32 InNumChannels)
            : mDeviceID(deviceId)
        {
            mDolbyGameKitUnrealModule = &FModuleManager::GetModuleChecked<FDolbyGameKitUnrealModule>("DolbyAtmos");
        }
        virtual ~FDolbySoundfieldEncoder() { mDolbyGameKitUnrealModule = nullptr; };

        virtual void Encode(const FSoundfieldEncoderInputData& inputData, ISoundfieldAudioPacket& outputData) override
        {
            outputData.Reset();
            EncodeAndMixIn(inputData, outputData);
        }

        virtual void EncodeAndMixIn(const FSoundfieldEncoderInputData& inputData, ISoundfieldAudioPacket& outputData) override
        {
            const auto deviceHandle = FAudioDeviceManager::Get()->GetAudioDeviceRaw(mDeviceID + 1);
            // should be active if not muted.
#if WITH_EDITOR
            const auto bIsDeviceActive = !mDolbyGameKitUnrealModule->IsPIEPaused() && deviceHandle && !(deviceHandle->IsAudioDeviceMuted());
#else
            const auto bIsDeviceActive = deviceHandle && !(deviceHandle->IsAudioDeviceMuted());
#endif
            if (!bIsDeviceActive)
            {
                return;
            }
            const Audio::AlignedFloatBuffer& inputAudio = inputData.AudioBuffer;
            const FSoundfieldSpeakerPositionalData& positionalData = inputData.PositionalData;
            const auto numInputChannels = inputData.NumChannels;
            const auto numFrames = inputData.AudioBuffer.Num() / numInputChannels;

            const Audio::FChannelPositionInfo& channelPosition = (*positionalData.ChannelPositions)[0];

            const TSample* const pSamples = &(*inputData.AudioBuffer.begin());

            //  TODO:  remove DegreesToRadians if UE fixes this!!!

            DolbyGameKit::PolarCoordinates unrealPolarCoordinates{ 
                DolbyGameKit::DegreesToRadians(channelPosition.Azimuth),
                DolbyGameKit::DegreesToRadians(channelPosition.Elevation),
                channelPosition.Radius
            };
            DolbyGameMetadata dolbyGameMetadata;
            dolbyGameMetadata.coordinates = DolbyGameKit::PolarToAtmos(unrealPolarCoordinates);

#if DEBUG_SOUNDFIELDS
            // Show both what Unreal gives us as values and the polar->cartesian in atmos space
            if (GEngine)
            {
                GEngine->AddOnScreenDebugMessage(-1, 15.f, FColor::Yellow,
                    FString::Printf(TEXT("Encode: Az=%f, El=%f, Rad=%f"),
                        channelPosition.Azimuth, channelPosition.Elevation, channelPosition.Radius));
                GEngine->AddOnScreenDebugMessage(-1, 15.f, FColor::Yellow,
                    FString::Printf(TEXT("Atmos Coords: X=%f, Y=%f, Z=%f"),
                        dolbyGameMetadata.coordinates.x, dolbyGameMetadata.coordinates.y,
                        dolbyGameMetadata.coordinates.z));
            }
#endif
            const auto flattenedID = DolbyGameAPI_GetUniqueSourceID(mDeviceID, inputData.InputSettings.GetUniqueId());

            // this assumes a 5.1 or 7.1 bed in SMPTE channel order
            // We are also treating stereo that comes into Soundfield to be directly mixed into L/R
            // Mono to be sent to the Center channel or split to L/R if the output device is stereo
            // and we ignoring the speaker position data that comes with the mono/stereo asset
            DolbyGameAPI_AddBedToPresentation(pSamples,
                flattenedID,
                numInputChannels,
                numFrames,
                true);
            
            streamStartedEncoding = true;
        }
    };

    class FDolbySoundfieldDecoder : public ISoundfieldDecoderStream
    {
    private:
        class FDolbyGameKitUnrealModule* mDolbyGameKitUnrealModule;
        bool mRegisteredAsFlushRequester{ false };
        Audio::FDeviceId mDeviceID{ 0 };

    public:

        FDolbySoundfieldDecoder(Audio::FDeviceId deviceId)
            : mDeviceID(deviceId)
        {
            mDolbyGameKitUnrealModule = &FModuleManager::GetModuleChecked<FDolbyGameKitUnrealModule>("DolbyAtmos");
        }
        
        virtual ~FDolbySoundfieldDecoder()
        {
            if (mRegisteredAsFlushRequester && (mDolbyGameKitUnrealModule != nullptr))
            {
                mRegisteredAsFlushRequester = false;
                mDolbyGameKitUnrealModule->UnRegisterFlushRequester(this);
            }
        }

        virtual void Decode(const FSoundfieldDecoderInputData& InputData, FSoundfieldDecoderOutputData& outputData) override
        {
        }

		virtual void DecodeAndMixIn(const FSoundfieldDecoderInputData& InputData, FSoundfieldDecoderOutputData& outputData) override
        {
            const auto bIsModuleInitialized = (mDolbyGameKitUnrealModule != nullptr && mDolbyGameKitUnrealModule->IsAvailable() && mDolbyGameKitUnrealModule->IsInitializedDolbyGameKit());
#if WITH_EDITOR
            const auto startedProcessing = !mDolbyGameKitUnrealModule->IsPIEPaused() && (streamStartedEncoding || streamStartedTranscoding);
#else
            const auto startedProcessing = streamStartedEncoding || streamStartedTranscoding;
#endif
            if (bIsModuleInitialized && startedProcessing)
            {
                const auto deviceHandle = FAudioDeviceManager::Get()->GetAudioDeviceRaw(mDeviceID + 1);
                // should be active if not muted.
                const auto bIsDeviceActive = deviceHandle && !(deviceHandle->IsAudioDeviceMuted());
                if (bIsDeviceActive)
                {
                    if (!mRegisteredAsFlushRequester)
                    {
                        mRegisteredAsFlushRequester = true;
                        mDolbyGameKitUnrealModule->RegisterFlushRequester(this);
                    }
                    // Normally, we want to request a flush after registering, but these soundfields
                    // tend to get two decode() calls back-to-back when they are activated.
                    // Adding this "else" statement ignores this first flush, which helps keep
                    // the flushing process synchronized.
                    else
                    {
                        mDolbyGameKitUnrealModule->RequestFlush(this);
                    }
                }
                else
                {
                    if (mRegisteredAsFlushRequester)
                    {
                        mRegisteredAsFlushRequester = false;
                        mDolbyGameKitUnrealModule->UnRegisterFlushRequester(this);
                    }
                }
            }
        }
    };

    class FDolbyGameKitAudioMixer : public ISoundfieldMixerStream
    {
    private:

    public:
        FDolbyGameKitAudioMixer() {}

        virtual void MixTogether(const FSoundfieldMixerInputData& inputData, ISoundfieldAudioPacket& outputData) override
        {
        }
    };

    FDolbyGameKitSoundfieldFactory::FDolbyGameKitSoundfieldFactory()
    {
        ISoundfieldFactory::RegisterSoundfieldFormat(this);
    }

    FDolbyGameKitSoundfieldFactory::~FDolbyGameKitSoundfieldFactory()
    {
        ISoundfieldFactory::UnregisterSoundfieldFormat(this);
    }

    FName FDolbyGameKitSoundfieldFactory::GetSoundfieldFormatName()
    {
        static FName DolbyGameKitSoundfieldFormat = TEXT("Dolby Atmos");
        return DolbyGameKitSoundfieldFormat;
    }

    TUniquePtr<ISoundfieldEncoderStream> FDolbyGameKitSoundfieldFactory::CreateEncoderStream(const FAudioPluginInitializationParams& InitInfo, const ISoundfieldEncodingSettingsProxy& InitialSettings)
    {
        const FDolbyGameKitSoundfieldSettingsProxy& Settings = DowncastSoundfieldRef<const FDolbyGameKitSoundfieldSettingsProxy>(InitialSettings);
        FAudioDevice* AudioDevice = InitInfo.AudioDevicePtr;

        check(AudioDevice);

        // deviceID is one-indexed. We are changing it to be 0-indexed.
        const auto adjustedDeviceID = AudioDevice->DeviceID - 1;

        return TUniquePtr<ISoundfieldEncoderStream>(new FDolbySoundfieldEncoder(adjustedDeviceID, InitInfo.NumOutputChannels));
    }

    TUniquePtr<ISoundfieldDecoderStream> FDolbyGameKitSoundfieldFactory::CreateDecoderStream(const FAudioPluginInitializationParams& InitInfo, const ISoundfieldEncodingSettingsProxy& InitialSettings)
    {
        FAudioDevice* AudioDevice = InitInfo.AudioDevicePtr;

        check(AudioDevice);

        // deviceID is one-indexed. We are changing it to be 0-indexed.
        const auto adjustedDeviceID = AudioDevice->DeviceID - 1;

        return TUniquePtr<ISoundfieldDecoderStream>(new FDolbySoundfieldDecoder(adjustedDeviceID));
    }

    TUniquePtr<ISoundfieldMixerStream> FDolbyGameKitSoundfieldFactory::CreateMixerStream(const ISoundfieldEncodingSettingsProxy& InitialSettings)
    {
        return TUniquePtr<ISoundfieldMixerStream>(new FDolbyGameKitAudioMixer());
    }

    TUniquePtr<ISoundfieldAudioPacket> FDolbyGameKitSoundfieldFactory::CreateEmptyPacket()
    {
        return TUniquePtr<ISoundfieldAudioPacket>(new FDolbyGameKitAudioPacket());
    }

    UClass* FDolbyGameKitSoundfieldFactory::GetCustomEncodingSettingsClass() const
    {
        return UDolbyGameKitSoundfieldSettings::StaticClass();
    }

    const USoundfieldEncodingSettingsBase* FDolbyGameKitSoundfieldFactory::GetDefaultEncodingSettings()
    {
        return GetDefault<UDolbyGameKitSoundfieldSettings>();
    }

    void FDolbyGameKitAudioPacket::Serialize(FArchive& Ar)
    {
        // Since the FDolbyGameKitAudioPacket is just a handle to the API,
        // we don't have anything to serialize.
    }

    TUniquePtr<ISoundfieldAudioPacket> FDolbyGameKitAudioPacket::Duplicate() const
    {
        FDolbyGameKitAudioPacket* Packet = new FDolbyGameKitAudioPacket();
        return TUniquePtr<ISoundfieldAudioPacket>(Packet);
    }

    void FDolbyGameKitAudioPacket::Reset()
    {
    }
}
