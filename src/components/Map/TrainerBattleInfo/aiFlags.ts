type TrainerAIFlag = {
  desc: string;
  rarity: number; // 0 = common, 1 = rare, 2 = very rare
};
export const aiFlags: Record<string, TrainerAIFlag> = Object.freeze({
  CHECK_BAD_MOVE: { desc: "Avoids ineffective moves", rarity: 0 },

  TRY_TO_FAINT: { desc: "Goes for KO's", rarity: 1 },

  CHECK_VIABILITY: { desc: "Exploits move effects", rarity: 1 },

  FORCE_SETUP_FIRST_TURN: { desc: "Sets up on first turn", rarity: 2 },

  RISKY: { desc: "Takes risks", rarity: 2 },

  PREFER_STRONGEST_MOVE: { desc: "Favors KO's", rarity: 1 },

  PREFER_BATON_PASS: { desc: "Baton Pass strategy", rarity: 0 },

  DOUBLE_BATTLE: { desc: "Uses double battle tactics", rarity: 0 },

  HP_AWARE: { desc: "HP Levels change strategy", rarity: 2 },

  POWERFUL_STATUS: { desc: "Prioritizes field effects", rarity: 2 },

  NEGATE_UNAWARE: { desc: "Ignores special ability effects", rarity: 0 },

  WILL_SUICIDE: { desc: "Will self-destruct", rarity: 2 },

  PREFER_STATUS_MOVES: { desc: "Favors status moves", rarity: 0 },

  STALL: { desc: "Stalling tactics", rarity: 0 },

  SMART_SWITCHING: { desc: "Switches & selects Pokémon wisely", rarity: 1 },

  SMART_MON_CHOICES: { desc: "Selects Pokémon wisely", rarity: 1 },

  ACE_POKEMON: { desc: "Reserves strongest Pokémon", rarity: 2 },
  SMART_TRAINER: { desc: "Adapts to your team", rarity: 2 },
  SMARTISH_TRAINER: { desc: "Occasionally plans ahead", rarity: 1 },
  BASIC_TRAINER: { desc: "Standard AI routine", rarity: 0 },

  OMNISCIENT: { desc: "Knows your party", rarity: 3 },

  CONSERVATIVE: { desc: "Assumes minimum damage", rarity: 0 },

  SEQUENCE_SWITCHING: { desc: "Uses Pokémon in fixed order", rarity: 0 },

  DOUBLE_ACE_POKEMON: { desc: "Saves strongest 2 Pokémon", rarity: 0 },
  "0": { desc: "Free", rarity: 0 },
});
