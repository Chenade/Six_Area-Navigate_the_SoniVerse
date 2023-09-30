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

#include "DolbyAtmosPluginEditorModule.h"

#include "AssetToolsModule.h"
#include "Interfaces/IPluginManager.h"
#include "ISettingsModule.h"
#include "DolbyAtmosSettings.h"
#include "Styling/SlateStyle.h"
#include "Styling/SlateStyleRegistry.h"
#include "Modules/ModuleManager.h"

IMPLEMENT_MODULE(DolbyGameKit::FDolbyGameKitUnrealEditorModule, DolbyAtmosEditor)

#define LOCTEXT_NAMESPACE "FDolbyGameKitUnrealEditorModule"

namespace DolbyGameKit
{
    /***********************************************/
    /* Dolby Game Kit Editor Module                */
    /***********************************************/
    void FDolbyGameKitUnrealEditorModule::StartupModule()
    {
        RegisterSettings();

        // Register the audio editor asset type actions.
        IAssetTools& AssetTools = FModuleManager::LoadModuleChecked<FAssetToolsModule>("AssetTools").Get();
    }

    void FDolbyGameKitUnrealEditorModule::ShutdownModule()
    {
        if (UObjectInitialized())
        {
            UnregisterSettings();
        }
    }

    void FDolbyGameKitUnrealEditorModule::RegisterSettings()
    {
            if (ISettingsModule* SettingsModule = FModuleManager::GetModulePtr<ISettingsModule>("Settings"))
            {
                    SettingsModule->RegisterSettings("Project", "Plugins", "Dolby Atmos",
                            LOCTEXT("DolbyGameKitUnrealEditorSettingsName", "Dolby Atmos"),
                            LOCTEXT("DolbyGameKitUnrealEditorSettingsDescription", "Configure the Dolby Atmos plugin"),
                            GetMutableDefault<UDolbyGameKitSettings>()
                    );
            }
    }

    void FDolbyGameKitUnrealEditorModule::UnregisterSettings()
    {
            if (ISettingsModule* SettingsModule = FModuleManager::GetModulePtr<ISettingsModule>("Settings"))
            {
                    SettingsModule->UnregisterSettings("Project", "Plugins", "Dolby Atmos");
            }
    }


} // namespace DolbyGameKit
