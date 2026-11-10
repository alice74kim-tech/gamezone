import React, { useState } from 'react';
import { ToolType } from '../types/game';
import { soundManager } from '../utils/audio';
import { Volume2, VolumeX, Sun, Sunset, Moon, Smartphone, Hammer, Home, ShoppingBag, Landmark, HelpCircle, X } from 'lucide-react';

interface HUDProps {
  bells: number;
  nookMiles: number;
  equippedTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  isDesignerOpen: boolean;
  onToggleDesigner: () => void;
  onOpenHouseInterior: () => void;
  onOpenShop: () => void;
  onOpenMuseum: () => void;
  onOpenPhone: () => void;
  onOpenWorkbench: () => void;
  timeOfDay: 'day' | 'sunset' | 'night';
  onToggleTimeOfDay: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  bells,
  nookMiles,
  equippedTool,
  onSelectTool,
  isDesignerOpen,
  onToggleDesigner,
  onOpenHouseInterior,
  onOpenShop,
  onOpenMuseum,
  onOpenPhone,
  onOpenWorkbench,
  timeOfDay,
  onToggleTimeOfDay,
  isMuted,
  onToggleMute,
}) => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const tools: { type: ToolType; label: string; icon: string; key: string }[] = [
    { type: 'rod', label: '낚싯대', icon: '🎣', key: '1' },
    { type: 'net', label: '잠자리채', icon: '🦋', key: '2' },
    { type: 'shovel', label: '삽', icon: '⛏️', key: '3' },
    { type: 'axe', label: '도끼', icon: '🪓', key: '4' },
    { type: 'slingshot', label: '새총', icon: '🎯', key: '5' },
    { type: 'designer', label: '섬 크리에이터', icon: '⛑️', key: '6' },
  ];

  return (
    <>
      {/* TOP BAR (Adhering to Top Bar Contract) */}
      <header className="fixed top-0 inset-x-0 z-40 bg-amber-50/90 backdrop-blur-md border-b-2 border-amber-900/20 px-4 py-2.5 flex items-center justify-between gap-4 select-none shadow-sm">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <span className="text-xl">🍃</span>
          <span className="font-gaegu text-xl sm:text-2xl font-black text-amber-950 tracking-tight">
            동물의 숲: 아일랜드 디자이너
          </span>
        </div>

        {/* Zone 2: Navigation Links / Island Features */}
        <nav className="hidden lg:flex items-center gap-4 text-xs font-bold text-amber-900/80">
          <button
            onClick={onToggleDesigner}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
              isDesignerOpen ? 'bg-yellow-400 text-slate-900 shadow' : 'hover:bg-amber-100'
            }`}
          >
            <span>⛑️ 지형·건물 공사</span>
          </button>

          <button
            onClick={onOpenHouseInterior}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-amber-100 transition"
          >
            <Home className="w-4 h-4 text-amber-700" />
            <span>내 집 꾸미기</span>
          </button>

          <button
            onClick={onOpenShop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-amber-100 transition"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-700" />
            <span>너굴 상점</span>
          </button>

          <button
            onClick={onOpenMuseum}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-amber-100 transition"
          >
            <Landmark className="w-4 h-4 text-stone-700" />
            <span>박물관</span>
          </button>

          <button
            onClick={onOpenWorkbench}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-amber-100 transition"
          >
            <Hammer className="w-4 h-4 text-amber-800" />
            <span>DIY 공방</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions, Currency & Audio/Time */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Bells & Miles */}
          <div className="flex items-center gap-2 bg-white/90 px-3 py-1 rounded-2xl border border-amber-300 shadow-sm text-xs font-black">
            <span className="text-amber-600">💰 {bells.toLocaleString()} 벨</span>
            <span className="text-slate-300">|</span>
            <span className="text-teal-600">✈️ {nookMiles.toLocaleString()} 마일</span>
          </div>

          {/* Time of Day Switch */}
          <button
            onClick={onToggleTimeOfDay}
            className="p-1.5 bg-white hover:bg-amber-100 rounded-xl border border-amber-200 text-slate-700 transition"
            title={`시간대 변경 (현재: ${timeOfDay === 'day' ? '낮' : timeOfDay === 'sunset' ? '노을' : '밤'})`}
          >
            {timeOfDay === 'day' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : timeOfDay === 'sunset' ? (
              <Sunset className="w-4 h-4 text-orange-500" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {/* Audio BGM Mute */}
          <button
            onClick={onToggleMute}
            className="p-1.5 bg-white hover:bg-amber-100 rounded-xl border border-amber-200 text-slate-700 transition"
            title={isMuted ? '음악 켜기' : '음소거'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>

          {/* NookPhone Button */}
          {/* Help Guide Button */}
          <button
            onClick={() => setIsGuideOpen(true)}
            className="p-1.5 bg-white hover:bg-amber-100 rounded-xl border border-amber-200 text-amber-900 transition flex items-center gap-1 font-bold text-xs"
            title="게임 가이드 및 조작법"
          >
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">가이드</span>
          </button>

          {/* NookPhone Button */}
          <button
            onClick={onOpenPhone}
            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs font-black shadow flex items-center gap-1.5 active:scale-95 transition"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">너굴폰</span>
          </button>
        </div>
      </header>

      {/* GAME GUIDE MODAL */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-amber-50 rounded-3xl border-4 border-amber-900/60 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="bg-emerald-700 text-white p-4 flex items-center justify-between border-b-4 border-emerald-900">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">📖</span>
                <div>
                  <h3 className="text-lg font-black">Nook Inc. 무인도 이주 플랜 완벽 가이드</h3>
                  <p className="text-xs text-emerald-100">조작법 및 섬 라이프 100% 즐기기</p>
                </div>
              </div>
              <button
                onClick={() => setIsGuideOpen(false)}
                className="p-1.5 hover:bg-emerald-800 rounded-full text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Guide Sections */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-800">
              {/* Section 1 */}
              <div className="p-3.5 bg-white rounded-2xl border border-amber-200 shadow-sm">
                <h4 className="font-extrabold text-amber-950 text-sm mb-1.5 flex items-center gap-1.5">
                  <span>🎮 1. 기본 조작법</span>
                </h4>
                <ul className="space-y-1 text-slate-600 text-xs">
                  <li>• <strong>이동</strong>: 키보드 <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded">W</kbd><kbd className="px-1.5 py-0.5 bg-slate-100 border rounded">A</kbd><kbd className="px-1.5 py-0.5 bg-slate-100 border rounded">S</kbd><kbd className="px-1.5 py-0.5 bg-slate-100 border rounded">D</kbd> 또는 <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded">방향키</kbd> (목표 타일을 직접 클릭해도 걸어갑니다)</li>
                  <li>• <strong>액션</strong>: <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded">Space</kbd> 또는 화면 클릭 (도구 사용, 나무 흔들기, 주민 대화, 건물 입장)</li>
                  <li>• <strong>도구 단축키</strong>: <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded">1</kbd> 낚싯대, <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded">2</kbd> 잠자리채, <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded">3</kbd> 삽, <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded">4</kbd> 도끼, <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded">5</kbd> 새총, <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded">6</kbd> 섬 크리에이터</li>
                </ul>
              </div>

              {/* Section 2 */}
              <div className="p-3.5 bg-white rounded-2xl border border-amber-200 shadow-sm">
                <h4 className="font-extrabold text-emerald-800 text-sm mb-1.5 flex items-center gap-1.5">
                  <span>⛑️ 2. 섬 크리에이터 (지형 공사 & 건물 배치)</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">
                  상단 메뉴 또는 안전모 버튼(6번)을 누르면 하단에 <strong>디자인 스튜디오</strong>가 열립니다.
                </p>
                <ul className="space-y-1 text-slate-600 text-xs">
                  <li>• <strong>지형 & 길 공사</strong>: 브러시(하천, 흙길, 돌길, 벽돌길, 나무 데크, 모래, 절벽)를 선택하고 맵을 클릭하면 즉시 지형이 변경됩니다.</li>
                  <li>• <strong>건물 이설</strong>: 내 집, 너굴 상점, 박물관, 마을 회관, 이웃 주민의 집을 선택한 뒤 원하는 지형을 클릭하면 그곳으로 이설됩니다.</li>
                  <li>• <strong>가구 배치 & 회전</strong>: 가구를 맵에 놓고, 배치된 가구를 클릭하면 90° 회전하거나 인벤토리로 회수할 수 있습니다.</li>
                  <li>• <strong>나무 & 꽃 심기</strong>: 사과·체리·복숭아 과일나무, 돈나무 및 튤립·장미·코스모스를 바로 심을 수 있습니다.</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="p-3.5 bg-white rounded-2xl border border-amber-200 shadow-sm">
                <h4 className="font-extrabold text-sky-800 text-sm mb-1.5 flex items-center gap-1.5">
                  <span>🎣 3. 낚시 & 곤충 & 화석 & 풍선 선물</span>
                </h4>
                <ul className="space-y-1 text-slate-600 text-xs">
                  <li>• <strong>낚시</strong>: 낚싯대를 들고 강/바다의 물고기 그림자 근처를 향해 스페이스를 누르면 찌를 던집니다. 찌가 "퐁당!" 하고 가라앉는 순간 다시 스페이스를 눌러 낚아 올립니다!</li>
                  <li>• <strong>곤충 채집</strong>: 잠자리채를 들고 날아다니는 나비나 나무에 붙은 딱정벌레 근처에서 스페이스를 휘두릅니다.</li>
                  <li>• <strong>화석 발굴</strong>: 땅에 반짝이는 별 모양 균열(✦)을 삽으로 파내어 티라노사우루스 등 고대 화석을 발굴합니다.</li>
                  <li>• <strong>선물 풍선 격추</strong>: 하늘에 풍선 선물이 지나갈 때 새총을 들고 쏘아 맞히면 벨과 가구 선물을 획득합니다.</li>
                </ul>
              </div>

              {/* Section 4 */}
              <div className="p-3.5 bg-white rounded-2xl border border-amber-200 shadow-sm">
                <h4 className="font-extrabold text-amber-900 text-sm mb-1.5 flex items-center gap-1.5">
                  <span>🏪 4. 너굴 상점, 박물관, 내 집 인테리어</span>
                </h4>
                <ul className="space-y-1 text-slate-600 text-xs">
                  <li>• <strong>너굴 상점</strong>: 잡은 물고기와 과일을 팔아 벨을 벌고, 가구와 도구를 구매하며 대출금을 상환하여 2층 대저택으로 증축하세요.</li>
                  <li>• <strong>부엉 박물관</strong>: 잡은 물고기·곤충·화석을 기증하면 수족관, 곤충 온실, 화석관에 살아있는 표본으로 전시됩니다.</li>
                  <li>• <strong>내 집 꾸미기</strong>: 집 안으로 들어가 벽지와 마루를 변경하고, 가구를 배치하고 회전할 수 있습니다.</li>
                  <li>• <strong>이웃 주민</strong>: 잭슨(고양이), 뽀야미(햄스터)에게 다가가면 동물어 음성으로 대화하고 선물을 건넬 수 있습니다.</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-amber-100/80 border-t border-amber-200 flex justify-end">
              <button
                onClick={() => setIsGuideOpen(false)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow transition active:scale-95"
              >
                알겠습니다! 즐겁게 플레이하기
              </button>
            </div>
          </div>
        </div>
      )}


      {/* BOTTOM QUICK TOOL BELT (Quick select with keys 1~6) */}
      {!isDesignerOpen && (
        <div className="fixed bottom-4 inset-x-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="bg-amber-50/95 backdrop-blur-md px-3 py-2 rounded-3xl border-2 border-amber-900/30 shadow-2xl flex items-center gap-1.5 pointer-events-auto">
            {tools.map((t) => {
              const isEquipped = equippedTool === t.type;
              return (
                <button
                  key={t.type}
                  onClick={() => {
                    soundManager.playDesignerChime();
                    if (t.type === 'designer') {
                      onToggleDesigner();
                    } else {
                      onSelectTool(isEquipped ? 'none' : t.type);
                    }
                  }}
                  className={`relative p-2 rounded-2xl flex flex-col items-center justify-center transition active:scale-95 ${
                    isEquipped
                      ? 'bg-yellow-400 text-slate-900 ring-2 ring-yellow-500 shadow-md scale-105'
                      : 'bg-white hover:bg-amber-100 text-slate-700 border border-amber-200'
                  }`}
                  title={`${t.label} (단축키: ${t.key})`}
                >
                  <span className="text-xl">{t.icon}</span>
                  <span className="text-[10px] font-bold mt-0.5 hidden sm:inline">{t.label}</span>
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-900 text-white text-[9px] rounded-full font-black flex items-center justify-center shadow">
                    {t.key}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* KEYBOARD CONTROLS HELPER (bottom-left) */}
      <div className="fixed bottom-4 left-4 z-20 hidden md:flex items-center gap-2 bg-amber-950/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-2xl text-[11px] font-medium shadow pointer-events-none select-none">
        <span>🎮 이동: <strong>WASD / 방향키</strong></span>
        <span>·</span>
        <span>액션: <strong>Space / 클릭</strong></span>
        <span>·</span>
        <span>도구: <strong>숫자 1~6</strong></span>
      </div>
    </>
  );
};
