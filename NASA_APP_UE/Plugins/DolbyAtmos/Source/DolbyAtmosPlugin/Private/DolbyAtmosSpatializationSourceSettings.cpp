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

#include "DolbyAtmosSpatializationSourceSettings.h"

#if WITH_EDITOR
#include "Runtime/Engine/Classes/Components/AudioComponent.h"
#include "Editor.h"
#include "Engine/LevelStreaming.h"
#include "LevelEditorViewport.h"
#endif // WITH_EDITOR

UDolbyGameKitSpatializationSourceSettings::UDolbyGameKitSpatializationSourceSettings()
{
}

#if WITH_EDITOR
bool UDolbyGameKitSpatializationSourceSettings::DoesAudioComponentReferenceThis(UAudioComponent* InAudioComponent)
{
    const FSoundAttenuationSettings* ComponentSettings = InAudioComponent->GetAttenuationSettingsToApply();
    if (ComponentSettings != nullptr)
    {
        return ComponentSettings->PluginSettings.SpatializationPluginSettingsArray.Contains(this);
    }
    else
    {
        return false;
    }
}

bool UDolbyGameKitSpatializationSourceSettings::CanEditChange(const FProperty* InProperty) const
{
    const bool ParentVal = Super::CanEditChange(InProperty);

    return ParentVal;
}

void UDolbyGameKitSpatializationSourceSettings::PostEditChangeProperty(FPropertyChangedEvent& PropertyChangedEvent)
{
    FName PropertyName = (PropertyChangedEvent.Property != nullptr) ? PropertyChangedEvent.Property->GetFName() : NAME_None;
    Super::PostEditChangeProperty(PropertyChangedEvent);
}

#endif // WITH_EDITOR
