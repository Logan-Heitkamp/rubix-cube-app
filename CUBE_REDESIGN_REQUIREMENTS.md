# Cube Redesign Requirements

## Goal
Redesign the main cube screen to look cleaner and more minimal, similar to [alg.cubing.net](https://alg.cubing.net/).

## Current Issues
- Dark background with default Three.js lighting creates a "not great" look
- Controls overlay in top-right corner is visually cluttered
- No separation between cube and content areas
- Basic visual presentation lacks polish

## Desired Design

### Layout
- **Left 50%**: Cube display (clean, minimalist)
- **Right 50%**: Content area (algorithms, timers, etc.)
- Responsive: stacks vertically on mobile

### Cube Display
- Minimal/no shading or shadows on the cube
- Clean white/colored stickers against dark background
- No grid or background elements
- Cube should be centered in left half of screen (not full center)
- Black lines between colored faces (like the spaces between pieces)

### Controls
- **Touch drag to rotate cube** (keep current gesture)
- Optional: 4 corner rotation buttons for quick angles (top, bottom, front, back views)
- Hide face turn controls by default (can be toggled)
- Zoom controls: minimal +/- buttons

### Visual Style
- Background: Dark (`#0f172a`) or transparent
- Cube faces: Standard colors (white, yellow, orange, red, green, blue)
- Stickers: Solid colors with minimal borders
- Text/controls: Theme-aware (light/dark mode support)

## Implementation Tasks

### 1. Create New Components

#### `MinimalCube.tsx`
- Simplified Three.js setup
- Use `MeshBasicMaterial` for no shading
- Clean lighting (single ambient light)
- No grid helper
- Camera positioned to center cube in left half of split view

#### `CubeRotationControls.tsx`
- 4 corner buttons: top, bottom, front, back views
- Optional: Reset button
- Minimal design matching alg.cubing.net style

#### `SplitView.tsx`
- Flex container with 50/50 split
- Left pane: Cube
- Right pane: Content area
- Responsive: stacks vertically on mobile

### 2. Update Existing Files

#### `CubeView.tsx`
- Use `SplitView` as layout wrapper
- Move controls to minimal overlay (bottom-left or top-left)
- Keep gesture rotation on cube
- Show rotation controls by default
- Hide face turn controls by default

#### `App.tsx`
- Keep tab navigation
- Ensure tabs are visible (may need to adjust content area height)

### 3. Camera Positioning
- Camera should be positioned so cube appears centered in left half
- Camera distance should be fixed to avoid zooming when rotating
- Spherical coordinates for camera orbit (fixed radius)

### 4. Edge Lines
- Add black lines between colored faces
- Should match the thickness of spaces between cube pieces
- Use internal faces or separate edge geometry

## Files to Create
```
src/features/cube/components/
├── MinimalCube.tsx          (NEW)
├── CubeRotationControls.tsx (NEW)
└── SplitView.tsx            (NEW)
```

## Files to Modify
```
src/features/cube/
├── CubeView.tsx             (MODIFY)
└── CubeControls.tsx         (Optional - hide by default)
```

## Verification Checklist
- [ ] Cube renders cleanly without shading
- [ ] Left 50% / Right 50% layout works on desktop
- [ ] Mobile shows full cube (no split)
- [ ] Touch rotation is smooth
- [ ] Controls don't clutter the view
- [ ] Black lines visible between colored faces
- [ ] Tabs are visible on mobile
- [ ] Works on both light and dark themes
