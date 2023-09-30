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

#include "DolbyAtmosSettings.h"
#include "DolbyAtmosPluginModule.h"
#include "DolbyGameApi.h"

UDolbyGameKitSettings::UDolbyGameKitSettings()
{
}

#if WITH_EDITOR
void UDolbyGameKitSettings::PostEditChangeProperty(FPropertyChangedEvent& PropertyChangedEvent)
{
    Super::PostEditChangeProperty(PropertyChangedEvent);
    FName PropertyName = (PropertyChangedEvent.Property != NULL) ? PropertyChangedEvent.Property->GetFName() : NAME_None;
    if (PropertyName == GET_MEMBER_NAME_CHECKED(UDolbyGameKitSettings, bEnablePluginRendering))
    {
        // Only change if the DolbyGameAPI is initialized
        if(DolbyGameAPI_IsInitialized())
        {
            if (bEnablePluginRendering)
            {
                DolbyGameAPI_DisableDynamicObjects();
            }
            else
            {
                DolbyGameAPI_EnableDynamicObjects();
            }
        }
        else
        {
            UE_LOG(LogDolbyAtmos, Warning, TEXT("Propery edit ineffective since Dolby Atmos backend isn't initialized yet!"))
        }
    }
}

bool UDolbyGameKitSettings::CanEditChange(const FProperty* InProperty) const
{
    return Super::CanEditChange(InProperty);
}
#endif
