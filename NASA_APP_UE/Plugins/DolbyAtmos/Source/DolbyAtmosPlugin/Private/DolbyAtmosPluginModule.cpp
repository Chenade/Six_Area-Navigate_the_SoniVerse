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

#include "DolbyAtmosPluginModule.h"

#include "AudioMixerTypes.h"
#include "AudioMixerDevice.h"
#include "AudioDeviceManager.h"
#include "Features/IModularFeatures.h"
#include "Misc/CoreDelegates.h"

#include "DolbyAtmosSpatialization.h"
#include "DolbyAtmosExternalEndpoints.h"
#include "DolbyAtmosSettings.h"
#if WITH_EDITOR
#include "Editor.h"
#include "ISettingsModule.h"
#include "ISettingsEditorModule.h"
#include "Sound/AudioSettings.h"
#endif

#define _USE_MATH_DEFINES

#include <cassert>
#include <cmath>
#include <stdexcept>

IMPLEMENT_MODULE(DolbyGameKit::FDolbyGameKitUnrealModule, DolbyAtmos)

DEFINE_LOG_CATEGORY(LogDolbyAtmos);
DEFINE_LOG_CATEGORY(LogDolbyAtmosBackend);

namespace DolbyGameKit
{
    /* Dolby Atmos Front Heights Endpoint Factory implementation */

    FDolbyAtmosFrontHeightsEndpointFactory::FDolbyAtmosFrontHeightsEndpointFactory()
    {
        IAudioEndpointFactory::RegisterEndpointType(this);
        bIsImplemented = true;
    }

    FDolbyAtmosFrontHeightsEndpointFactory::~FDolbyAtmosFrontHeightsEndpointFactory()
    {
        IAudioEndpointFactory::UnregisterEndpointType(this);
    }

    FName FDolbyAtmosFrontHeightsEndpointFactory::GetEndpointTypeName()
    {
        return TEXT("Dolby Atmos Front Heights");
    }

    TUniquePtr<IAudioEndpoint> FDolbyAtmosFrontHeightsEndpointFactory::CreateNewEndpointInstance(const FAudioPluginInitializationParams& InitInfo, const IAudioEndpointSettingsProxy& InitialSettings)
    {
        const FDolbyAtmosEndpointSettingsProxy& Settings = DowncastSoundfieldRef<const FDolbyAtmosEndpointSettingsProxy>(InitialSettings);
        auto deviceHandle = InitInfo.AudioDevicePtr;
        DolbyAtmos::FDolbyAtmosFrontHeightsEndpoint* Endpoint = new DolbyAtmos::FDolbyAtmosFrontHeightsEndpoint(deviceHandle);
        if (!Endpoint->IsEndpointAllowed())
        {
            UE_LOG(LogDolbyAtmos, Warning, TEXT("Only one instance of %s endpoint submit is allowed.  Additional instances ignored."), *GetEndpointTypeName().ToString());
        }
        return TUniquePtr<IAudioEndpoint>(Endpoint);
    }

    /* Dolby Atmos Mid Heights Endpoint Factory implementation */

    FDolbyAtmosMidHeightsEndpointFactory::FDolbyAtmosMidHeightsEndpointFactory()
    {
        IAudioEndpointFactory::RegisterEndpointType(this);
        bIsImplemented = true;
    }

    FDolbyAtmosMidHeightsEndpointFactory::~FDolbyAtmosMidHeightsEndpointFactory()
    {
        IAudioEndpointFactory::UnregisterEndpointType(this);
    }

    FName FDolbyAtmosMidHeightsEndpointFactory::GetEndpointTypeName()
    {
        return TEXT("Dolby Atmos Mid Heights");
    }

