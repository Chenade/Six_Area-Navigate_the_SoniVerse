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

#include "DolbyAtmosSoundfield.h"
#include "ISoundfieldFormat.h"
#include "DolbyGameCommonConstants.h"
#include "DolbyAtmosSoundfieldSettings.generated.h"

class FDolbyGameKitSoundfieldSettingsProxy : public ISoundfieldEncodingSettingsProxy
{
public:
    virtual uint32 GetUniqueId() const override
    {
        // we currently have no way to correlate incoming soundfield audio with a source
        return kNoSourceID;
    }

    virtual TUniquePtr<ISoundfieldEncodingSettingsProxy> Duplicate() const override
    {
        FDolbyGameKitSoundfieldSettingsProxy* proxy = new FDolbyGameKitSoundfieldSettingsProxy();
        return TUniquePtr<ISoundfieldEncodingSettingsProxy>(proxy);
    }
};

UCLASS()
class DOLBYATMOS_API UDolbyGameKitSoundfieldSettings : public USoundfieldEncodingSettingsBase
{
    GENERATED_BODY()

public:

    virtual TUniquePtr<ISoundfieldEncodingSettingsProxy> GetProxy() const override
    {
        FDolbyGameKitSoundfieldSettingsProxy* proxy = new FDolbyGameKitSoundfieldSettingsProxy();

        return TUniquePtr<ISoundfieldEncodingSettingsProxy>(proxy);
    }

};
