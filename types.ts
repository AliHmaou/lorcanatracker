export interface Card {
  id: number;
  name: string;
  active: boolean;
  damage: number;
  strength: number;
  willpower: number;
}

export interface Player {
  id: number;
  name: string;
  lore: number;
  color: string;
  inkAvailable: number;
  cards: Card[];
  banishedCards: Card[];
  fieldLoreBonus: number;
}

export interface RepositoryCard {
  fullName: string;
  name: string;
  // Fix: Changed `version` from an optional property to a required property that can be `undefined`.
  // This resolves a TypeScript error in App.tsx related to type predicates, by making the interface
  // structurally compatible with the objects being created in the application code.
  version: string | undefined;
  strength: number;
  willpower: number;
}

export interface RepositoryFile {
  cards: {
    name: string;
    version?: string;
    strength: number;
    willpower: number;
  }[];
}
