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

#include <DolbyCoordinates.h>

using TSample = float;

struct DolbyGameMetadata
{
    DolbyGameKit::AtmosCoordinates coordinates{ 0.0f, 0.0f, 0.0f };
    bool snapToCoordinates{ false };

    // TODO: add additional metadata fields as needed
    float size{ 0.0f };
};

using byte_t = char;