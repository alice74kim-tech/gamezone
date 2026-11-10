import React, { useState } from 'react';
import { DIY_RECIPES, ITEMS } from '../data/gameData';
import { InventorySlot } from '../types/game';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { X, Hammer, Sparkles, Check } from 'lucide-react';

interface DIYWorkbenchModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventorySlot[];
  onCraftItem: (resultItemId: string, materialsUsed: { itemId: string; count: number }[]) => void;
}

export const DIYWorkbenchModal: React.FC<DIYWorkbenchModalProps> = ({
  isOpen,
  onClose,
  inventory,
  onCraftItem,
}) => {
  const [selectedRecipeId, setSelectedRecipeId] = useState(DIY_RECIPES[0].id);
  const [craftingAnim, setCraftingAnim] = useState(false);

  if (!isOpen) return null;

  const currentRecipe = DIY_RECIPES.find((r) => r.id === selectedRecipeId) || DIY_RECIPES[0];
  const resultItem = ITEMS[currentRecipe.resultItemId];

  // Check if player has all required materials
  const canCraft = currentRecipe.materials.every((mat) => {
    const invSlot = inventory.find((s) => s.item.id === mat.itemId);
    return (invSlot?.count || 0) >= mat.count;
  });

  const handleCraft = () => {
    if (!canCraft || craftingAnim) return;

    soundManager.playDesignerChime();
    setCraftingAnim(true);

    setTimeout(() => {
      soundManager.playCelebrationFanfare();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
      onCraftItem(currentRecipe.resultItemId, currentRecipe.materials);
      setCraftingAnim(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-amber-50 rounded-3xl border-4 border-amber-900/60 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-amber-800 text-white p-4 flex items-center justify-between border-b-4 border-amber-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-700 rounded-2xl text-2xl shadow">
              🔨
            </div>
            <div>
              <h2 className="text-xl font-black">심플 DIY 작업대</h2>
              <p className="text-xs text-amber-200">섬에서 수확한 목재와 돌로 가구와 울타리를 제작하세요!</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-amber-700 rounded-full text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto flex-1">
          {/* Left: Recipe List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 mb-1">제작 가능한 DIY 레시피</h4>
            {DIY_RECIPES.map((recipe) => {
              const item = ITEMS[recipe.resultItemId];
              if (!item) return null;
              const isSelected = recipe.id === selectedRecipeId;

              const isReady = recipe.materials.every((mat) => {
                const invSlot = inventory.find((s) => s.item.id === mat.itemId);
                return (invSlot?.count || 0) >= mat.count;
              });

              return (
                <div
                  key={recipe.id}
                  onClick={() => {
                    soundManager.playAnimalese('DIY');
                    setSelectedRecipeId(recipe.id);
                  }}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition ${
                    isSelected
                      ? 'border-amber-600 bg-amber-100 shadow-md'
                      : 'border-amber-200 bg-white hover:bg-amber-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-1 bg-amber-50 rounded-xl">{item.icon}</span>
                    <div>
                      <h5 className="font-bold text-xs text-slate-800">{item.name}</h5>
                      <span className="text-[10px] text-slate-500 line-clamp-1">{item.description}</span>
                    </div>
                  </div>
                  {isReady ? (
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full">
                      제작 가능
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">재료 부족</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Recipe Detail & Craft Button */}
          {resultItem && (
            <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex flex-col items-center justify-center p-4 bg-amber-50/60 rounded-2xl mb-3 border border-amber-100">
                  <span className={`text-5xl mb-2 ${craftingAnim ? 'animate-spin' : ''}`}>
                    {resultItem.icon}
                  </span>
                  <h3 className="font-black text-base text-slate-800">{resultItem.name}</h3>
                  <p className="text-xs text-slate-500 text-center mt-1">{resultItem.description}</p>
                </div>

                <h4 className="text-xs font-bold text-slate-700 mb-2">필요 재료 목록:</h4>
                <div className="space-y-1.5">
                  {currentRecipe.materials.map((mat) => {
                    const matDef = ITEMS[mat.itemId];
                    const invSlot = inventory.find((s) => s.item.id === mat.itemId);
                    const userCount = invSlot?.count || 0;
                    const hasEnough = userCount >= mat.count;

                    return (
                      <div
                        key={mat.itemId}
                        className="flex items-center justify-between p-2 rounded-xl bg-amber-50/80 border border-amber-100 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span>{matDef?.icon}</span>
                          <span className="font-semibold text-slate-800">{matDef?.name}</span>
                        </div>
                        <span
                          className={`font-black ${
                            hasEnough ? 'text-emerald-600' : 'text-rose-500'
                          }`}
                        >
                          {userCount} / {mat.count}개
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                disabled={!canCraft || craftingAnim}
                onClick={handleCraft}
                className={`w-full mt-4 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-95 ${
                  canCraft && !craftingAnim
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                {craftingAnim ? (
                  <>
                    <Hammer className="w-5 h-5 animate-bounce" />
                    <span>뚝딱뚝딱 만드는 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span>지금 제작하기!</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
