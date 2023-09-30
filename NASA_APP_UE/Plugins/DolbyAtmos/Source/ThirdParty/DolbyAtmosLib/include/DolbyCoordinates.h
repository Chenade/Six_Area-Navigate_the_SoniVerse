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

namespace DolbyGameKit
{

// arbitrary game polar coordinates
struct PolarCoordinates
{
    float azimuth;
    float elevation;
    float distance;
};

// arbitrary game Cartesian coordinates
struct CartesianCoordinates
{
    float x;
    float y;
    float z;
};

// internal Atmos coordinates (consistent with DAMF)
struct AtmosCoordinates
{
    float x;    // from -1.0 to 1.0 (left to right)
    float y;    // from -1.0 to 1.0 (back to front)
    float z;    // from -1.0 to 1.0 (bottom to top)
};

// Microsoft ISpatialAudioClient coordinates (Windows/XBox API)
struct IsacCoordinates
{
    float x;    // from -0.5 to 0.5 (left to right)
    float y;    // from -0.5 to 0.5 (front to back)
    float z;    // from -1.0 to 1.0 (bottom to top)
};

inline void CartesianToPolar( float x, float y, float z, float &azimuth, float &elevation, float &radius );
inline void PolarToCartesian( float azimuth, float elevation, float radius, float &x, float &y, float &z );

PolarCoordinates CartesianToPolar( const CartesianCoordinates cartesianCoords );
CartesianCoordinates PolarToCartesian( const PolarCoordinates polarCoords );

const float DegreesToRadians( float angleDegrees );
const float RadiansToDegrees( float angleRadians );

AtmosCoordinates CartesianToAtmos(const CartesianCoordinates gameCoords, float scaleFactor = 1.0f);
AtmosCoordinates PolarToAtmos(const PolarCoordinates unrealPolarCoordinates);

IsacCoordinates AtmosToISAC(const AtmosCoordinates atmosCoordinates);

} // namespace DolbyGameKit
