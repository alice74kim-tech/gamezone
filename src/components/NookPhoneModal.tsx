import React, { useState } from 'react';
import { CRITTERS, DIY_RECIPES, ITEMS } from '../data/gameData';
import { soundManager } from '../utils/audio';
import { X, BookOpen, Hammer, Award, Star, Map, CheckCircle2 } from 'lucide-react';
import { PlacedItem, TileType } from '../types/game';

interface NookPhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  caughtCritters: string[];
  donatedCritters: string[];
  nookMiles: number;
  onClaimMile: (id: string, reward: number) => void;
  completedMiles: string[];
  placedItems: PlacedItem[];
  tiles: TileType[][];
}

export const NookPhoneModal: React.FC<NookPhoneModalProps> = ({
  isOpen,
  onClose,
  caughtCritters,
  donatedCritters,
  nookMiles,
  onClaimMile,
  completedMiles,
  placedItems,
  tiles,
}) => {
  const [activeApp, setActiveApp] = useState<'home' | 'critterpedia' | 'diy' | 'miles' | 'rating' | 'map'>('home');
  const [critterCategory, setCritterCategory] = useState<'fish' | 'bug' | 'fossil'>('fish');

  if (!isOpen) return null;

  // Calculate Island Rating based on placed furniture, flowers, trees, paths
  const treeCount = placedItems.filter((i) => i.type === 'tree').length;
  const flowerCount = placedItems.filter((i) => i.type === 'flower').length;
  const furnitureCount = placedItems.filter((i) => i.type === 'furniture' || i.type === 'bridge').length;
  const pathCount = tiles.flat().filter((t) => t.includes('path') || t === 'wood_deck').length;

  let starRating = 1;
  let feedback = '섬이 아직 자연 그대로입니다. 가구와 꽃을 심어 아름답게 가꿔보세요!';
  if (flowerCount >= 5 && furnitureCount >= 4) {
    starRating = 2;
    feedback = '섬에 조금씩 활기가 돌기 시작했습니다! 산책로를 포장하고 가로등을 세워보세요.';
  }
  if (flowerCount >= 8 && furnitureCount >= 8 && pathCount >= 10) {
    starRating = 3;
    feedback = '소문이 퍼져 유명 가수 K.K. 라이더가 라이브 콘서트를 열러 올 만큼 매력적인 섬이 되었습니다! 🎸';
  }
  if (flowerCount >= 12 && furnitureCount >= 12 && treeCount >= 8 && pathCount >= 16) {
    starRating = 4;
    feedback = '관광객들이 감탄을 금치 못하는 환상의 리조트 아일랜드입니다!';
  }
  if (flowerCount >= 16 && furnitureCount >= 16 && treeCount >= 10 && pathCount >= 24) {
    starRating = 5;
    feedback = '만점 별 5개의 최고급 지상낙원 섬입니다! 금빛 물뿌리개 수여 대상입니다! ✨';
  }

  // Daily Nook Miles challenges
  const milesChallenges = [
    { id: 'mile_fish', title: '섬의 낚시 명수', desc: '강이나 바다에서 물고기를 3회 이상 낚으세요!', reward: 300, progress: caughtCritters.filter(id => CRITTERS[id]?.type === 'fish').length, goal: 3 },
    { id: 'mile_bug', title: '곤충 채집 대모험', desc: '꽃이나 나무 주변에서 곤충을 3회 이상 포획하세요!', reward: 300, progress: caughtCritters.filter(id => CRITTERS[id]?.type === 'bug').length, goal: 3 },
    { id: 'mile_fossil', title: '고고학 발굴단', desc: '땅속 별 모양 균열에서 화석을 발굴하세요!', reward: 500, progress: caughtCritters.filter(id => CRITTERS[id]?.type === 'fossil').length, goal: 2 },
    { id: 'mile_decor', title: '아일랜드 크리에이터', desc: '야외에 가구나 조경 장식을 5개 이상 배치하세요!', reward: 400, progress: furnitureCount, goal: 5 },
    { id: 'mile_path', title: '포장도로 전문가', desc: '길이나 나무 데크를 10칸 이상 시공하세요!', reward: 400, progress: pathCount, goal: 10 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      {/* NookPhone Device Frame */}
      <div className="relative w-full max-w-md bg-teal-500 rounded-[44px] p-4 border-4 border-teal-700 shadow-2xl flex flex-col h-[650px] overflow-hidden">
        {/* Phone Speaker & Camera notch */}
        <div className="w-full flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-1.5 bg-teal-800 rounded-full" />
          <div className="w-2.5 h-2.5 bg-teal-800 rounded-full" />
        </div>

        {/* Screen Bezel */}
        <div className="flex-1 bg-amber-50 rounded-[32px] border-4 border-teal-800 shadow-inner overflow-hidden flex flex-col">
          {/* Top Status Bar */}
          <div className="px-4 py-2 bg-teal-600 text-white flex items-center justify-between text-xs font-bold border-b border-teal-700">
            <div className="flex items-center gap-1.5">
              <span>🍃</span>
              <span className="font-gaegu text-sm">너굴폰 스마트 OS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-300">✈️ {nookMiles.toLocaleString()} 마일</span>
              <button
                onClick={onClose}
                className="p-1 hover:bg-teal-700 rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* App Views */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col">
            {/* 1. HOME SCREEN */}
            {activeApp === 'home' && (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 mb-3 px-1">너굴폰 앱 모음</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        soundManager.playAnimalese('도감');
                        setActiveApp('critterpedia');
                      }}
                      className="p-3 bg-white rounded-2xl border-2 border-amber-200 shadow hover:border-emerald-500 flex flex-col items-center gap-1.5 active:scale-95 transition"
                    >
                      <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                        📖
                      </div>
                      <span className="text-xs font-extrabold text-slate-800">생물 도감</span>
                    </button>

                    <button
                      onClick={() => {
                        soundManager.playAnimalese('DIY');
                        setActiveApp('diy');
                      }}
                      className="p-3 bg-white rounded-2xl border-2 border-amber-200 shadow hover:border-emerald-500 flex flex-col items-center gap-1.5 active:scale-95 transition"
                    >
                      <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                        🔨
                      </div>
                      <span className="text-xs font-extrabold text-slate-800">DIY 레시피</span>
                    </button>

                    <button
                      onClick={() => {
                        soundManager.playAnimalese('마일');
                        setActiveApp('miles');
                      }}
                      className="p-3 bg-white rounded-2xl border-2 border-amber-200 shadow hover:border-emerald-500 flex flex-col items-center gap-1.5 active:scale-95 transition"
                    >
                      <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                        🎖️
                      </div>
                      <span className="text-xs font-extrabold text-slate-800">너굴 마일+</span>
                    </button>

                    <button
                      onClick={() => {
                        soundManager.playAnimalese('평판');
                        setActiveApp('rating');
                      }}
                      className="p-3 bg-white rounded-2xl border-2 border-amber-200 shadow hover:border-emerald-500 flex flex-col items-center gap-1.5 active:scale-95 transition"
                    >
                      <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                        ⭐
                      </div>
                      <span className="text-xs font-extrabold text-slate-800">섬 평판</span>
                    </button>

                    <button
                      onClick={() => {
                        soundManager.playAnimalese('지도');
                        setActiveApp('map');
                      }}
                      className="p-3 bg-white rounded-2xl border-2 border-amber-200 shadow hover:border-emerald-500 flex flex-col items-center gap-1.5 active:scale-95 transition"
                    >
                      <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                        🗺️
                      </div>
                      <span className="text-xs font-extrabold text-slate-800">섬 전체 지도</span>
                    </button>
                  </div>
                </div>

                {/* Island Weather Widget */}
                <div className="p-3 bg-gradient-to-r from-sky-100 to-emerald-100 rounded-2xl border border-sky-200 flex items-center justify-between shadow-sm mt-4">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold">무인도 기상 정보</span>
                    <h4 className="text-xs font-extrabold text-slate-800">포근한 봄바람과 맑은 하늘</h4>
                  </div>
                  <span className="text-3xl">☀️</span>
                </div>
              </div>
            )}

            {/* 2. CRITTERPEDIA */}
            {activeApp === 'critterpedia' && (
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => setActiveApp('home')}
                    className="text-xs font-bold text-teal-700 flex items-center gap-1"
                  >
                    ← 홈으로
                  </button>
                  <div className="flex gap-1 bg-amber-200/60 p-1 rounded-xl">
                    <button
                      onClick={() => setCritterCategory('fish')}
                      className={`px-2 py-0.5 text-xs font-bold rounded-lg ${
                        critterCategory === 'fish' ? 'bg-white shadow text-sky-800' : 'text-slate-600'
                      }`}
                    >
                      물고기
                    </button>
                    <button
                      onClick={() => setCritterCategory('bug')}
                      className={`px-2 py-0.5 text-xs font-bold rounded-lg ${
                        critterCategory === 'bug' ? 'bg-white shadow text-emerald-800' : 'text-slate-600'
                      }`}
                    >
                      곤충
                    </button>
                    <button
                      onClick={() => setCritterCategory('fossil')}
                      className={`px-2 py-0.5 text-xs font-bold rounded-lg ${
                        critterCategory === 'fossil' ? 'bg-white shadow text-amber-900' : 'text-slate-600'
                      }`}
                    >
                      화석
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto pr-1">
                  {Object.values(CRITTERS)
                    .filter((c) => c.type === critterCategory)
                    .map((critter) => {
                      const isCaught = caughtCritters.includes(critter.id);
                      const isDonated = donatedCritters.includes(critter.id);

                      return (
                        <div
                          key={critter.id}
                          className={`p-2.5 rounded-2xl border flex flex-col justify-between ${
                            isCaught
                              ? 'bg-white border-amber-300 shadow-sm'
                              : 'bg-stone-100 border-stone-200 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-2xl">{isCaught ? critter.icon : '❓'}</span>
                            {isDonated && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-bold rounded-full border border-emerald-300">
                                기증완료 🏛️
                              </span>
                            )}
                          </div>
                          <div className="mt-1">
                            <h5 className="font-extrabold text-xs text-slate-800">
                              {isCaught ? critter.name : '???'}
                            </h5>
                            <span className="text-[10px] text-slate-500">
                              {isCaught ? critter.location : '미발견'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 3. DIY RECIPES */}
            {activeApp === 'diy' && (
              <div className="flex-1 flex flex-col">
                <button
                  onClick={() => setActiveApp('home')}
                  className="text-xs font-bold text-teal-700 flex items-center gap-1 mb-3"
                >
                  ← 홈으로
                </button>
                <div className="space-y-2 overflow-y-auto pr-1">
                  {DIY_RECIPES.map((recipe) => {
                    const resultItem = ITEMS[recipe.resultItemId];
                    if (!resultItem) return null;
                    return (
                      <div
                        key={recipe.id}
                        className="p-3 bg-white rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl p-1 bg-amber-50 rounded-xl">{resultItem.icon}</span>
                          <div>
                            <h4 className="font-bold text-xs text-slate-800">{resultItem.name}</h4>
                            <div className="flex items-center gap-1.5 mt-1">
                              {recipe.materials.map((mat) => (
                                <span key={mat.itemId} className="text-[10px] text-slate-500">
                                  {ITEMS[mat.itemId]?.name} x{mat.count}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full">
                          습득완료
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. NOOK MILES+ */}
            {activeApp === 'miles' && (
              <div className="flex-1 flex flex-col">
                <button
                  onClick={() => setActiveApp('home')}
                  className="text-xs font-bold text-teal-700 flex items-center gap-1 mb-3"
                >
                  ← 홈으로
                </button>
                <div className="space-y-2.5 overflow-y-auto pr-1">
                  {milesChallenges.map((ch) => {
                    const isCompleted = ch.progress >= ch.goal;
                    const isClaimed = completedMiles.includes(ch.id);

                    return (
                      <div
                        key={ch.id}
                        className="p-3 bg-white rounded-2xl border border-amber-200 shadow-sm flex flex-col gap-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1">
                            <span>{ch.title}</span>
                            <span className="text-teal-600 font-bold">+{ch.reward} 마일</span>
                          </h4>
                          {isClaimed ? (
                            <span className="text-[10px] text-slate-400 font-bold">수령 완료</span>
                          ) : isCompleted ? (
                            <button
                              onClick={() => {
                                soundManager.playCelebrationFanfare();
                                onClaimMile(ch.id, ch.reward);
                              }}
                              className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl animate-bounce shadow"
                            >
                              마일 받기!
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-bold">
                              {ch.progress} / {ch.goal}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">{ch.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. ISLAND RATING */}
            {activeApp === 'rating' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-2">
                <button
                  onClick={() => setActiveApp('home')}
                  className="self-start text-xs font-bold text-teal-700 flex items-center gap-1 mb-3"
                >
                  ← 홈으로
                </button>
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-3xl mb-2 shadow-inner">
                  ⭐
                </div>
                <h3 className="text-base font-black text-slate-900">섬 평판 평가</h3>
                <div className="flex items-center gap-1 my-2">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-6 h-6 ${
                        idx < starRating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="p-3 bg-white rounded-2xl border border-amber-200 shadow-sm text-xs text-slate-700 my-3 leading-relaxed">
                  "{feedback}"
                </div>
                <div className="w-full grid grid-cols-2 gap-2 text-left text-xs bg-amber-100/60 p-3 rounded-2xl">
                  <span>🌲 나무: <strong>{treeCount}그루</strong></span>
                  <span>🌷 꽃: <strong>{flowerCount}송이</strong></span>
                  <span>🪵 가구: <strong>{furnitureCount}점</strong></span>
                  <span>🧱 포장도로: <strong>{pathCount}칸</strong></span>
                </div>
              </div>
            )}

            {/* 6. ISLAND MAP */}
            {activeApp === 'map' && (
              <div className="flex-1 flex flex-col">
                <button
                  onClick={() => setActiveApp('home')}
                  className="text-xs font-bold text-teal-700 flex items-center gap-1 mb-3"
                >
                  ← 홈으로
                </button>
                <div className="flex-1 bg-emerald-600 rounded-2xl p-2 border-2 border-emerald-800 shadow-inner flex items-center justify-center overflow-hidden">
                  {/* Mini Map preview */}
                  <div
                    className="grid gap-[1px] bg-emerald-800/50 p-1 rounded-xl"
                    style={{ gridTemplateColumns: `repeat(${tiles[0].length}, 8px)` }}
                  >
                    {tiles.map((row, y) =>
                      row.map((t, x) => (
                        <div
                          key={`mini-${x}-${y}`}
                          className={`w-2 h-2 rounded-[1px] ${
                            t === 'water'
                              ? 'bg-sky-400'
                              : t === 'sand'
                              ? 'bg-amber-200'
                              : t === 'cliff'
                              ? 'bg-lime-700'
                              : t.includes('path') || t === 'wood_deck'
                              ? 'bg-slate-300'
                              : 'bg-emerald-500'
                          }`}
                        />
                      ))
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-center text-slate-500 mt-2">
                  무인도 전체 위성 지도 (26 x 20)
                </span>
              </div>
            )}
          </div>

          {/* Bottom Home Indicator */}
          <div className="h-6 flex items-center justify-center bg-teal-600">
            <button
              onClick={() => setActiveApp('home')}
              className="w-20 h-1.5 bg-white/70 hover:bg-white rounded-full transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
