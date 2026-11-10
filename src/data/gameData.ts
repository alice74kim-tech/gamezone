/**
 * Animal Forest: Island Designer Game Data
 */

import { Critter, DIYRecipe, ItemDefinition, PlacedItem, TileType, Villager } from '../types/game';

export const ASSET_IMAGES = {
  banner: '/src/assets/images/animal_island_banner_1794280189047.jpg',
  tomNook: '/src/assets/images/tanuki_shopkeeper_1794280190613.jpg',
  blathers: '/src/assets/images/owl_curator_1794280190430.jpg',
  raymond: '/src/assets/images/cat_villager_1794280190558.jpg',
};

export const MAP_WIDTH = 26;
export const MAP_HEIGHT = 20;

export const ITEMS: Record<string, ItemDefinition> = {
  // Tools
  tool_rod: { id: 'tool_rod', name: '낚싯대', category: 'tool', description: '강이나 바다에 던져 물고기를 낚아보세요!', price: 200, buyPrice: 400, icon: '🎣' },
  tool_net: { id: 'tool_net', name: '잠자리채', category: 'tool', description: '주변을 날아다니는 곤충을 살금살금 다가가 잡으세요!', price: 200, buyPrice: 400, icon: '🦋' },
  tool_shovel: { id: 'tool_shovel', name: '삽', category: 'tool', description: '빛나는 땅에서 화석을 파내거나 바위를 칠 수 있어요.', price: 250, buyPrice: 500, icon: '⛏️' },
  tool_axe: { id: 'tool_axe', name: '도끼', category: 'tool', description: '나무를 쳐서 목재를 얻거나 나무를 흔들 수 있어요.', price: 250, buyPrice: 500, icon: '🪓' },
  tool_slingshot: { id: 'tool_slingshot', name: '새총', category: 'tool', description: '하늘에 떠다니는 풍선 선물을 쏘아 떨어뜨려요!', price: 300, buyPrice: 600, icon: '🎯' },
  tool_designer: { id: 'tool_designer', name: '섬 크리에이터 안전모', category: 'tool', description: '마을 지형을 바꾸고 길을 포장하는 공사를 시작해요!', price: 0, buyPrice: 1000, icon: '⛑️' },

  // Materials & Gatherables
  mat_wood: { id: 'mat_wood', name: '목재', category: 'material', description: '튼튼한 가구를 만드는 기본 재료.', price: 60, icon: '🪵' },
  mat_softwood: { id: 'mat_softwood', name: '부드러운 목재', category: 'material', description: '결이 고운 목재.', price: 60, icon: '🪵' },
  mat_hardwood: { id: 'mat_hardwood', name: '단단한 목재', category: 'material', description: '무거운 건축물에 쓰이는 목재.', price: 60, icon: '🪵' },
  mat_branch: { id: 'mat_branch', name: '나뭇가지', category: 'material', description: '나무를 흔들면 떨어지는 가벼운 가지.', price: 10, icon: '🌿' },
  mat_stone: { id: 'mat_stone', name: '돌', category: 'material', description: '바위를 치면 나오는 단단한 돌.', price: 50, icon: '🪨' },
  mat_iron: { id: 'mat_iron', name: '철광석', category: 'material', description: '빛나는 금속 재료. 고급 도구에 필수!', price: 375, icon: '🔩' },
  mat_clay: { id: 'mat_clay', name: '점토', category: 'material', description: '도자기나 벽돌을 만들 때 쓰이는 흙.', price: 100, icon: '🧱' },

  // Fruits
  fruit_apple: { id: 'fruit_apple', name: '사과', category: 'fruit', description: '새콤달콤한 섬 특산물 사과!', price: 100, icon: '🍎' },
  fruit_cherry: { id: 'fruit_cherry', name: '체리', category: 'fruit', description: '새빨간 쌍둥이 체리.', price: 100, icon: '🍒' },
  fruit_peach: { id: 'fruit_peach', name: '복숭아', category: 'fruit', description: '향긋하고 달콤한 복숭아.', price: 100, icon: '🍑' },

  // Outdoor Furniture & Decorations
  furn_log_bench: { id: 'furn_log_bench', name: '통나무 벤치', category: 'furniture', description: '편안하게 쉴 수 있는 통나무 벤치.', price: 300, buyPrice: 800, icon: '🪵', placeable: true, size: [2, 1] },
  furn_garden_fountain: { id: 'furn_garden_fountain', name: '가든 분수대', category: 'furniture', description: '물이 시원하게 솟아오르는 클래식 분수대.', price: 2500, buyPrice: 6800, icon: '⛲', placeable: true, size: [2, 2] },
  furn_streetlamp: { id: 'furn_streetlamp', name: '앤틱 가로등', category: 'furniture', description: '밤이 되면 은은하게 불을 밝히는 가로등.', price: 800, buyPrice: 1600, icon: '🏮', placeable: true, size: [1, 1] },
  furn_campfire: { id: 'furn_campfire', name: '모닥불', category: 'furniture', description: '타닥타닥 따뜻한 불씨가 피어오르는 모닥불.', price: 200, buyPrice: 500, icon: '🔥', placeable: true, size: [1, 1] },
  furn_beach_lounger: { id: 'furn_beach_lounger', name: '비치 베드 & 파라솔', category: 'furniture', description: '모래사장에서 일광욕을 즐기기 딱 좋은 선베드.', price: 1200, buyPrice: 3200, icon: '⛱️', placeable: true, size: [2, 1] },
  furn_stone_lantern: { id: 'furn_stone_lantern', name: '석등', category: 'furniture', description: '고즈넉한 동양풍 석조 등불.', price: 900, buyPrice: 2400, icon: '🗿', placeable: true, size: [1, 1] },
  furn_picnic_set: { id: 'furn_picnic_set', name: '피크닉 바구니 세트', category: 'furniture', description: '잔디밭에 깔고 샌드위치를 먹을 수 있는 돗자리.', price: 700, buyPrice: 1900, icon: '🧺', placeable: true, size: [2, 1] },
  furn_tea_stall: { id: 'furn_tea_stall', name: '노점 마차', category: 'furniture', description: '과일이나 기념품을 전시할 수 있는 귀여운 노점.', price: 1500, buyPrice: 4200, icon: '🎪', placeable: true, size: [2, 1] },
  furn_kk_stereo: { id: 'furn_kk_stereo', name: 'K.K. 주크박스', category: 'furniture', description: 'K.K.의 명곡이 흘러나오는 레트로 플레이어!', price: 3000, buyPrice: 8500, icon: '📻', placeable: true, size: [1, 1] },
  furn_white_fence: { id: 'furn_white_fence', name: '하얀 목재 울타리 (x5)', category: 'furniture', description: '마을 정원을 예쁘게 구획할 수 있는 울타리.', price: 150, buyPrice: 400, icon: '🪵', placeable: true, size: [1, 1] },
  furn_bush_hedge: { id: 'furn_bush_hedge', name: '생울타리 수풀 (x5)', category: 'furniture', description: '초록빛 자연 그대로를 살린 울타리.', price: 150, buyPrice: 400, icon: '🌿', placeable: true, size: [1, 1] },
  furn_hammock: { id: 'furn_hammock', name: '야외 해먹', category: 'furniture', description: '바람을 맞으며 낮잠을 잘 수 있는 스트라이프 해먹.', price: 900, buyPrice: 2300, icon: '🛏️', placeable: true, size: [2, 1] },

  // Indoor Decor
  furn_cozy_bed: { id: 'furn_cozy_bed', name: '푹신한 원목 침대', category: 'furniture', description: '하루의 피로를 풀어주는 아늑한 침대.', price: 1800, buyPrice: 4500, icon: '🛏️', placeable: true, indoorOnly: true },
  furn_wood_sofa: { id: 'furn_wood_sofa', name: '패브릭 원목 소파', category: 'furniture', description: '거실에 잘 어울리는 따뜻한 색감의 2인용 소파.', price: 1400, buyPrice: 3800, icon: '🛋️', placeable: true, indoorOnly: true },
  furn_retro_tv: { id: 'furn_retro_tv', name: '레트로 브라운관 TV', category: 'furniture', description: '옛날 감성이 가득한 브라운관 TV.', price: 2200, buyPrice: 5600, icon: '📺', placeable: true, indoorOnly: true },
  furn_monstera: { id: 'furn_monstera', name: '몬스테라 화분', category: 'furniture', description: '방 안의 공기를 정화해주는 싱그러운 관엽식물.', price: 500, buyPrice: 1200, icon: '🪴', placeable: true, indoorOnly: true },
  furn_fireplace: { id: 'furn_fireplace', name: '벽돌 벽난로', category: 'furniture', description: '추운 밤을 훈훈하게 만들어주는 벽난로.', price: 3200, buyPrice: 8800, icon: '🪵', placeable: true, indoorOnly: true },
  furn_cute_rug: { id: 'furn_cute_rug', name: '너굴 나뭇잎 러그', category: 'furniture', description: '바닥에 깔면 산뜻해지는 나뭇잎 모양 초록 러그.', price: 600, buyPrice: 1500, icon: '🍃', placeable: true, indoorOnly: true },

  // Wallpapers & Floorings
  wall_forest: { id: 'wall_forest', name: '자작나무 숲 벽지', category: 'furniture', description: '숲속에 와 있는 듯한 자작나무 벽지.', price: 800, buyPrice: 2000, icon: '🌲', indoorOnly: true },
  wall_sky: { id: 'wall_sky', name: '푸른 하늘 구름 벽지', category: 'furniture', description: '맑은 날 뭉게구름이 둥실 떠 있는 벽지.', price: 800, buyPrice: 2000, icon: '☁️', indoorOnly: true },
  wall_brick: { id: 'wall_brick', name: '화이트 브릭 벽지', category: 'furniture', description: '모던하고 깔끔한 화이트 벽돌 벽지.', price: 800, buyPrice: 2000, icon: '🧱', indoorOnly: true },
  floor_wood: { id: 'floor_wood', name: '헤링본 원목 마루', category: 'furniture', description: '고급스럽고 편안한 원목 마루.', price: 800, buyPrice: 2000, icon: '🪵', indoorOnly: true },
  floor_tatami: { id: 'floor_tatami', name: '다다미 바닥', category: 'furniture', description: '은은한 풀 향이 나는 전통 다다미 바닥.', price: 800, buyPrice: 2000, icon: '🌾', indoorOnly: true },
};

