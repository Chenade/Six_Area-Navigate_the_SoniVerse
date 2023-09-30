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

#include <string>

/* (1) Should this function exist? Should there be a "query memory" function
 *     on the top-level IDAPS API to avoid needing this? I suspect this is
 *     extra complexity. Assuming it does need to exist, should this API
 *     also provide a custom free() method? How does the engine know when it
 *     is permissible to deallocate the memory requested from this function?
 *     Does it just assume that if it gets called again, the old blob can be
 *     immediately freed? */

namespace DolbyGameKit
{
class IEngineDelegate
{
public:
    virtual ~IEngineDelegate() = default;

    /* This function is used to allocate a blob of memory suitable for holding
     * audio data that must be accessed in a real time context.(1) The
     * function is thread-safe. */
    virtual void* ConfigureMemory(size_t size) = 0;

    /* I think the following 4 APIs should be removed. Their values should be
     * passed directly to the DolbyGameAPI_Init() API and possibly also the
     * DolbyGameAPI_ResetSink() API. */
    virtual const size_t GetBufferFrameSize() const = 0;
    virtual const float GetSampleRate() const = 0;
    virtual const size_t GetMaxBufferSize() const = 0;
    virtual const int GetNumSources() const = 0;

    /* This function is used to send log information to the calling code. */
    virtual void Print(const std::string& message) = 0;

};
}
