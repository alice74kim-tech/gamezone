import React, { useState } from 'react';
import { DesignerBrushType, PlacedItem } from '../types/game';
import { ITEMS } from '../data/gameData';
import { Hammer, Trees, Building2, Palette, X, RotateCw, Trash2, Check } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface IslandDesignerToolbarProps {
  isOpen: boolean;
  onClose: () => void;
  activeBrush: DesignerBrushType;
  onSelectBrush: (brush: DesignerBrushType) => void;
  selectedBuildingToPlace: string | null;
  onSelectBuildingToPlace: (buildingType: string | null) => void;
  selectedFurnitureToPlace: string | null;
  onSelectFurnitureToPlace: (furnitureId: string | null) => void;
  selectedPlacedItem: PlacedItem | null;
  onRotateItem: (item: PlacedItem) => void;
  onRemoveItem: (item: PlacedItem) => void;
  onAddTree: (fruitType?: 'apple' | 'cherry' | 'peach' | 'bell') => void;
  onAddFlower: (type: 'tulip' | 'rose' | 'cosmos' | 'pansy', color: string) => void;
}

export const IslandDesignerToolbar: React.FC<IslandDesignerToolbarProps> = ({
  isOpen,
  onClose,
  activeBrush,
  onSelectBrush,
  selectedBuildingToPlace,
  onSelectBuildingToPlace,
  selectedFurnitureToPlace,
  onSelectFurnitureToPlace,
  selectedPlacedItem,
  onRotateItem,
  onRemoveItem,
  onAddTree,
  onAddFlower,
}) => {
  const [activeTab, setActiveTab] = useState<'terrain' | 'buildings' | 'furniture' | 'nature'>('terrain');

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 max-w-4xl mx-auto z-50 bg-amber-50/95 backdrop-blur-md border-4 border-amber-900/40 rounded-3xl shadow-2xl p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom duration-300">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-amber-200 pb-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-yellow-400 text-slate-900 rounded-xl shadow-sm text-lg">⛑️</span>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
              <span>섬 크리에이터 디자인 스튜디오</span>
              <span className="text-xs px-2 py-0.5 bg-emerald-600 text-white rounded-full font-medium">ON</span>
            </h3>
            <p className="text-xs text-amber-900/80">마을 지형을 깎고 길을 닦으며, 건물과 장식품을 원하는 곳에 배치하세요!</p>
          </div>
        </div>

        {/* Selected Item Controller (if clicked on map) */}
        {selectedPlacedItem && (
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border border-amber-300 shadow-sm">
            <span className="text-xs font-bold text-slate-800">
              선택됨: {ITEMS[selectedPlacedItem.itemId]?.name || selectedPlacedItem.type}
            </span>
            <button
              onClick={() => {
                soundManager.playDesignerChime();
                onRotateItem(selectedPlacedItem);
              }}
              className="p-1 hover:bg-amber-100 rounded-lg text-slate-700 transition flex items-center gap-1 text-xs"
              title="회전하기"
            >
              <RotateCw className="w-3.5 h-3.5" /> 회전
            </button>
            <button
              onClick={() => {
                soundManager.playDesignerChime();
                onRemoveItem(selectedPlacedItem);
              }}
              className="p-1 hover:bg-rose-100 rounded-lg text-rose-600 transition flex items-center gap-1 text-xs"
              title="철거/회수하기"
            >
              <Trash2 className="w-3.5 h-3.5" /> 회수
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="p-1.5 hover:bg-amber-200/80 rounded-full text-amber-900 transition"
          title="디자인 모드 종료"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-amber-200/50 p-1 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('terrain')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'terrain' ? 'bg-white text-emerald-800 shadow-sm' : 'text-amber-900/80 hover:bg-amber-100'
          }`}
        >
          <Palette className="w-4 h-4 text-emerald-600" />
          <span>지형 & 길 공사</span>
        </button>

        <button
          onClick={() => setActiveTab('buildings')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'buildings' ? 'bg-white text-amber-900 shadow-sm' : 'text-amber-900/80 hover:bg-amber-100'
          }`}
        >
          <Building2 className="w-4 h-4 text-amber-700" />
          <span>건물 건축 & 이설</span>
        </button>

        <button
          onClick={() => setActiveTab('furniture')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'furniture' ? 'bg-white text-blue-900 shadow-sm' : 'text-amber-900/80 hover:bg-amber-100'
          }`}
        >
          <Hammer className="w-4 h-4 text-blue-600" />
          <span>가구 & 야외 장식</span>
        </button>

        <button
          onClick={() => setActiveTab('nature')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'nature' ? 'bg-white text-emerald-900 shadow-sm' : 'text-amber-900/80 hover:bg-amber-100'
          }`}
        >
          <Trees className="w-4 h-4 text-emerald-600" />
          <span>과일 나무 & 꽃</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="min-h-24 max-h-36 overflow-y-auto">
        {/* 1. TERRAIN TAB */}
        {activeTab === 'terrain' && (
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
            {[
              { type: 'grass', label: '잔디 복구', icon: '🌿', color: 'bg-emerald-500' },
              { type: 'dirt_path', label: '흙길 포장', icon: '🪵', color: 'bg-[#d2a679]' },
              { type: 'stone_path', label: '돌길 포장', icon: '🪨', color: 'bg-slate-400' },
              { type: 'brick_path', label: '벽돌길', icon: '🧱', color: 'bg-rose-400' },
              { type: 'wood_deck', label: '나무 데크', icon: '🪵', color: 'bg-amber-600' },
              { type: 'water', label: '하천 파기', icon: '💧', color: 'bg-sky-400' },
              { type: 'sand', label: '모래사장', icon: '🏖️', color: 'bg-amber-200' },
              { type: 'cliff', label: '절벽 쌓기', icon: '⛰️', color: 'bg-lime-600' },
              { type: 'demolish', label: '지우개/철거', icon: '🧹', color: 'bg-stone-300' },
            ].map((brush) => (
              <button
                key={brush.type}
                onClick={() => {
                  soundManager.playDesignerChime();
                  onSelectBrush(brush.type as DesignerBrushType);
                  onSelectBuildingToPlace(null);
                  onSelectFurnitureToPlace(null);
                }}
                className={`p-2 rounded-2xl flex flex-col items-center justify-center gap-1 border-2 transition active:scale-95 ${
                  activeBrush === brush.type && !selectedBuildingToPlace && !selectedFurnitureToPlace
                    ? 'border-yellow-500 bg-yellow-100 shadow-md ring-2 ring-yellow-400'
                    : 'border-amber-200 bg-white hover:bg-amber-50'
                }`}
              >
                <span className="text-xl">{brush.icon}</span>
                <span className="text-[11px] font-bold text-slate-800 whitespace-nowrap">{brush.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* 2. BUILDINGS TAB */}
        {activeTab === 'buildings' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { type: 'house', label: '내 집 (오두막)', icon: '🏠', desc: '클릭하여 새 위치로 이설' },
              { type: 'shop', label: '너굴 상점', icon: '🏪', desc: '콩돌이 밤돌이 상점' },
              { type: 'museum', label: '부엉 박물관', icon: '🏛️', desc: '수족관 & 화석관' },
              { type: 'town_hall', label: '안내소 광장', icon: '⛳', desc: '마을 깃발 & 게시판' },
              { type: 'villager_house', label: '주민의 집', icon: '🏡', desc: '이웃 동물 거주지' },
              { type: 'bridge', label: '통나무 다리', icon: '🌉', desc: '강을 건너는 다리' },
            ].map((b) => (
              <button
                key={b.type}
                onClick={() => {
                  soundManager.playDesignerChime();
                  onSelectBuildingToPlace(b.type);
                  onSelectFurnitureToPlace(null);
                }}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 border-2 transition active:scale-95 text-center ${
                  selectedBuildingToPlace === b.type
                    ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-400'
                    : 'border-amber-200 bg-white hover:bg-amber-50'
                }`}
              >
                <span className="text-2xl">{b.icon}</span>
                <span className="text-xs font-bold text-slate-800 whitespace-nowrap">{b.label}</span>
                <span className="text-[10px] text-slate-500">{b.desc}</span>
              </button>
            ))}
          </div>
        )}

        {/* 3. FURNITURE TAB */}
        {activeTab === 'furniture' && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {[
              'furn_log_bench',
              'furn_garden_fountain',
              'furn_streetlamp',
              'furn_campfire',
              'furn_beach_lounger',
              'furn_stone_lantern',
              'furn_picnic_set',
              'furn_tea_stall',
              'furn_kk_stereo',
              'furn_white_fence',
              'furn_bush_hedge',
              'furn_hammock',
            ].map((id) => {
              const item = ITEMS[id];
              if (!item) return null;
              return (
                <button
                  key={id}
                  onClick={() => {
                    soundManager.playDesignerChime();
                    onSelectFurnitureToPlace(id);
                    onSelectBuildingToPlace(null);
                  }}
                  className={`p-2 rounded-2xl flex flex-col items-center justify-center gap-1 border-2 transition active:scale-95 ${
                    selectedFurnitureToPlace === id
                      ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-400'
                      : 'border-amber-200 bg-white hover:bg-amber-50'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[11px] font-bold text-slate-800 truncate w-full text-center">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 4. NATURE TAB */}
        {activeTab === 'nature' && (
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-amber-200">
              <span className="text-xs font-bold text-slate-700 px-2">나무 심기:</span>
              <button
                onClick={() => onAddTree('apple')}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <span>🍎 사과나무</span>
              </button>
              <button
                onClick={() => onAddTree('cherry')}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <span>🍒 체리나무</span>
              </button>
              <button
                onClick={() => onAddTree('peach')}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <span>🍑 복숭아나무</span>
              </button>
              <button
                onClick={() => onAddTree('bell')}
                className="px-2.5 py-1 bg-yellow-100 hover:bg-yellow-200 rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <span>💰 돈나무</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-amber-200">
              <span className="text-xs font-bold text-slate-700 px-2">꽃 심기:</span>
              <button
                onClick={() => onAddFlower('tulip', 'red')}
                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 rounded-xl text-xs font-bold flex items-center gap-1 text-rose-700"
              >
                <span>🌷 빨간 튤립</span>
              </button>
              <button
                onClick={() => onAddFlower('rose', 'pink')}
                className="px-2.5 py-1 bg-pink-50 hover:bg-pink-100 rounded-xl text-xs font-bold flex items-center gap-1 text-pink-700"
              >
                <span>🌹 핑크 장미</span>
              </button>
              <button
                onClick={() => onAddFlower('cosmos', 'white')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 text-slate-700"
              >
                <span>🌸 하얀 코스모스</span>
              </button>
              <button
                onClick={() => onAddFlower('pansy', 'blue')}
                className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 rounded-xl text-xs font-bold flex items-center gap-1 text-sky-700"
              >
                <span>🌼 파란 팬지</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Guide notice */}
      <div className="text-[11px] text-amber-900/80 bg-amber-100/80 px-3 py-1.5 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>원하는 도구를 선택한 뒤 섬 지도를 클릭하면 즉시 적용됩니다!</span>
        </div>
        <span className="font-semibold text-amber-950">ESC / 닫기로 완료</span>
      </div>
    </div>
  );
};
