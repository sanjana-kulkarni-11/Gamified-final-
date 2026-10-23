/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

/**
 * Pixel Cloud matching the reference image:
 * Chunky white pixel body with stepped blue/cyan shadow underneath.
 */
export const PixelCloud: React.FC<{ className?: string }> = ({ className = 'w-48 h-24' }) => (
  <svg
    viewBox="0 0 120 60"
    className={`image-pixelated ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Under-cloud Blue/Cyan Pixel Shadow */}
    <rect x="25" y="45" width="70" height="8" fill="#587beb" />
    <rect x="15" y="40" width="90" height="8" fill="#587beb" />
    <rect x="35" y="30" width="30" height="15" fill="#4368dd" />
    <rect x="75" y="32" width="28" height="12" fill="#4368dd" />
    <rect x="10" y="32" width="25" height="10" fill="#4368dd" />

    {/* White Main Pixel Cloud */}
    <rect x="30" y="10" width="45" height="18" fill="#ffffff" />
    <rect x="65" y="14" width="35" height="18" fill="#ffffff" />
    <rect x="15" y="22" width="90" height="20" fill="#ffffff" />
    <rect x="10" y="28" width="100" height="12" fill="#ffffff" />
    <rect x="42" y="6" width="22" height="6" fill="#ffffff" />
    <rect x="72" y="10" width="18" height="6" fill="#ffffff" />

    {/* Cyan Cloud Inset Accents */}
    <rect x="24" y="32" width="12" height="4" fill="#69a3f5" />
    <rect x="80" y="26" width="14" height="4" fill="#69a3f5" />
    <rect x="52" y="22" width="16" height="4" fill="#69a3f5" />
  </svg>
);

/**
 * Golden 4-pointed pixel star from the reference image.
 */
export const PixelStar: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={`image-pixelated ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Dark outline */}
    <rect x="7" y="1" width="2" height="14" fill="#a17500" />
    <rect x="1" y="7" width="14" height="2" fill="#a17500" />
    <rect x="6" y="3" width="4" height="10" fill="#c99700" />
    <rect x="3" y="6" width="10" height="4" fill="#c99700" />

    {/* Golden Body */}
    <rect x="7" y="2" width="2" height="12" fill="#ffd54f" />
    <rect x="2" y="7" width="12" height="2" fill="#ffd54f" />
    <rect x="5" y="5" width="6" height="6" fill="#ffe082" />
    {/* Center shine */}
    <rect x="7" y="7" width="2" height="2" fill="#ffffff" />
  </svg>
);

/**
 * Pixel Academic Textbook on the left side of the screen.
 */
export const PixelBook: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg
    viewBox="0 0 32 32"
    className={`image-pixelated ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Dark Outline */}
    <rect x="4" y="8" width="24" height="18" rx="2" fill="#321b4a" />
    {/* Book Cover - Violet / Magenta */}
    <rect x="6" y="10" width="20" height="14" fill="#a84379" />
    <rect x="7" y="11" width="18" height="12" fill="#c75393" />
    {/* Bookmark Stripe */}
    <rect x="14" y="8" width="4" height="16" fill="#60b5ff" />
    {/* White Page Edges */}
    <rect x="6" y="22" width="20" height="3" fill="#e6e8ee" />
    <rect x="7" y="23" width="3" height="1" fill="#717a8a" />
    <rect x="12" y="23" width="3" height="1" fill="#717a8a" />
    <rect x="17" y="23" width="3" height="1" fill="#717a8a" />
    <rect x="22" y="23" width="3" height="1" fill="#717a8a" />
  </svg>
);

/**
 * Pixel Lab Potion Flask on the right side of the screen.
 */
export const PixelFlask: React.FC<{ className?: string }> = ({ className = 'w-24 h-28' }) => (
  <svg
    viewBox="0 0 32 40"
    className={`image-pixelated ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Rim & Neck */}
    <rect x="11" y="2" width="10" height="3" fill="#34495e" />
    <rect x="12" y="3" width="8" height="2" fill="#67809f" />
    <rect x="13" y="5" width="6" height="8" fill="#34495e" />
    <rect x="14" y="5" width="4" height="8" fill="#81cfe0" opacity="0.8" />

    {/* Flask Body (Trapezoid stepped pixels) */}
    <rect x="10" y="13" width="12" height="4" fill="#34495e" />
    <rect x="7" y="17" width="18" height="5" fill="#34495e" />
    <rect x="4" y="22" width="24" height="14" fill="#34495e" />

    {/* Glass Inner & Liquid Fill (Cyan) */}
    <rect x="11" y="14" width="10" height="3" fill="#81cfe0" opacity="0.6" />
    <rect x="8" y="18" width="16" height="4" fill="#22a7f0" />
    <rect x="6" y="23" width="20" height="11" fill="#19b5fe" />

    {/* Liquid highlights & bubbles */}
    <rect x="8" y="25" width="3" height="3" fill="#e0f7fa" />
    <rect x="17" y="28" width="2" height="2" fill="#e0f7fa" />
    <rect x="13" y="24" width="2" height="2" fill="#ffffff" />
  </svg>
);

