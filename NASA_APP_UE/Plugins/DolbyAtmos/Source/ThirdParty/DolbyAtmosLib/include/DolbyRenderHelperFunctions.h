/******************************************************************************
 * This program is protected under international and U.S. copyright laws as
 * an unpublished work. This program is confidential and proprietary to the
 * copyright owners. Reproduction or disclosure, in whole or in part, or the
 * production of derivative works therefrom without the express permission of
 * the copyright owners is prohibited.
 *
 *                Copyright (C) 2023 by Dolby Laboratories.
 *                            All rights reserved.
 ******************************************************************************/

#pragma once

#include "DolbyGameCommonTypes.h"

namespace DolbyGameKit
{

/*********************************************************************************
 * Given a audio buffer of length numSamplesPerBuffer * numInputChannels, de-interleave
 * the buffer and return a pointer to the audio output buffer.
 *
 *
 * @param pAudioInputBuffer     Raw handle to the audio input buffer to de-interleave
 *                                  audio, of length numSamplesPerBuffer * numInputChannels.
 *
 * @param numInputChannels      The number of channels in pAudioInputBuffer.
 * @param numSamplesPerChannel  The number of samples per channel in pAudioInputBuffer.

 * @param pAudioOutputBuffer    Raw handle to the de-interleaved audio output buffer. If this
 *                              handle is null, will return with a fail.
 *
 * @return Whether or not the de-interleaving was successful.
 */
bool DeinterleaveAudioBuffer(
    const TSample* const pAudioInputBuffer,
    const int numInputChannels,
    const int numSamplesPerChannel,
    TSample* &pAudioOutputBuffer
);

} // namespace DolbyGameKit