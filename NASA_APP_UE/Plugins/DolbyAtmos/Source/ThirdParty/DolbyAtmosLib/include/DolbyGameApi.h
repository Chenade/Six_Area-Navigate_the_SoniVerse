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

#include <DolbyGameSpeakerLayout.h>
#include <DolbyGameCommonTypes.h>
#include <IEngineDelegate.h>

/**********************************************************************************
 * Initialize DolbyGameAPI. This function must be called before using any other
 * functions in this API unless explicitly stated. If the function succeeds, the
 * DolbyGameAPI_IsInitialized() will return true.
 *
 * If any of these parameters change, you must re-initialize IDAPS using the
 * DolbyGameAPI_DeInit() followed by another call to this function.
 *
 * @param disableObjectRendering If true, objects will be rendered to a bed-
 *                                  channel layout. If this setting is false,
 *                                  objects will be rendered using dynamic objects.
 * @param engineDelegate         Engine delegate used for argument is (default uses
 *                                  ideal sample-rate and callback buffer size).
**********************************************************************************/
void DolbyGameAPI_Init(bool disableObjectRendering, DolbyGameKit::IEngineDelegate* engineDelegate = nullptr);

/**********************************************************************************
 * Deinitializes DolbyGameAPI. After calling this function,
 * DolbyGameAPI_IsInitialized() will return false.
**********************************************************************************/
void DolbyGameAPI_DeInit();

/**********************************************************************************
 * Reinitializes DolbyGameAPI using a new engine block size. This will overwrite
 * the existing blocksize that was obtained using the GetBufferFrameSize() method
 * on the engineDelegate passed to the Init() function.
 *
 * @param newCallbackBufferSize     Buffer size to update DolbyGameAPI internals
 *                                      to.
**********************************************************************************/
void DolbyGameAPI_UpdateCallbackBufferSize(const size_t newCallbackBufferSize);

/**********************************************************************************
 * Returns true if a successful call to DolbyGameAPI_Init() has been made.
 * This API may be called before a successful call to the Init() API.
 *
 * @return Value of whether or not DolbyGameAPI has been successfully initialized.
**********************************************************************************/
bool DolbyGameAPI_IsInitialized();

/**********************************************************************************
 * Enables support for rendering to dynamic objects if supported by the sink.
 * Note that if Init() is called specifying that dynamic objects should not
 * be supported, there is no guarantee dynamic objects will start working
 * after this call as the sink will already have been initialized.
 *
 * All accumulated audio for the current frame will be discarded. Source and
 * Device IDs will persist.
*********************************************************************************/
void DolbyGameAPI_EnableDynamicObjects();

/*********************************************************************************
 * Disables support for rendering to dynamic objects.
 *
 * All accumulated audio for the current frame will be discarded. Source and
 * Device IDs will persist.
*********************************************************************************/
void DolbyGameAPI_DisableDynamicObjects();

/*********************************************************************************
 * Return a string representation of the version of DolbyGameAPI. The memory for
 * this string is owned by the library and does not need to be freed. The function
 * does not fail and will always return a valid null-terminated string. It may
 * be called prior to calling DolbyGameAPI_Init().
*********************************************************************************/
const char* DolbyGameAPI_GetVersion();

/*********************************************************************************
 * Return a unique identifier for a particular source index (sourceID) within
 * the given source group (deviceID). The returned value is to be used with
 * the DolbyGameAPI_Add*ToPresentation() audio functions as well as the
 * DolbyGameAPI_[Start/Stop]DynamicObject() APIs.
 *
 * @param deviceID      Device ID provided from game engine. Expected to be from
 *                          [0, [num_game_engine_devices]).
 *
 * @param sourceID      Unique audio source ID provided by game engine. Expected
 *                          to be from [0, IEngineDelegate::GetNumSources())
 *
 * @return Unique source ID to be used in DolbyGameAPI for adding audio to render.
*********************************************************************************/
const int DolbyGameAPI_GetUniqueSourceID(
    const unsigned int deviceID,
    const unsigned int sourceID);

