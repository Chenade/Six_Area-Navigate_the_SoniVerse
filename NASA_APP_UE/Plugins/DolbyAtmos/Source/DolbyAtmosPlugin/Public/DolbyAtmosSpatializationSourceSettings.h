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

#include "IAudioExtensionPlugin.h"
#include "DolbyAtmosSpatializationSourceSettings.generated.h"

UCLASS()
class DOLBYATMOS_API UDolbyGameKitSpatializationSourceSettings : public USpatializationPluginSourceSettingsBase
{
	GENERATED_BODY()

public:
	UDolbyGameKitSpatializationSourceSettings();

#if WITH_EDITOR
	// See if Audio Component references this settings instance:
	bool DoesAudioComponentReferenceThis(class UAudioComponent* InAudioComponent);

	virtual bool CanEditChange(const FProperty* InProperty) const override;
	virtual void PostEditChangeProperty(struct FPropertyChangedEvent& PropertyChangedEvent) override;
#endif

};
