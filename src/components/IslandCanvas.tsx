import React, { useRef, useEffect, useState, useCallback } from 'react';
import { TileType, PlacedItem, ToolType, DesignerBrushType, LiveCritter, FlyingBalloon } from '../types/game';
import { soundManager } from '../utils/audio';
import { ITEMS, MAP_WIDTH, MAP_HEIGHT, CRITTERS } from '../data/gameData';

interface IslandCanvasProps {
  tiles: TileType[][];
  placedItems: PlacedItem[];
  equippedTool: ToolType;
  designerBrush: DesignerBrushType;
  selectedBuildingToPlace: string | null;
  selectedFurnitureToPlace: string | null;
  onTileClick: (x: number, y: number) => void;
  onInteractPlacedItem: (item: PlacedItem) => void;
  onCatchCritter: (critterId: string, type: 'fish' | 'bug') => void;
  onDigFossil: (x: number, y: number) => void;
  onPopBalloon: (balloon: FlyingBalloon) => void;
  onTalkToVillager: (villagerId: string) => void;
  playerPos: { x: number; y: number };
  setPlayerPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  timeOfDay: 'day' | 'sunset' | 'night';
}

const TILE_SIZE = 48; // px

export const IslandCanvas: React.FC<IslandCanvasProps> = ({
  tiles,
  placedItems,
  equippedTool,
  designerBrush,
  selectedBuildingToPlace,
  selectedFurnitureToPlace,
  onTileClick,
  onInteractPlacedItem,
  onCatchCritter,
  onDigFossil,
  onPopBalloon,
  onTalkToVillager,
  playerPos,
  setPlayerPos,
  timeOfDay,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverTile, setHoverTile] = useState<{ x: number; y: number } | null>(null);
  const [playerFacing, setPlayerFacing] = useState<'down' | 'up' | 'left' | 'right'>('down');
  const [isWalking, setIsWalking] = useState(false);
  const [actionEffect, setActionEffect] = useState<{ x: number; y: number; text: string; icon: string } | null>(null);

  // Live swimming fish and fluttery bugs
  const [critters, setCritters] = useState<LiveCritter[]>([
    { id: 'fish_1', critterId: 'fish_crucian_carp', type: 'fish', x: 12.3, y: 3.5, vx: 0.02, vy: 0.01, size: 'medium', state: 'wandering' },
    { id: 'fish_2', critterId: 'fish_black_bass', type: 'fish', x: 13.5, y: 7.2, vx: -0.01, vy: 0.02, size: 'large', state: 'wandering' },
    { id: 'fish_3', critterId: 'fish_red_snapper', type: 'fish', x: 7.5, y: 18.5, vx: 0.03, vy: 0.01, size: 'large', state: 'wandering' },
    { id: 'bug_1', critterId: 'bug_common_butterfly', type: 'bug', x: 4.2, y: 6.2, vx: 0.03, vy: -0.02, size: 'small', state: 'wandering' },
    { id: 'bug_2', critterId: 'bug_morpho', type: 'bug', x: 16.5, y: 11.2, vx: -0.02, vy: 0.03, size: 'medium', state: 'wandering' },
    { id: 'bug_3', critterId: 'bug_rhinoceros_beetle', type: 'bug', x: 18.0, y: 4.2, vx: 0, vy: 0, size: 'medium', state: 'wandering' },
  ]);

  // Floating presents
  const [balloons, setBalloons] = useState<FlyingBalloon[]>([
    { id: 'balloon_init', x: -1, y: 5, color: 'red', speed: 0.015 },
  ]);

  // Digging spots (star cracks for fossils)
  const [fossilSpots, setFossilSpots] = useState<{ x: number; y: number }[]>([
    { x: 5, y: 9 },
    { x: 11, y: 15 },
    { x: 21, y: 11 },
  ]);

  // Fishing state
  const [fishingState, setFishingState] = useState<{
    active: boolean;
    bobberX: number;
    bobberY: number;
    targetFishId: string | null;
    nibbles: number;
    canReel: boolean;
  }>({
    active: false,
    bobberX: 0,
    bobberY: 0,
    targetFishId: null,
    nibbles: 0,
    canReel: false,
  });

  // Handle keyboard player movement
  useEffect(() => {
    const keysDown = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      keysDown.add(e.key.toLowerCase());
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'Enter') {
        handleMainAction();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDown.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const moveInterval = window.setInterval(() => {
      if (keysDown.size === 0) {
        setIsWalking(false);
        return;
      }

      let dx = 0;
      let dy = 0;

      if (keysDown.has('arrowup') || keysDown.has('w')) {
        dy -= 0.18;
        setPlayerFacing('up');
      }
      if (keysDown.has('arrowdown') || keysDown.has('s')) {
        dy += 0.18;
        setPlayerFacing('down');
      }
      if (keysDown.has('arrowleft') || keysDown.has('a')) {
        dx -= 0.18;
        setPlayerFacing('left');
      }
      if (keysDown.has('arrowright') || keysDown.has('d')) {
        dx += 0.18;
        setPlayerFacing('right');
      }

      if (dx !== 0 || dy !== 0) {
        setIsWalking(true);
        setPlayerPos((prev) => {
          const newX = Math.max(0.5, Math.min(MAP_WIDTH - 1.5, prev.x + dx));
          const newY = Math.max(0.5, Math.min(MAP_HEIGHT - 1.5, prev.y + dy));

          // Check tile passability
          const tileX = Math.floor(newX);
          const tileY = Math.floor(newY);
          const targetTile = tiles[tileY]?.[tileX];

          // Water is blocked unless on bridge
          const hasBridge = placedItems.some(
            (item) => item.type === 'bridge' && Math.abs(item.x - tileX) <= 1 && Math.abs(item.y - tileY) <= 0.5
          );

          if (targetTile === 'water' && !hasBridge) {
            return prev;
          }

          // Sound effect on footstep
          if (Math.random() < 0.18) {
            const surface = targetTile === 'sand' ? 'sand' : targetTile === 'stone_path' ? 'stone' : targetTile === 'wood_deck' ? 'wood' : 'grass';
            soundManager.playFootstep(surface);
          }

          return { x: newX, y: newY };
        });
      }
    }, 40);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(moveInterval);
    };
  }, [tiles, placedItems]);

  // Center scroll on player
  useEffect(() => {
    if (!containerRef.current) return;
    const px = playerPos.x * TILE_SIZE;
    const py = playerPos.y * TILE_SIZE;
    const viewW = containerRef.current.clientWidth;
    const viewH = containerRef.current.clientHeight;

    containerRef.current.scrollTo({
      left: px - viewW / 2 + TILE_SIZE / 2,
      top: py - viewH / 2 + TILE_SIZE / 2,
      behavior: 'smooth',
    });
  }, [playerPos]);

  // Critter & Balloon physics loop
  useEffect(() => {
    const loop = setInterval(() => {
      // Move swimming fish
      setCritters((prev) =>
        prev.map((c) => {
          let nextX = c.x + c.vx;
          let nextY = c.y + c.vy;

          if (c.type === 'fish') {
            // Check if still in water
            const tx = Math.floor(nextX);
            const ty = Math.floor(nextY);
            if (!tiles[ty] || tiles[ty][tx] !== 'water') {
              return { ...c, vx: -c.vx, vy: -c.vy };
            }
          } else {
            // Bugs flutter around
            if (nextX <= 1 || nextX >= MAP_WIDTH - 2) nextX = c.x - c.vx;
            if (nextY <= 1 || nextY >= MAP_HEIGHT - 2) nextY = c.y - c.vy;
            if (Math.random() < 0.1) {
              return {
                ...c,
                x: nextX,
                y: nextY,
                vx: (Math.random() - 0.5) * 0.08,
                vy: (Math.random() - 0.5) * 0.08,
              };
            }
          }

          return { ...c, x: nextX, y: nextY };
        })
      );

      // Move balloons
      setBalloons((prev) =>
        prev
          .map((b) => ({ ...b, x: b.x + b.speed }))
          .filter((b) => b.x < MAP_WIDTH + 2)
      );

      // Chance to spawn new balloon if none
      if (Math.random() < 0.01) {
        setBalloons((prev) => {
          if (prev.length === 0) {
            return [{
              id: 'balloon_' + Date.now(),
              x: -1,
              y: 3 + Math.random() * 8,
              color: ['red', 'blue', 'yellow', 'green'][Math.floor(Math.random() * 4)] as 'red' | 'blue' | 'yellow' | 'green',
              speed: 0.015,
            }];
          }
          return prev;
        });
      }
    }, 100);

    return () => clearInterval(loop);
  }, [tiles]);

  // Main Action trigger (Space or action button)
  const handleMainAction = useCallback(() => {
    const frontTile = getTileInFront(playerPos, playerFacing);

    // If Slingshot equipped -> check for balloons overhead
    if (equippedTool === 'slingshot') {
      const hitBalloon = balloons.find((b) => Math.hypot(b.x - playerPos.x, b.y - playerPos.y) < 2.5);
      if (hitBalloon) {
        soundManager.playBalloonPop();
        onPopBalloon(hitBalloon);
        setBalloons((prev) => prev.filter((b) => b.id !== hitBalloon.id));
        triggerEffect(playerPos.x, playerPos.y - 1, '선물 격추!', '🎁');
        return;
      }
    }

    // If Fishing Rod equipped
    if (equippedTool === 'rod') {
      if (fishingState.active) {
        // Try reeling in
        if (fishingState.canReel && fishingState.targetFishId) {
          const fish = critters.find((c) => c.id === fishingState.targetFishId);
          if (fish) {
            soundManager.playCelebrationFanfare();
            onCatchCritter(fish.critterId, 'fish');
            setCritters((prev) => prev.filter((c) => c.id !== fish.id));
            triggerEffect(playerPos.x, playerPos.y - 0.5, '물고기를 낚았다!', '🎣');
          }
        }
        setFishingState({ active: false, bobberX: 0, bobberY: 0, targetFishId: null, nibbles: 0, canReel: false });
      } else {
        // Cast bobber
        const targetTile = tiles[frontTile.y]?.[frontTile.x];
        if (targetTile === 'water') {
          soundManager.playSplash();
          const nearbyFish = critters.find(
            (c) => c.type === 'fish' && Math.hypot(c.x - frontTile.x, c.y - frontTile.y) < 2.0
          );
          setFishingState({
            active: true,
            bobberX: frontTile.x + 0.5,
            bobberY: frontTile.y + 0.5,
            targetFishId: nearbyFish ? nearbyFish.id : null,
            nibbles: 0,
            canReel: false,
          });

          // Simulate fish nibble after short wait
          if (nearbyFish) {
            setTimeout(() => {
              soundManager.playBiteNibble();
              setFishingState((st) => ({ ...st, nibbles: 1 }));
              setTimeout(() => {
                soundManager.playSplash();
                setFishingState((st) => ({ ...st, nibbles: 2, canReel: true }));
                // Give 1.5 seconds to reel in
                setTimeout(() => {
                  setFishingState((st) => ({ ...st, canReel: false }));
                }, 1500);
              }, 1200);
            }, 1000);
          }
        }
      }
      return;
    }

    // If Net equipped -> catch flying bugs
    if (equippedTool === 'net') {
      soundManager.playNetSwoosh();
      const nearbyBug = critters.find(
        (c) => c.type === 'bug' && Math.hypot(c.x - playerPos.x, c.y - playerPos.y) < 1.8
      );
      if (nearbyBug) {
        soundManager.playCelebrationFanfare();
        onCatchCritter(nearbyBug.critterId, 'bug');
        setCritters((prev) => prev.filter((c) => c.id !== nearbyBug.id));
        triggerEffect(playerPos.x, playerPos.y - 0.5, '곤충을 잡았다!', '🦋');
        return;
      }
    }

    // If Shovel equipped -> check for fossil star spot or hit rock
    if (equippedTool === 'shovel') {
      soundManager.playDig();
      const fossilIndex = fossilSpots.findIndex(
        (f) => Math.hypot(f.x - frontTile.x, f.y - frontTile.y) < 1.0
      );
      if (fossilIndex !== -1) {
        soundManager.playCelebrationFanfare();
        const spot = fossilSpots[fossilIndex];
        setFossilSpots((prev) => prev.filter((_, idx) => idx !== fossilIndex));
        onDigFossil(spot.x, spot.y);
        triggerEffect(frontTile.x, frontTile.y, '화석을 발굴했다!', '🦖');
        return;
      }

      // Check rock
      const rock = placedItems.find(
        (item) => item.type === 'rock' && Math.hypot(item.x - frontTile.x, item.y - frontTile.y) < 1.0
      );
      if (rock) {
        soundManager.playCoin();
        triggerEffect(frontTile.x, frontTile.y, '철광석 & 벨 획득!', '🔩');
        return;
      }
    }

    // Check item in front to shake tree or interact
    const frontItem = placedItems.find(
      (item) => Math.hypot(item.x - frontTile.x, item.y - frontTile.y) < 1.2
    );
    if (frontItem) {
      if (frontItem.type === 'tree') {
        soundManager.playTreeShake();
        if (frontItem.treeState?.hasFruit) {
          triggerEffect(frontItem.x, frontItem.y - 1, '과일 수확!', '🍎');
        } else {
          triggerEffect(frontItem.x, frontItem.y - 1, '나뭇가지 획득!', '🌿');
        }
      }
      onInteractPlacedItem(frontItem);
      return;
    }

    // Check villager nearby
    const villagersAtPos = [
      { id: 'tom_nook', x: 16, y: 9 },
      { id: 'blathers', x: 8, y: 6 },
      { id: 'raymond', x: 18, y: 13 },
      { id: 'flurry', x: 7, y: 14 },
    ];
    const nearVillager = villagersAtPos.find(
      (v) => Math.hypot(v.x - playerPos.x, v.y - playerPos.y) < 1.8
    );
    if (nearVillager) {
      onTalkToVillager(nearVillager.id);
    }
  }, [playerPos, playerFacing, equippedTool, balloons, fishingState, critters, fossilSpots, placedItems, tiles, onCatchCritter, onDigFossil, onPopBalloon, onInteractPlacedItem, onTalkToVillager]);

  const triggerEffect = (x: number, y: number, text: string, icon: string) => {
    setActionEffect({ x, y, text, icon });
    setTimeout(() => setActionEffect(null), 1800);
  };

  const getTileInFront = (pos: { x: number; y: number }, facing: string) => {
    let fx = Math.round(pos.x);
    let fy = Math.round(pos.y);
    if (facing === 'up') fy -= 1;
    if (facing === 'down') fy += 1;
    if (facing === 'left') fx -= 1;
    if (facing === 'right') fx += 1;
    return { x: Math.max(0, Math.min(MAP_WIDTH - 1, fx)), y: Math.max(0, Math.min(MAP_HEIGHT - 1, fy)) };
  };

  // Canvas tile click (designer mode or placement)
  const handleTileClickInternal = (x: number, y: number) => {
    if (equippedTool === 'designer' || selectedBuildingToPlace || selectedFurnitureToPlace) {
      soundManager.playDesignerChime();
      onTileClick(x, y);
    } else {
      // Tap to walk towards clicked tile
      setPlayerPos({ x, y });
      setIsWalking(true);
      setTimeout(() => setIsWalking(false), 200);
    }
  };

  // Lighting overlay based on time of day
  const timeOverlayClass = {
    day: 'bg-transparent',
    sunset: 'bg-amber-600/15 pointer-events-none mix-blend-color-burn',
    night: 'bg-indigo-950/40 pointer-events-none mix-blend-multiply',
  }[timeOfDay];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-auto bg-[#388e3c] select-none cursor-pointer"
      onMouseMove={(e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const scrollLeft = containerRef.current.scrollLeft;
        const scrollTop = containerRef.current.scrollTop;
        const mouseX = e.clientX - rect.left + scrollLeft;
        const mouseY = e.clientY - rect.top + scrollTop;
        const tx = Math.floor(mouseX / TILE_SIZE);
        const ty = Math.floor(mouseY / TILE_SIZE);
        if (tx >= 0 && tx < MAP_WIDTH && ty >= 0 && ty < MAP_HEIGHT) {
          setHoverTile({ x: tx, y: ty });
        }
      }}
    >
      {/* Map Board */}
      <div
        className="relative shadow-2xl transition-all duration-300"
        style={{
          width: MAP_WIDTH * TILE_SIZE,
          height: MAP_HEIGHT * TILE_SIZE,
        }}
      >
        {/* Render Grid Tiles */}
        {tiles.map((row, y) => (
          <div key={`row-${y}`} className="flex">
            {row.map((tileType, x) => {
              const isFront = hoverTile?.x === x && hoverTile?.y === y;
              return (
                <div
                  key={`tile-${x}-${y}`}
                  onClick={() => handleTileClickInternal(x, y)}
                  style={{ width: TILE_SIZE, height: TILE_SIZE }}
                  className={`relative shrink-0 transition-colors ${getTileClass(tileType)} ${
                    isFront && equippedTool === 'designer' ? 'ring-2 ring-yellow-400 ring-inset z-10' : ''
                  }`}
                >
                  {/* Subtle grass triangle pattern */}
                  {tileType === 'grass' && (
                    <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
                      <span className="text-[10px] text-emerald-900 select-none">▲</span>
                    </div>
                  )}

                  {/* Water waves effect */}
                  {tileType === 'water' && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 animate-water-wiggle pointer-events-none">
                      <div className="w-6 h-1 bg-white/70 rounded-full" />
                    </div>
                  )}

                  {/* Sand shell detail */}
                  {tileType === 'sand' && (x + y) % 7 === 0 && (
                    <div className="absolute bottom-1 right-1 opacity-70 text-[10px] pointer-events-none">
                      🐚
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Fossil Star Dig Spots */}
        {fossilSpots.map((spot, idx) => (
          <div
            key={`fossil-${idx}`}
            className="absolute z-10 pointer-events-none flex items-center justify-center animate-bounce"
            style={{
              left: spot.x * TILE_SIZE + 12,
              top: spot.y * TILE_SIZE + 12,
              width: 24,
              height: 24,
            }}
          >
            <span className="text-amber-800 font-bold text-lg select-none drop-shadow">✦</span>
          </div>
        ))}

        {/* Live Critters (Fish & Bugs) */}
        {critters.map((c) => (
          <div
            key={c.id}
            className={`absolute z-15 pointer-events-none transition-transform duration-200 ${
              c.type === 'bug' ? 'animate-float-bob' : 'opacity-70'
            }`}
            style={{
              left: c.x * TILE_SIZE,
              top: c.y * TILE_SIZE,
              width: TILE_SIZE,
              height: TILE_SIZE,
            }}
          >
            {c.type === 'fish' ? (
              // Fish silhouette swimming under water
              <div
                className="w-7 h-3 bg-slate-900/40 rounded-full blur-[0.5px] shadow-sm transform"
                style={{
                  transform: `rotate(${Math.atan2(c.vy, c.vx)}rad) scale(${c.size === 'large' ? 1.4 : 1})`,
                }}
              />
            ) : (
              // Bug emoji fluttering
              <div className="text-xl filter drop-shadow">
                {CRITTERS[c.critterId]?.icon || '🦋'}
              </div>
            )}
          </div>
        ))}

        {/* Fishing Bobber */}
        {fishingState.active && (
          <div
            className={`absolute z-20 pointer-events-none transition-all ${
              fishingState.nibbles > 0 ? 'animate-ping' : 'animate-bounce'
            }`}
            style={{
              left: fishingState.bobberX * TILE_SIZE - 8,
              top: fishingState.bobberY * TILE_SIZE - 8,
            }}
          >
            <div className="w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-lg flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
            {fishingState.canReel && (
              <div className="absolute -top-7 -left-4 px-2 py-0.5 bg-yellow-400 text-slate-900 font-black text-xs rounded-full animate-bounce shadow">
                잡아라!
              </div>
            )}
          </div>
        )}

        {/* Placed Items (Buildings, Trees, Furniture, Flowers, Rocks) */}
        {placedItems.map((item) => (
          <PlacedItemView
            key={item.id}
            item={item}
            onClick={() => onInteractPlacedItem(item)}
          />
        ))}

        {/* NPC Villagers */}
        <VillagerAvatar
          name="너굴"
          species="너구리"
          x={16}
          y={9}
          color="#059669"
          emoji="🦝"
          onClick={() => onTalkToVillager('tom_nook')}
        />
        <VillagerAvatar
          name="부엉"
          species="부엉이"
          x={8}
          y={6}
          color="#854d0e"
          emoji="🦉"
          onClick={() => onTalkToVillager('blathers')}
        />
        <VillagerAvatar
          name="잭슨"
          species="고양이"
          x={18}
          y={13}
          color="#475569"
          emoji="🐱"
          onClick={() => onTalkToVillager('raymond')}
        />
        <VillagerAvatar
          name="뽀야미"
          species="햄스터"
          x={7}
          y={14}
          color="#ec4899"
          emoji="🐹"
          onClick={() => onTalkToVillager('flurry')}
        />

        {/* Player Character */}
        <div
          className={`absolute z-30 pointer-events-none transition-transform duration-100 flex flex-col items-center justify-center ${
            isWalking ? 'scale-105' : ''
          }`}
          style={{
            left: playerPos.x * TILE_SIZE,
            top: playerPos.y * TILE_SIZE - 12,
            width: TILE_SIZE,
            height: TILE_SIZE + 12,
          }}
        >
          {/* Designer Helmet or cute cap */}
          {equippedTool === 'designer' ? (
            <div className="w-5 h-3 bg-yellow-400 rounded-t-full border border-yellow-600 shadow-sm -mb-1 z-10" />
          ) : (
            <div className="w-4 h-2 bg-emerald-600 rounded-t-full shadow-sm -mb-1 z-10" />
          )}

          {/* Player Body (Cute Chibi Style) */}
          <div className="relative w-8 h-8 bg-amber-100 rounded-full border-2 border-amber-900 shadow-md flex items-center justify-center">
            {/* Eyes */}
            <div className="flex gap-1.5 items-center">
              <div className="w-1.5 h-2 bg-slate-900 rounded-full" />
              <div className="w-1.5 h-2 bg-slate-900 rounded-full" />
            </div>
            {/* Cheeks */}
            <div className="absolute bottom-1.5 left-1 w-1.5 h-1 bg-pink-400 rounded-full opacity-60" />
            <div className="absolute bottom-1.5 right-1 w-1.5 h-1 bg-pink-400 rounded-full opacity-60" />
          </div>

          {/* Clothing & Tool in Hand */}
          <div className="w-6 h-5 bg-teal-600 rounded-b-md border border-teal-800 shadow -mt-1 flex items-center justify-center text-xs">
            {equippedTool !== 'none' && (
              <span className="absolute -right-3 -top-1 text-sm transform rotate-12 filter drop-shadow">
                {getToolIcon(equippedTool)}
              </span>
            )}
          </div>
          {/* Shadow */}
          <div className="w-6 h-2 bg-black/20 rounded-full blur-[1px] mt-0.5" />
        </div>

        {/* Flying Balloons Overhead */}
        {balloons.map((b) => (
          <div
            key={b.id}
            onClick={() => onPopBalloon(b)}
            className="absolute z-40 cursor-pointer animate-float-bob filter drop-shadow-xl flex flex-col items-center"
            style={{
              left: b.x * TILE_SIZE,
              top: b.y * TILE_SIZE - 20,
            }}
          >
            <div
              className={`w-7 h-9 rounded-t-full rounded-b-lg border-2 border-white flex items-center justify-center shadow-lg ${
                b.color === 'red'
                  ? 'bg-rose-500'
                  : b.color === 'blue'
                  ? 'bg-sky-500'
                  : b.color === 'yellow'
                  ? 'bg-amber-400'
                  : 'bg-emerald-500'
              }`}
            >
              <div className="w-2 h-2 bg-white/60 rounded-full -mt-2" />
            </div>
            <div className="w-0.5 h-4 bg-white/70" />
            <div className="w-5 h-5 bg-amber-100 border border-amber-400 rounded shadow text-[10px] flex items-center justify-center">
              🎁
            </div>
          </div>
        ))}

        {/* Action Effect Popups */}
        {actionEffect && (
          <div
            className="absolute z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full animate-bounce flex items-center gap-1.5 px-3 py-1 bg-white/95 text-slate-800 font-bold text-xs rounded-full shadow-lg border border-emerald-400"
            style={{
              left: actionEffect.x * TILE_SIZE + TILE_SIZE / 2,
              top: actionEffect.y * TILE_SIZE,
            }}
          >
            <span className="text-base">{actionEffect.icon}</span>
            <span>{actionEffect.text}</span>
          </div>
        )}

        {/* Time of Day Lighting Filter */}
        <div className={`absolute inset-0 ${timeOverlayClass} transition-colors duration-1000`} />
      </div>

      {/* Floating Action Button for Touch / Mobile */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 sm:hidden">
        <button
          onClick={handleMainAction}
          className="w-16 h-16 bg-emerald-500 text-white font-black text-xl rounded-full shadow-2xl border-4 border-white active:scale-95 flex items-center justify-center"
        >
          {equippedTool !== 'none' ? getToolIcon(equippedTool) : 'A'}
        </button>
      </div>
    </div>
  );
};

function getTileClass(type: TileType): string {
  switch (type) {
    case 'grass':
      return 'bg-[#55b766] border border-[#4ca85c]/40';
    case 'dirt_path':
      return 'bg-[#d2a679] border border-[#c19568]/40';
    case 'stone_path':
      return 'bg-[#94a3b8] border border-[#64748b]/40 shadow-inner';
    case 'brick_path':
      return 'bg-[#c27c62] border border-[#a8654d]/50';
    case 'wood_deck':
      return 'bg-[#b8860b] border border-[#996e00]/50';
    case 'water':
      return 'bg-[#38bdf8] border border-[#0284c7]/40 shadow-inner';
    case 'sand':
      return 'bg-[#fde68a] border border-[#fcd34d]/40';
    case 'cliff':
      return 'bg-[#84cc16] border-t-4 border-amber-900/60 shadow-2xl';
    default:
      return 'bg-[#55b766]';
  }
}

function getToolIcon(tool: ToolType): string {
  switch (tool) {
    case 'rod':
      return '🎣';
    case 'net':
      return '🦋';
    case 'shovel':
      return '⛏️';
    case 'axe':
      return '🪓';
    case 'slingshot':
      return '🎯';
    case 'watering_can':
      return '💧';
    case 'designer':
      return '⛑️';
    default:
      return '';
  }
}

// Placed Item Component
const PlacedItemView: React.FC<{ item: PlacedItem; onClick: () => void }> = ({ item, onClick }) => {
  const isBuilding = item.type === 'building';
  const isTree = item.type === 'tree';
  const isRock = item.type === 'rock';
  const isFlower = item.type === 'flower';
  const isBridge = item.type === 'bridge';

  // Size footprint
  let widthPx = TILE_SIZE;
  let heightPx = TILE_SIZE;

  if (isBuilding) {
    widthPx = TILE_SIZE * 3;
    heightPx = TILE_SIZE * 2.5;
  } else if (isBridge) {
    widthPx = TILE_SIZE * 2;
    heightPx = TILE_SIZE * 1.5;
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`absolute z-20 cursor-pointer transition-transform hover:scale-105 select-none ${
        isBuilding ? 'z-25' : ''
      }`}
      style={{
        left: item.x * TILE_SIZE,
        top: item.y * TILE_SIZE - (isBuilding || isTree ? 16 : 0),
        width: widthPx,
        height: heightPx,
      }}
    >
      {/* Buildings */}
      {isBuilding && (
        <div className="w-full h-full relative flex flex-col items-center justify-end">
          {item.buildingType === 'house' && (
            <div className="relative w-full h-full bg-amber-100 rounded-t-2xl border-4 border-amber-900/80 shadow-2xl flex flex-col items-center justify-end pb-2 overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-10 bg-rose-600 rounded-t-xl border-b-4 border-rose-800 flex items-center justify-center">
                <span className="text-white font-black text-xs">내 집</span>
              </div>
              <div className="w-8 h-12 bg-amber-800 rounded-t-lg border-2 border-amber-950 flex items-center justify-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              </div>
            </div>
          )}

          {item.buildingType === 'shop' && (
            <div className="relative w-full h-full bg-emerald-100 rounded-t-2xl border-4 border-emerald-900/80 shadow-2xl flex flex-col items-center justify-end pb-2 overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-10 bg-emerald-600 rounded-t-xl border-b-4 border-emerald-800 flex items-center justify-center">
                <span className="text-white font-black text-xs">너굴 상점 🍃</span>
              </div>
              <div className="w-10 h-12 bg-amber-700 rounded-t-lg border-2 border-amber-900 flex items-center justify-center">
                <span className="text-xs">🚪</span>
              </div>
            </div>
          )}

          {item.buildingType === 'museum' && (
            <div className="relative w-full h-full bg-stone-200 rounded-t-2xl border-4 border-stone-800 shadow-2xl flex flex-col items-center justify-end pb-2 overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-10 bg-stone-700 rounded-t-xl border-b-4 border-stone-900 flex items-center justify-center">
                <span className="text-white font-black text-xs">박물관 🏛️</span>
              </div>
              <div className="w-10 h-12 bg-stone-800 rounded-t-lg flex items-center justify-center text-amber-300">
                🦉
              </div>
            </div>
          )}

          {item.buildingType === 'town_hall' && (
            <div className="relative w-full h-full bg-orange-100 rounded-t-2xl border-4 border-orange-900/80 shadow-2xl flex flex-col items-center justify-end pb-2 overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-10 bg-orange-500 rounded-t-xl border-b-4 border-orange-700 flex items-center justify-center">
                <span className="text-white font-black text-xs">안내소 광장 ⛳</span>
              </div>
              <div className="w-10 h-12 bg-amber-800 rounded-t-lg flex items-center justify-center">
                🔔
              </div>
            </div>
          )}

          {item.buildingType === 'villager_house' && (
            <div className="relative w-full h-full bg-sky-100 rounded-t-2xl border-4 border-sky-900/80 shadow-xl flex flex-col items-center justify-end pb-2 overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-10 bg-sky-500 rounded-t-xl border-b-4 border-sky-700 flex items-center justify-center">
                <span className="text-white font-black text-xs">이웃 주민의 집</span>
              </div>
              <div className="w-8 h-10 bg-amber-700 rounded-t-lg flex items-center justify-center">
                🚪
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bridge */}
      {isBridge && (
        <div className="w-full h-full bg-amber-800 rounded-lg border-4 border-amber-950 shadow-xl flex items-center justify-around px-2">
          <div className="w-2 h-full bg-amber-900 rounded-sm" />
          <div className="w-2 h-full bg-amber-900 rounded-sm" />
        </div>
      )}

      {/* Trees */}
      {isTree && (
        <div className="relative w-full h-full flex flex-col items-center justify-end">
          {/* Canopy */}
          <div className="w-12 h-12 bg-emerald-600 rounded-full border-2 border-emerald-900 shadow-md flex items-center justify-center relative -mb-2">
            {item.treeState?.hasFruit && (
              <span className="text-sm animate-bounce">
                {item.treeState.fruitType === 'apple'
                  ? '🍎'
                  : item.treeState.fruitType === 'cherry'
                  ? '🍒'
                  : item.treeState.fruitType === 'peach'
                  ? '🍑'
                  : '💰'}
              </span>
            )}
          </div>
          {/* Trunk */}
          <div className="w-4 h-6 bg-amber-900 rounded-sm shadow-sm" />
        </div>
      )}

      {/* Rocks */}
      {isRock && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-9 h-7 bg-stone-500 border-2 border-stone-800 rounded-2xl shadow-md flex items-center justify-center text-xs">
            🪨
          </div>
        </div>
      )}

      {/* Flowers */}
      {isFlower && (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-2xl filter drop-shadow">
            {item.flowerType === 'rose'
              ? '🌹'
              : item.flowerType === 'tulip'
              ? '🌷'
              : item.flowerType === 'cosmos'
              ? '🌸'
              : '🌼'}
          </span>
        </div>
      )}

      {/* Furniture */}
      {item.type === 'furniture' && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="p-1 bg-white/80 rounded-xl shadow-md border border-slate-300 flex items-center justify-center">
            <span className="text-2xl">{ITEMS[item.itemId]?.icon || '📦'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Villager NPC Avatar on Canvas
const VillagerAvatar: React.FC<{
  name: string;
  species: string;
  x: number;
  y: number;
  color: string;
  emoji: string;
  onClick: () => void;
}> = ({ name, x, y, color, emoji, onClick }) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="absolute z-25 cursor-pointer flex flex-col items-center animate-float-bob hover:scale-110 transition-transform"
      style={{
        left: x * TILE_SIZE,
        top: y * TILE_SIZE - 12,
        width: TILE_SIZE,
        height: TILE_SIZE + 12,
      }}
    >
      <div className="px-1.5 py-0.5 bg-white text-slate-800 text-[10px] font-bold rounded-full shadow border border-slate-200 mb-0.5 whitespace-nowrap">
        {name}
      </div>
      <div
        className="w-9 h-9 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-lg"
        style={{ backgroundColor: color }}
      >
        {emoji}
      </div>
    </div>
  );
};