/*********************************************************************************
 * Given a mono audio buffer of length numSamplesPerBuffer associated with the
 * given uniqueSourceID and metadata (position), render it into the scene.
 *
 * @param pAudioInputBuffer     Raw handle to the audio input buffer to render
 *                                  audio of length numSamplesPerBuffer.
 *
 * @param uniqueSourceID        The unique source ID associated with the audio
 *                                  of the pAudioInputBuffer.
 *
 * @param numSamplesPerBuffer   The number of samples in pAudioInputBuffer.
 *
 * @param position              The Atmos 3D coordinates for the sound source.
********************************************************************************/
void DolbyGameAPI_AddMonoToPresentation(
    const TSample* const pAudioInputBuffer,
    const int uniqueSourceID,
    const unsigned int numSamplesPerBuffer,
    const DolbyGameMetadata* const position);

/*********************************************************************************
 * Given a stereo audio buffer of length NUM_STEREO_CHANNELS *
 * numSamplesPerChannelPerBuffer, associated with the given uniqueSourceID
 * and metadata ([left/right]ChannelPosition), render it into the scene.
 *
 * @param pAudioInputBuffer     Raw handle to the audio input buffer to render
 *                                  audio of length numSamplesPerBuffer.
 *
 * @param uniqueSourceID        The unique source ID associated with the audio
 *                                  of the pAudioInputBuffer.
 *
 * @param numSamplesPerChannelPerBuffer   The number of samples of each channel
 *                                           in pAudioInputBuffer.
 * @param isInterleaved         Whether or not pAudioInputBuffer has its samples
 *                                  as interleaved data per-channel.
 *
 * @param leftChannelPosition   The Atmos 3D coordinates of the left channel
 *                                  for the sound source.
 * @param rightChannelPosition  The Atmos 3D coordinates of the right channel
 *                                  for the sound source.
********************************************************************************/
void DolbyGameAPI_AddStereoToPresentation(
    const TSample* const pAudioInputBuffer,
    const int uniqueSourceID,
    const unsigned int numSamplesPerChannelPerBuffer,
    const bool isInterleaved,
    const DolbyGameMetadata* const leftChannelPosition,
    const DolbyGameMetadata* const rightChannelPosition);

/*********************************************************************************
 * Add a set of bed channels from an audio buffer of length numChannels *
 * numSamplesPerChannelPerBuffer, associated with the given uniqueSourceID
 * into the scene. Downmixing to the underlying output bed format will occur
 * if necessary.
 *
 * @param pAudioInputBuffer     Raw handle to the audio input buffer to render
 *                                  audio of length numSamplesPerBuffer.
 *
 * @param uniqueSourceID        The unique source ID associated with the audio
 *                                  of the pAudioInputBuffer.
 *
 * @param numChannels           Number of channels, which must be  1 (mono C),
 *                                  2 (stereo LR), 6 (5.1 LRCLfeLsRs) or
 *                                  8 (7.1 LRCLfeLsRsLrsRrs).
 *
 * @param numSamplesPerChannelPerBuffer   The number of samples of each channel
 *                                           in pAudioInputBuffer.
 * @param isInterleaved         Whether or not pAudioInputBuffer has its samples
 *                                  as interleaved data per-channel.
********************************************************************************/
void DolbyGameAPI_AddBedToPresentation(
    const TSample* const pAudioInputBuffer,
    const int uniqueSourceID,
    const unsigned int numChannels,
    const unsigned int numSamplesPerChannelPerBuffer,
    const bool isInterleaved);

