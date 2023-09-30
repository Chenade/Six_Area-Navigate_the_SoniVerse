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

#include "DolbyAtmosSubmixBufferListener.h"

#include "Modules/ModuleManager.h"

#include "DolbyAtmosPluginModule.h"

#include "DolbyGameApi.h"

namespace DolbyGameKit
{
DolbyGameKitMasterSubmixBufferListener::DolbyGameKitMasterSubmixBufferListener()
{
    DolbyGameKitUnrealModule = &FModuleManager::GetModuleChecked<FDolbyGameKitUnrealModule>("DolbyAtmos");
}

DolbyGameKitMasterSubmixBufferListener::~DolbyGameKitMasterSubmixBufferListener()
{
}

void DolbyGameKitMasterSubmixBufferListener::OnNewSubmixBuffer(const USoundSubmix * OwningSubmix, float * AudioData, int32 NumSamples, int32 NumChannels, const int32 SampleRate, double AudioClock)
{
    // we don't want to support the submix buffer listener for now
    
/*
    if (DolbyGameKitUnrealModule == nullptr)
        return;
    if (!DolbyGameKitUnrealModule->IsInitializedDolbyGameKit())
        return;

    DolbyGameAPI_AddBedToPresentation(
        AudioData,
        0,
        NumChannels,
        NumSamples,
        true);
*/
}
};
