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

namespace UnrealBuildTool.Rules
{
    public class DolbyAtmosEditor : ModuleRules
    {
        public DolbyAtmosEditor(ReadOnlyTargetRules Target) : base(Target)
        {
            PrivateIncludePaths.AddRange(
                new string[] {
                    "DolbyAtmosPluginEditor/Private",
                    "DolbyAtmosPlugin/Private",
                }
            );

            PublicIncludePaths.AddRange(
                new string[] {
                }
            );


            PublicDependencyModuleNames.AddRange(
                new string[] {
                    "Core",
                    "CoreUObject",
                    "Engine",
                    "InputCore",
                    "UnrealEd",
                    "LevelEditor",
                    "EditorStyle",
                    "RenderCore",
                    "RHI",
                    "AudioEditor",
                    "AudioMixer",
                    "DolbyAtmos"
                }
            );

            PrivateIncludePathModuleNames.AddRange(
                new string[] {
                    "AssetTools",
                    "Landscape"
            });

            PrivateDependencyModuleNames.AddRange(
                new string[] {
                    "Slate",
                    "SlateCore",
                    "UnrealEd",
                    "AudioEditor",
                    "LevelEditor",
                    "Landscape",
                    "Core",
                    "CoreUObject",
                    "Engine",
                    "InputCore",
                    "PropertyEditor",
                    "Projects",
                    "EditorStyle",
                    "DolbyAtmos",
                    "Eigen"
                 }
            );
        }
    }
}