/**
 * Row of 5 pixel hearts with dark outline, red gradient, and white specular pixel.
 */
export const PixelHeart: React.FC<{ active?: boolean; size?: number }> = ({ active = true, size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className="image-pixelated shrink-0 transition-transform hover:scale-110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Dark Border */}
    <path
      d="M3 2H5V3H7V4H9V3H11V2H13V4H14V7H13V9H11V11H9V13H7V11H5V9H3V7H2V4H3V2Z"
      fill="#2b1414"
    />
    {active ? (
      <>
        {/* Red Heart Body */}
        <path
          d="M3 4H5V5H7V6H9V5H11V4H13V7H11V9H9V11H7V9H5V7H3V4Z"
          fill="#ff3b30"
        />
        <rect x="4" y="5" width="3" height="3" fill="#ff4d42" />
        <rect x="9" y="5" width="3" height="3" fill="#ff4d42" />
        <rect x="5" y="8" width="6" height="2" fill="#e0261b" />
        {/* White Specular Shine Pixel */}
        <rect x="4" y="4" width="1.5" height="1.5" fill="#ffffff" />
        <rect x="10" y="4" width="1" height="1" fill="#ffb4af" />
      </>
    ) : (
      <>
        {/* Empty / Depleted Heart Body */}
        <path
          d="M3 4H5V5H7V6H9V5H11V4H13V7H11V9H9V11H7V9H5V7H3V4Z"
          fill="#473138"
        />
        <rect x="5" y="8" width="6" height="2" fill="#2d1c22" />
      </>
    )}
  </svg>
);

/**
 * Pixel Art Student Graduate:
 * Mortarboard graduation cap with hanging yellow tassel, happy eyes, pink cheeks, suit & tie.
 */
export const PixelGraduateAvatar: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 140,
}) => (
  <svg
    width={size}
    height={size * 1.15}
    viewBox="0 0 48 56"
    className={`image-pixelated ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Mortarboard Graduation Cap (Black/charcoal stepped polygon) */}
    <rect x="16" y="2" width="16" height="4" fill="#1b1d24" />
    <rect x="10" y="6" width="28" height="4" fill="#1b1d24" />
    <rect x="6" y="10" width="36" height="4" fill="#282c37" />
    <rect x="12" y="14" width="24" height="4" fill="#1b1d24" />

    {/* Gold Tassel dangling to the left */}
    <rect x="23" y="4" width="2" height="2" fill="#fbc02d" />
    <rect x="10" y="10" width="2" height="3" fill="#fbc02d" />
    <rect x="9" y="13" width="2" height="5" fill="#fbc02d" />
    <rect x="8" y="17" width="3" height="4" fill="#f57f17" />

    {/* Hair (Brown / dark) */}
    <rect x="12" y="18" width="24" height="4" fill="#422c1b" />
    <rect x="10" y="21" width="5" height="5" fill="#422c1b" />
    <rect x="33" y="21" width="5" height="5" fill="#422c1b" />

    {/* Face (Warm Peach Tone) */}
    <rect x="14" y="20" width="20" height="15" fill="#fed6b2" />
    <rect x="12" y="25" width="24" height="7" fill="#fed6b2" />

    {/* Eyes (Black pixel dots) */}
    <rect x="17" y="26" width="2" height="3" fill="#1e2029" />
    <rect x="29" y="26" width="2" height="3" fill="#1e2029" />

    {/* Rosy Cheeks */}
    <rect x="14" y="28" width="2" height="2" fill="#ff8a80" />
    <rect x="32" y="28" width="2" height="2" fill="#ff8a80" />

    {/* Smile */}
    <rect x="22" y="30" width="4" height="1.5" fill="#8d3d2e" />

    {/* Graduation Gown & Tie */}
    {/* White Collar */}
    <rect x="20" y="35" width="8" height="3" fill="#ffffff" />
    {/* Red Necktie */}
    <rect x="23" y="37" width="2" height="7" fill="#e53935" />
    <rect x="22" y="38" width="4" height="3" fill="#e53935" />

    {/* Black Academic Robe */}
    <rect x="12" y="36" width="9" height="16" fill="#1a1c23" />
    <rect x="27" y="36" width="9" height="16" fill="#1a1c23" />
    <rect x="10" y="40" width="28" height="14" fill="#20242e" />
  </svg>
);

/**
 * Pixel Art Companion Pet Cat (Lavender/pink cyberpunk kitty with cyan highlights)
 */
export const PixelPetCat: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 64,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    className={`image-pixelated ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Ears (Pointed Up) */}
    <rect x="8" y="8" width="3" height="5" fill="#f8bbd0" />
    <rect x="9" y="9" width="1.5" height="3" fill="#ba68c8" />
    <rect x="19" y="8" width="3" height="5" fill="#f8bbd0" />
    <rect x="19.5" y="9" width="1.5" height="3" fill="#ba68c8" />

    {/* Cat Head */}
    <rect x="7" y="12" width="16" height="10" fill="#f8bbd0" />
    <rect x="9" y="10" width="12" height="2" fill="#f8bbd0" />

    {/* Eyes (Purple / Deep Violet) */}
    <rect x="10" y="15" width="2" height="2" fill="#4a148c" />
    <rect x="18" y="15" width="2" height="2" fill="#4a148c" />
    {/* Nose & Mouth */}
    <rect x="14" y="17" width="2" height="1" fill="#e91e63" />
    <rect x="13" y="18" width="4" height="1" fill="#7b1fa2" />

    {/* Collar (Cyan Neon) */}
    <rect x="9" y="21" width="12" height="2" fill="#00e5ff" />

    {/* Body & Paws */}
    <rect x="9" y="23" width="12" height="7" fill="#ea80fc" />
    <rect x="8" y="28" width="4" height="3" fill="#80d8ff" />
    <rect x="18" y="28" width="4" height="3" fill="#80d8ff" />

    {/* Wagging Pixel Tail on Left */}
    <rect x="4" y="24" width="5" height="2" fill="#80d8ff" />
    <rect x="4" y="21" width="3" height="4" fill="#80d8ff" />
    <rect x="5" y="18" width="2" height="4" fill="#ba68c8" />
  </svg>
);

