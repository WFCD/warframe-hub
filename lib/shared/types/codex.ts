export type CodexItem = {
  name: string;
  uniqueName: string;
  type?: string;
  category?: string;
  tradable?: boolean;
  masterable?: boolean;
  imageName?: string;
};

export type CodexItemAbility = {
  uniqueName: string;
  name: string;
  description?: string;
  imageName?: string;
};

export type CodexItemComponent = {
  uniqueName: string;
  name: string;
  description?: string;
  itemCount?: number;
  imageName?: string;
  tradable?: boolean;
  drops?: CodexItemDrop[];
};

export type CodexItemDrop = {
  location?: string;
  type?: string;
  chance?: number;
  rarity?: string;
};

export type CodexItemDetail = CodexItem & {
  description?: string;
  masteryReq?: number;
  isPrime?: boolean;
  polarity?: string;
  polarities?: string[];
  rarity?: string;
  baseDrain?: number;
  fusionLimit?: number;
  compatName?: string;
  health?: number;
  shield?: number;
  armor?: number;
  power?: number;
  stamina?: number;
  sprintSpeed?: number;
  passiveDescription?: string;
  abilities?: CodexItemAbility[];
  components?: CodexItemComponent[];
  buildPrice?: number;
  buildTime?: number;
  buildQuantity?: number;
  drops?: CodexItemDrop[];
  wikiaUrl?: string;
  wikiAvailable?: boolean;
  introduced?: { name?: string; url?: string; aliases?: string[] };
  levelStats?: Array<{ stats?: string[] }>;
  [key: string]: unknown;
};
