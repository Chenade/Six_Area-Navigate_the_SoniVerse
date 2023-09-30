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

class IDolbyGameKitUnrealModule : public IModuleInterface
{
public:
	/**
	* Singleton-like access to this module's interface. This is just for
	* convenience! Beware of calling this during the shutdown phase, though.
	* Your module might have been unloaded already.
	*
	* @return Returns singleton instance, loading the module on demand if needed
	*/
	static inline IDolbyGameKitUnrealModule& Get()
	{
		return FModuleManager::LoadModuleChecked<IDolbyGameKitUnrealModule>("DolbyAtmos");
	}

	/**
	* Checks to see if this module is loaded and ready. It is only valid to call
	* Get() if IsAvailable() returns true.
	*
	* @return True if the module is loaded and ready to use
	*/
	static inline bool IsAvailable()
	{
		return FModuleManager::Get().IsModuleLoaded("DolbyAtmos");
	}
};