    TUniquePtr<IAudioEndpoint> FDolbyAtmosMidHeightsEndpointFactory::CreateNewEndpointInstance(const FAudioPluginInitializationParams& InitInfo, const IAudioEndpointSettingsProxy& InitialSettings)
    {
        const FDolbyAtmosEndpointSettingsProxy& Settings = DowncastSoundfieldRef<const FDolbyAtmosEndpointSettingsProxy>(InitialSettings);
        auto deviceHandle = InitInfo.AudioDevicePtr;
        DolbyAtmos::FDolbyAtmosMidHeightsEndpoint* Endpoint = new DolbyAtmos::FDolbyAtmosMidHeightsEndpoint(deviceHandle);
        if (!Endpoint->IsEndpointAllowed())
        {
            UE_LOG(LogDolbyAtmos, Warning, TEXT("Only one instance of %s endpoint submit is allowed.  Additional instances ignored."), *GetEndpointTypeName().ToString());
        }
        return TUniquePtr<IAudioEndpoint>(Endpoint);
    }

    /* Dolby Atmos Rear Heights Endpoint Factory implementation */

    FDolbyAtmosRearHeightsEndpointFactory::FDolbyAtmosRearHeightsEndpointFactory()
    {
        IAudioEndpointFactory::RegisterEndpointType(this);
        bIsImplemented = true;
    }

    FDolbyAtmosRearHeightsEndpointFactory::~FDolbyAtmosRearHeightsEndpointFactory()
    {
        IAudioEndpointFactory::UnregisterEndpointType(this);
    }

    FName FDolbyAtmosRearHeightsEndpointFactory::GetEndpointTypeName()
    {
        return TEXT("Dolby Atmos Rear Heights");
    }

    TUniquePtr<IAudioEndpoint> FDolbyAtmosRearHeightsEndpointFactory::CreateNewEndpointInstance(const FAudioPluginInitializationParams& InitInfo, const IAudioEndpointSettingsProxy& InitialSettings)
    {
        const FDolbyAtmosEndpointSettingsProxy& Settings = DowncastSoundfieldRef<const FDolbyAtmosEndpointSettingsProxy>(InitialSettings);
        auto deviceHandle = InitInfo.AudioDevicePtr;
        DolbyAtmos::FDolbyAtmosRearHeightsEndpoint* Endpoint = new DolbyAtmos::FDolbyAtmosRearHeightsEndpoint(deviceHandle);
        if (!Endpoint->IsEndpointAllowed())
        {
            UE_LOG(LogDolbyAtmos, Warning, TEXT("Only one instance of %s endpoint submit is allowed.  Additional instances ignored."), *GetEndpointTypeName().ToString());
        }
        return TUniquePtr<IAudioEndpoint>(Endpoint);
    }

    UDolbyGameKitSpatializationSourceSettings* FDolbyGameKitUnrealModule::GlobalSpatializationSourceSettings = nullptr;


    FDolbyGameKitUnrealModule::FDolbyGameKitUnrealModule()
    {
    }

    FDolbyGameKitUnrealModule::~FDolbyGameKitUnrealModule()
    {
    }

    void FDolbyGameKitUnrealModule::RegisterFlushRequester(const void* requester)
    {
        FScopeLock Lock(&FlushRequestersCriticalSection);
        RegisteredFlushRequesters.AddUnique(requester);
    }

    void FDolbyGameKitUnrealModule::UnRegisterFlushRequester(const void* requester)
    {
        FScopeLock Lock(&FlushRequestersCriticalSection);
        RegisteredFlushRequesters.Remove(requester);
        PendingFlushRequesters.Remove(requester);
        // if we are waiting on this requester for a flush, perform immediately.
        if ((RegisteredFlushRequesters.Num() > 0) && (PendingFlushRequesters.Num() == RegisteredFlushRequesters.Num()))
        {
            // catch and log exception if flush times out
            try
            {
                DolbyGameAPI_FlushPresentationToSink();
            }
            catch (std::runtime_error const& exception)
            {
                UE_LOG(LogDolbyAtmos, Warning, TEXT("%S"), exception.what());
            }

            // Empty with slack to prevent constant deallocation/reallocation of TArray memory
            PendingFlushRequesters.Empty(RegisteredFlushRequesters.Num());
        }
    }