export const CRITTERS: Record<string, Critter> = {
  // Fish
  fish_pale_chub: { id: 'fish_pale_chub', name: '피라미', type: 'fish', rarity: 'common', location: '강', catchQuote: '피라미를 잡았다! 피할 수 없는 손맛!', sellPrice: 200, donated: false, icon: '🐟', color: '#60a5fa' },
  fish_crucian_carp: { id: 'fish_crucian_carp', name: '붕어', type: 'fish', rarity: 'common', location: '강', catchQuote: '붕어를 잡았다! 붕어빵에는 없지만 여기엔 있지!', sellPrice: 160, donated: false, icon: '🐟', color: '#38bdf8' },
  fish_carp: { id: 'fish_carp', name: '잉어', type: 'fish', rarity: 'uncommon', location: '연못/강', catchQuote: '잉어를 잡았다! 잉어킹 부럽지 않아!', sellPrice: 300, donated: false, icon: '🐟', color: '#f97316' },
  fish_black_bass: { id: 'fish_black_bass', name: '배스', type: 'fish', rarity: 'common', location: '강', catchQuote: '배스를 잡았다! 배고파서 배스? 아냐, 힘이 장사야!', sellPrice: 400, donated: false, icon: '🐟', color: '#4ade80' },
  fish_sea_bass: { id: 'fish_sea_bass', name: '농어', type: 'fish', rarity: 'common', location: '바다', catchQuote: '농어를 잡았다! 왜 농어일까? 농담이 아니라 농어!', sellPrice: 400, donated: false, icon: '🐟', color: '#2dd4bf' },
  fish_red_snapper: { id: 'fish_red_snapper', name: '도미', type: 'fish', rarity: 'rare', location: '바다', catchQuote: '도미를 잡았다! 선명한 붉은빛! 오늘 저녁은 도미 파티?', sellPrice: 3000, donated: false, icon: '🐠', color: '#ef4444' },
  fish_tuna: { id: 'fish_tuna', name: '다랑어', type: 'fish', rarity: 'rare', location: '부둣가 바다', catchQuote: '다랑어를 잡았다! 대단한 대물이다! 묵직해!', sellPrice: 7000, donated: false, icon: '🦈', color: '#3b82f6' },
  fish_coelacanth: { id: 'fish_coelacanth', name: '실러캔스', type: 'fish', rarity: 'legendary', location: '비 오는 바다', catchQuote: '실러캔스를 잡았다! 살아있는 고대 화석을 낚다니 기적이야!!', sellPrice: 15000, donated: false, icon: '🐋', color: '#6366f1' },
  fish_goldfish: { id: 'fish_goldfish', name: '금붕어', type: 'fish', rarity: 'uncommon', location: '연못', catchQuote: '금붕어를 잡았다! 어항에 넣어 키우고 싶어!', sellPrice: 1300, donated: false, icon: '🐡', color: '#fbbf24' },

  // Bugs
  bug_common_butterfly: { id: 'bug_common_butterfly', name: '배추흰나비', type: 'bug', rarity: 'common', location: '꽃밭 주변', catchQuote: '배추흰나비를 잡았다! 나풀나풀 하얀 날개!', sellPrice: 160, donated: false, icon: '🦋', color: '#f8fafc' },
  bug_tiger_butterfly: { id: 'bug_tiger_butterfly', name: '호랑나비', type: 'bug', rarity: 'common', location: '꽃밭 주변', catchQuote: '호랑나비를 잡았다! 멋진 줄무늬 패턴!', sellPrice: 240, donated: false, icon: '🦋', color: '#f59e0b' },
  bug_morpho: { id: 'bug_morpho', name: '몰포나비', type: 'bug', rarity: 'rare', location: '꽃밭 & 숲', catchQuote: '몰포나비를 잡았다! 눈부신 에메랄드 블루빛 날개!', sellPrice: 4000, donated: false, icon: '🦋', color: '#06b6d4' },
  bug_rhinoceros_beetle: { id: 'bug_rhinoceros_beetle', name: '장수풍뎅이', type: 'bug', rarity: 'uncommon', location: '나무 줄기', catchQuote: '장수풍뎅이를 잡았다! 멋진 뿔을 가진 숲의 제왕!', sellPrice: 1350, donated: false, icon: '🪲', color: '#78350f' },
  bug_stag_beetle: { id: 'bug_stag_beetle', name: '톱사슴벌레', type: 'bug', rarity: 'rare', location: '나무 줄기', catchQuote: '톱사슴벌레를 잡았다! 톱니 모양 큰 턱이 위풍당당해!', sellPrice: 2000, donated: false, icon: '🪲', color: '#451a03' },
  bug_honeybee: { id: 'bug_honeybee', name: '꿀벌', type: 'bug', rarity: 'common', location: '꽃 주변', catchQuote: '꿀벌을 잡았다! 붕붕 날아다니는 부지런한 친구!', sellPrice: 200, donated: false, icon: '🐝', color: '#facc15' },
  bug_firefly: { id: 'bug_firefly', name: '반딧불이', type: 'bug', rarity: 'uncommon', location: '밤하늘 강가', catchQuote: '반딧불이를 잡았다! 꼬리에서 반짝이는 초록 등불!', sellPrice: 300, donated: false, icon: '✨', color: '#84cc16' },

  // Fossils
  fossil_trex: { id: 'fossil_trex', name: '티라노사우루스 두개골', type: 'fossil', rarity: 'rare', location: '땅속 균열', catchQuote: '티라노사우루스 두개골을 발굴했다! 엄청난 위압감의 공룡!', sellPrice: 6000, donated: false, icon: '🦖', color: '#d97706' },
  fossil_triceratops: { id: 'fossil_triceratops', name: '트리케라톱스 뿔', type: 'fossil', rarity: 'uncommon', location: '땅속 균열', catchQuote: '트리케라톱스 뿔을 발굴했다! 세 개의 거대한 뿔!', sellPrice: 4500, donated: false, icon: '🦏', color: '#b45309' },
  fossil_ammonite: { id: 'fossil_ammonite', name: '암모나이트', type: 'fossil', rarity: 'common', location: '땅속 균열', catchQuote: '암모나이트 화석을 발굴했다! 아름다운 나선형 껍데기!', sellPrice: 1100, donated: false, icon: '🐚', color: '#9a3412' },
  fossil_trilobite: { id: 'fossil_trilobite', name: '삼엽충', type: 'fossil', rarity: 'common', location: '땅속 균열', catchQuote: '삼엽충 화석을 발굴했다! 고생대 바다를 주름잡던 절지동물!', sellPrice: 1300, donated: false, icon: '🦐', color: '#7c2d12' },
};

