/**
 * Game types for Animal Forest: Island Designer
 */

export type TileType = 
  | 'grass' 
  | 'dirt_path' 
  | 'stone_path' 
  | 'brick_path' 
  | 'wood_deck' 
  | 'water' 
  | 'sand' 
  | 'cliff';

export type ToolType = 
  | 'none' 
  | 'net' 
  | 'rod' 
  | 'shovel' 
  | 'axe' 
  | 'watering_can' 
  | 'slingshot'
  | 'designer'; // Island Creator helmet mode

export type DesignerBrushType = 
  | 'grass'
  | 'dirt_path'
  | 'stone_path'
  | 'brick_path'
  | 'wood_deck'
  | 'water'
  | 'sand'
  | 'cliff'
  | 'demolish';

export interface GridPos {
  x: number;
  y: number;
}

export interface PlacedItem {
  id: string;
  itemId: string;
  x: number;
  y: number;
  rotation: 0 | 90 | 180 | 270;
  type: 'furniture' | 'tree' | 'flower' | 'rock' | 'building' | 'bridge';
  buildingType?: 'house' | 'shop' | 'museum' | 'town_hall' | 'villager_house';
  treeState?: {
    fruitType?: 'apple' | 'cherry' | 'peach' | 'bell';
    hasFruit: boolean;
    woodChopsLeft: number;
  };
  rockState?: {
    hitsLeft: number;
    isMoneyRock?: boolean;
  };
  flowerType?: 'tulip' | 'cosmos' | 'pansy' | 'rose';
  flowerColor?: 'red' | 'white' | 'yellow' | 'pink' | 'blue';
}

export interface ItemDefinition {
  id: string;
  name: string;
  category: 'tool' | 'furniture' | 'material' | 'fruit' | 'creature' | 'recipe' | 'seed' | 'fossil' | 'misc';
  description: string;
  price: number; // sell price
  buyPrice?: number; // buy price at Nook's
  icon: string; // emoji or SVG key
  color?: string;
  size?: [number, number]; // tile footprint width, height
  placeable?: boolean;
  indoorOnly?: boolean;
  outdoorOnly?: boolean;
}

export interface InventorySlot {
  item: ItemDefinition;
  count: number;
}

export interface Critter {
  id: string;
  name: string;
  type: 'fish' | 'bug' | 'fossil';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  location: string;
  catchQuote: string;
  sellPrice: number;
  donated: boolean;
  icon: string;
  color: string;
  activeMonths?: string;
}

export interface LiveCritter {
  id: string;
  critterId: string;
  type: 'fish' | 'bug';
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: 'small' | 'medium' | 'large' | 'huge';
  state: 'wandering' | 'noticing' | 'biting' | 'fleeing';
  biteProgress?: number;
}

export interface Villager {
  id: string;
  name: string;
  species: string;
  personality: 'stylish' | 'sweet' | 'bubbly' | 'lazy' | 'scholarly' | 'entrepreneur';
  catchphrase: string;
  portrait: string;
  color: string;
  houseX: number;
  houseY: number;
  currentX: number;
  currentY: number;
  dialogues: string[];
  friendship: number;
  giftHistory: string[];
}

export interface DIYRecipe {
  id: string;
  resultItemId: string;
  resultCount: number;
  materials: {
    itemId: string;
    count: number;
  }[];
}

export interface IslandRating {
  stars: number;
  feedback: string;
  treeCount: number;
  flowerCount: number;
  furnitureCount: number;
  fencingCount: number;
}

export interface FlyingBalloon {
  id: string;
  x: number;
  y: number;
  color: 'red' | 'blue' | 'yellow' | 'green';
  speed: number;
}
