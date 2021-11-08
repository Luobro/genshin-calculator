import { ArtifactSet, BuffEffect, Character, Element, Enemy, Move, MoveType, StatsBonus, Weapon } from './lib/interface';
import { bonusMerger } from './lib/utils';
import Calculator from './lib/calculator';

export const character: Character = {
  name: '胡桃',
  level: 80,
  characterStat: {
    hp: 13721,
    atk: 94,
    def: 773,
    em: 0,
    critRate: 0.05,
    critDmg: 0.788,
    healingBonus: 0,
    incomingHealingBonus: 0,
    energyRecharge: 1,
    cooldownReduction: 0,
    shieldStrength: 0,
    physicalDmgBonus: 0,
    physicalResistance: 0,
    physicalResReduction: 0,
    pyroDmgBonus: 0,
    pyroResistance: 0,
    pyroResReduction: 0,
    hydroDmgBonus: 0,
    hydroResistance: 0,
    hydroResReduction: 0,
    anemoDmgBonus: 0,
    anemoResistance: 0,
    anemoResReduction: 0,
    cryoDmgBonus: 0,
    cryoResistance: 0,
    cryoResReduction: 0,
    dendroDmgBonus: 0,
    dendroResistance: 0,
    dendroResReduction: 0,
    electroDmgBonus: 0,
    electroResistance: 0,
    electroResReduction: 0,
    geoDmgBonus: 0,
    geoResistance: 0,
    geoResReduction: 0,
    normalHitDmgBonus: 0,
    chargedHitDmgBonus: 0,
    plungingHitDmgBonus: 0,
    elementalSkillDmgBonus: 0,
    elementalBurstDmgBonus: 0,
    commonDmgBonus: 0,
    dmgReduction: 0,
    defReduction: 0,
    reactionBonus: 0,
  },
  buffEffects: [
    ({ statsBonus, character, weapon }) => {
      const { hp } = Calculator.calculateStats(character.characterStat, weapon.atk, statsBonus)
      const bonusAtk = hp * 0.0506;
      return bonusMerger(statsBonus, {
        atkFlat: bonusAtk,
      })
    },
    ({ statsBonus }) => bonusMerger(statsBonus, { pyroDmgBonus: 0.33 }),
  ],
};
export const weapon: Weapon = {
  atk: 454,
  subStat: {
    critRate: 0.368,
  },
  buffEffects: [
    ({ statsBonus }) => bonusMerger(statsBonus, { atkRate: 0.24 }),
  ],
};
// const weapon: Weapon = {
//   atk: 454,
//   subStat: {
//     em: 221, 
//   },
//   buffEffects: [
//     ({statsBonus}) => bonusMerger(statsBonus, { commonDmgBonus: 0.28 }),
//   ],
// };
export const artifactSet: ArtifactSet = {
  flower: {
    hpFlat: 4780,
    critDmg: 0.21,
    em: 23,
    hpRate: 0.099,
    energyRecharge: 0.091,
  },
  plume: {
    atkFlat: 311,
    critRate: 0.066,
    hpFlat: 538,
    critDmg: 0.148,
    atkRate: 0.099,
  },
  // sands: {
  //   hpRate: 0.466,
  //   critDmg: 0.109,
  //   atkFlat: 19,
  //   critRate: 0.109,
  //   atkRate: 0.087,
  // },
  sands: {
    em: 187,
    defFlat: 44,
    critRate: 0.0620,
    hpFlat: 448,
    critDmg: 0.218,
  },
  // goblet: {
  //   hpRate: 0.466,
  //   critDmg: 0.148,
  //   critRate: 0.058,
  //   atkFlat: 51,
  //   defFlat: 44,
  // },
  goblet: {
    pyroDmgBonus: 0.466,
    atkFlat: 49,
    critRate: 0.074,
    defRate: 0.124,
    energyRecharge: 0.052,
  },
  circlet: {
    critDmg: 0.622,
    critRate: 0.097,
    em: 33,
    atkFlat: 18,
    energyRecharge: 0.168,
  },
  buffEffects: [
    ({ statsBonus }) => bonusMerger(statsBonus, { atkRate: 0.18 }),
    ({ statsBonus }) => bonusMerger(statsBonus, { normalHitDmgBonus: 0.50, chargedHitDmgBonus: 0.50, plungingHitDmgBonus: 0.50 }),
  ],
};
export const enemy: Enemy = {
  level: 90,
  physicalResistance: 0.1, // 物理抗性
  pyroResistance: 0.1, // 火元素抗性
  hydroResistance: 0.1, // 水元素抗性
  anemoResistance: 0.1, // 风元素抗性
  cryoResistance: 0.1, // 冰元素抗性
  dendroResistance: 0.1, // 草元素抗性
  electroResistance: 0.1, // 雷元素抗性
  geoResistance: 0.1, // 岩元素抗性
};
export const move: Move = {
  dmgType: Element.Pyro,
  moveType: MoveType.NormalHit,
  rate: 0.693,
  buffEffects: [],
};
export const buffEffects: BuffEffect[] = [
  ({ statsBonus }) => bonusMerger(statsBonus, { atkRate: 0.25 }),
];