export const DIY_RECIPES: DIYRecipe[] = [
  {
    id: 'recipe_log_bench',
    resultItemId: 'furn_log_bench',
    resultCount: 1,
    materials: [
      { itemId: 'mat_wood', count: 4 },
      { itemId: 'mat_branch', count: 2 },
    ],
  },
  {
    id: 'recipe_campfire',
    resultItemId: 'furn_campfire',
    resultCount: 1,
    materials: [
      { itemId: 'mat_branch', count: 5 },
      { itemId: 'mat_stone', count: 3 },
    ],
  },
  {
    id: 'recipe_white_fence',
    resultItemId: 'furn_white_fence',
    resultCount: 1,
    materials: [
      { itemId: 'mat_wood', count: 6 },
      { itemId: 'mat_softwood', count: 4 },
    ],
  },
  {
    id: 'recipe_picnic_set',
    resultItemId: 'furn_picnic_set',
    resultCount: 1,
    materials: [
      { itemId: 'mat_softwood', count: 4 },
      { itemId: 'mat_branch', count: 4 },
      { itemId: 'fruit_apple', count: 2 },
    ],
  },
  {
    id: 'recipe_beach_lounger',
    resultItemId: 'furn_beach_lounger',
    resultCount: 1,
    materials: [
      { itemId: 'mat_hardwood', count: 6 },
      { itemId: 'mat_wood', count: 4 },
    ],
  },
  {
    id: 'recipe_garden_fountain',
    resultItemId: 'furn_garden_fountain',
    resultCount: 1,
    materials: [
      { itemId: 'mat_stone', count: 12 },
      { itemId: 'mat_iron', count: 3 },
      { itemId: 'mat_clay', count: 4 },
    ],
  },
];

