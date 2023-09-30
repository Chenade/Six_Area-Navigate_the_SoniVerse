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

using UnrealBuildTool;
using System.IO;

public class DolbyAtmos : ModuleRules
{
    protected virtual bool bSupportsProceduralMesh { get { return true; } }

    public DolbyAtmos(ReadOnlyTargetRules Target) : base(Target)
    {
        string DolbyGameKitPath = ModuleDirectory + "/Private";

        PublicIncludePaths.AddRange(
            new string[] {
            }
        );

        PrivateIncludePaths.Add(DolbyGameKitPath);

        PublicDependencyModuleNames.AddRange(
            new string[] {
                "Core",
                "CoreUObject",
                "Engine",
                "AudioMixer",
                "SignalProcessing",
                "SoundFieldRendering",
                "AudioExtensions",
            }
        );

        PrivateIncludePathModuleNames.AddRange(
            new string[] {
                "TargetPlatform"
            }
        );

        PrivateDependencyModuleNames.AddRange(
            new string[] {
                "Core",
                "CoreUObject",
                "Engine",
                "InputCore",
                "Projects",
                "AudioMixer",
                "AudioMixerCore",
                "AudioExtensions"
            }
        );

        if (Target.bBuildEditor == true)
        {
            PrivateDependencyModuleNames.Add("SettingsEditor");
            PrivateDependencyModuleNames.Add("UnrealEd");
            PrivateDependencyModuleNames.Add("Landscape");
        }

        ShadowVariableWarningLevel = WarningLevel.Off;

        AddEngineThirdPartyPrivateStaticDependencies(Target,
                "DolbyAtmosLib"
                );


        if (Target.Platform == UnrealTargetPlatform.Android)
        {
            bEnableExceptions = true;
        }
        // String comparison for XSX to avoid the plugin build script failing
        // when Xbox platform extenstion isn't built with the Unreal Engine source code
        else if (Target.Platform == UnrealTargetPlatform.Win64 || Target.Platform.ToString() == "XSX")
        {
            // These parameters are mandatory for winrt support
            bEnableExceptions = true;
            bUseUnity = false;
            CppStandard = CppStandardVersion.Cpp17;
            PublicSystemLibraries.AddRange(new string[] { "mmdevapi.lib", "shlwapi.lib", "runtimeobject.lib", "winmm.lib" });
            PrivateIncludePaths.AddRange(new string[] {
                                                        Path.Combine(Target.WindowsPlatform.WindowsSdkDir,
                                                            "Include",
                                                            Target.WindowsPlatform.WindowsSdkVersion,
                                                            "cppwinrt")
                                                      }
                                        );
        }
        else if (Target.Platform == UnrealTargetPlatform.Mac)
        {
            bEnableExceptions = true;
            PublicFrameworks.AddRange(new string[]{"AudioToolbox"});
        }
        else if (Target.Platform == UnrealTargetPlatform.IOS)
        {
            bEnableExceptions = true;
            PublicFrameworks.AddRange(new string[]{"AudioToolbox"});
        }
    }
}
