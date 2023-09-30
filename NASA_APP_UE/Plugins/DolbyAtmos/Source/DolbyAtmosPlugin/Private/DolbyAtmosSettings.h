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

#include "CoreMinimal.h"
#include "UObject/ObjectMacros.h"
#include "DolbyAtmosSettings.generated.h"

UCLASS(config = Engine, defaultconfig)
class DOLBYATMOS_API UDolbyGameKitSettings : public UObject
{
    GENERATED_BODY()
public:
    UDolbyGameKitSettings();

#if WITH_EDITOR
    virtual void PostEditChangeProperty(struct FPropertyChangedEvent& PropertyChangedEvent) override;
    virtual bool CanEditChange(const FProperty* InProperty) const override;
#endif

    UPROPERTY(config, EditAnywhere, Category = "Dolby Atmos | Windows")
    bool bEnablePluginRendering { false };
};
