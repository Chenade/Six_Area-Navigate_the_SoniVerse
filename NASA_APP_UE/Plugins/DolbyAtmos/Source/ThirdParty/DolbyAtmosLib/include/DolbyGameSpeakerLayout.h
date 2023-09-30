/******************************************************************************
 * This program is protected under international and U.S. copyright laws as
 * an unpublished work. This program is confidential and proprietary to the
 * copyright owners. Reproduction or disclosure, in whole or in part, or the
 * production of derivative works therefrom without the express permission of
 * the copyright owners is prohibited.
 *
 *                Copyright (C) 2017-2023 by Dolby Laboratories.
 *                            All rights reserved.
 ******************************************************************************/

#pragma once

#ifdef __cplusplus
#include <unordered_map>
#include <unordered_set>

extern "C" {
#endif

#define MAX_RENDERED_SPEAKER_COUNT 16

/* Individual speaker positions. */
// ground layer
#define SPK_POS_L     {  -1.0,     1.0,     0  }
#define SPK_POS_R     {   1.0,     1.0,     0  }
#define SPK_POS_C     {   0,       1.0,     0  }
#define SPK_POS_LS    {  -1.0,       0,     0  }
#define SPK_POS_RS    {   1.0,       0,     0  }
#define SPK_POS_LRS   {  -1.0,    -1.0,     0  }
#define SPK_POS_RRS   {   1.0,    -1.0,     0  }
#define SPK_POS_CR    {   0,      -1.0,     0  }
#define SPK_POS_LFE   {  -2,       -2,     -2  }
// top layer
#define SPK_POS_LTF   {  -1.0,    1.0,    1.0  }
#define SPK_POS_RTF   {   1.0,    1.0,    1.0  }
#define SPK_POS_LTR   {  -1.0,   -1.0,    1.0  }
#define SPK_POS_RTR   {   1.0,   -1.0,    1.0  }
#define SPK_POS_LTM   {  -1.0,      0,    1.0  }
#define SPK_POS_RTM   {   1.0,      0,    1.0  }
// bottom layer
#define SPK_POS_LBF   {  -1.0,    1.0,   -1.0  }
#define SPK_POS_RBF   {   1.0,    1.0,   -1.0  }
#define SPK_POS_LBR   {  -1.0,   -1.0,   -1.0  }
#define SPK_POS_RBR   {   1.0,   -1.0,   -1.0  }

typedef struct
{
    float x;
    float y;
    float z;
} pos_coordinates;

typedef enum
{
    SPEAKER_LAYOUT_UNDEFINED = 0,
    SPEAKER_LAYOUT_MONO,
    SPEAKER_LAYOUT_2_0,
    SPEAKER_LAYOUT_2_1,
    SPEAKER_LAYOUT_5_1,
    SPEAKER_LAYOUT_5_1_2,
    SPEAKER_LAYOUT_5_1_4,
    SPEAKER_LAYOUT_7_1,
    SPEAKER_LAYOUT_7_1_2,
    SPEAKER_LAYOUT_7_1_4,
    SPEAKER_LAYOUT_8_1_4_4,
    SPEAKER_LAYOUT_COUNT
} SPEAKER_LAYOUT;

typedef enum
{
    X_DIM = 1,
    Y_DIM = 2,
    Z_DIM = 3,
}POSITION_DIMENSION;


void get_speaker_positions(SPEAKER_LAYOUT layout_index, pos_coordinates **p_spk_pos, unsigned int *p_spk_num, unsigned int *p_layout_dim);

#ifdef __cplusplus

// Speaker positions in 5.1.x/7.1.x output buffers
enum
{
    SPEAKER_BUS_INDEX_L = 0,
    SPEAKER_BUS_INDEX_R,
    SPEAKER_BUS_INDEX_C,
    SPEAKER_BUS_INDEX_LS,
    SPEAKER_BUS_INDEX_RS,
    SPEAKER_BUS_INDEX_LRS,
    SPEAKER_BUS_INDEX_RRS
};

#define SPEAKER_COUNT_NONE      0
#define SPEAKER_COUNT_MONO      1
#define SPEAKER_COUNT_2_0       2
#define SPEAKER_COUNT_2_1       3
#define SPEAKER_COUNT_3_0       3
#define SPEAKER_COUNT_5_0       5
#define SPEAKER_COUNT_5_1       6
#define SPEAKER_COUNT_5_1_2     8
#define SPEAKER_COUNT_5_1_4     10
#define SPEAKER_COUNT_7_0       7
#define SPEAKER_COUNT_7_1       8
#define SPEAKER_COUNT_7_1_2     10
#define SPEAKER_COUNT_7_1_4     12
#define SPEAKER_COUNT_8_1_4_4   17

#ifdef __cplusplus
const static std::unordered_map<SPEAKER_LAYOUT, size_t> speakerLayoutToNumChannels = {
    {SPEAKER_LAYOUT_UNDEFINED, SPEAKER_COUNT_NONE},
    {SPEAKER_LAYOUT_MONO, SPEAKER_COUNT_MONO},
    {SPEAKER_LAYOUT_2_0, SPEAKER_COUNT_2_0},
    {SPEAKER_LAYOUT_2_1, SPEAKER_COUNT_2_1},
    {SPEAKER_LAYOUT_5_1, SPEAKER_COUNT_5_1},
    {SPEAKER_LAYOUT_5_1_2, SPEAKER_COUNT_5_1_2},
    {SPEAKER_LAYOUT_5_1_4, SPEAKER_COUNT_5_1_4},
    {SPEAKER_LAYOUT_7_1, SPEAKER_COUNT_7_1},
    {SPEAKER_LAYOUT_7_1_2, SPEAKER_COUNT_7_1_2},
    {SPEAKER_LAYOUT_7_1_4, SPEAKER_COUNT_7_1_4},
    {SPEAKER_LAYOUT_8_1_4_4, SPEAKER_COUNT_8_1_4_4},
};

// excludes LFE.
const static std::unordered_map<SPEAKER_LAYOUT, size_t> speakerLayoutToNumListenerPlaneSpeakers = {
    {SPEAKER_LAYOUT_UNDEFINED, SPEAKER_COUNT_NONE},
    {SPEAKER_LAYOUT_MONO, SPEAKER_COUNT_MONO},
    {SPEAKER_LAYOUT_2_0, SPEAKER_COUNT_2_0},
    {SPEAKER_LAYOUT_2_1, 2},
    {SPEAKER_LAYOUT_5_1, 5},
    {SPEAKER_LAYOUT_5_1_2, 5},
    {SPEAKER_LAYOUT_5_1_4, 5},
    {SPEAKER_LAYOUT_7_1, 7},
    {SPEAKER_LAYOUT_7_1_2, 7},
    {SPEAKER_LAYOUT_7_1_4, 7},
    {SPEAKER_LAYOUT_8_1_4_4, 8},
};

const static std::unordered_set<SPEAKER_LAYOUT> speakerLayoutWithTwoHeightChannels = {
    SPEAKER_LAYOUT_5_1_2,
    SPEAKER_LAYOUT_7_1_2,
};

const static std::unordered_set<SPEAKER_LAYOUT> speakerLayoutWithFourHeightChannels = {
    SPEAKER_LAYOUT_5_1_4,
    SPEAKER_LAYOUT_7_1_4,
    SPEAKER_LAYOUT_8_1_4_4,
};
#endif

// Channel positions in 5.1/7.1 input files with SMPTE channel ordering
enum
{
    SMPTE_CHANNEL_INDEX_L = 0,
    SMPTE_CHANNEL_INDEX_R,
    SMPTE_CHANNEL_INDEX_C,
    SMPTE_CHANNEL_INDEX_LFE,
    SMPTE_CHANNEL_INDEX_LS,
    SMPTE_CHANNEL_INDEX_RS,
    SMPTE_CHANNEL_INDEX_LRS,
    SMPTE_CHANNEL_INDEX_RRS
};

// locations of heights channel stereo pairs used for rendering.
enum HeightStereoPair
{
    FRONT,  // LTF + RTF
    MIDDLE, // LTM + RTM
    REAR    // LTR + RTR
};
}
#endif