/**
 * Retro Pixel Cursor pointer from the reference UI
 */
export const PixelCursor: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg
    viewBox="0 0 16 20"
    className={`image-pixelated ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Black outline */}
    <path
      d="M1 1V17L5 13L8 19L11 18L8 12L13 12L1 1Z"
      fill="#111429"
    />
    {/* Light grey inner */}
    <path
      d="M2 3V15.5L5.5 12L8.5 18L10 17.2L7 11.5L11.5 11.5L2 3Z"
      fill="#e0e0e0"
    />
    {/* White specular line */}
    <rect x="2" y="3" width="1" height="12" fill="#ffffff" />
  </svg>
);

/**
 * Pixel Stone Castle with Blue Conical Roofs & Pennant Flags (Top-right of map)
 */
export const PixelCastle: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 110 }) => (
  <svg
    width={size}
    height={size * 1.15}
    viewBox="0 0 64 72"
    className={`image-pixelated ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Left Tower Roof (Blue Conical) */}
    <polygon points="12,2 20,18 4,18" fill="#2563eb" stroke="#1e293b" strokeWidth="1" />
    <polygon points="12,4 18,17 8,17" fill="#3b82f6" />
    <rect x="11" y="0" width="2" height="3" fill="#60a5fa" />

    {/* Right Tower Roof (Blue Conical) */}
    <polygon points="52,2 60,18 44,18" fill="#2563eb" stroke="#1e293b" strokeWidth="1" />
    <polygon points="52,4 58,17 48,17" fill="#3b82f6" />
    <rect x="51" y="0" width="2" height="3" fill="#60a5fa" />

    {/* Center High Spire */}
    <polygon points="32,0 38,14 26,14" fill="#1d4ed8" stroke="#0f172a" strokeWidth="1" />
    <polygon points="32,2 36,13 28,13" fill="#3b82f6" />
    <rect x="31" y="-2" width="2" height="3" fill="#93c5fd" />

    {/* Battlements / Walls (Grey Stone) */}
    <rect x="6" y="18" width="12" height="38" fill="#64748b" stroke="#0f172a" strokeWidth="1" />
    <rect x="46" y="18" width="12" height="38" fill="#64748b" stroke="#0f172a" strokeWidth="1" />
    <rect x="18" y="24" width="28" height="32" fill="#475569" stroke="#0f172a" strokeWidth="1" />

    {/* Stone textures & bricks */}
    <rect x="8" y="22" width="4" height="2" fill="#94a3b8" />
    <rect x="12" y="32" width="4" height="2" fill="#334155" />
    <rect x="48" y="24" width="4" height="2" fill="#94a3b8" />
    <rect x="52" y="36" width="4" height="2" fill="#334155" />
    <rect x="22" y="28" width="5" height="2" fill="#64748b" />
    <rect x="34" y="30" width="6" height="2" fill="#334155" />

    {/* Glowing Center Window */}
    <rect x="29" y="30" width="6" height="8" rx="2" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
    <rect x="31" y="32" width="2" height="4" fill="#ffffff" />

    {/* Arch Gate (Dark Timber & Iron Portcullis) */}
    <path d="M26 44 H38 V56 H26 Z" fill="#0f172a" />
    <rect x="28" y="42" width="8" height="4" rx="2" fill="#0f172a" />
    <rect x="29" y="46" width="2" height="10" fill="#334155" />
    <rect x="33" y="46" width="2" height="10" fill="#334155" />

    {/* Rocky Foundation */}
    <rect x="2" y="56" width="60" height="12" fill="#1e293b" />
    <rect x="6" y="58" width="18" height="4" fill="#334155" />
    <rect x="30" y="60" width="26" height="4" fill="#334155" />
  </svg>
);

