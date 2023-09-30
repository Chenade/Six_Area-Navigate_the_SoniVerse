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

#include "AudioDevice.h"
#include "AudioMixerDevice.h"
#include "Sound/SoundSubmix.h"
#include "Sound/SoundSubmixSend.h"

namespace DolbyGameKit
{

    // This is used to register with the master submix.
    class DolbyGameKitMasterSubmixBufferListener :
        public ISubmixBufferListener
    {
    public:
        DolbyGameKitMasterSubmixBufferListener();

        virtual ~DolbyGameKitMasterSubmixBufferListener();
    protected:
        // this is called everytime ProcessAudio is called by the owning submix
        virtual void OnNewSubmixBuffer(const USoundSubmix* OwningSubmix,
            float* AudioData,
            int32 NumSamples,
            int32 NumChannels,
            const int32 SampleRate,
            double AudioClock) override;

        class FDolbyGameKitUnrealModule* DolbyGameKitUnrealModule;
    };
};