    void FDolbyGameKitUnrealModule::RequestFlush(const void* requester)
    {
        if (RegisteredFlushRequesters.Contains(requester))
        {
            // Prevent race conditions on PendingFlushRequesters state.
            FScopeLock Lock(&FlushRequestersCriticalSection);

            bool outOfSyncFlushRequest = PendingFlushRequesters.Contains(requester);
            if (outOfSyncFlushRequest)
            {
                // this case implies that a registered flush-requester has failed to request a flush. To prevent problems, initiate a flush anyway.
                // UE_LOG(LogDolbyAtmos, Warning, TEXT("In RequestFlush(), requester was seen twice before seeing all other expected requests. Performing flush."));
            }
            else
            {
                PendingFlushRequesters.Add(requester);
            }

            // if (a) all requesters have requested
            // or (b) if a requester has already exists in requestor list
            // then perform flush
            if((PendingFlushRequesters.Num() == RegisteredFlushRequesters.Num()) ||
                outOfSyncFlushRequest)
            {
                // catch and log exception if flush times out
                try
                {
#if WITH_EDITOR
                    if (!mPIEPaused)
#endif
                    {
                        DolbyGameAPI_FlushPresentationToSink();
                    }
                }
                catch (std::runtime_error const& exception)
                {
                    UE_LOG(LogDolbyAtmos, Warning, TEXT("%S"), exception.what());
                }

                // Empty with slack to prevent constant deallocation/reallocation of TArray memory
                PendingFlushRequesters.Empty(RegisteredFlushRequesters.Num());
            }
        }
        else
        {
            UE_LOG(LogDolbyAtmos, Warning, TEXT("In RequestFlush(), requester had not been previously registered, ignoring flush request."));
        }
    }

