import React, { useState } from 'react';
import { InventorySlot, ItemDefinition } from '../types/game';
import { ASSET_IMAGES, ITEMS } from '../data/gameData';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { X, ShoppingBag, Coins, CreditCard, Sparkles } from 'lucide-react';

interface NookShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  bells: number;
  onBellsChange: (newBells: number) => void;
  inventory: InventorySlot[];
  onInventoryChange: (newInv: InventorySlot[]) => void;
  houseTier: number;
  onUpgradeHouse: () => void;
}

export const NookShopModal: React.FC<NookShopModalProps> = ({
  isOpen,
  onClose,
  bells,
  onBellsChange,
  inventory,
  onInventoryChange,
  houseTier,
  onUpgradeHouse,
}) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'loan'>('buy');
  const [dialogue, setDialogue] = useState('어서오게나! 너굴 상점에 온 것을 환영하네구리~!');

  if (!isOpen) return null;

  // Items for sale today
  const shopCatalog = [
    ITEMS.furn_log_bench,
    ITEMS.furn_garden_fountain,
    ITEMS.furn_streetlamp,
    ITEMS.furn_campfire,
    ITEMS.furn_beach_lounger,
    ITEMS.furn_stone_lantern,
    ITEMS.furn_picnic_set,
    ITEMS.furn_tea_stall,
    ITEMS.furn_kk_stereo,
    ITEMS.furn_white_fence,
    ITEMS.furn_cozy_bed,
    ITEMS.furn_wood_sofa,
    ITEMS.furn_retro_tv,
    ITEMS.furn_monstera,
    ITEMS.wall_forest,
    ITEMS.floor_wood,
    ITEMS.tool_rod,
    ITEMS.tool_net,
    ITEMS.tool_shovel,
    ITEMS.tool_axe,
    ITEMS.tool_slingshot,
  ].filter(Boolean);

  const handleBuy = (item: ItemDefinition) => {
    const cost = item.buyPrice || 1000;
    if (bells < cost) {
      setDialogue('이런... 벨이 조금 부족한 것 같네구리!');
      return;
    }

    soundManager.playCoin();
    onBellsChange(bells - cost);

    // Add to inventory
    const existing = inventory.find((slot) => slot.item.id === item.id);
    if (existing) {
      onInventoryChange(
        inventory.map((slot) =>
          slot.item.id === item.id ? { ...slot, count: slot.count + 1 } : slot
        )
      );
    } else {
      onInventoryChange([...inventory, { item, count: 1 }]);
    }

    setDialogue(`${item.name}을(를) 구매해주어 정말 고맙네구리~! 탁월한 선택이야!`);
  };

  const handleSell = (slot: InventorySlot) => {
    soundManager.playCoin();
    const earnings = (slot.item.price || 100) * slot.count;
    onBellsChange(bells + earnings);

    onInventoryChange(inventory.filter((s) => s.item.id !== slot.item.id));
    setDialogue(`${slot.item.name} ${slot.count}개를 매입했네! 여기 ${earnings.toLocaleString()} 벨일세구리~`);
  };

  const loanAmount = houseTier === 1 ? 98000 : 198000;

  const handlePayLoan = () => {
    if (bells < loanAmount) {
      setDialogue('대출금을 모두 갚기에는 벨이 아직 부족하네구리! 천천히 모아오게나~');
      return;
    }

    soundManager.playCelebrationFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    onBellsChange(bells - loanAmount);
    onUpgradeHouse();
    setDialogue('축하하네구리!! 집 대출금을 완납했어! 즉시 더 크고 멋진 집으로 증축 공사에 들어가겠네!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-amber-50 rounded-3xl border-4 border-amber-900/60 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Tom Nook */}
        <div className="bg-emerald-700 text-white p-4 flex items-center justify-between border-b-4 border-emerald-900">
          <div className="flex items-center gap-3">
            <img
              src={ASSET_IMAGES.tomNook}
              alt="너굴 사장"
              className="w-14 h-14 rounded-full border-2 border-white/80 object-cover shadow"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black">너굴 상점 (Nook's Cranny)</h2>
                <span className="text-xs px-2 py-0.5 bg-emerald-800 text-emerald-200 rounded-full font-bold">영업중</span>
              </div>
              <p className="text-xs text-emerald-100">너굴 사장 & 콩돌이 밤돌이 자매점</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Bells display */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-amber-950 rounded-2xl font-black text-sm shadow border border-amber-500">
              <Coins className="w-4 h-4 text-amber-900" />
              <span>{bells.toLocaleString()} 벨</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-emerald-800 rounded-full text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Speech Bubble */}
        <div className="p-3 bg-amber-100/90 border-b border-amber-200 text-xs sm:text-sm text-amber-950 font-semibold flex items-center gap-2">
          <span className="text-base">🍃</span>
          <p className="leading-snug">{dialogue}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-amber-200 bg-amber-100/60">
          <button
            onClick={() => {
              setActiveTab('buy');
              soundManager.playAnimalese('너굴');
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'buy' ? 'bg-amber-50 text-emerald-800 border-b-2 border-emerald-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>오늘의 진열 상품 구매</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('sell');
              soundManager.playAnimalese('너굴');
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'sell' ? 'bg-amber-50 text-amber-900 border-b-2 border-amber-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-600" />
            <span>소지품 매입 (판매)</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('loan');
              soundManager.playAnimalese('너굴');
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'loan' ? 'bg-amber-50 text-blue-900 border-b-2 border-blue-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4 text-blue-600" />
            <span>집 대출금 상환 & 증축</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1">
          {/* TAB 1: BUY */}
          {activeTab === 'buy' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {shopCatalog.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-white rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between hover:border-emerald-400 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 bg-amber-50 rounded-xl border border-amber-100">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{item.description}</p>
                      <span className="text-xs font-black text-amber-600">{(item.buyPrice || 1000).toLocaleString()} 벨</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuy(item)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow active:scale-95 transition"
                  >
                    구매
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: SELL */}
          {activeTab === 'sell' && (
            <div>
              {inventory.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-base font-semibold">주머니에 판매할 수 있는 물건이 없습니다!</p>
                  <p className="text-xs mt-1">강에서 물고기를 낚거나 땅속 화석을 발굴해보세요.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {inventory.map((slot) => (
                    <div
                      key={slot.item.id}
                      className="p-3 bg-white rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 bg-amber-50 rounded-xl border border-amber-100">{slot.item.icon}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-slate-800 text-sm">{slot.item.name}</h4>
                            <span className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-semibold">x{slot.count}</span>
                          </div>
                          <span className="text-xs font-black text-emerald-600">
                            +{(slot.item.price * slot.count).toLocaleString()} 벨
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSell(slot)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow active:scale-95 transition"
                      >
                        판매
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LOAN */}
          {activeTab === 'loan' && (
            <div className="flex flex-col items-center justify-center py-6 text-center max-w-md mx-auto">
              <div className="p-4 bg-emerald-100 rounded-full mb-3 text-4xl shadow-inner">
                🏡
              </div>
              <h3 className="text-lg font-black text-slate-800">
                {houseTier === 1 ? '아담한 통나무 오두막 대출' : '2층 럭셔리 대저택 대출'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                대출금을 모두 갚으면 너굴 하우징에서 즉시 건물을 더 크고 호화롭게 증축해 드립니다!
              </p>

              <div className="my-5 p-4 bg-white rounded-2xl border-2 border-amber-200 w-full shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span>남은 상환액:</span>
                  <span className="text-base font-black text-rose-600">{loanAmount.toLocaleString()} 벨</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>내 보유 벨:</span>
                  <span className="font-bold text-amber-700">{bells.toLocaleString()} 벨</span>
                </div>
              </div>

              <button
                onClick={handlePayLoan}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>대출금 완납하고 집 증축하기</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