/**
 * Pixel Glowing Treasure Chest overflowing with Gold Coins (End of path)
 */
export const PixelTreasureChest: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 110 }) => (
  <svg
    width={size}
    height={size * 0.85}
    viewBox="0 0 64 54"
    className={`image-pixelated ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Chest Lid (Open upward angle) */}
    <polygon points="6,6 58,6 62,20 2,20" fill="#854d0e" stroke="#1e1b4b" strokeWidth="1.5" />
    <polygon points="10,8 54,8 57,18 7,18" fill="#b45309" />
    <rect x="8" y="10" width="4" height="8" fill="#d97706" />
    <rect x="52" y="10" width="4" height="8" fill="#d97706" />

    {/* Overflowing Gold Coins & Gems */}
    <ellipse cx="32" cy="22" rx="24" ry="8" fill="#facc15" stroke="#78350f" strokeWidth="1" />
    {/* Coins & Specular Highlights */}
    <circle cx="20" cy="20" r="3" fill="#fde047" stroke="#ca8a04" />
    <circle cx="26" cy="18" r="3.5" fill="#fef08a" stroke="#ca8a04" />
    <circle cx="34" cy="19" r="3.5" fill="#facc15" stroke="#ca8a04" />
    <circle cx="42" cy="21" r="3" fill="#fde047" stroke="#ca8a04" />
    <circle cx="28" cy="23" r="3" fill="#eab308" stroke="#a16207" />
    <circle cx="38" cy="24" r="3.5" fill="#fef08a" stroke="#a16207" />
    <circle cx="16" cy="23" r="2.5" fill="#facc15" />
    <circle cx="48" cy="23" r="2.5" fill="#facc15" />
    {/* Sparkling Gems */}
    <polygon points="32,14 34,17 32,20 30,17" fill="#38bdf8" />
    <polygon points="22,17 24,19 22,21 20,19" fill="#f43f5e" />
    <polygon points="44,17 46,19 44,21 42,19" fill="#4ade80" />

    {/* Chest Base */}
    <rect x="4" y="24" width="56" height="26" rx="2" fill="#713f12" stroke="#1e1b4b" strokeWidth="1.5" />
    <rect x="6" y="26" width="52" height="22" fill="#854d0e" />
    {/* Iron Strapping */}
    <rect x="12" y="24" width="6" height="26" fill="#ca8a04" stroke="#713f12" />
    <rect x="46" y="24" width="6" height="26" fill="#ca8a04" stroke="#713f12" />
    {/* Golden Lock */}
    <rect x="28" y="26" width="8" height="8" rx="1" fill="#facc15" stroke="#78350f" />
    <circle cx="32" cy="29" r="1.5" fill="#1e1b4b" />
    <rect x="31" y="29" width="2" height="3" fill="#1e1b4b" />
  </svg>
);

/**
 * Pixel Wooden START Signpost
 */
export const PixelSignpost: React.FC<{ className?: string }> = ({ className = 'w-20 h-16' }) => (
  <svg
    viewBox="0 0 40 32"
    className={`image-pixelated ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Post */}
    <rect x="18" y="14" width="4" height="18" fill="#5c3818" stroke="#1e1008" strokeWidth="0.8" />
    <rect x="19" y="14" width="2" height="18" fill="#7c4a20" />
    {/* Signboard */}
    <rect x="4" y="2" width="32" height="14" rx="2" fill="#92592b" stroke="#1e1008" strokeWidth="1" />
    <rect x="6" y="4" width="28" height="10" fill="#a76834" />
    {/* Nails */}
    <rect x="8" y="8" width="1.5" height="1.5" fill="#2d170a" />
    <rect x="30" y="8" width="1.5" height="1.5" fill="#2d170a" />
    {/* START text */}
    <text
      x="20"
      y="12"
      fill="#ffffff"
      fontFamily="'Press Start 2P', monospace"
      fontSize="6"
      textAnchor="middle"
      fontWeight="bold"
    >
      START
    </text>
  </svg>
);

