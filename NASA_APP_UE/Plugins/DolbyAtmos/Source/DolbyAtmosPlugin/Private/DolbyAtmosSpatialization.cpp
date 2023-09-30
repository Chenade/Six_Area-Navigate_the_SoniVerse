/******************************************************************************
 * This program is protected under international and U.S. copyright laws as
 * an unpublished work. This program is confidential and proprietary to the
 * copyright owners. Reproduction or disclosure, in whole or in part, or the
 * production of derivative works therefrom without the express permission of
 * the copyright owners is prohibited.
 *
 *                Copyright (C) 2021-2023 by Dolby Laboratories.
 *                            All rights reserved.
 ******************************************************************************/

#include "DolbyAtmosSpatialization.h"

#include "Modules/ModuleManager.h"

#include "DolbyAtmosPluginModule.h"

namespace DolbyGameKit
{
    static bool sbPassThrough = true;

    FDolbyGameKitSpatialization::FDolbyGameKitSpatialization()
        : DolbyGameKitUnrealModule(nullptr)
    {
    }

    FDolbyGameKitSpatialization::FDolbyGameKitSpatialization(Audio::FDeviceId deviceId)
        : DolbyGameKitUnrealModule(nullptr),
          mDeviceID(deviceId)
    {
    }

    FDolbyGameKitSpatialization::~FDolbyGameKitSpatialization()
    {
    }

    void FDolbyGameKitSpatialization::Initialize(const FAudioPluginInitializationParams InitializationParams)
    {
        DolbyGameKitUnrealModule = &FModuleManager::GetModuleChecked<FDolbyGameKitUnrealModule>("DolbyAtmos");
        deinterleavedBuffer.SetNumUninitialized(InitializationParams.BufferLength * 2);
        FMemory::Memset(deinterleavedBuffer.GetData(), 0.0f, sizeof(float) * 2);
    }

    void FDolbyGameKitSpatialization::Shutdown()
    {
        if (mRegisteredAsFlushRequester && (DolbyGameKitUnrealModule != nullptr))
        {
            mRegisteredAsFlushRequester = false;
            DolbyGameKitUnrealModule->UnRegisterFlushRequester(this);
        }

        deinterleavedBuffer.Empty();

        DolbyGameKitUnrealModule = nullptr;
    }

    bool FDolbyGameKitSpatialization::IsSpatializationEffectInitialized() const
    {
        const auto bIsNonNull = (DolbyGameKitUnrealModule != nullptr);
        const auto bIsAvailiable = bIsNonNull && DolbyGameKitUnrealModule->IsAvailable();
        const auto bIsInitializedDolbyGameKit = bIsNonNull && DolbyGameKitUnrealModule->IsInitializedDolbyGameKit();
        const auto bIsInitialized = bIsNonNull && bIsAvailiable && bIsInitializedDolbyGameKit;
        return bIsInitialized;
    }

    void FDolbyGameKitSpatialization::OnInitSource(const uint32 SourceId, const FName& AudioComponentUserId, USpatializationPluginSourceSettingsBase* InSettings)
    {
        if (IsSpatializationEffectInitialized())
        {
            // this source id is used against multiple devices (if they exist).
            const auto flattenedSourceID = DolbyGameAPI_GetUniqueSourceID(mDeviceID, SourceId);

            DolbyGameAPI_StartDynamicObject(flattenedSourceID);
        }
    }

    void FDolbyGameKitSpatialization::OnReleaseSource(const uint32 SourceId)
    {
        if (IsSpatializationEffectInitialized())
        {
            // this source id is used against multiple devices (if they exist).
            const auto flattenedSourceID = DolbyGameAPI_GetUniqueSourceID(mDeviceID, SourceId);
            DolbyGameAPI_StopDynamicObject(flattenedSourceID);
        }
    }

