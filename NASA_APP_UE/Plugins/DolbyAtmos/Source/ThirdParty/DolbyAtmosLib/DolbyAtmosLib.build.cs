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

using UnrealBuildTool;
using System.IO;

public class DolbyAtmosLib : ModuleRules
{
	protected virtual string DolbyAtmosLibIncludePath { get { return Path.Combine(ModuleDirectory, "include/"); } }
	protected virtual string DolbyAtmosLibPath { get { return Path.Combine(ModuleDirectory, "lib/"); } }

	public DolbyAtmosLib(ReadOnlyTargetRules Target) : base(Target)
	{
		Type = ModuleType.External;

		PublicIncludePaths.Add(DolbyAtmosLibIncludePath);
		string LibraryPath = DolbyAtmosLibPath;

		// String comparison for XSX to avoid the plugin build script failing
		// when Xbox platform extenstion isn't built with the Unreal Engine source code
		if (Target.Platform == UnrealTargetPlatform.Win64 || Target.Platform.ToString() == "XSX")
		{
			LibraryPath += "Windows/VS2019/";
			LibraryPath += "x64/";

			LibraryPath += "Release/";

 			PublicAdditionalLibraries.Add(LibraryPath + "GameKitCore.lib");
		}
		else if (Target.Platform == UnrealTargetPlatform.Mac)
		{
			PublicAdditionalLibraries.Add(LibraryPath + "macOS/libGameKitCore.a");
		}
        else if (Target.Platform == UnrealTargetPlatform.IOS)
		{
			PublicAdditionalLibraries.Add(LibraryPath + "iOS/libGameKitCore.a");
		}
		else if (Target.IsInPlatformGroup(UnrealPlatformGroup.Android))
		{
			string[] Architectures = new string[] {
				"ARM64"
			};

			foreach(string Architecture in Architectures)
			{
				PublicAdditionalLibraries.Add(LibraryPath + "Android/" + Architecture + "/libGameKitCore.a");
			}
		}
    }
}