    void FDolbyGameKitUnrealModule::StartupModule()
    {
        check(mBuffers.Num() == 0);

        // Register the Dolby Game Kit plugin factories.
        IModularFeatures::Get().RegisterModularFeature(FDolbySpatializationPluginFactory::GetModularFeatureName(), &SpatializationPluginFactory);

        if (!IsRunningDedicatedServer() && !GlobalSpatializationSourceSettings)
        {
            if (!GlobalSpatializationSourceSettings)
            {
                GlobalSpatializationSourceSettings = NewObject<UDolbyGameKitSpatializationSourceSettings>(UDolbyGameKitSpatializationSourceSettings::StaticClass(), TEXT("Default Global Dolby Atmos Spatialization Preset"));
            }

            if (GlobalSpatializationSourceSettings)
            {
                GlobalSpatializationSourceSettings->AddToRoot();
            }
        }

        // Registering the endpoint factories
        IModularFeatures::Get().RegisterModularFeature(FDolbyAtmosFrontHeightsEndpointFactory::GetModularFeatureName(), &DolbyAtmosFrontHeightsEndpointFactory);
        IModularFeatures::Get().RegisterModularFeature(FDolbyAtmosMidHeightsEndpointFactory::GetModularFeatureName(), &DolbyAtmosMidHeightsEndpointFactory);
        IModularFeatures::Get().RegisterModularFeature(FDolbyAtmosRearHeightsEndpointFactory::GetModularFeatureName(), &DolbyAtmosRearHeightsEndpointFactory);

        mMasterSubmixBufferListener = std::make_unique<DolbyGameKitMasterSubmixBufferListener>();

        DeviceCreatedHandle = FAudioDeviceManagerDelegates::OnAudioDeviceCreated.AddRaw(this, &FDolbyGameKitUnrealModule::OnNewDeviceCreated);
        DeviceDestroyedHandle = FAudioDeviceManagerDelegates::OnAudioDeviceDestroyed.AddRaw(this, &FDolbyGameKitUnrealModule::OnDeviceDestroyed);
#if WITH_EDITOR
#if 0   // Currently unused Delegates (here for ease of adding later)

        // Sent when a PIE session is beginning (before we decide if PIE can run - allows clients to avoid blocking PIE)
        FEditorDelegates::PreBeginPIE.AddRaw(this, &FDolbyGameKitUnrealModule::OnPreBeginPIE);

        // Sent when a PIE session has fully started and after BeginPlay() has been called
        FEditorDelegates::PostPIEStarted.AddRaw(this, &FDolbyGameKitUnrealModule::OnPostPIEStarted);

        // Sent when a PIE session is ending, before anything else happens
        FEditorDelegates::PrePIEEnded.AddRaw(this, &FDolbyGameKitUnrealModule::OnPrePIEEnded);

        // Sent when a PIE session is single-stepped
        FEditorDelegates::SingleStepPIE.AddRaw(this, &FDolbyGameKitUnrealModule::OnSingleStepPIE);

        // Sent just before the user switches between from PIE to SIE, or vice-versa.  Passes in whether we are currently in SIE
        FEditorDelegates::OnPreSwitchBeginPIEAndSIE.AddRaw(this, &FDolbyGameKitUnrealModule::OnPreSwitchBeginPIEAndSIE);

        // Sent after the user switches between from PIE to SIE, or vice-versa.  Passes in whether we are currently in SIE
        FEditorDelegates::OnSwitchBeginPIEAndSIE.AddRaw(this, &FDolbyGameKitUnrealModule::OnSwitchBeginPIEAndSIE);

        // Sent when a PIE session is canceled
        FEditorDelegates::CancelPIE.AddRaw(this, &FDolbyGameKitUnrealModule::CancelPIE);
#endif
        // Sent when a PIE session is beginning (but hasn't actually started yet)
        FEditorDelegates::BeginPIE.AddRaw(this, &FDolbyGameKitUnrealModule::OnBeginPIE);

        // Sent when a PIE session is ending
        FEditorDelegates::EndPIE.AddRaw(this, &FDolbyGameKitUnrealModule::OnEndPIE);

        // Sent when a PIE session is paused
        FEditorDelegates::PausePIE.AddRaw(this, &FDolbyGameKitUnrealModule::OnPausePIE);

        // Sent when a PIE session is resumed
        FEditorDelegates::ResumePIE.AddRaw(this, &FDolbyGameKitUnrealModule::OnResumePIE);

        // Register to be notified when properties are edited
        FCoreUObjectDelegates::OnObjectPropertyChanged.AddRaw(this, &FDolbyGameKitUnrealModule::OnPropertyChanged);

        UAudioSettings* AudioSettings = GetMutableDefault<UAudioSettings>();
        check(AudioSettings);
        mMaxChannelCount = AudioSettings->GetHighestMaxChannels();

        AudioSettings->OnAudioSettingsChanged().AddRaw(this, &FDolbyGameKitUnrealModule::OnAudioSettingsChanged);
#endif

        // Register application lifecycle delegates
        SuspendContextHandle = FCoreDelegates::ApplicationWillDeactivateDelegate.AddRaw(this, &FDolbyGameKitUnrealModule::SuspendContext);
        ResumeContextHandle = FCoreDelegates::ApplicationHasReactivatedDelegate.AddRaw(this, &FDolbyGameKitUnrealModule::ResumeContext);

    }

