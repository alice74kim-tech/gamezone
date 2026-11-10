import React, { useState, useEffect } from 'react';
import {
  TileType,
  PlacedItem,
  ToolType,
  DesignerBrushType,
  InventorySlot,
  Villager,
  FlyingBalloon,
} from './types/game';
import {
  createInitialTiles,
  createInitialPlacedItems,
  ITEMS,
  CRITTERS,
  VILLAGERS,
  MAP_WIDTH,
  MAP_HEIGHT,
} from './data/gameData';
import { soundManager } from './utils/audio';
import { IslandCanvas } from './components/IslandCanvas';
import { IslandDesignerToolbar } from './components/IslandDesignerToolbar';
import { HUD } from './components/HUD';
import { NookShopModal } from './components/NookShopModal';
import { MuseumModal } from './components/MuseumModal';
import { HouseInteriorModal } from './components/HouseInteriorModal';
import { NookPhoneModal } from './components/NookPhoneModal';
import { DIYWorkbenchModal } from './components/DIYWorkbenchModal';
import { VillagerDialogModal } from './components/VillagerDialogModal';

export default function App() {
  // Game World State
  const [tiles, setTiles] = useState<TileType[][]>(createInitialTiles);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>(createInitialPlacedItems);
  const [playerPos, setPlayerPos] = useState({ x: 5, y: 8 });
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset' | 'night'>('day');
  const [isMuted, setIsMuted] = useState(false);

  // Player Economy & Progression
  const [bells, setBells] = useState<number>(3500);
  const [nookMiles, setNookMiles] = useState<number>(1200);
  const [houseTier, setHouseTier] = useState<number>(1);
  const [completedMiles, setCompletedMiles] = useState<string[]>([]);
  const [inventory, setInventory] = useState<InventorySlot[]>([
    { item: ITEMS.tool_rod, count: 1 },
    { item: ITEMS.tool_net, count: 1 },
    { item: ITEMS.tool_shovel, count: 1 },
    { item: ITEMS.fruit_apple, count: 5 },
    { item: ITEMS.mat_wood, count: 10 },
    { item: ITEMS.mat_stone, count: 6 },
  ]);

  // Critters and Museum Collection
  const [caughtCritters, setCaughtCritters] = useState<string[]>([
    'fish_crucian_carp',
    'bug_common_butterfly',
    'fossil_ammonite',
  ]);
  const [donatedCritters, setDonatedCritters] = useState<string[]>([
    'fossil_ammonite',
  ]);

  // Equipped Tool & Island Designer
  const [equippedTool, setEquippedTool] = useState<ToolType>('rod');
  const [isDesignerOpen, setIsDesignerOpen] = useState(false);
  const [designerBrush, setDesignerBrush] = useState<DesignerBrushType>('stone_path');
  const [selectedBuildingToPlace, setSelectedBuildingToPlace] = useState<string | null>(null);
  const [selectedFurnitureToPlace, setSelectedFurnitureToPlace] = useState<string | null>(null);
  const [selectedPlacedItem, setSelectedPlacedItem] = useState<PlacedItem | null>(null);

  // Modals
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isMuseumOpen, setIsMuseumOpen] = useState(false);
  const [isHouseInteriorOpen, setIsHouseInteriorOpen] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [isWorkbenchOpen, setIsWorkbenchOpen] = useState(false);
  const [activeVillager, setActiveVillager] = useState<Villager | null>(null);

  // Start peaceful BGM on first interaction
  useEffect(() => {
    const handleFirstClick = () => {
      soundManager.startBGM();
      window.removeEventListener('click', handleFirstClick);
    };
    window.addEventListener('click', handleFirstClick);
    return () => window.removeEventListener('click', handleFirstClick);
  }, []);

  // Keyboard shortcut listener for tools (1-6)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (e.key === '1') setEquippedTool('rod');
      if (e.key === '2') setEquippedTool('net');
      if (e.key === '3') setEquippedTool('shovel');
      if (e.key === '4') setEquippedTool('axe');
      if (e.key === '5') setEquippedTool('slingshot');
      if (e.key === '6') {
        setIsDesignerOpen((prev) => !prev);
        setEquippedTool(isDesignerOpen ? 'none' : 'designer');
      }
      if (e.key === 'Escape') {
        setIsDesignerOpen(false);
        setSelectedBuildingToPlace(null);
        setSelectedFurnitureToPlace(null);
        setSelectedPlacedItem(null);
        setIsShopOpen(false);
        setIsMuseumOpen(false);
        setIsHouseInteriorOpen(false);
        setIsPhoneOpen(false);
        setIsWorkbenchOpen(false);
        setActiveVillager(null);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isDesignerOpen]);

  // Handle Tile Click in Island Designer or placement mode
  const handleTileClick = (x: number, y: number) => {
    // 1. If building relocation is selected
    if (selectedBuildingToPlace) {
      soundManager.playDesignerChime();
      if (selectedBuildingToPlace === 'bridge') {
        // Place new bridge across river
        const newBridge: PlacedItem = {
          id: 'bridge_' + Date.now(),
          itemId: 'building_bridge',
          x,
          y,
          rotation: 0,
          type: 'bridge',
        };
        setPlacedItems((prev) => [...prev, newBridge]);
      } else {
        // Relocate existing building
        setPlacedItems((prev) =>
          prev.map((item) => {
            if (item.type === 'building' && item.buildingType === selectedBuildingToPlace) {
              return { ...item, x, y };
            }
            return item;
          })
        );
      }
      setSelectedBuildingToPlace(null);
      return;
    }

    // 2. If furniture placement is selected
    if (selectedFurnitureToPlace) {
      soundManager.playDesignerChime();
      const newFurniture: PlacedItem = {
        id: 'furn_' + Date.now(),
        itemId: selectedFurnitureToPlace,
        x,
        y,
        rotation: 0,
        type: 'furniture',
      };
      setPlacedItems((prev) => [...prev, newFurniture]);
      return;
    }

    // 3. Terrain modification
    if (equippedTool === 'designer' || isDesignerOpen) {
      if (designerBrush === 'demolish') {
        // Remove item on tile or revert path to grass
        setPlacedItems((prev) => prev.filter((i) => i.x !== x || i.y !== y));
        setTiles((prev) => {
          const next = prev.map((row) => [...row]);
          if (next[y]) next[y][x] = 'grass';
          return next;
        });
      } else {
        setTiles((prev) => {
          const next = prev.map((row) => [...row]);
          if (next[y]) next[y][x] = designerBrush as TileType;
          return next;
        });
      }
    }
  };

  // Interact with placed items (Enter building, shake tree, select for rotation)
  const handleInteractPlacedItem = (item: PlacedItem) => {
    if (isDesignerOpen) {
      setSelectedPlacedItem(item);
      return;
    }

    // If clicking a building in normal mode
    if (item.type === 'building') {
      if (item.buildingType === 'house') {
        setIsHouseInteriorOpen(true);
      } else if (item.buildingType === 'shop') {
        setIsShopOpen(true);
      } else if (item.buildingType === 'museum') {
        setIsMuseumOpen(true);
      } else if (item.buildingType === 'town_hall') {
        setIsPhoneOpen(true);
      } else if (item.buildingType === 'villager_house') {
        const villager = VILLAGERS.find((v) => v.houseX === item.x || Math.abs(v.houseX - item.x) <= 2) || VILLAGERS[2];
        setActiveVillager(villager);
      }
      return;
    }

    // If shaking fruit tree
    if (item.type === 'tree') {
      if (item.treeState?.hasFruit) {
        const fruitType = item.treeState.fruitType || 'apple';
        const fruitItemId = fruitType === 'apple' ? 'fruit_apple' : fruitType === 'cherry' ? 'fruit_cherry' : 'fruit_peach';
        const fruitItem = ITEMS[fruitItemId] || ITEMS.fruit_apple;

        // Add fruit to inventory
        addItemToInventory(fruitItem, 2);

        // Remove fruit from tree
        setPlacedItems((prev) =>
          prev.map((t) => (t.id === item.id ? { ...t, treeState: { ...t.treeState!, hasFruit: false } } : t))
        );
      } else {
        // Drop wood branches
        addItemToInventory(ITEMS.mat_branch, 1);
      }
    }
  };

  // Helper to add item to inventory
  const addItemToInventory = (item: typeof ITEMS[string], count = 1) => {
    setInventory((prev) => {
      const existing = prev.find((s) => s.item.id === item.id);
      if (existing) {
        return prev.map((s) => (s.item.id === item.id ? { ...s, count: s.count + count } : s));
      }
      return [...prev, { item, count }];
    });
  };

  // Catch Critter handler
  const handleCatchCritter = (critterId: string, type: 'fish' | 'bug') => {
    if (!caughtCritters.includes(critterId)) {
      setCaughtCritters((prev) => [...prev, critterId]);
    }
    const critterDef = CRITTERS[critterId];
    if (critterDef) {
      const itemDef: typeof ITEMS[string] = {
        id: critterDef.id,
        name: critterDef.name,
        category: 'creature',
        description: critterDef.catchQuote,
        price: critterDef.sellPrice,
        icon: critterDef.icon,
      };
      addItemToInventory(itemDef, 1);
    }
  };

  // Dig Fossil handler
  const handleDigFossil = () => {
    const fossils = ['fossil_trex', 'fossil_triceratops', 'fossil_ammonite', 'fossil_trilobite'];
    const randomFossilId = fossils[Math.floor(Math.random() * fossils.length)];
    if (!caughtCritters.includes(randomFossilId)) {
      setCaughtCritters((prev) => [...prev, randomFossilId]);
    }
    const fossilDef = CRITTERS[randomFossilId];
    if (fossilDef) {
      const itemDef: typeof ITEMS[string] = {
        id: fossilDef.id,
        name: fossilDef.name,
        category: 'fossil',
        description: fossilDef.catchQuote,
        price: fossilDef.sellPrice,
        icon: fossilDef.icon,
      };
      addItemToInventory(itemDef, 1);
    }
  };

  // Pop Balloon handler
  const handlePopBalloon = () => {
    setBells((prev) => prev + 1000);
    addItemToInventory(ITEMS.furn_tea_stall, 1);
  };

  // Talk to Villager handler
  const handleTalkToVillager = (villagerId: string) => {
    const villager = VILLAGERS.find((v) => v.id === villagerId);
    if (villager) {
      soundManager.playAnimalese(villager.name);
      setActiveVillager(villager);
    }
  };

  // Rotate Placed Item
  const handleRotateItem = (item: PlacedItem) => {
    setPlacedItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, rotation: ((i.rotation + 90) % 360) as 0 | 90 | 180 | 270 } : i))
    );
  };

  // Remove Placed Item
  const handleRemoveItem = (item: PlacedItem) => {
    setPlacedItems((prev) => prev.filter((i) => i.id !== item.id));
    setSelectedPlacedItem(null);
  };

  // Add Tree in Designer
  const handleAddTree = (fruitType: 'apple' | 'cherry' | 'peach' | 'bell' = 'apple') => {
    soundManager.playDesignerChime();
    const newTree: PlacedItem = {
      id: 'tree_' + Date.now(),
      itemId: 'tree_' + fruitType,
      x: Math.round(playerPos.x) + 1,
      y: Math.round(playerPos.y),
      rotation: 0,
      type: 'tree',
      treeState: { fruitType, hasFruit: true, woodChopsLeft: 3 },
    };
    setPlacedItems((prev) => [...prev, newTree]);
  };

  // Add Flower in Designer
  const handleAddFlower = (type: 'tulip' | 'rose' | 'cosmos' | 'pansy', color: string) => {
    soundManager.playDesignerChime();
    const newFlower: PlacedItem = {
      id: 'flower_' + Date.now(),
      itemId: 'flower_' + type,
      x: Math.round(playerPos.x) + 1,
      y: Math.round(playerPos.y),
      rotation: 0,
      type: 'flower',
      flowerType: type,
      flowerColor: color as 'red' | 'white' | 'yellow' | 'pink' | 'blue',
    };
    setPlacedItems((prev) => [...prev, newFlower]);
  };

  // Craft DIY Item
  const handleCraftItem = (resultItemId: string, materialsUsed: { itemId: string; count: number }[]) => {
    // Deduct materials from inventory
    setInventory((prev) => {
      let updated = [...prev];
      materialsUsed.forEach((mat) => {
        updated = updated
          .map((s) => (s.item.id === mat.itemId ? { ...s, count: s.count - mat.count } : s))
          .filter((s) => s.count > 0);
      });

      // Add crafted item
      const itemDef = ITEMS[resultItemId];
      if (itemDef) {
        const existing = updated.find((s) => s.item.id === itemDef.id);
        if (existing) {
          return updated.map((s) => (s.item.id === itemDef.id ? { ...s, count: s.count + 1 } : s));
        }
        return [...updated, { item: itemDef, count: 1 }];
      }
      return updated;
    });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#55b766] flex flex-col font-sans select-none">
      {/* Top Bar HUD */}
      <HUD
        bells={bells}
        nookMiles={nookMiles}
        equippedTool={equippedTool}
        onSelectTool={(tool) => setEquippedTool(tool)}
        isDesignerOpen={isDesignerOpen}
        onToggleDesigner={() => {
          const next = !isDesignerOpen;
          setIsDesignerOpen(next);
          setEquippedTool(next ? 'designer' : 'rod');
        }}
        onOpenHouseInterior={() => setIsHouseInteriorOpen(true)}
        onOpenShop={() => setIsShopOpen(true)}
        onOpenMuseum={() => setIsMuseumOpen(true)}
        onOpenPhone={() => setIsPhoneOpen(true)}
        onOpenWorkbench={() => setIsWorkbenchOpen(true)}
        timeOfDay={timeOfDay}
        onToggleTimeOfDay={() => {
          setTimeOfDay((prev) => (prev === 'day' ? 'sunset' : prev === 'sunset' ? 'night' : 'day'));
        }}
        isMuted={isMuted}
        onToggleMute={() => {
          const muted = soundManager.toggleMute();
          setIsMuted(muted);
        }}
      />

      {/* Main Interactive Island Canvas */}
      <main className="flex-1 w-full h-full pt-14">
        <IslandCanvas
          tiles={tiles}
          placedItems={placedItems}
          equippedTool={equippedTool}
          designerBrush={designerBrush}
          selectedBuildingToPlace={selectedBuildingToPlace}
          selectedFurnitureToPlace={selectedFurnitureToPlace}
          onTileClick={handleTileClick}
          onInteractPlacedItem={handleInteractPlacedItem}
          onCatchCritter={handleCatchCritter}
          onDigFossil={handleDigFossil}
          onPopBalloon={handlePopBalloon}
          onTalkToVillager={handleTalkToVillager}
          playerPos={playerPos}
          setPlayerPos={setPlayerPos}
          timeOfDay={timeOfDay}
        />
      </main>

      {/* Island Designer Toolbar (when helmet mode is active) */}
      <IslandDesignerToolbar
        isOpen={isDesignerOpen}
        onClose={() => {
          setIsDesignerOpen(false);
          setEquippedTool('rod');
          setSelectedBuildingToPlace(null);
          setSelectedFurnitureToPlace(null);
        }}
        activeBrush={designerBrush}
        onSelectBrush={(brush) => setDesignerBrush(brush)}
        selectedBuildingToPlace={selectedBuildingToPlace}
        onSelectBuildingToPlace={(b) => setSelectedBuildingToPlace(b)}
        selectedFurnitureToPlace={selectedFurnitureToPlace}
        onSelectFurnitureToPlace={(f) => setSelectedFurnitureToPlace(f)}
        selectedPlacedItem={selectedPlacedItem}
        onRotateItem={handleRotateItem}
        onRemoveItem={handleRemoveItem}
        onAddTree={handleAddTree}
        onAddFlower={handleAddFlower}
      />

      {/* Modals */}
      <NookShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        bells={bells}
        onBellsChange={setBells}
        inventory={inventory}
        onInventoryChange={setInventory}
        houseTier={houseTier}
        onUpgradeHouse={() => setHouseTier(2)}
      />

      <MuseumModal
        isOpen={isMuseumOpen}
        onClose={() => setIsMuseumOpen(false)}
        inventory={inventory}
        onDonateCritter={(critterId) => {
          setDonatedCritters((prev) => [...prev, critterId]);
          // Remove from inventory
          const critterDef = CRITTERS[critterId];
          if (critterDef) {
            setInventory((prev) =>
              prev
                .map((s) => (s.item.name === critterDef.name ? { ...s, count: s.count - 1 } : s))
                .filter((s) => s.count > 0)
            );
          }
        }}
        donatedCritters={donatedCritters}
      />

      <HouseInteriorModal
        isOpen={isHouseInteriorOpen}
        onClose={() => setIsHouseInteriorOpen(false)}
        houseTier={houseTier}
      />

      <NookPhoneModal
        isOpen={isPhoneOpen}
        onClose={() => setIsPhoneOpen(false)}
        caughtCritters={caughtCritters}
        donatedCritters={donatedCritters}
        nookMiles={nookMiles}
        onClaimMile={(id, reward) => {
          setCompletedMiles((prev) => [...prev, id]);
          setNookMiles((prev) => prev + reward);
        }}
        completedMiles={completedMiles}
        placedItems={placedItems}
        tiles={tiles}
      />

      <DIYWorkbenchModal
        isOpen={isWorkbenchOpen}
        onClose={() => setIsWorkbenchOpen(false)}
        inventory={inventory}
        onCraftItem={handleCraftItem}
      />

      <VillagerDialogModal
        villager={activeVillager}
        onClose={() => setActiveVillager(null)}
        inventory={inventory}
        onGiftItem={(giftSlot) => {
          setInventory((prev) =>
            prev
              .map((s) => (s.item.id === giftSlot.item.id ? { ...s, count: s.count - 1 } : s))
              .filter((s) => s.count > 0)
          );
          if (activeVillager) {
            activeVillager.friendship += 15;
          }
        }}
        onOpenShop={() => setIsShopOpen(true)}
        onOpenMuseum={() => setIsMuseumOpen(true)}
      />
    </div>
  );
}