    void FDolbyGameKitSpatialization::ProcessAudio(const FAudioPluginSourceInputData& InputData, FAudioPluginSourceOutputData& OutputData)
    {
        const auto deviceHandle = FAudioDeviceManager::Get()->GetAudioDeviceRaw(mDeviceID + 1);

#if WITH_EDITOR
        const auto bIsDeviceActive = !DolbyGameKitUnrealModule->IsPIEPaused() && deviceHandle && !(deviceHandle->IsAudioDeviceMuted());
#else
        const auto bIsDeviceActive = deviceHandle && !(deviceHandle->IsAudioDeviceMuted());
#endif
        if (IsSpatializationEffectInitialized() && InputData.AudioBuffer != nullptr && bIsDeviceActive)
        {
            const unsigned int numChannels = InputData.NumChannels;
            const unsigned int numSamplesPerFrame = static_cast<const unsigned int>(InputData.AudioBuffer->Num());
            const unsigned int numSamplesPerChannel = numSamplesPerFrame / numChannels;
            const TSample* const pSamples = &(*InputData.AudioBuffer->GetData());
            TSample* pSamplesDeinterleaved = deinterleavedBuffer.GetData();
            
            // this source id is used against multiple devices (if they exist).
            const auto flattenedSourceID = DolbyGameAPI_GetUniqueSourceID(mDeviceID, InputData.SourceId);

            if (numChannels == 1)
            {
                DolbyGameMetadata dolbyGameMetadata;

                float scaleFactor = 1.0f / InputData.SpatializationParams->NormalizedOmniRadius;

                dolbyGameMetadata.coordinates =
                    UnrealCartesianToAtmos(InputData.SpatializationParams->EmitterPosition, scaleFactor);

                DolbyGameAPI_AddMonoToPresentation(
                    pSamples,
                    flattenedSourceID,
                    numSamplesPerChannel,
                    &dolbyGameMetadata);
            }
            else if (numChannels == 2)
            {
                auto pSamplesIsDeinterleaved = DolbyGameKit::DeinterleaveAudioBuffer(pSamples, numChannels, numSamplesPerChannel, pSamplesDeinterleaved);
                auto samplesToUse = pSamplesIsDeinterleaved ? pSamplesDeinterleaved : pSamples;
                if (!pSamplesIsDeinterleaved)
                {
                    UE_LOG(LogDolbyAtmos, Warning, TEXT("The Audio Buffer failed to deinterleave...processed audio is interleaved."));
                }
                
                float scaleFactor = 1.0f / InputData.SpatializationParams->NormalizedOmniRadius;

                DolbyGameMetadata leftPositionMetadata;
                leftPositionMetadata.coordinates =
                    UnrealCartesianToAtmos(InputData.SpatializationParams->LeftChannelPosition, scaleFactor);

                DolbyGameMetadata rightPositionMetadata;
                rightPositionMetadata.coordinates =
                    UnrealCartesianToAtmos(InputData.SpatializationParams->RightChannelPosition, scaleFactor);

                DolbyGameAPI_AddStereoToPresentation(
                    samplesToUse,
                    flattenedSourceID,
                    numSamplesPerChannel,
                    !pSamplesIsDeinterleaved,
                    &leftPositionMetadata,
                    &rightPositionMetadata);
            }
            else
            {
                // this assumes a 5.1 or 7.1 bed in SMPTE channel order
                DolbyGameAPI_AddBedToPresentation(
                    pSamples,
                    flattenedSourceID,
                    numChannels,
                    numSamplesPerChannel,
                    true);
            }
        }

        return;
    }

    DolbyGameKit::AtmosCoordinates FDolbyGameKitSpatialization::UnrealCartesianToAtmos(FVector emitterPosition,  float scaleFactor)
    {
        //  UE uses a left hand Z up coordinate space
        DolbyGameKit::CartesianCoordinates gameCoordinates = {
            static_cast<float>(emitterPosition.Y),
            static_cast<float>(-emitterPosition.Z),
            static_cast<float>(emitterPosition.X) };

        return DolbyGameKit::CartesianToAtmos(gameCoordinates, scaleFactor >  1.0? 1.0f : scaleFactor);
    }

    void FDolbyGameKitSpatialization::OnAllSourcesProcessed()
    {
        if (IsSpatializationEffectInitialized())
        {
            const auto deviceHandle = FAudioDeviceManager::Get()->GetAudioDeviceRaw(mDeviceID + 1);
            const auto bIsDeviceActive = deviceHandle && !(deviceHandle->IsAudioDeviceMuted());
            if (bIsDeviceActive)
            {
                if (!mRegisteredAsFlushRequester)
                {
                    mRegisteredAsFlushRequester = true;
                    DolbyGameKitUnrealModule->RegisterFlushRequester(this);
                }

                DolbyGameKitUnrealModule->RequestFlush(this);
            }
            else
            {
                if (mRegisteredAsFlushRequester)
                {
                    mRegisteredAsFlushRequester = false;
                    DolbyGameKitUnrealModule->UnRegisterFlushRequester(this);
                }
            }
        }
    }
}