    void FDolbyGameKitUnrealModule::ShutdownModule()
    {
        if (mBuffers.Num() > 0)
        {
            DolbyGameAPI_DeInit();
        }

        FAudioDeviceManagerDelegates::OnAudioDeviceCreated.Remove(DeviceCreatedHandle);
        FAudioDeviceManagerDelegates::OnAudioDeviceDestroyed.Remove(DeviceDestroyedHandle);
        FCoreDelegates::ApplicationWillDeactivateDelegate.Remove(SuspendContextHandle);
        FCoreDelegates::ApplicationHasReactivatedDelegate.Remove(ResumeContextHandle);

#if WITH_EDITOR
#if 0   // Currently unused Delegates (here for ease of adding later)
        FEditorDelegates::PreBeginPIE.RemoveAll(this);
        FEditorDelegates::PostPIEStarted.RemoveAll(this);
        FEditorDelegates::PrePIEEnded.RemoveAll(this);
        FEditorDelegates::SingleStepPIE.RemoveAll(this);
        FEditorDelegates::OnPreSwitchBeginPIEAndSIE.RemoveAll(this);
        FEditorDelegates::OnSwitchBeginPIEAndSIE.RemoveAll(this);
        FEditorDelegates::CancelPIE.RemoveAll(this);
#endif
        FEditorDelegates::BeginPIE.RemoveAll(this);
        FEditorDelegates::EndPIE.RemoveAll(this);
        FEditorDelegates::PausePIE.RemoveAll(this);
        FEditorDelegates::ResumePIE.RemoveAll(this);
        FCoreUObjectDelegates::OnObjectPropertyChanged.RemoveAll(this);
#endif

        if (GlobalSpatializationSourceSettings)
        {
            GlobalSpatializationSourceSettings->RemoveFromRoot();
        }

        mDolbyGameAPI_Initialized = false;
        mBufferFrameSize = 0;
        mNumSources = 0;
        for (auto& buffer : mBuffers)
        {
            FMemory::Free(buffer);
        }
        mBuffers.Empty();

        // Unregister the Dolby Game Kit plugin factories.
        IModularFeatures::Get().UnregisterModularFeature(FDolbySpatializationPluginFactory::GetModularFeatureName(), &SpatializationPluginFactory);
    }

    void FDolbyGameKitUnrealModule::FreeMemory()
    {
        // free memory
        for (auto& buffer : mBuffers)
        {
            FMemory::Free(buffer);
        }
        mBuffers.Empty();
    }

    void* FDolbyGameKitUnrealModule::ConfigureMemory(size_t size)
    {
        if (size == 0)
        {
            // catch and return nullptr if we get no size.
            return nullptr;
        }

        void * gameKitAudioBuffers = FMemory::Malloc(size, sizeof(TSample));
        mBuffers.Push(gameKitAudioBuffers);
        return gameKitAudioBuffers;
    }

    void FDolbyGameKitUnrealModule::SetBufferFrameSize(const int32 bufferFrameSize)
    {
        mBufferFrameSize = bufferFrameSize;
    }

    const size_t FDolbyGameKitUnrealModule::GetBufferFrameSize() const
    {
        return mBufferFrameSize;
    }

    const float FDolbyGameKitUnrealModule::GetSampleRate() const
    {
        return mSampleRate;
    }

    const size_t FDolbyGameKitUnrealModule::GetMaxBufferSize() const
    {
        // Update if this value changes in UE.
        constexpr size_t kMaxBufferSize = 4096;
        return kMaxBufferSize;
    }

    const int FDolbyGameKitUnrealModule::GetNumSources() const
    {
        return mNumSources;
    }

    void FDolbyGameKitUnrealModule::Print(const std::string& message)
    {
        UE_LOG(LogDolbyAtmosBackend, Display, TEXT("%S"), message.c_str());
    }

    IAudioPluginFactory* FDolbyGameKitUnrealModule::GetPluginFactory(EAudioPlugin PluginType)
    {
        // can add other plugins here based on type
        switch (PluginType)
        {
        case EAudioPlugin::SPATIALIZATION:
            return &SpatializationPluginFactory;
            break;
        default:
            return nullptr;
        }
    }

