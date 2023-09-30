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

#pragma once

#include "Audio.h"
#include "IAudioExtensionPlugin.h"
#include "DolbyCoordinates.h"
#include "DolbyRenderHelperFunctions.h"

namespace DolbyGameKit
{

    class FDolbyGameKitSpatialization : public IAudioSpatialization
    {
    private:
        DolbyGameKit::AtmosCoordinates UnrealCartesianToAtmos(FVector emitterPosition, float scaleFactor);
        TArray<TSample> deinterleavedBuffer;

        class FDolbyGameKitUnrealModule* DolbyGameKitUnrealModule;
        bool mRegisteredAsFlushRequester{ false };
        Audio::FDeviceId mDeviceID { 0 };

    public: // IAudioSpatialization
        virtual void Initialize(const FAudioPluginInitializationParams InitializationParams) override;
        virtual void Shutdown() override;
        virtual bool IsSpatializationEffectInitialized() const override;
        virtual void OnInitSource(const uint32 SourceId, const FName& AudioComponentUserId, USpatializationPluginSourceSettingsBase* InSettings) override;
        virtual void OnReleaseSource(const uint32 SourceId) override;
        virtual void ProcessAudio(const FAudioPluginSourceInputData& InputData, FAudioPluginSourceOutputData& OutputData) override;
        virtual void OnAllSourcesProcessed() override;

    public:
        FDolbyGameKitSpatialization();
        FDolbyGameKitSpatialization(Audio::FDeviceId deviceId);
        ~FDolbyGameKitSpatialization();
    };
}
