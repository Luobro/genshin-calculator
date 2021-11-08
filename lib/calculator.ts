import { chain, mapValues, defaults, flow } from 'lodash';
import { Element, AdvanceStats, IGetDMGParams, Stats, StatsBonus, Character, Weapon, ArtifactSet, Enemy, BuffEffect, ICalculatorParams, NumberObject, IBuffEffectParams, Move, MoveType, CritStatus } from './interface';
import { bonusMerger, calculateRateFlat } from './utils';

export default class Calculator {
  static getDamage({
    talentRate,
    atk,
    critDmg,
    critRate,
    dmgBonus,
    lvlCharacter,
    lvlEnemy,
    defReduction,
    resEnemy,
    resReduction,
    EM,
    reactionCoeff,
    reactionBonus,
    otherEffect,
  }: IGetDMGParams) {
    const critMul = 1 + critDmg * Math.min(critRate, 1);
    const defMul = (lvlCharacter + 100) / (lvlCharacter + 100 + (lvlEnemy + 100) * (1 - defReduction));
    const resistance = resEnemy - resReduction;
    const resMul = resistance < 0 ? 1 - resistance / 2 : resistance >= 0.75 ? 1 / (4 * resistance + 1) : 1 - resistance;
    const emBonux = 1 + 0.00189266831 * EM * Math.pow(Math.E, -0.000505 * EM);
    const reactionMul = reactionCoeff > 1 ? emBonux * reactionCoeff + reactionBonus : 1;
    const result = talentRate * atk * critMul * (1 + dmgBonus) * defMul * resMul * reactionMul;

    if (!otherEffect) return result;
    return otherEffect(result);
  }

  static calculateStats(characterStat: Stats, weaponAtk: number, statsBonus: StatsBonus): Stats {
    const { hp, atk, def, ...restStats } = characterStat;

    const result = {
      hp: calculateRateFlat({
        whiteValue: hp,
        rateBonus: statsBonus.hpRate,
        flatBonus: statsBonus.hpFlat,
      }),
      atk: calculateRateFlat({
        whiteValue: atk + weaponAtk,
        rateBonus: statsBonus.atkRate,
        flatBonus: statsBonus.atkFlat,
      }),
      def: calculateRateFlat({
        whiteValue: def,
        rateBonus: statsBonus.defRate,
        flatBonus: statsBonus.defFlat,
      }),
      ...mapValues(restStats, (v: number, k): number => {
        const result = v + statsBonus[k as keyof StatsBonus];
        return result;
      }),
    }

    return result;
  }

  character: Character;
  weapon: Weapon;
  artifactSet: ArtifactSet;
  enemy: Enemy;
  move: Move;
  buffEffects: BuffEffect[];
  reactionCoeff: number;

  constructor(params: ICalculatorParams) {
    this.character = params.character;
    this.weapon = params.weapon;
    this.artifactSet = params.artifactSet;
    this.enemy = params.enemy;
    this.move = params.move;
    this.buffEffects = params.buffEffects;
    this.reactionCoeff = params.reactionCoeff;
  }

  get currentStats(): Stats {
    return Calculator.calculateStats(this.character.characterStat, this.weapon.atk, this.statsBonus);
  }

  get statsBonus(): StatsBonus {
    const buildBonus = chain(this.artifactSet)
      .pick(['flower', 'plume', 'sands', 'goblet', 'circlet'])
      .values()
      .concat(this.weapon.subStat)
      .reduce(bonusMerger, this.transPartialToStatsBonus({}))
      .value();

    const buffEffects = [
      ...this.buffEffects,
      ...this.artifactSet.buffEffects,
      ...this.weapon.buffEffects,
      ...this.move.buffEffects,
      ...this.character.buffEffects,
    ].map(effect => (params: IBuffEffectParams) => {
      const statsBonus = effect(params);
      return { ...params, statsBonus }
    });

    const { statsBonus } = flow(
      ...buffEffects,
    )({
      statsBonus: buildBonus,
      character: this.character,
      weapon: this.weapon,
      artifactSets: this.artifactSet
    });

    return statsBonus;
  }