/**
 * Pixel Player Avatar Standing on Road (Brown hair, blue jacket, backpack)
 */
export const PixelRunnerSprite: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size * 1.15}
    viewBox="0 0 24 28"
    className={`image-pixelated ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Brown Hair */}
    <rect x="7" y="2" width="10" height="4" fill="#4a2e18" />
    <rect x="6" y="4" width="12" height="5" fill="#4a2e18" />
    <rect x="8" y="2" width="8" height="2" fill="#6d4424" />

    {/* Face */}
    <rect x="8" y="7" width="8" height="6" fill="#fed6b2" />
    {/* Eyes */}
    <rect x="9" y="9" width="1.5" height="2" fill="#1e1b4b" />
    <rect x="13.5" y="9" width="1.5" height="2" fill="#1e1b4b" />
    {/* Smile */}
    <rect x="11" y="11" width="2" height="1" fill="#991b1b" />

    {/* Blue Jacket */}
    <rect x="7" y="13" width="10" height="8" fill="#2563eb" stroke="#1e1b4b" strokeWidth="0.5" />
    <rect x="9" y="13" width="6" height="8" fill="#3b82f6" />
    {/* Yellow/White shirt collar */}
    <rect x="11" y="13" width="2" height="2" fill="#facc15" />

    {/* Backpack straps */}
    <rect x="7" y="14" width="1.5" height="6" fill="#1e293b" />
    <rect x="15.5" y="14" width="1.5" height="6" fill="#1e293b" />

    {/* Pants */}
    <rect x="8" y="21" width="3.5" height="4" fill="#334155" />
    <rect x="12.5" y="21" width="3.5" height="4" fill="#334155" />

    {/* Shoes (Orange/White sneakers) */}
    <rect x="7" y="25" width="4.5" height="2.5" fill="#ea580c" />
    <rect x="12.5" y="25" width="4.5" height="2.5" fill="#ea580c" />
  </svg>
);

/**
 * Pixel Achievement Shield Badge (Colors: blue, red, gold, green, purple)
 */
export const PixelAchievementBadge: React.FC<{
  type: 'blue' | 'red' | 'gold' | 'green' | 'purple';
  symbol: string;
  size?: number;
}> = ({ type, symbol, size = 36 }) => {
  const colors = {
    blue: { bg: '#1d4ed8', border: '#3b82f6', glow: '#60a5fa' },
    red: { bg: '#b91c1c', border: '#ef4444', glow: '#f87171' },
    gold: { bg: '#b45309', border: '#f59e0b', glow: '#fbbf24' },
    green: { bg: '#15803d', border: '#22c55e', glow: '#4ade80' },
    purple: { bg: '#6b21a8', border: '#a855f7', glow: '#c084fc' },
  }[type];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className="image-pixelated shrink-0"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Border */}
      <path
        d="M12 2 L20 5 V13 C20 18 12 22 12 22 C12 22 4 18 4 13 V5 L12 2 Z"
        fill={colors.bg}
        stroke="#020617"
        strokeWidth="1.2"
      />
      <path
        d="M12 4 L18 6.5 V12.5 C18 16.5 12 20 12 20 C12 20 6 16.5 6 12.5 V6.5 L12 4 Z"
        fill={colors.border}
        opacity="0.85"
      />
      {/* Center Icon Symbol */}
      <text
        x="12"
        y="14.5"
        fill="#ffffff"
        fontFamily="'Press Start 2P', monospace"
        fontSize="7.5"
        textAnchor="middle"
        fontWeight="bold"
      >
        {symbol}
      </text>
    </svg>
  );
};

