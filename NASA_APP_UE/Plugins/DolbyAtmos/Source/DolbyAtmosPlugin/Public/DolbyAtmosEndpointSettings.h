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
#include "IAudioExtensionPlugin.h"
#include "DolbyAtmosEndpointSettings.generated.h"

UENUM()
enum class DolbyAtmosHeightsPair : uint8
{
    // Front heights
    FrontHeights,
    // Mid heights
    MidHeights,
    // Rear Heights
    RearHeights,
};

class FDolbyAtmosEndpointSettingsProxy : public IAudioEndpointSettingsProxy
{
public:
	DolbyAtmosHeightsPair HeightStereoPair;
};



UCLASS()
class DOLBYATMOS_API UDolbyAtmosEndpointSettings : public UAudioEndpointSettingsBase
{
    GENERATED_BODY()

public:

    UPROPERTY(EditAnywhere, Category = "Dolby Atmos | Heights Endpoint", meta = (ClampMin = "0", ClampMax = "2"))
    DolbyAtmosHeightsPair HeightStereoPair;

    virtual TUniquePtr<IAudioEndpointSettingsProxy> GetProxy() const override
    {
        FDolbyAtmosEndpointSettingsProxy* Settings = new FDolbyAtmosEndpointSettingsProxy();
        Settings->HeightStereoPair = HeightStereoPair;
        return TUniquePtr<IAudioEndpointSettingsProxy>(Settings);
    }
};
