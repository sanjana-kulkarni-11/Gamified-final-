/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { GameMode, CharacterConfig, CharacterSkin, PowerUpActiveState } from '../../types/game';
import { initThreeScene, CityEnvironment } from '../../game/threeScene';
import { GameEngine } from '../../game/gameEngine';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

interface GameCanvasProps {
  mode: GameMode;
  character: CharacterConfig;
  skin?: CharacterSkin;
  restorationLevel: number;
  onScoreUpdate: (score: number, distance: number, orbs: number, tokens: number, multiplier: number) => void;
  onPowerUpUpdate: (activePowerUps: PowerUpActiveState[]) => void;
  onKnowledgeFragment: () => void;
  onGateFeedback?: (feedback: { title: string; subtitle: string; isOptimal: boolean; explanation: string }) => void;
  onGameOver: (finalStats: {
    score: number;
    distance: number;
    orbs: number;
    tokens: number;
    knowledgeFragments: number;
    codeGatesCleared: number;
    multiplier: number;
  }) => void;
  isPaused: boolean;
  onTogglePause: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  mode,
  character,
  skin,
  restorationLevel,
  onScoreUpdate,
  onPowerUpUpdate,
  onKnowledgeFragment,
  onGateFeedback,
  onGameOver,
  isPaused,
  onTogglePause,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const envRef = useRef<CityEnvironment | null>(null);

  // Swipe detection coordinates
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const env = initThreeScene(containerRef.current);
    envRef.current = env;

    // Initialize Game Engine
    const engine = new GameEngine(
      env,
      character,
      skin,
      mode,
      restorationLevel,
      {
        onScoreUpdate,
        onPowerUpUpdate,
        onKnowledgeFragment,
        onGateFeedback,
        onGameOver,
      }
    );
    engineRef.current = engine;
    engine.start();

    // Window resize handler
    const handleResize = () => {
      if (!containerRef.current || !env) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      env.camera.aspect = w / h;
      env.camera.updateProjectionMatrix();
      env.renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!engineRef.current) return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          engineRef.current.moveLeft();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          engineRef.current.moveRight();
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
        case ' ': // Spacebar
          e.preventDefault();
          engineRef.current.jump();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          engineRef.current.slide();
          break;
        case 'Escape':
        case 'p':
        case 'P':
          onTogglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      engine.destroy();
      env.dispose();
    };
  }, [character, skin, mode, restorationLevel]);

  // Synchronize pause state
  useEffect(() => {
    if (!engineRef.current) return;
    if (isPaused) {
      engineRef.current.pause();
    } else {
      engineRef.current.resume();
    }
  }, [isPaused]);

  // Swipe event handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    touchStartRef.current = { x: clientX, y: clientY, time: performance.now() };
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!touchStartRef.current || !engineRef.current) return;
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as React.MouseEvent).clientY;

    const dx = clientX - touchStartRef.current.x;
    const dy = clientY - touchStartRef.current.y;
    const dt = performance.now() - touchStartRef.current.time;

    const minSwipeDist = 28; // pixels
    if (dt < 600) {
      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > minSwipeDist) {
          engineRef.current.moveRight();
        } else if (dx < -minSwipeDist) {
          engineRef.current.moveLeft();
        }
      } else {
        // Vertical swipe
        if (dy > minSwipeDist) {
          engineRef.current.slide();
        } else if (dy < -minSwipeDist) {
          engineRef.current.jump();
        }
      }
    }
    touchStartRef.current = null;
  };

  return (
    <div
      className="relative w-full h-full select-none overflow-hidden touch-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
    >
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* On-screen touch buttons for mobile / tablet ergonomics */}
      <div className="md:hidden absolute bottom-4 left-0 right-0 flex justify-between items-center px-4 pointer-events-none z-20">
        <div className="flex gap-2 pointer-events-auto">
          <button
            onClick={() => engineRef.current?.moveLeft()}
            className="w-14 h-14 bg-slate-900/80 border border-emerald-500/40 active:bg-emerald-500/30 text-emerald-300 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg"
            aria-label="Move Left"
          >
            <ArrowLeft className="w-7 h-7" />
          </button>
          <button
            onClick={() => engineRef.current?.moveRight()}
            className="w-14 h-14 bg-slate-900/80 border border-emerald-500/40 active:bg-emerald-500/30 text-emerald-300 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg"
            aria-label="Move Right"
          >
            <ArrowRight className="w-7 h-7" />
          </button>
        </div>

        <div className="flex gap-2 pointer-events-auto">
          <button
            onClick={() => engineRef.current?.jump()}
            className="w-14 h-14 bg-slate-900/80 border border-cyan-500/40 active:bg-cyan-500/30 text-cyan-300 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg"
            aria-label="Jump"
          >
            <ArrowUp className="w-7 h-7" />
          </button>
          <button
            onClick={() => engineRef.current?.slide()}
            className="w-14 h-14 bg-slate-900/80 border border-amber-500/40 active:bg-amber-500/30 text-amber-300 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg"
            aria-label="Slide"
          >
            <ArrowDown className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
};