  getDamage(critStatus = CritStatus.Expect) {
    const elementDmgBonus = this.getAttributeByElement().elementalDmgBonus;
    const moveTypeDmgBonus = this.getMoveTypeDmgBonus();
    const dmgBonus = elementDmgBonus + moveTypeDmgBonus + this.currentStats.commonDmgBonus;

    const critRate = critStatus === CritStatus.Expect ? this.currentStats.critRate : critStatus === CritStatus.Critic ? 1 : 0;
    return Calculator.getDamage({
      talentRate: this.move.rate,
      atk: this.currentStats.atk,
      critDmg: this.currentStats.critDmg,
      critRate: critRate,
      lvlCharacter: this.character.level,
      lvlEnemy: this.enemy.level,
      dmgBonus,
      defReduction: this.currentStats.defReduction,
      resEnemy: this.getAttributeByElement().resEnemy,
      resReduction: this.getAttributeByElement().resReduction,
      EM: this.currentStats.em,
      reactionCoeff: this.reactionCoeff,
      reactionBonus: this.currentStats.reactionBonus,
    })
  }

  private transPartialToStatsBonus(partialBonus: Partial<StatsBonus>): StatsBonus {
    return defaults(partialBonus, {
      atkRate: 0,
      atkFlat: 0,
      hpRate: 0,
      hpFlat: 0,
      defRate: 0,
      defFlat: 0,
      em: 0,
      critRate: 0,
      critDmg: 0,
      healingBonus: 0,
      incomingHealingBonus: 0,
      energyRecharge: 0,
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
    });
  }

  private getAttributeByElement() {
    const elementalType: Element = this.move.dmgType;
    switch (elementalType) {
      case Element.Anemo:
        return {
          elementalDmgBonus: this.currentStats.anemoDmgBonus,
          resEnemy: this.enemy.anemoResistance,
          resReduction: this.currentStats.anemoResReduction,
        }
      case Element.Cryo:
        return {
          elementalDmgBonus: this.currentStats.cryoDmgBonus,
          resEnemy: this.enemy.cryoResistance,
          resReduction: this.currentStats.cryoResReduction,
        }
      case Element.Dendro:
        return {
          elementalDmgBonus: this.currentStats.dendroDmgBonus,
          resEnemy: this.enemy.dendroResistance,
          resReduction: this.currentStats.dendroResReduction,
        }
      case Element.Electro:
        return {
          elementalDmgBonus: this.currentStats.electroDmgBonus,
          resEnemy: this.enemy.electroResistance,
          resReduction: this.currentStats.electroResReduction,
        }
      case Element.Geo:
        return {
          elementalDmgBonus: this.currentStats.geoDmgBonus,
          resEnemy: this.enemy.geoResistance,
          resReduction: this.currentStats.geoResReduction,
        }
      case Element.Hydro:
        return {
          elementalDmgBonus: this.currentStats.hydroDmgBonus,
          resEnemy: this.enemy.hydroResistance,
          resReduction: this.currentStats.hydroResReduction,
        }
      case Element.Pyro:
        return {
          elementalDmgBonus: this.currentStats.pyroDmgBonus,
          resEnemy: this.enemy.pyroResistance,
          resReduction: this.currentStats.pyroResReduction,
        }
      case Element.Physical:
        return {
          elementalDmgBonus: this.currentStats.physicalDmgBonus,
          resEnemy: this.enemy.physicalResistance,
          resReduction: this.currentStats.physicalResReduction,
        }
      default:
        return {
          elementalDmgBonus: 0,
          resEnemy: 0,
          resReduction: 0,
        }
    }
  }

  private getMoveTypeDmgBonus() {
    const moveType: MoveType = this.move.moveType;
    switch (moveType) {
      case MoveType.ChargedHit:
        return this.currentStats.chargedHitDmgBonus;
      case MoveType.NormalHit:
        return this.currentStats.normalHitDmgBonus;
      case MoveType.PlungingHit:
        return this.currentStats.plungingHitDmgBonus;
      case MoveType.ElementalSkill:
        return this.currentStats.elementalSkillDmgBonus;
      case MoveType.ElementalBurst:
        return this.currentStats.elementalBurstDmgBonus;
      default:
        return 0;
    }
  }
}