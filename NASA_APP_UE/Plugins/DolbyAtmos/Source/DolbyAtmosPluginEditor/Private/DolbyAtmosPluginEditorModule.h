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

#include "IDolbyAtmosPluginEditorModule.h"
#include "Framework/MultiBox/MultiBoxExtender.h"

namespace DolbyGameKit
{
    class FDolbyGameKitUnrealEditorModule : public IDolbyGameKitUnrealEditorModule
    {
    public:
        virtual void StartupModule() override;
        virtual void ShutdownModule() override;

        void RegisterSettings();
        void UnregisterSettings();
    };

} // namespace DolbyGameKit
