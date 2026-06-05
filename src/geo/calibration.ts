// Per-map world<->minimap calibration (source: valorant-api.com /v1/maps).
// Forward maps Unreal world coords -> normalized [0,1] minimap position.
// Note the x/y swap and the negative yMultiplier (image Y points down).

export type MapKey =
  | "Ascent" | "Bind" | "Haven" | "Split" | "Icebox" | "Breeze"
  | "Fracture" | "Pearl" | "Lotus" | "Sunset" | "Abyss" | "Corrode";

export interface MapCalib {
  xMultiplier: number;
  yMultiplier: number;
  xScalarToAdd: number;
  yScalarToAdd: number;
}

export interface Vec2 { x: number; y: number; }

export const MAP_CALIB: Record<MapKey, MapCalib> = {
  Ascent:   { xMultiplier: 7.0e-5, yMultiplier: -7.0e-5, xScalarToAdd: 0.813895, yScalarToAdd: 0.573242 },
  Bind:     { xMultiplier: 5.9e-5, yMultiplier: -5.9e-5, xScalarToAdd: 0.576941, yScalarToAdd: 0.967566 },
  Haven:    { xMultiplier: 7.5e-5, yMultiplier: -7.5e-5, xScalarToAdd: 1.093450, yScalarToAdd: 0.642728 },
  Split:    { xMultiplier: 7.8e-5, yMultiplier: -7.8e-5, xScalarToAdd: 0.842188, yScalarToAdd: 0.697578 },
  Icebox:   { xMultiplier: 7.2e-5, yMultiplier: -7.2e-5, xScalarToAdd: 0.460214, yScalarToAdd: 0.304687 },
  Breeze:   { xMultiplier: 7.0e-5, yMultiplier: -7.0e-5, xScalarToAdd: 0.465123, yScalarToAdd: 0.833078 },
  Fracture: { xMultiplier: 7.8e-5, yMultiplier: -7.8e-5, xScalarToAdd: 0.556952, yScalarToAdd: 1.155886 },
  Pearl:    { xMultiplier: 7.8e-5, yMultiplier: -7.8e-5, xScalarToAdd: 0.480469, yScalarToAdd: 0.916016 },
  Lotus:    { xMultiplier: 7.2e-5, yMultiplier: -7.2e-5, xScalarToAdd: 0.454789, yScalarToAdd: 0.917752 },
  Sunset:   { xMultiplier: 7.8e-5, yMultiplier: -7.8e-5, xScalarToAdd: 0.500000, yScalarToAdd: 0.515625 },
  Abyss:    { xMultiplier: 8.1e-5, yMultiplier: -8.1e-5, xScalarToAdd: 0.500000, yScalarToAdd: 0.500000 },
  Corrode:  { xMultiplier: 7.0e-5, yMultiplier: -7.0e-5, xScalarToAdd: 0.526158, yScalarToAdd: 0.500000 },
};

/** world -> normalized [0,1] minimap coords. Multiply by minimap image px to plot. */
export function toMinimap(loc: Vec2, c: MapCalib): Vec2 {
  return {
    x: loc.y * c.xMultiplier + c.xScalarToAdd,
    y: loc.x * c.yMultiplier + c.yScalarToAdd,
  };
}

/** inverse: normalized [0,1] -> world coords. Used to author realistic fixture positions. */
export function worldFromNormalized(nx: number, ny: number, c: MapCalib): Vec2 {
  return {
    x: Math.round((ny - c.yScalarToAdd) / c.yMultiplier),
    y: Math.round((nx - c.xScalarToAdd) / c.xMultiplier),
  };
}
