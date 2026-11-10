import React, { useState } from 'react';
import { Critter, InventorySlot } from '../types/game';
import { ASSET_IMAGES, CRITTERS } from '../data/gameData';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { X, Fish, Bug, Compass, Sparkles } from 'lucide-react';

interface MuseumModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventorySlot[];
  onDonateCritter: (critterId: string) => void;
  donatedCritters: string[];
}

export const MuseumModal: React.FC<MuseumModalProps> = ({
  isOpen,
  onClose,
  inventory,
  onDonateCritter,
  donatedCritters,
}) => {
  const [activeWing, setActiveWing] = useState<'aquarium' | 'insectarium' | 'fossils' | 'donate'>('aquarium');
  const [speech, setSpeech] = useState('후우... 박물관에 오신 것을 환영합니다! 기증품을 관람하시겠습니까?');

  if (!isOpen) return null;

  // Donatable critters from player inventory
  const donatableItems = inventory.filter((slot) => {
    const isCritter = Object.values(CRITTERS).some((c) => c.name === slot.item.name);
    const critterDef = Object.values(CRITTERS).find((c) => c.name === slot.item.name);
    return isCritter && critterDef && !donatedCritters.includes(critterDef.id);
  });

  const handleDonate = (slot: InventorySlot) => {
    const critterDef = Object.values(CRITTERS).find((c) => c.name === slot.item.name);
    if (!critterDef) return;

    soundManager.playCelebrationFanfare();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });

    onDonateCritter(critterDef.id);

    if (critterDef.type === 'bug') {
      setSpeech(`으으윽...! ${critterDef.name}이군요! 사실 벌레는 끔찍하게 소름끼치지만... 학술적 가치를 위해 정성껏 전시하겠습니다! 후우...`);
    } else if (critterDef.type === 'fish') {
      setSpeech(`오오! ${critterDef.name}을(를) 기증해주시다니! 수족관 어항이 한층 더 생기 넘치게 되었습니다!`);
    } else {
      setSpeech(`감격스럽습니다! 고대 지구의 신비를 품은 ${critterDef.name} 화석을 화석관 중앙 단상에 영구 보존하겠습니다!`);
    }
  };

  const allCrittersList = Object.values(CRITTERS);
  const fishList = allCrittersList.filter((c) => c.type === 'fish');
  const bugList = allCrittersList.filter((c) => c.type === 'bug');
  const fossilList = allCrittersList.filter((c) => c.type === 'fossil');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-amber-50 rounded-3xl border-4 border-amber-900/60 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Blathers */}
        <div className="bg-stone-800 text-amber-100 p-4 flex items-center justify-between border-b-4 border-stone-950">
          <div className="flex items-center gap-3">
            <img
              src={ASSET_IMAGES.blathers}
              alt="부엉 관장"
              className="w-14 h-14 rounded-full border-2 border-amber-300/80 object-cover shadow"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">국립 섬 박물관 (Museum)</h2>
                <span className="text-xs px-2 py-0.5 bg-amber-900/80 text-amber-200 rounded-full font-bold">
                  관장: 부엉
                </span>
              </div>
              <p className="text-xs text-stone-300">총 기증품: {donatedCritters.length} / {allCrittersList.length}점</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-stone-700 rounded-full text-stone-300 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Speech Bubble */}
        <div className="p-3 bg-stone-100 border-b border-stone-300 text-xs sm:text-sm text-stone-900 font-semibold flex items-center gap-2">
          <span className="text-base">🦉</span>
          <p className="leading-snug">{speech}</p>
        </div>

        {/* Wing Navigation */}
        <div className="flex border-b border-stone-300 bg-stone-200/60">
          <button
            onClick={() => {
              setActiveWing('aquarium');
              soundManager.playAnimalese('부엉');
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition ${
              activeWing === 'aquarium' ? 'bg-sky-900 text-white shadow-inner' : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            <Fish className="w-4 h-4 text-sky-400" />
            <span>수족관 (물고기)</span>
          </button>

          <button
            onClick={() => {
              setActiveWing('insectarium');
              soundManager.playAnimalese('부엉');
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition ${
              activeWing === 'insectarium' ? 'bg-emerald-900 text-white shadow-inner' : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            <Bug className="w-4 h-4 text-emerald-400" />
            <span>곤충관 (온실)</span>
          </button>

          <button
            onClick={() => {
              setActiveWing('fossils');
              soundManager.playAnimalese('부엉');
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition ${
              activeWing === 'fossils' ? 'bg-amber-950 text-white shadow-inner' : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>화석관 (고생대)</span>
          </button>

          <button
            onClick={() => {
              setActiveWing('donate');
              soundManager.playAnimalese('부엉');
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition ${
              activeWing === 'donate' ? 'bg-amber-600 text-white shadow-inner' : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>표본 기증하기</span>
          </button>
        </div>

        {/* Wing Views */}
        <div className="p-4 overflow-y-auto flex-1">
          {/* 1. AQUARIUM */}
          {activeWing === 'aquarium' && (
            <div className="space-y-4">
              <div className="p-4 bg-sky-950 text-sky-100 rounded-2xl border-2 border-sky-800 shadow-inner flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-sky-200">심해 & 산호초 대형 수족관</h3>
                  <p className="text-xs text-sky-300">섬의 강과 바다에서 낚아 기증된 어류들이 유영하고 있습니다.</p>
                </div>
                <span className="text-3xl animate-bounce">🌊</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {fishList.map((fish) => {
                  const isDonated = donatedCritters.includes(fish.id);
                  return (
                    <div
                      key={fish.id}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition ${
                        isDonated
                          ? 'bg-gradient-to-b from-sky-900/40 to-sky-950/40 border-sky-600/60 shadow'
                          : 'bg-stone-100/60 border-stone-200 opacity-50'
                      }`}
                    >
                      <span className={`text-4xl mb-1 ${isDonated ? 'animate-float-bob' : 'filter grayscale'}`}>
                        {fish.icon}
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm">{fish.name}</h4>
                      <span className="text-[10px] text-slate-500">{fish.location}</span>
                      {isDonated ? (
                        <span className="mt-1 text-[10px] px-2 py-0.5 bg-sky-600 text-white rounded-full font-bold">
                          전시중
                        </span>
                      ) : (
                        <span className="mt-1 text-[10px] text-slate-400">미기증</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. INSECTARIUM */}
          {activeWing === 'insectarium' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-950 text-emerald-100 rounded-2xl border-2 border-emerald-800 shadow-inner flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-emerald-200">자연 생태 온실 곤충관</h3>
                  <p className="text-xs text-emerald-300">꽃과 나무에서 채집된 아름다운 나비와 딱정벌레들의 서식지입니다.</p>
                </div>
                <span className="text-3xl animate-bounce">🌿</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {bugList.map((bug) => {
                  const isDonated = donatedCritters.includes(bug.id);
                  return (
                    <div
                      key={bug.id}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition ${
                        isDonated
                          ? 'bg-emerald-50 border-emerald-300 shadow'
                          : 'bg-stone-100/60 border-stone-200 opacity-50'
                      }`}
                    >
                      <span className={`text-4xl mb-1 ${isDonated ? 'animate-float-bob' : 'filter grayscale'}`}>
                        {bug.icon}
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm">{bug.name}</h4>
                      <span className="text-[10px] text-slate-500">{bug.location}</span>
                      {isDonated ? (
                        <span className="mt-1 text-[10px] px-2 py-0.5 bg-emerald-600 text-white rounded-full font-bold">
                          전시중
                        </span>
                      ) : (
                        <span className="mt-1 text-[10px] text-slate-400">미기증</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. FOSSILS */}
          {activeWing === 'fossils' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-950 text-amber-100 rounded-2xl border-2 border-amber-800 shadow-inner flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-amber-200">고생대 & 중생대 화석 전시관</h3>
                  <p className="text-xs text-amber-300">땅속 깊은 균열에서 발굴된 고대 생물의 뼈대와 껍데기들입니다.</p>
                </div>
                <span className="text-3xl animate-bounce">🦖</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                {fossilList.map((fossil) => {
                  const isDonated = donatedCritters.includes(fossil.id);
                  return (
                    <div
                      key={fossil.id}
                      className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center transition ${
                        isDonated
                          ? 'bg-amber-100/70 border-amber-400 shadow'
                          : 'bg-stone-100/60 border-stone-200 opacity-50'
                      }`}
                    >
                      <span className={`text-5xl mb-2 ${isDonated ? '' : 'filter grayscale'}`}>
                        {fossil.icon}
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm">{fossil.name}</h4>
                      <span className="text-[11px] text-amber-900/80 mt-0.5">{fossil.catchQuote}</span>
                      {isDonated ? (
                        <span className="mt-2 text-xs px-2.5 py-0.5 bg-amber-800 text-amber-100 rounded-full font-bold">
                          전시완료
                        </span>
                      ) : (
                        <span className="mt-2 text-xs text-slate-400">미발굴</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. DONATE */}
          {activeWing === 'donate' && (
            <div>
              {donatableItems.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-base font-semibold">현재 주머니에 새로 기증할 수 있는 표본이 없습니다!</p>
                  <p className="text-xs mt-1">낚시, 곤충 채집, 땅속 화석 발굴을 통해 새로운 생물을 채집해 오세요.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {donatableItems.map((slot) => (
                    <div
                      key={slot.item.id}
                      className="p-3 bg-white rounded-2xl border-2 border-amber-200 shadow-sm flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 bg-amber-50 rounded-xl border border-amber-100">
                          {slot.item.icon}
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{slot.item.name}</h4>
                          <span className="text-xs text-emerald-600 font-semibold">새로운 기증 대상!</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDonate(slot)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow active:scale-95 transition"
                      >
                        기증하기
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