    void FDolbyGameKitUnrealModule::OnNewDeviceCreated(Audio::FDeviceId InID)
    {
        // deviceID is one-indexed. We are changing it to be 0-indexed.
        const auto adjustedDeviceID = InID - 1;
        if (RegisteredAudioIDs.Contains(adjustedDeviceID))
        {
            return;
        }
        RegisteredAudioIDs.Add(adjustedDeviceID);
        FAudioDevice* DeviceHandle = FAudioDeviceManager::Get()->GetAudioDeviceRaw(InID);
        if (ensure(DeviceHandle) && DeviceHandle->IsAudioMixerEnabled())
        {
            auto MixerDevice = static_cast<Audio::FMixerDevice*>(DeviceHandle);
            MixerDevice->RegisterSubmixBufferListener(mMasterSubmixBufferListener.get());

            if (!mDolbyGameAPI_Initialized)
            {

                const UDolbyGameKitSettings* Settings = GetDefault<UDolbyGameKitSettings>();
                mDolbyGameAPI_Initialized = true;
                mBufferFrameSize = DeviceHandle->PlatformSettings.CallbackBufferFrameSize;
                mNumSources = DeviceHandle->GetMaxSources();

                const FAudioPlatformSettings& audioPlatformSettings = FAudioPlatformSettings::GetPlatformSettings(FPlatformProperties::GetRuntimeSettingsClassName());
                if (audioPlatformSettings.SampleRate < 0)
                {
                    UE_LOG(LogDolbyAtmos, Error, TEXT("The sample-rate for the device driver selected is invalid. Please try again."));
                }
                mSampleRate = static_cast<float>(audioPlatformSettings.SampleRate);
                try
                {
                    DolbyGameAPI_Init(Settings->bEnablePluginRendering, this);
                    DolbyGameAPI_AddDevice(adjustedDeviceID);
                    UE_LOG(LogDolbyAtmos, Display, TEXT("Dolby Atmos library version: %S"), DolbyGameAPI_GetVersion());
                }
                catch (std::runtime_error const& exception)
                {
                    UE_LOG(LogDolbyAtmos, Error, TEXT("%S"), exception.what());
                }
            }
            else
            {
                DolbyGameAPI_AddDevice(adjustedDeviceID);
                // We are currently assuming that multiple Unreal Engine AudioEngine FMixerDevices will have the same attributes
                // But FAudioDevices that don't re-init don't update their buffer size change. It would reflect only after an engine re-launch
                assert(mBufferFrameSize == DeviceHandle->PlatformSettings.CallbackBufferFrameSize);
                assert(mNumSources == DeviceHandle->GetMaxSources());
            }
        }
    }

    void FDolbyGameKitUnrealModule::OnDeviceDestroyed(Audio::FDeviceId InID)
    {
        // deviceID is one-indexed. We are changing it to be 0-indexed.
        const auto adjustedDeviceID = InID - 1;
        if (RegisteredAudioIDs.Contains(adjustedDeviceID))
        {
            RegisteredAudioIDs.Remove(adjustedDeviceID);
            auto DeviceHandle = FAudioDeviceManager::Get()->GetAudioDeviceRaw(InID);
            if (ensure(DeviceHandle) && DeviceHandle->IsAudioMixerEnabled())
            {
                DolbyGameAPI_RemoveDevice(adjustedDeviceID);
                auto MixerDevice = static_cast<Audio::FMixerDevice*>(DeviceHandle);
                MixerDevice->UnregisterSubmixBufferListener(mMasterSubmixBufferListener.get());
            }
        }
    }

    void FDolbyGameKitUnrealModule::SuspendContext()
    {
#if PLATFORM_ANDROID
        DolbyGameAPI_SuspendSink();
#endif
        return;
    }

    void FDolbyGameKitUnrealModule::ResumeContext()
    {
#if PLATFORM_ANDROID
        DolbyGameAPI_ResumeSink();
#endif
        return;
    }

#if WITH_EDITOR
    void FDolbyGameKitUnrealModule::OnBeginPIE(const bool isSimulating)
    {
        mPIEPaused = false;
        DolbyGameAPI_ResetSink(mPIEPaused);
    }

