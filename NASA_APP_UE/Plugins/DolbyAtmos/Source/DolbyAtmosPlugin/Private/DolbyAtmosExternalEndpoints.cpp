/******************************************************************************
* This program is protected under international and U.S. copyright laws as
* an unpublished work. This program is confidential and proprietary to the
* copyright owners. Reproduction or disclosure, in whole or in part, or the
* production of derivative works therefrom without the express permission of
* the copyright owners is prohibited.
*
*                Copyright (C) 2022 by Dolby Laboratories.
*                            All rights reserved.
******************************************************************************/

#include "DolbyAtmosExternalEndpoints.h"
#include "DolbyAtmosPluginModule.h"

namespace DolbyAtmos
{

/*************************************************************/

/* Dolby Atmos Heights Interface Endpoint Implementation     */

/*************************************************************/

DolbyAtmosHeightsEndpointInterface::DolbyAtmosHeightsEndpointInterface(FAudioDevice* inAudioDevice)
    : mAudioDeviceRef(inAudioDevice), DolbyGameKitUnrealModule(nullptr)
{
    DolbyGameKitUnrealModule = &FModuleManager::GetModuleChecked<DolbyGameKit::FDolbyGameKitUnrealModule>("DolbyAtmos");
}

DolbyAtmosHeightsEndpointInterface::~DolbyAtmosHeightsEndpointInterface()
{
    mRegisteredAsFlushRequester = false;
    DolbyGameKitUnrealModule->UnRegisterFlushRequester(this);
}

float DolbyAtmosHeightsEndpointInterface::GetSampleRate() const
{
    if (!DolbyGameKitUnrealModule)
    {
        return 0;
    }
    else
    {
        return DolbyGameKitUnrealModule->GetSampleRate();
    }
}

int32 DolbyAtmosHeightsEndpointInterface::GetDesiredNumFrames() const
{
    if (!DolbyGameKitUnrealModule)
    {
        return 0;
    }
    else
    {
        return DolbyGameKitUnrealModule->GetBufferFrameSize();
    }
}

bool DolbyAtmosHeightsEndpointInterface::HeightsAudioCallback(const TArrayView<const float>& InAudio, const int32& NumChannels, const IAudioEndpointSettingsProxy* InSettings)
{
    check(NumChannels == GetNumChannels());
#if WITH_EDITOR
    const auto bIsDeviceActive = !DolbyGameKitUnrealModule->IsPIEPaused() && mAudioDeviceRef && !(mAudioDeviceRef->IsAudioDeviceMuted());
#else
    const auto bIsDeviceActive = mAudioDeviceRef && !(mAudioDeviceRef->IsAudioDeviceMuted());
#endif

    const int32 numSamplesPerChannel = InAudio.Num() / NumChannels;
    const float firstSample = InAudio.IsEmpty() ? 0.f : InAudio[0];

    if (bIsDeviceActive && !InAudio.IsEmpty())
    {
        if (!mRegisteredAsFlushRequester)
        {
            mRegisteredAsFlushRequester = true;
            DolbyGameKitUnrealModule->RegisterFlushRequester(this);
        }

        // Passes the heightsStereoPairType based on sub class initialization
        DolbyGameAPI_AddHeightsToPresentation(
            InAudio.GetData(),
            0, // no source ID needed,
            NumChannels,
            numSamplesPerChannel,
            true,
            heightsStereoPairType
        );

        // call flush after adding to presentation
        DolbyGameKitUnrealModule->RequestFlush(this);
    }
    else
    {
        if(mRegisteredAsFlushRequester)
        {
            mRegisteredAsFlushRequester = false;
            DolbyGameKitUnrealModule->UnRegisterFlushRequester(this);
        }
    }

    return true; 
}

} // namespace DolbyAtmos