export const VILLAGERS: Villager[] = [
  {
    id: 'tom_nook',
    name: '너굴',
    species: '너구리',
    personality: 'entrepreneur',
    catchphrase: '구리~',
    portrait: ASSET_IMAGES.tomNook,
    color: '#059669',
    houseX: 16,
    houseY: 7,
    currentX: 16,
    currentY: 9,
    friendship: 80,
    giftHistory: [],
    dialogues: [
      '어서오게나! 우리 섬에 온 것을 진심으로 환영하네구리~!',
      '섬 크리에이터 안전모를 쓰면 지형을 자유롭게 파거나 길을 포장할 수 있다네!',
      '상점에서 다양한 가구와 도구를 팔고 있으니 언제든 들러보게나구리~',
      '집 대출금을 모두 갚으면 더 넓고 근사한 2층 집으로 증축해줄게구리!',
    ],
  },
  {
    id: 'blathers',
    name: '부엉',
    species: '부엉이',
    personality: 'scholarly',
    catchphrase: '후우...',
    portrait: ASSET_IMAGES.blathers,
    color: '#854d0e',
    houseX: 8,
    houseY: 4,
    currentX: 8,
    currentY: 6,
    friendship: 75,
    giftHistory: [],
    dialogues: [
      '후우... 안녕하세요! 이 섬의 박물관 관장을 맡고 있는 부엉이라고 합니다.',
      '강이나 바다의 물고기, 혹은 땅속 화석을 발견하시면 꼭 기증해 주십시오!',
      '으으... 곤충도 전시는 하지만... 사실 벌레는 조금 징그럽단 말이죠...',
      '박물관 안에 수족관과 화석 전시관을 마련해 두었으니 언제든 관람하러 오세요!',
    ],
  },
  {
    id: 'raymond',
    name: '잭슨',
    species: '고양이',
    personality: 'stylish',
    catchphrase: '우쭐',
    portrait: ASSET_IMAGES.raymond,
    color: '#475569',
    houseX: 19,
    houseY: 12,
    currentX: 18,
    currentY: 13,
    friendship: 60,
    giftHistory: [],
    dialogues: [
      '여어, 대표! 오늘도 섬 정돈에 여념이 없군. 역시 감각이 탁월해.',
      '우리 마을에 배치된 가구들을 보면 매일 영감이 샘솟는다구. 우쭐!',
      '혹시 나한테 줄 멋진 선물이나 특산 과일이라도 있는 건 아니겠지?',
      '길을 모던한 돌길이나 벽돌길로 포장해보는 건 어때? 훨씬 도시적일 텐데 말야.',
    ],
  },
  {
    id: 'flurry',
    name: '뽀야미',
    species: '햄스터',
    personality: 'sweet',
    catchphrase: '뽀얌',
    portrait: ASSET_IMAGES.banner,
    color: '#ec4899',
    houseX: 6,
    houseY: 14,
    currentX: 7,
    currentY: 14,
    friendship: 65,
    giftHistory: [],
    dialogues: [
      '안녕하세요~! 오늘 날씨가 참 화창해서 산책하기 딱 좋아요, 뽀얌!',
      '알록달록 예쁜 튤립과 코스모스를 잔디밭에 심으면 기분이 몽글몽글해져요~',
      '강가에서 물고기를 낚으셨나요? 잡을 때 나는 풍덩 소리가 참 시원해요!',
      '대표님이 섬을 이렇게 예쁘게 꾸며주셔서 매일매일이 소풍 같아요, 뽀얌~',
    ],
  },
];

