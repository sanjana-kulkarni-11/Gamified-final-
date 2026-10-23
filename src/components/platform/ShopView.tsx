/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentProgress, CharacterConfig, CharacterSkin, TrailEffect } from '../../types/game';
import { INITIAL_CHARACTERS, INITIAL_SKINS, INITIAL_TRAILS } from '../../data/initialData';
import { storageService } from '../../services/storageService';
import { soundManager } from '../../audio/soundManager';
import { ShoppingBag, Coins, Check, Sparkles, User, Palette, Wind } from 'lucide-react';

interface ShopViewProps {
  progress: StudentProgress;
  onUpdateProgress: (updated: StudentProgress) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({ progress, onUpdateProgress }) => {
  const [activeTab, setActiveTab] = useState<'characters' | 'skins' | 'trails'>('characters');

  const handleUnlockCharacter = (char: CharacterConfig) => {
    if (progress.recyclingTokens < char.tokenCost) {
      soundManager.playCrash();
      return;
    }

    const updated: StudentProgress = {
      ...progress,
      recyclingTokens: progress.recyclingTokens - char.tokenCost,
      unlockedCharacterIds: [...progress.unlockedCharacterIds, char.id],
      selectedCharacterId: char.id,
    };
    storageService.saveProgress(updated);
    onUpdateProgress(updated);
    soundManager.playPowerUp();
  };

  const handleSelectCharacter = (charId: string) => {
    const updated = { ...progress, selectedCharacterId: charId };
    storageService.saveProgress(updated);
    onUpdateProgress(updated);
    soundManager.playLaneSwitch();
  };

  const handleUnlockSkin = (skin: CharacterSkin) => {
    if (progress.recyclingTokens < skin.tokenCost) {
      soundManager.playCrash();
      return;
    }

    const updated: StudentProgress = {
      ...progress,
      recyclingTokens: progress.recyclingTokens - skin.tokenCost,
      unlockedSkinIds: [...progress.unlockedSkinIds, skin.id],
      selectedSkinId: skin.id,
    };
    storageService.saveProgress(updated);
    onUpdateProgress(updated);
    soundManager.playPowerUp();
  };

  const handleSelectSkin = (skinId: string) => {
    const updated = { ...progress, selectedSkinId: skinId };
    storageService.saveProgress(updated);
    onUpdateProgress(updated);
    soundManager.playLaneSwitch();
  };

  const handleUnlockTrail = (trail: TrailEffect) => {
    if (progress.recyclingTokens < trail.tokenCost) {
      soundManager.playCrash();
      return;
    }

    const updated: StudentProgress = {
      ...progress,
      recyclingTokens: progress.recyclingTokens - trail.tokenCost,
      unlockedTrailIds: [...progress.unlockedTrailIds, trail.id],
      selectedTrailId: trail.id,
    };
    storageService.saveProgress(updated);
    onUpdateProgress(updated);
    soundManager.playPowerUp();
  };

  const handleSelectTrail = (trailId: string) => {
    const updated = { ...progress, selectedTrailId: trailId };
    storageService.saveProgress(updated);
    onUpdateProgress(updated);
    soundManager.playLaneSwitch();
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Eco Customization Depot</span>
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">Eco-Runner Shop</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Spend earned recycling tokens to unlock hero runners, cyber-aerogel suits, and photon trail effects.
          </p>
        </div>

        {/* Currency balance pill */}
        <div className="bg-slate-900 border border-amber-500/50 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-lg">
          <Coins className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Recycling Tokens</div>
            <div className="text-xl font-black text-amber-300 font-mono leading-none">
              {progress.recyclingTokens}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('characters')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'characters'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Characters</span>
        </button>

        <button
          onClick={() => setActiveTab('skins')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'skins'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Suits & Outfits</span>
        </button>

        <button
          onClick={() => setActiveTab('trails')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'trails'
              ? 'bg-purple-500 text-slate-950 font-black shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>Sprint Trails</span>
        </button>
      </div>

      {/* Characters Tab */}
      {activeTab === 'characters' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {INITIAL_CHARACTERS.map((char) => {
            const isUnlocked = progress.unlockedCharacterIds.includes(char.id);
            const isSelected = progress.selectedCharacterId === char.id;
            const canAfford = progress.recyclingTokens >= char.tokenCost;

            return (
              <div
                key={char.id}
                className={`bg-slate-900/90 border rounded-3xl p-6 flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-emerald-400 ring-2 ring-emerald-500/30'
                    : 'border-slate-800'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg"
                      style={{ backgroundColor: `${char.primaryColor}22`, color: char.primaryColor }}
                    >
                      {char.name[0]}
                    </div>
                    {isSelected ? (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500 text-slate-950">
                        Equipped
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" />
                        {char.tokenCost}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-0.5">{char.name}</h3>
                  <div className="text-xs font-semibold text-emerald-400 mb-2">{char.title}</div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{char.description}</p>

                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs mb-6">
                    <div className="text-slate-400 font-semibold mb-0.5">Campus Specialty:</div>
                    <div className="text-cyan-300 font-medium">{char.roleSpecialty}</div>
                  </div>
                </div>

                {isSelected ? (
                  <button
                    disabled
                    className="w-full py-3 bg-slate-800 text-slate-400 text-xs font-bold rounded-xl cursor-default"
                  >
                    Currently Running
                  </button>
                ) : isUnlocked ? (
                  <button
                    onClick={() => handleSelectCharacter(char.id)}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Select Runner
                  </button>
                ) : (
                  <button
                    disabled={!canAfford}
                    onClick={() => handleUnlockCharacter(char)}
                    className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? `Unlock for ${char.tokenCost} Tokens` : `Need ${char.tokenCost - progress.recyclingTokens} More Tokens`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Outfits Tab */}
      {activeTab === 'skins' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {INITIAL_SKINS.map((skin) => {
            const isUnlocked = progress.unlockedSkinIds.includes(skin.id);
            const isSelected = progress.selectedSkinId === skin.id;
            const canAfford = progress.recyclingTokens >= skin.tokenCost;

            return (
              <div
                key={skin.id}
                className={`bg-slate-900/90 border rounded-3xl p-6 flex flex-col justify-between transition-all ${
                  isSelected ? 'border-cyan-400 ring-2 ring-cyan-500/30' : 'border-slate-800'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-1.5 items-center">
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: skin.palette.suit }} />
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: skin.palette.visor }} />
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: skin.palette.trim }} />
                    </div>
                    {isSelected ? (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-400 text-slate-950">
                        Equipped
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" />
                        {skin.tokenCost}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{skin.name}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-6">{skin.description}</p>
                </div>

                {isSelected ? (
                  <button
                    disabled
                    className="w-full py-2.5 bg-slate-800 text-slate-400 text-xs font-bold rounded-xl cursor-default"
                  >
                    Equipped Suit
                  </button>
                ) : isUnlocked ? (
                  <button
                    onClick={() => handleSelectSkin(skin.id)}
                    className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Equip Suit
                  </button>
                ) : (
                  <button
                    disabled={!canAfford}
                    onClick={() => handleUnlockSkin(skin)}
                    className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? `Unlock (${skin.tokenCost} Tokens)` : `Insufficient Tokens`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Trails Tab */}
      {activeTab === 'trails' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {INITIAL_TRAILS.map((trail) => {
            const isUnlocked = progress.unlockedTrailIds.includes(trail.id);
            const isSelected = progress.selectedTrailId === trail.id;
            const canAfford = progress.recyclingTokens >= trail.tokenCost;

            return (
              <div
                key={trail.id}
                className={`bg-slate-900/90 border rounded-3xl p-5 flex flex-col justify-between transition-all ${
                  isSelected ? 'border-purple-400 ring-2 ring-purple-500/30' : 'border-slate-800'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div
                      className="w-8 h-8 rounded-full shadow-lg"
                      style={{ backgroundColor: trail.color, boxShadow: `0 0 16px ${trail.glowColor}` }}
                    />
                    {isSelected ? (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-400 text-slate-950">
                        Equipped
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        Ready
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40">
                        {trail.tokenCost}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">{trail.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{trail.description}</p>
                </div>

                {isSelected ? (
                  <button
                    disabled
                    className="w-full py-2 bg-slate-800 text-slate-400 text-xs font-bold rounded-xl cursor-default"
                  >
                    Active Trail
                  </button>
                ) : isUnlocked ? (
                  <button
                    onClick={() => handleSelectTrail(trail.id)}
                    className="w-full py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Equip Trail
                  </button>
                ) : (
                  <button
                    disabled={!canAfford}
                    onClick={() => handleUnlockTrail(trail)}
                    className={`w-full py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Unlock
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
