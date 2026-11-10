import React, { useState, useEffect } from 'react';
import { Villager, InventorySlot } from '../types/game';
import { soundManager } from '../utils/audio';
import { X, Gift, MessageCircle, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VillagerDialogModalProps {
  villager: Villager | null;
  onClose: () => void;
  inventory: InventorySlot[];
  onGiftItem: (item: InventorySlot) => void;
  onOpenShop?: () => void;
  onOpenMuseum?: () => void;
}

export const VillagerDialogModal: React.FC<VillagerDialogModalProps> = ({
  villager,
  onClose,
  inventory,
  onGiftItem,
  onOpenShop,
  onOpenMuseum,
}) => {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showGiftPicker, setShowGiftPicker] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!villager) return;
    const fullText = villager.dialogues[dialogueIndex % villager.dialogues.length];
    setDisplayedText('');
    setIsTyping(true);

    let charIdx = 0;
    const timer = setInterval(() => {
      if (charIdx < fullText.length) {
        const nextChar = fullText.charAt(charIdx);
        setDisplayedText((prev) => prev + nextChar);
        soundManager.playAnimalese(nextChar, villager.personality === 'sweet' ? 1.3 : 1.0);
        charIdx++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 32);

    return () => clearInterval(timer);
  }, [villager, dialogueIndex]);

  if (!villager) return null;

  const handleNextDialogue = () => {
    if (isTyping) {
      // Complete instantly
      setDisplayedText(villager.dialogues[dialogueIndex % villager.dialogues.length]);
      setIsTyping(false);
    } else {
      setDialogueIndex((prev) => prev + 1);
    }
  };

  const handleSendGift = (slot: InventorySlot) => {
    soundManager.playCelebrationFanfare();
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 },
    });
    onGiftItem(slot);
    setShowGiftPicker(false);
    setDisplayedText(`와아~! ${slot.item.name}을(를) 나한테 주는 거야?! 정말 고마워, ${villager.catchphrase}! 소중히 간직할게!`);
  };

  return (
    <div className="fixed inset-x-4 bottom-6 max-w-2xl mx-auto z-50 animate-in fade-in slide-in-from-bottom duration-200">
      {/* Dialogue Box */}
      <div className="relative bg-amber-50/95 backdrop-blur-md rounded-3xl border-4 border-amber-900/60 shadow-2xl p-5 flex flex-col gap-3">
        {/* Nameplate & Portrait Badge */}
        <div className="flex items-center justify-between -mt-9">
          <div className="flex items-center gap-2">
            <div className="w-14 h-14 rounded-full border-4 border-amber-900/40 bg-white shadow-lg overflow-hidden flex items-center justify-center">
              <img
                src={villager.portrait}
                alt={villager.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="px-4 py-1 text-white font-black text-sm rounded-2xl shadow-md border-2 border-white flex items-center gap-1.5"
              style={{ backgroundColor: villager.color }}
            >
              <span>{villager.name}</span>
              <span className="text-[10px] opacity-80">({villager.species})</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full border border-amber-300 shadow-sm text-xs font-bold text-amber-900">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>친밀도: {villager.friendship}</span>
            <button
              onClick={onClose}
              className="ml-2 p-1 hover:bg-amber-100 rounded-full text-slate-500 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div
          onClick={handleNextDialogue}
          className="min-h-16 py-2 px-1 cursor-pointer select-none"
        >
          <p className="font-gaegu text-xl sm:text-2xl text-slate-900 font-bold leading-relaxed">
            "{displayedText}"
          </p>
          {!isTyping && (
            <div className="flex justify-end">
              <span className="text-xs text-amber-800/80 animate-pulse font-semibold">
                ▶ 계속 이야기하기 (클릭)
              </span>
            </div>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center justify-end gap-2 border-t border-amber-200/80 pt-2.5">
          {villager.id === 'tom_nook' && onOpenShop && (
            <button
              onClick={() => {
                onClose();
                onOpenShop();
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1 active:scale-95 transition"
            >
              <span>상점 물건 구경하기 🍃</span>
            </button>
          )}

          {villager.id === 'blathers' && onOpenMuseum && (
            <button
              onClick={() => {
                onClose();
                onOpenMuseum();
              }}
              className="px-3 py-1.5 bg-stone-700 hover:bg-stone-800 text-amber-100 rounded-xl text-xs font-bold shadow flex items-center gap-1 active:scale-95 transition"
            >
              <span>박물관 입장 & 기증 🏛️</span>
            </button>
          )}

          <button
            onClick={() => setShowGiftPicker(!showGiftPicker)}
            className="px-3 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-xl text-xs font-bold shadow flex items-center gap-1 active:scale-95 transition"
          >
            <Gift className="w-3.5 h-3.5 text-rose-600" />
            <span>선물 건네기</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white hover:bg-amber-100 text-slate-700 rounded-xl text-xs font-bold border border-amber-200 transition"
          >
            대화 마치기
          </button>
        </div>

        {/* Gift Picker Drawer */}
        {showGiftPicker && (
          <div className="p-3 bg-white rounded-2xl border border-amber-200 shadow-inner mt-1">
            <span className="text-xs font-bold text-slate-700 block mb-2">
              건넬 선물을 선택하세요:
            </span>
            {inventory.length === 0 ? (
              <p className="text-xs text-slate-400">주머니에 줄 수 있는 물건이 없습니다.</p>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
                {inventory.map((slot) => (
                  <button
                    key={slot.item.id}
                    onClick={() => handleSendGift(slot)}
                    className="p-1.5 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 flex items-center gap-1.5 text-xs font-bold text-slate-800 transition active:scale-95"
                  >
                    <span>{slot.item.icon}</span>
                    <span>{slot.item.name}</span>
                    <span className="text-[10px] text-slate-500">x{slot.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