/**
 * Generate initial island map tiles
 */
export function createInitialTiles(): TileType[][] {
  const tiles: TileType[][] = [];

  for (let y = 0; y < MAP_HEIGHT; y++) {
    const row: TileType[] = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
      // South beach area
      if (y >= MAP_HEIGHT - 3 || x === 0 || x === MAP_WIDTH - 1) {
        row.push('sand');
        continue;
      }

      // North cliff plateau
      if (y <= 2 && x >= 4 && x <= 14) {
        row.push('cliff');
        continue;
      }

      // Winding river cutting through the island
      const isRiver = 
        (x === 12 && y >= 0 && y <= 6) ||
        (x === 13 && y >= 5 && y <= 9) ||
        (x === 14 && y >= 8 && y <= 13) ||
        (x === 13 && y >= 12 && y <= 16) ||
        (x === 12 && y >= 15 && y <= 19);

      if (isRiver) {
        row.push('water');
        continue;
      }

      // Natural stone paths around town square
      if (
        (y === 8 && x >= 14 && x <= 18) ||
        (y === 9 && (x === 14 || x === 18)) ||
        (y === 10 && x >= 14 && x <= 18)
      ) {
        row.push('stone_path');
        continue;
      }

      // Default green grass
      row.push('grass');
    }
    tiles.push(row);
  }

  return tiles;
}