/*********************************************************************************
 * Add a set of bed channels from an audio buffer of length numChannels *
 * numSamplesPerChannelPerBuffer, associated with the given uniqueSourceID
 * into height channels of a specific heightStereoPair into the scene.
 * Downmixing to the stereo height output pair will occur if necessary.
 *
 * For 2 channel height modes (SPEAKER_LAYOUT_5_1_2 or
 * SPEAKER_LAYOUT_7_1_2), heightStereoPair has no effect. The input buffer
 * will be collapsed into the height channels in the same way that the input
 * buffer would be mixed into a stereo stream into the Ltm and Rtm channels.
 * For 4 channel height modes (SPEAKER_LAYOUT_5_1_4, SPEAKER_LAYOUT_7_1_4,
 * SPEAKER_LAYOUT_8_1_4_4), the value of heightStereoPair is used to determine
 * how the rendering will be summed into the Ltf, Rtf, Ltb and Rtb channels;
 * if the value is FRONT, the entirety of the 2 channel downmix of the input
 * channels will be summed into the front two height channels. If the value is
 * REAR, the entirety of the 2 channel mix will be summed into the rear two
 * height channels. If the value is MIDDLE, the entirety of the 2 channel mix
 * will be summed equally with attenuation into the front and rear sets of
 * height channels.
 *
 * @param pAudioInputBuffer     Raw handle to the audio input buffer to render
 *                                  audio of length numSamplesPerBuffer.
 *
 * @param uniqueSourceID        The unique source ID associated with the audio
 *                                  of the pAudioInputBuffer.
 *
 * @param numChannels           Number of channels, which must be  1 (mono C),
 *                                  2 (stereo LR), 6 (5.1 LRCLfeLsRs) or
 *                                  8 (7.1 LRCLfeLsRsLrsRrs).
 *
 * @param numSamplesPerChannelPerBuffer   The number of samples of each channel
 *                                           in pAudioInputBuffer.
 * @param isInterleaved         Whether or not pAudioInputBuffer has its samples
 *                                  as interleaved data per-channel.
 *
 * @param heightStereoPair      Height stereo pair of value FRONT, MIDDLE,
 *                                  or REAR. The function send input bed channels
 *                                  to any of the pairs will be downmixed based
 *                                  on the number of height channels in the final
 *                                  output speaker format.
********************************************************************************/
void DolbyGameAPI_AddHeightsToPresentation(
    const TSample* const pAudioInputBuffer,
    const int uniqueSourceID,
    const unsigned int numChannels,
    const unsigned int numSamplesPerChannelPerBuffer,
    const bool isInterleaved,
    const HeightStereoPair heightStereoPair);

/********************************************************************************
 * Resets the underlying device output sink.
 *
 * @param waitForNextFlush  Synchronizes the reset with the next call to
 *                          DolbyGameAPI_FlushPresentationToSink
********************************************************************************/
void DolbyGameAPI_ResetSink(bool waitForNextFlush = false);

/********************************************************************************
 * Halts playback of the audio. Audio will stop being consumed from buffers
 * until playback is resumed via DolbyGameAPI_ResumeSink().
********************************************************************************/
void DolbyGameAPI_SuspendSink();

/********************************************************************************
 * Resume playback of the audio in the device output sink.
********************************************************************************/
void DolbyGameAPI_ResumeSink();

/********************************************************************************
 * Indicate that there will be no more calls to the
 * DolbyGameAPI_Add*ToPresentation() APIs and flush a frame worth of audio data
 * into the sink. The length of the buffer sent to the sink is determined by the
 * IEngineDelegate::GetBufferFrameSize() API that was supplied to the Init()
 * function at the point Init() was called.
********************************************************************************/
void DolbyGameAPI_FlushPresentationToSink();

/********************************************************************************
 * Add a new deviceID to the set of supported devices. This will allocate
 * space for another set of internal source states (the number of which will
 * be the result of GetNumSources() as returned by the delegate).
 *
 * @param deviceId The device ID of each of the game engine's instantiated
 *                  devices
********************************************************************************/
void DolbyGameAPI_AddDevice(const unsigned int deviceId);

/********************************************************************************
 * Removes a deviceID and sets all the source states that were allocated to
 * the group to be inactive.
 *
 * @param deviceId The device ID of each of the game engine's instantiated
 *                  devices.
********************************************************************************/
void DolbyGameAPI_RemoveDevice(const unsigned int deviceId);

/********************************************************************************
 * Take an internal source index as returned by
 * DolbyGameAPI_GetUniqueSourceID(). If the source is already active, this
 * function does nothing. If the source is inactive, we will attempt to
 * allocate it a dynamic object (if supported by the sink). If there are no
 * dynamic objects available, the object will be rendered into the bed mix.
 *
 * @param uniqueSourceID        The unique source ID associated with the
 *                                  sound source in the scene.
********************************************************************************/
void DolbyGameAPI_StartDynamicObject(const int uniqueSourceID);

/********************************************************************************
 * Take an internal source index as returned by
 * DolbyGameAPI_GetUniqueSourceID(). Regardless of the current type or state
 * of the specified source, it will be marked as inactive. Any dynamic object
 * that was allocated to the source will become available to another
 * source.
 *
 * @param uniqueSourceID        The unique source ID associated with the
 *                                  sound source in the scene.
********************************************************************************/
void DolbyGameAPI_StopDynamicObject(const int uniqueSourceID);