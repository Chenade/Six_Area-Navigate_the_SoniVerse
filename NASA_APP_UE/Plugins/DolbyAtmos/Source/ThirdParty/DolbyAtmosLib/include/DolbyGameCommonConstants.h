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

#pragma once

const float gainUnity = 1.0f;               //  0 dB
const float gainHalfPower = 0.708f;         // -3 dB
const float gainQuarterPower = 0.5012f;     // -6 dB

const unsigned int kNumStereoChannels = 2;
const int kMaxSupportedInternalRendererChannels = 2;
// The number of supported interleaved channels to de-interleave.
const unsigned int kMaxSupportedInterleavedChannels = 2;

// soundfield sources currently have no source ID
const int kNoSourceID = -1;
