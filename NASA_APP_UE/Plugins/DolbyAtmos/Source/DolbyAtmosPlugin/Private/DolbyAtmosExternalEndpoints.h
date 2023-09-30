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

#pragma once

#include "IAudioEndpoint.h"
#include "DolbyAtmosPluginModule.h"
#include "AudioDevice.h"
#include "DolbyGameSpeakerLayout.h"

namespace DolbyGameKit
{
    class FDolbyGameKitUnrealModule;
}

namespace DolbyAtmos
{

/* Heights Endpoint Interface */
class DolbyAtmosHeightsEndpointInterface: public IAudioEndpoint
{
protected:
    FAudioDevice* mAudioDeviceRef;
    DolbyGameKit::FDolbyGameKitUnrealModule* DolbyGameKitUnrealModule;
    bool mRegisteredAsFlushRequester{ false };
    HeightStereoPair heightsStereoPairType;
public:
    DolbyAtmosHeightsEndpointInterface(FAudioDevice* inDevice);
    ~DolbyAtmosHeightsEndpointInterface();
    
    virtual float GetSampleRate() const override;
    virtual int32 GetNumChannels() const override { return 2; /* Heights endpoint is fixed to stereo */ };
    virtual int32 GetDesiredNumFrames() const override;
    virtual bool EndpointRequiresCallback() const override { return true; };
    virtual bool OnAudioCallback(const TArrayView<const float>& InAudio, const int32& NumChannels, const IAudioEndpointSettingsProxy* InSettings) override { return true; };
    virtual bool IsImplemented() override { return true; };

    // Called by sub-class implementations in their audio callback
    bool HeightsAudioCallback(const TArrayView<const float>& InAudio, const int32& NumChannels, const IAudioEndpointSettingsProxy* InSettings);
    bool IsEndpointAllowed() const { return true; };    
};

/* Front Heights Endpoint interface */
class FDolbyAtmosFrontHeightsEndpoint: public DolbyAtmosHeightsEndpointInterface
{
public:
    FDolbyAtmosFrontHeightsEndpoint(FAudioDevice* deviceHandle) : DolbyAtmosHeightsEndpointInterface(deviceHandle)
    {
        heightsStereoPairType = HeightStereoPair::FRONT;
    };
    ~FDolbyAtmosFrontHeightsEndpoint() {};
protected:
    virtual bool OnAudioCallback(const TArrayView<const float>& InAudio, const int32& NumChannels, const IAudioEndpointSettingsProxy* InSettings) override
    {
        return HeightsAudioCallback(InAudio, NumChannels, InSettings);
    };
};

/* Mid Heights Endpoint interface */
class FDolbyAtmosMidHeightsEndpoint: public DolbyAtmosHeightsEndpointInterface
{
public:
    FDolbyAtmosMidHeightsEndpoint(FAudioDevice* deviceHandle) : DolbyAtmosHeightsEndpointInterface(deviceHandle)
    {
        heightsStereoPairType = HeightStereoPair::MIDDLE;
    };
    ~FDolbyAtmosMidHeightsEndpoint() {};
protected:
    virtual bool OnAudioCallback(const TArrayView<const float>& InAudio, const int32& NumChannels, const IAudioEndpointSettingsProxy* InSettings) override
    {
        return HeightsAudioCallback(InAudio, NumChannels, InSettings);
    };
};

/* Rear Heights Endpoint interface */
class FDolbyAtmosRearHeightsEndpoint: public DolbyAtmosHeightsEndpointInterface
{
public:
    FDolbyAtmosRearHeightsEndpoint(FAudioDevice* deviceHandle) : DolbyAtmosHeightsEndpointInterface(deviceHandle)
    {
        heightsStereoPairType = HeightStereoPair::REAR;
    };
    ~FDolbyAtmosRearHeightsEndpoint() {};
protected:
    virtual bool OnAudioCallback(const TArrayView<const float>& InAudio, const int32& NumChannels, const IAudioEndpointSettingsProxy* InSettings) override
    {
        return HeightsAudioCallback(InAudio, NumChannels, InSettings);
    };
};
} // namespace DolbyAtmos