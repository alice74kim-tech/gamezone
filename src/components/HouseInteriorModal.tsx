import React, { useState } from 'react';
import { ITEMS } from '../data/gameData';
import { soundManager } from '../utils/audio';
import { X, Sparkles, Home, RotateCw, Trash2, Plus } from 'lucide-react';

interface IndoorItem {
  id: string;
  itemId: string;
  x: number;
  y: number;
  rotation: number;
}

interface HouseInteriorModalProps {
  isOpen: boolean;
  onClose: () => void;
  houseTier: number;
}

export const HouseInteriorModal: React.FC<HouseInteriorModalProps> = ({
  isOpen,
  onClose,
  houseTier,
}) => {
  const [wallpaper, setWallpaper] = useState<'forest' | 'sky' | 'brick' | 'starry'>('forest');
  const [flooring, setFlooring] = useState<'wood' | 'tatami' | 'tile'>('wood');
  const [placedFurniture, setPlacedFurniture] = useState<IndoorItem[]>([
    { id: 'in_bed', itemId: 'furn_cozy_bed', x: 1, y: 1, rotation: 0 },
    { id: 'in_sofa', itemId: 'furn_wood_sofa', x: 3, y: 2, rotation: 0 },
    { id: 'in_tv', itemId: 'furn_retro_tv', x: 5, y: 1, rotation: 0 },
    { id: 'in_plant', itemId: 'furn_monstera', x: 0, y: 3, rotation: 0 },
    { id: 'in_rug', itemId: 'furn_cute_rug', x: 3, y: 3, rotation: 0 },
  ]);
  const [selectedItem, setSelectedItem] = useState<IndoorItem | null>(null);

  if (!isOpen) return null;

  const ROOM_SIZE = 6; // 6x5 grid tiles

  const handleTileClick = (x: number, y: number) => {
    if (selectedItem) {
      soundManager.playDesignerChime();
      setPlacedFurniture((prev) =>
        prev.map((item) => (item.id === selectedItem.id ? { ...item, x, y } : item))
      );
      setSelectedItem(null);
    }
  };

  const handleRotate = (item: IndoorItem) => {
    soundManager.playDesignerChime();
    setPlacedFurniture((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, rotation: (i.rotation + 90) % 360 } : i))
    );
  };

  const handleRemove = (item: IndoorItem) => {
    soundManager.playDesignerChime();
    setPlacedFurniture((prev) => prev.filter((i) => i.id !== item.id));
    if (selectedItem?.id === item.id) setSelectedItem(null);
  };

  const handleAddIndoorItem = (itemId: string) => {
    soundManager.playDesignerChime();
    const newItem: IndoorItem = {
      id: 'in_' + Date.now(),
      itemId,
      x: 2 + Math.floor(Math.random() * 2),
      y: 2 + Math.floor(Math.random() * 2),
      rotation: 0,
    };
    setPlacedFurniture((prev) => [...prev, newItem]);
  };

  const wallpaperClasses = {
    forest: 'bg-gradient-to-b from-emerald-800 to-emerald-950 border-b-8 border-emerald-900',
    sky: 'bg-gradient-to-b from-sky-400 to-sky-600 border-b-8 border-sky-800',
    brick: 'bg-gradient-to-b from-rose-900 to-stone-900 border-b-8 border-rose-950',
    starry: 'bg-gradient-to-b from-indigo-950 to-slate-950 border-b-8 border-indigo-900',
  }[wallpaper];

  const flooringClasses = {
    wood: 'bg-[#b07d4b] border border-[#8a5d30]/40',
    tatami: 'bg-[#c2b280] border border-[#96885b]/40',
    tile: 'bg-slate-200 border border-slate-300',
  }[flooring];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-amber-50 rounded-3xl border-4 border-amber-900/60 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-amber-800 text-amber-100 p-4 flex items-center justify-between border-b-4 border-amber-950">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-700 rounded-2xl text-2xl shadow">
              🏡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">내 집 인테리어 디자인 룸</h2>
                <span className="text-xs px-2.5 py-0.5 bg-amber-950 text-amber-300 rounded-full font-bold">
                  {houseTier === 1 ? '1층 아늑한 오두막' : '2층 럭셔리 대저택'}
                </span>
              </div>
              <p className="text-xs text-amber-200">가구를 드래그/클릭하여 배치하고 회전할 수 있습니다.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-amber-700 rounded-full text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Room Viewport */}
        <div className="p-6 bg-slate-900 flex flex-col items-center justify-center overflow-hidden">
          {/* Wall surface */}
          <div className={`w-full max-w-lg h-28 rounded-t-3xl p-3 flex items-center justify-around shadow-inner transition-colors duration-500 ${wallpaperClasses}`}>
            {/* Windows & Frame */}
            <div className="w-12 h-14 bg-sky-200/90 border-4 border-white rounded-lg shadow-md flex items-center justify-center">
              <div className="w-full h-0.5 bg-white" />
            </div>
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur px-3 py-1 rounded-full text-white text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>따뜻한 우리 집</span>
            </div>
            <div className="w-12 h-14 bg-sky-200/90 border-4 border-white rounded-lg shadow-md flex items-center justify-center">
              <div className="w-full h-0.5 bg-white" />
            </div>
          </div>

          {/* Floor Grid */}
          <div className="w-full max-w-lg bg-stone-700 p-3 rounded-b-3xl shadow-2xl border-4 border-stone-800">
            <div className="grid grid-cols-6 gap-1 bg-stone-800 p-2 rounded-2xl shadow-inner">
              {Array.from({ length: 5 }).map((_, y) => (
                <React.Fragment key={`row-${y}`}>
                  {Array.from({ length: ROOM_SIZE }).map((_, x) => {
                    const itemOnTile = placedFurniture.find((i) => i.x === x && i.y === y);
                    const isSelected = selectedItem?.id === itemOnTile?.id;

                    return (
                      <div
                        key={`cell-${x}-${y}`}
                        onClick={() => {
                          if (itemOnTile) {
                            soundManager.playDesignerChime();
                            setSelectedItem(isSelected ? null : itemOnTile);
                          } else {
                            handleTileClick(x, y);
                          }
                        }}
                        className={`h-14 rounded-xl flex items-center justify-center relative cursor-pointer transition-all ${flooringClasses} ${
                          isSelected ? 'ring-4 ring-yellow-400 z-10 scale-105 shadow-xl' : 'hover:brightness-105'
                        }`}
                      >
                        {itemOnTile && (
                          <div
                            className="text-3xl select-none filter drop-shadow transition-transform"
                            style={{ transform: `rotate(${itemOnTile.rotation}deg)` }}
                          >
                            {ITEMS[itemOnTile.itemId]?.icon || '📦'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Item Controller / Controls */}
        <div className="p-4 bg-amber-50 border-t-2 border-amber-200 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Wallpaper selection */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-700">벽지:</span>
              <button
                onClick={() => setWallpaper('forest')}
                className={`px-2.5 py-1 text-xs font-bold rounded-xl transition ${
                  wallpaper === 'forest' ? 'bg-emerald-600 text-white' : 'bg-white border text-slate-700'
                }`}
              >
                🌲 숲 벽지
              </button>
              <button
                onClick={() => setWallpaper('sky')}
                className={`px-2.5 py-1 text-xs font-bold rounded-xl transition ${
                  wallpaper === 'sky' ? 'bg-sky-600 text-white' : 'bg-white border text-slate-700'
                }`}
              >
                ☁️ 하늘 벽지
              </button>
              <button
                onClick={() => setWallpaper('brick')}
                className={`px-2.5 py-1 text-xs font-bold rounded-xl transition ${
                  wallpaper === 'brick' ? 'bg-rose-700 text-white' : 'bg-white border text-slate-700'
                }`}
              >
                🧱 벽돌 벽지
              </button>
              <button
                onClick={() => setWallpaper('starry')}
                className={`px-2.5 py-1 text-xs font-bold rounded-xl transition ${
                  wallpaper === 'starry' ? 'bg-indigo-900 text-white' : 'bg-white border text-slate-700'
                }`}
              >
                ✨ 별빛 벽지
              </button>
            </div>

            {/* Flooring selection */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-700">바닥:</span>
              <button
                onClick={() => setFlooring('wood')}
                className={`px-2.5 py-1 text-xs font-bold rounded-xl transition ${
                  flooring === 'wood' ? 'bg-amber-700 text-white' : 'bg-white border text-slate-700'
                }`}
              >
                🪵 원목 마루
              </button>
              <button
                onClick={() => setFlooring('tatami')}
                className={`px-2.5 py-1 text-xs font-bold rounded-xl transition ${
                  flooring === 'tatami' ? 'bg-amber-600 text-white' : 'bg-white border text-slate-700'
                }`}
              >
                🌾 다다미
              </button>
              <button
                onClick={() => setFlooring('tile')}
                className={`px-2.5 py-1 text-xs font-bold rounded-xl transition ${
                  flooring === 'tile' ? 'bg-slate-700 text-white' : 'bg-white border text-slate-700'
                }`}
              >
                ◻️ 모던 타일
              </button>
            </div>
          </div>

          {/* Quick add furniture & item rotation */}
          <div className="flex items-center justify-between pt-2 border-t border-amber-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">가구 추가:</span>
              <button
                onClick={() => handleAddIndoorItem('furn_cozy_bed')}
                className="px-2.5 py-1 bg-white hover:bg-amber-100 rounded-xl border border-amber-200 text-xs font-bold flex items-center gap-1 text-slate-800"
              >
                <Plus className="w-3 h-3 text-emerald-600" /> 침대
              </button>
              <button
                onClick={() => handleAddIndoorItem('furn_wood_sofa')}
                className="px-2.5 py-1 bg-white hover:bg-amber-100 rounded-xl border border-amber-200 text-xs font-bold flex items-center gap-1 text-slate-800"
              >
                <Plus className="w-3 h-3 text-emerald-600" /> 소파
              </button>
              <button
                onClick={() => handleAddIndoorItem('furn_retro_tv')}
                className="px-2.5 py-1 bg-white hover:bg-amber-100 rounded-xl border border-amber-200 text-xs font-bold flex items-center gap-1 text-slate-800"
              >
                <Plus className="w-3 h-3 text-emerald-600" /> TV
              </button>
              <button
                onClick={() => handleAddIndoorItem('furn_fireplace')}
                className="px-2.5 py-1 bg-white hover:bg-amber-100 rounded-xl border border-amber-200 text-xs font-bold flex items-center gap-1 text-slate-800"
              >
                <Plus className="w-3 h-3 text-emerald-600" /> 벽난로
              </button>
            </div>

            {selectedItem && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRotate(selectedItem)}
                  className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded-xl text-xs font-extrabold flex items-center gap-1 text-amber-950 shadow-sm"
                >
                  <RotateCw className="w-3.5 h-3.5" /> 90° 회전
                </button>
                <button
                  onClick={() => handleRemove(selectedItem)}
                  className="px-3 py-1 bg-rose-100 hover:bg-rose-200 rounded-xl text-xs font-extrabold flex items-center gap-1 text-rose-700 shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" /> 가구 보관
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