/**
 * Generate initial placed objects, trees, flowers, rocks, and buildings
 */
export function createInitialPlacedItems(): PlacedItem[] {
  return [
    // Buildings
    { id: 'b_my_house', itemId: 'building_house', x: 4, y: 7, rotation: 0, type: 'building', buildingType: 'house' },
    { id: 'b_nook_shop', itemId: 'building_shop', x: 16, y: 5, rotation: 0, type: 'building', buildingType: 'shop' },
    { id: 'b_museum', itemId: 'building_museum', x: 7, y: 3, rotation: 0, type: 'building', buildingType: 'museum' },
    { id: 'b_town_hall', itemId: 'building_town_hall', x: 16, y: 9, rotation: 0, type: 'building', buildingType: 'town_hall' },
    { id: 'b_raymond_house', itemId: 'building_villager_house', x: 19, y: 12, rotation: 0, type: 'building', buildingType: 'villager_house' },
    { id: 'b_flurry_house', itemId: 'building_villager_house', x: 5, y: 14, rotation: 0, type: 'building', buildingType: 'villager_house' },

    // Bridge over river
    { id: 'bridge_center', itemId: 'building_bridge', x: 14, y: 10, rotation: 0, type: 'bridge' },

    // Fruit Trees
    { id: 'tree_apple_1', itemId: 'tree_apple', x: 3, y: 4, rotation: 0, type: 'tree', treeState: { fruitType: 'apple', hasFruit: true, woodChopsLeft: 3 } },
    { id: 'tree_apple_2', itemId: 'tree_apple', x: 2, y: 8, rotation: 0, type: 'tree', treeState: { fruitType: 'apple', hasFruit: true, woodChopsLeft: 3 } },
    { id: 'tree_cherry_1', itemId: 'tree_cherry', x: 18, y: 4, rotation: 0, type: 'tree', treeState: { fruitType: 'cherry', hasFruit: true, woodChopsLeft: 3 } },
    { id: 'tree_peach_1', itemId: 'tree_peach', x: 21, y: 7, rotation: 0, type: 'tree', treeState: { fruitType: 'peach', hasFruit: true, woodChopsLeft: 3 } },
    { id: 'tree_bell_1', itemId: 'tree_bell', x: 9, y: 14, rotation: 0, type: 'tree', treeState: { fruitType: 'bell', hasFruit: true, woodChopsLeft: 3 } },
    { id: 'tree_normal_1', itemId: 'tree_normal', x: 22, y: 14, rotation: 0, type: 'tree', treeState: { hasFruit: false, woodChopsLeft: 3 } },

    // Rocks
    { id: 'rock_1', itemId: 'rock_mineral', x: 10, y: 7, rotation: 0, type: 'rock', rockState: { hitsLeft: 3, isMoneyRock: false } },
    { id: 'rock_money', itemId: 'rock_mineral', x: 20, y: 9, rotation: 0, type: 'rock', rockState: { hitsLeft: 3, isMoneyRock: true } },
    { id: 'rock_3', itemId: 'rock_mineral', x: 8, y: 12, rotation: 0, type: 'rock', rockState: { hitsLeft: 3, isMoneyRock: false } },

    // Flowers
    { id: 'flower_1', itemId: 'flower_tulip', x: 3, y: 6, rotation: 0, type: 'flower', flowerType: 'tulip', flowerColor: 'red' },
    { id: 'flower_2', itemId: 'flower_tulip', x: 4, y: 6, rotation: 0, type: 'flower', flowerType: 'tulip', flowerColor: 'yellow' },
    { id: 'flower_3', itemId: 'flower_rose', x: 15, y: 11, rotation: 0, type: 'flower', flowerType: 'rose', flowerColor: 'pink' },
    { id: 'flower_4', itemId: 'flower_cosmos', x: 17, y: 11, rotation: 0, type: 'flower', flowerType: 'cosmos', flowerColor: 'white' },
    { id: 'flower_5', itemId: 'flower_pansy', x: 18, y: 11, rotation: 0, type: 'flower', flowerType: 'pansy', flowerColor: 'blue' },

    // Initial placed outdoor furniture
    { id: 'furn_init_bench', itemId: 'furn_log_bench', x: 15, y: 8, rotation: 0, type: 'furniture' },
    { id: 'furn_init_fountain', itemId: 'furn_garden_fountain', x: 16, y: 11, rotation: 0, type: 'furniture' },
    { id: 'furn_init_lamp1', itemId: 'furn_streetlamp', x: 14, y: 7, rotation: 0, type: 'furniture' },
    { id: 'furn_init_lamp2', itemId: 'furn_streetlamp', x: 18, y: 7, rotation: 0, type: 'furniture' },
    { id: 'furn_init_campfire', itemId: 'furn_campfire', x: 6, y: 10, rotation: 0, type: 'furniture' },
    { id: 'furn_init_beach1', itemId: 'furn_beach_lounger', x: 10, y: 18, rotation: 0, type: 'furniture' },
  ];
}
