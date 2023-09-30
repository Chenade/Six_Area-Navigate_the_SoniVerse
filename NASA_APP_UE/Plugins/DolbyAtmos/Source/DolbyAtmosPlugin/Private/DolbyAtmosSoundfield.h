/******************************************************************************
 * This program is protected under international and U.S. copyright laws as
 * an unpublished work. This program is confidential and proprietary to the
 * copyright owners. Reproduction or disclosure, in whole or in part, or the
 * production of derivative works therefrom without the express permission of
 * the copyright owners is prohibited.
 *
 *                Copyright (C) 2021 by Dolby Laboratories.
 *                            All rights reserved.
 ******************************************************************************/

#pragma once

#include <string>

#include "ISoundfieldFormat.h"



namespace DolbyGameKit
{
    class FDolbyGameKitAudioPacket : public ISoundfieldAudioPacket
    {
    public:
        int SourceID;
        FDolbyGameKitAudioPacket() {}

        virtual void Serialize(FArchive& Ar) override;
        virtual TUniquePtr<ISoundfieldAudioPacket> Duplicate() const override;
        virtual void Reset() override;
    };

    class FDolbyGameKitSoundfieldFactory : public ISoundfieldFactory
    {
    public:
        FDolbyGameKitSoundfieldFactory();
        virtual ~FDolbyGameKitSoundfieldFactory();

        virtual FName GetSoundfieldFormatName() override;
        virtual TUniquePtr<ISoundfieldEncoderStream> CreateEncoderStream(const FAudioPluginInitializationParams& InitInfo, const ISoundfieldEncodingSettingsProxy& InitialSettings) override;
        virtual TUniquePtr<ISoundfieldDecoderStream> CreateDecoderStream(const FAudioPluginInitializationParams& InitInfo, const ISoundfieldEncodingSettingsProxy& InitialSettings) override;
        virtual TUniquePtr<ISoundfieldTranscodeStream> CreateTranscoderStream(const FName SourceFormat, const ISoundfieldEncodingSettingsProxy& InitialSourceSettings, const FName DestinationFormat, const ISoundfieldEncodingSettingsProxy& InitialDestinationSettings, const FAudioPluginInitializationParams& InitInfo) override {return nullptr;};
        virtual TUniquePtr<ISoundfieldMixerStream> CreateMixerStream(const ISoundfieldEncodingSettingsProxy& InitialSettings) override;
        virtual TUniquePtr<ISoundfieldAudioPacket> CreateEmptyPacket() override;
        virtual bool IsTranscodeRequiredBetweenSettings(const ISoundfieldEncodingSettingsProxy& SourceSettings, const ISoundfieldEncodingSettingsProxy& DestinationSettings) override {return false;};
        virtual bool CanTranscodeFromSoundfieldFormat(FName SourceFormat, const ISoundfieldEncodingSettingsProxy& SourceEncodingSettings) override {return false;};
        virtual bool CanTranscodeToSoundfieldFormat(FName DestinationFormat, const ISoundfieldEncodingSettingsProxy& DestinationEncodingSettings) override {return false;};
        virtual UClass* GetCustomEncodingSettingsClass() const override;
        virtual const USoundfieldEncodingSettingsBase* GetDefaultEncodingSettings() override;
    };
}
