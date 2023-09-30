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

#pragma once

#include "IAudioExtensionPlugin.h"
#include "IDolbyAtmosPluginModule.h"
#include "AudioPluginUtilities.h"
#include "AudioDevice.h"

#include "DolbyAtmosEndpointSettings.h"
#include "DolbyAtmosExternalEndpoints.h"
#include "DolbyAtmosSpatializationSourceSettings.h"
#include "DolbyAtmosSubmixBufferListener.h"
#include "DolbyAtmosSoundfield.h"

#include "DolbyGameApi.h"

#include <memory>

DECLARE_LOG_CATEGORY_EXTERN(LogDolbyAtmos, Log, All);
DECLARE_LOG_CATEGORY_EXTERN(LogDolbyAtmosBackend, Log, All);

namespace DolbyGameKit
{
/**********************************************************************/
/* Spatialization Plugin Factory                                      */
/**********************************************************************/
class FDolbySpatializationPluginFactory : public IAudioSpatializationFactory
{
public:

    virtual FString GetDisplayName() override
    {
        static FString DisplayName = FString(TEXT("Dolby Atmos"));
        return DisplayName;
    }

    virtual bool SupportsPlatform(const FString& PlatformName) override
    {
        return true;
    }

    virtual TAudioSpatializationPtr CreateNewSpatializationPlugin(FAudioDevice* OwningDevice) override;
    virtual UClass* GetCustomSpatializationSettingsClass() const override { return UDolbyGameKitSpatializationSourceSettings::StaticClass(); };

    virtual bool IsExternalSend() override { return true; }

    virtual int32 GetMaxSupportedChannels() override
    {
        return 2;
    }
};

/**********************************************************************/
/* Dolby Atmos Front Heights Endpoint Factory                         */
/**********************************************************************/
class FDolbyAtmosFrontHeightsEndpointFactory : public IAudioEndpointFactory
{
public:
    FDolbyAtmosFrontHeightsEndpointFactory();

    ~FDolbyAtmosFrontHeightsEndpointFactory();

    virtual FName GetEndpointTypeName() override;

    virtual TUniquePtr<IAudioEndpoint> CreateNewEndpointInstance(const FAudioPluginInitializationParams& InitInfo, const IAudioEndpointSettingsProxy& InitialSettings) override;

private:
};

/**********************************************************************/
/* Dolby Atmos Mid Heights Endpoint Factory                           */
/**********************************************************************/
class FDolbyAtmosMidHeightsEndpointFactory : public IAudioEndpointFactory
{
public:
    FDolbyAtmosMidHeightsEndpointFactory();

    ~FDolbyAtmosMidHeightsEndpointFactory();

    virtual FName GetEndpointTypeName() override;

    virtual TUniquePtr<IAudioEndpoint> CreateNewEndpointInstance(const FAudioPluginInitializationParams& InitInfo, const IAudioEndpointSettingsProxy& InitialSettings) override;

private:
};

/**********************************************************************/
/* Dolby Atmos Rear Heights Endpoint Factory                          */
/**********************************************************************/
class FDolbyAtmosRearHeightsEndpointFactory : public IAudioEndpointFactory
{
public:
    FDolbyAtmosRearHeightsEndpointFactory();

    ~FDolbyAtmosRearHeightsEndpointFactory();

    virtual FName GetEndpointTypeName() override;

    virtual TUniquePtr<IAudioEndpoint> CreateNewEndpointInstance(const FAudioPluginInitializationParams& InitInfo, const IAudioEndpointSettingsProxy& InitialSettings) override;

private:
};

/*********************************************************/
/* Dolby Game Kit Module                                */
/*********************************************************/
class FDolbyGameKitUnrealModule : public IDolbyGameKitUnrealModule,
                                  public DolbyGameKit::IEngineDelegate
{
private:
    // The global game kit spatialization source settings
    static UDolbyGameKitSpatializationSourceSettings* GlobalSpatializationSourceSettings;

    // List of registered audio devices.
    TArray<Audio::FDeviceId> RegisteredAudioIDs;

    // Plugin factories.
    FDolbySpatializationPluginFactory SpatializationPluginFactory;
    FDolbyGameKitSoundfieldFactory SoundfieldFactory;
    // Defining endpoint factories
    FDolbyAtmosFrontHeightsEndpointFactory DolbyAtmosFrontHeightsEndpointFactory;
    FDolbyAtmosMidHeightsEndpointFactory DolbyAtmosMidHeightsEndpointFactory;
    FDolbyAtmosRearHeightsEndpointFactory DolbyAtmosRearHeightsEndpointFactory;

    std::unique_ptr<DolbyGameKitMasterSubmixBufferListener> mMasterSubmixBufferListener;

    FDelegateHandle DeviceCreatedHandle;
    FDelegateHandle DeviceDestroyedHandle;
    FDelegateHandle SuspendContextHandle;
    FDelegateHandle ResumeContextHandle;

    bool mDolbyGameAPI_Initialized{ false };
    size_t mBufferFrameSize { 0 };
    float mSampleRate { 0.f };
    int mNumSources { 0 };

    TArray<void*> mBuffers;
    TArray<const void* > RegisteredFlushRequesters;
    TArray<const void* > PendingFlushRequesters;
    FCriticalSection FlushRequestersCriticalSection;

#if WITH_EDITOR
    int mMaxChannelCount { 0 };
    bool mPIEPaused{ false };
#endif

public:
    FDolbyGameKitUnrealModule();
    ~FDolbyGameKitUnrealModule();

    virtual void StartupModule() override;
    virtual void ShutdownModule() override;

    virtual void* ConfigureMemory(size_t size) override;
    void FreeMemory();
    virtual const size_t GetBufferFrameSize() const override;
    void SetBufferFrameSize(const int32 bufferFrameSize);
    virtual const float GetSampleRate() const override;
    virtual const size_t GetMaxBufferSize() const override;
    virtual const int GetNumSources() const override;
    virtual void Print(const std::string& message) override;

    // Returns a pointer to a given PluginType or nullptr if PluginType is invalid.
    IAudioPluginFactory* GetPluginFactory(EAudioPlugin PluginType);

    // delegate functions for audio device creation/destruction
    void OnNewDeviceCreated(Audio::FDeviceId InID);
    void OnDeviceDestroyed(Audio::FDeviceId InID);

    // delegate functions for foreground/background callbacks
    void SuspendContext();
    void ResumeContext();
#if WITH_EDITOR
    // delegate functions for editor callbacks
    void OnBeginPIE(const bool isSimulating);
    void OnEndPIE(const bool isSimulating);
    void OnPausePIE(const bool isSimulating);
    void OnResumePIE(const bool isSimulating);
    bool IsPIEPaused() { return mPIEPaused; }
    void OnAudioSettingsChanged() const;

    void OnPropertyChanged(UObject* ObjectBeingModified, FPropertyChangedEvent& PropertyChangedEvent) const;
#endif

    // Returns the global spatialization source settings set in the project settings
    static UDolbyGameKitSpatializationSourceSettings* GetGlobalSpatializationSourceSettings();

    void RegisterFlushRequester(const void* requester);
    void UnRegisterFlushRequester(const void* requester);
    void RequestFlush(const void* requester);

public:
    bool IsInitializedDolbyGameKit() const;
};

}  // namespace DolbyGameKit