    void FDolbyGameKitUnrealModule::OnEndPIE(const bool isSimulating)
    {
        mPIEPaused = false;
    }

    void FDolbyGameKitUnrealModule::OnPausePIE(const bool isSimulating)
    {
        mPIEPaused = true;
        DolbyGameAPI_ResetSink(!mPIEPaused);
    }

    void FDolbyGameKitUnrealModule::OnResumePIE(const bool isSimulating)
    {
        mPIEPaused = false;
    }

    void FDolbyGameKitUnrealModule::OnAudioSettingsChanged() const
    {
        const UAudioSettings* AudioSettings = GetDefault<UAudioSettings>();
        check(AudioSettings);
        FDolbyGameKitUnrealModule* Module = &FModuleManager::GetModuleChecked<FDolbyGameKitUnrealModule>("DolbyAtmos");

        if (Module->mMaxChannelCount != AudioSettings->GetHighestMaxChannels())
        {
            Module->mMaxChannelCount = AudioSettings->GetHighestMaxChannels();
            UE_LOG(LogDolbyAtmos, Warning, TEXT("Global max channel count changed to %d"), Module->mMaxChannelCount);
            ISettingsEditorModule* SettingsEditorModule = FModuleManager::GetModulePtr<ISettingsEditorModule>("SettingsEditor");
            if (SettingsEditorModule)
            {
                SettingsEditorModule->OnApplicationRestartRequired();
            }
        }
    }

    void FDolbyGameKitUnrealModule::OnPropertyChanged(UObject* ObjectBeingModified, FPropertyChangedEvent& PropertyChangedEvent) const
    {
        std::string propName = std::string(TCHAR_TO_UTF8(*PropertyChangedEvent.GetPropertyName().ToString()));
        // have to make sure it's for the current platform. Ignore Android and Xbox.
        if (propName == "AudioCallbackBufferFrameSize" || propName == "AudioMaxChannels")
        {
            std::string objectName = std::string(TCHAR_TO_UTF8(*ObjectBeingModified->GetFName().ToString()));
#if WIN32
            if (objectName.find("WindowsTargetSettings") != std::string::npos)
#elif __APPLE__
            if (objectName.find("MacTargetSettings") != std::string::npos)
#else
            // don't need to prompt restart for any other platform for now.
            return;
#endif
            {
                UE_LOG(LogDolbyAtmos, Warning, TEXT("Property Changed: %S"), propName.c_str());
                ISettingsEditorModule* SettingsEditorModule = FModuleManager::GetModulePtr<ISettingsEditorModule>("SettingsEditor");
                if (SettingsEditorModule)
                {
                    SettingsEditorModule->OnApplicationRestartRequired();
                }
            }
        }
    }
#endif

    UDolbyGameKitSpatializationSourceSettings* FDolbyGameKitUnrealModule::GetGlobalSpatializationSourceSettings()
    {
        return GlobalSpatializationSourceSettings;
    }

    bool FDolbyGameKitUnrealModule::IsInitializedDolbyGameKit() const
    {
        const auto bIsInitializedDolbyGameKit =
            (mBuffers.Num() > 0) &&
            (RegisteredAudioIDs.Num() > 0) &&
             DolbyGameAPI_IsInitialized()
            ;
        return bIsInitializedDolbyGameKit;
    }

    TAudioSpatializationPtr FDolbySpatializationPluginFactory::CreateNewSpatializationPlugin(FAudioDevice* OwningDevice)
    {
        // deviceID is one-indexed. We are changing it to be 0-indexed.
        const auto adjustedDeviceID = OwningDevice->DeviceID - 1;

        // Register the audio device to the Dolby Game Kit module.
        FDolbyGameKitUnrealModule* Module = &FModuleManager::GetModuleChecked<FDolbyGameKitUnrealModule>("DolbyAtmos");
        return TAudioSpatializationPtr(new FDolbyGameKitSpatialization(adjustedDeviceID));
    }
} // namespace DolbyGameKit
