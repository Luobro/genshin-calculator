export enum Element {
  Pyro, // 火
  Hydro, // 水
  Anemo, // 风
  Electro, // 雷
  Dendro, // 草
  Cryo, // 冰
  Geo, // 地
  Physical, // 物理
}

// 进阶属性
export type AdvanceStats = Omit<Stats, 'atk' | 'hp' | 'def'>;

// BUFF
export type BuffEffect = (params: IBuffEffectParams) => StatsBonus;

export interface IBuffEffectParams {
  statsBonus: StatsBonus; // 增益
  character: Character; // 角色
  weapon: Weapon; // 武器
  artifactSets: ArtifactSet; // 圣遗物
}

export interface Character {
  name: string; // 角色名称
  level: number; // 角色等级
  characterStat: Stats; // 角色基础面板
  buffEffects: BuffEffect[]; // BUFF
}

export interface Stats {
  hp: number; // 生命值
  atk: number; // 攻击力
  def: number; // 防御力
  em: number; // 元素精通
  critDmg: number; // 暴击伤害加成
  critRate: number; // 暴击率
  healingBonus: number; // 治疗加成
  incomingHealingBonus: number; // 受治疗加成
  energyRecharge: number; // 元素充能效率
  cooldownReduction: number; // 冷却缩减
  shieldStrength: number; // 护盾强效
  physicalDmgBonus: number; // 物理伤害加成
  physicalResistance: number; // 物理抗性加成
  physicalResReduction: number; // 降低敌人物理抗性
  pyroDmgBonus: number; // 火元素伤害加成
  pyroResistance: number; // 火元素抗性加成
  pyroResReduction: number; // 降低敌人火元素抗性
  hydroDmgBonus: number; // 水元素伤害加成
  hydroResistance: number; // 水元素抗性加成
  hydroResReduction: number; // 降低敌人水元素抗性
  anemoDmgBonus: number; // 风元素伤害加成
  anemoResistance: number; // 风元素抗性加成
  anemoResReduction: number; // 降低敌人风元素抗性
  cryoDmgBonus: number; // 冰元素伤害加成
  cryoResistance: number; // 冰元素抗性加成
  cryoResReduction: number; // 降低敌人冰元素抗性
  dendroDmgBonus: number; // 草元素伤害加成
  dendroResistance: number; // 草元素抗性加成
  dendroResReduction: number; // 降低敌人草元素抗性
  electroDmgBonus: number; // 雷元素伤害加成
  electroResistance: number; // 雷元素抗性加成
  electroResReduction: number; // 降低敌人雷元素抗性
  geoDmgBonus: number; // 岩元素伤害加成
  geoResistance: number; // 岩元素抗性加成
  geoResReduction: number; // 降低敌人岩元素抗性
  normalHitDmgBonus: number; // 普攻伤害加成
  chargedHitDmgBonus: number; // 重击伤害加成
  plungingHitDmgBonus: number; // 下落攻击伤害加成
  elementalSkillDmgBonus: number; // 元素战技伤害加成
  elementalBurstDmgBonus: number; // 元素爆发伤害加成
  commonDmgBonus: number; // 全部伤害加成
  dmgReduction: number; // 降低收到的伤害
  defReduction: number; // 降低敌人防御
  reactionBonus: number; // 反应加成
}

/**
 * 招式
 *
 * @export
 * @interface Move
 */
export interface Move {
  dmgType: Element, // 元素伤害类型
  moveType: MoveType, // 招式类型 
  rate: number; // 倍率
  buffEffects: BuffEffect[]; // BUFF
}


/**
 * 招式类型
 *
 * @export
 * @enum {number}
 */
export enum MoveType {
  NormalHit, // 普通攻击
  ChargedHit, // 重攻击
  PlungingHit, // 下落攻击
  ElementalSkill, // 元素战技
  ElementalBurst, // 元素爆发（大招）
}

// 属性加成
export type StatsBonus = {
  atkRate: number; // 攻击力百分比提升
  atkFlat: number; // 攻击力提升
  hpRate: number; // 生命值百分比提升
  hpFlat: number; // 生命值提升
  defRate: number; // 防御力百分比提升
  defFlat: number; // 防御力提升
} & AdvanceStats;


/**
 * 武器
 *
 * @export
 * @interface Weapon
 */
export interface Weapon {
  atk: number; // 攻击力
  subStat: Partial<StatsBonus>; //副属性
  buffEffects: BuffEffect[]; // BUFF
}


export type Artifact = Partial<StatsBonus>


/**
 * 圣遗物
 *
 * @export
 * @interface ArtifactSet
 */
export interface ArtifactSet {
  flower: Artifact; // 花
  plume: Artifact; // 羽
  sands: Artifact; // 沙
  goblet: Artifact; // 杯
  circlet: Artifact; // 冠
  buffEffects: BuffEffect[];  // BUFF
}


/**
 * 敌人
 *
 * @export
 * @interface Enemy
 */
export interface Enemy {
  level: number;
  physicalResistance: number; // 物理抗性
  pyroResistance: number; // 火元素抗性
  hydroResistance: number; // 水元素抗性
  anemoResistance: number; // 风元素抗性
  cryoResistance: number; // 冰元素抗性
  dendroResistance: number; // 草元素抗性
  electroResistance: number; // 雷元素抗性
  geoResistance: number; // 岩元素抗性
}


/**
 * 伤害计算公式参数
 *
 * @export
 * @interface IGetDMGParams
 */
export interface IGetDMGParams {
  talentRate: number; // 技能倍率
  atk: number; // 攻击力
  critDmg: number; // 暴击伤害加成
  critRate: number; // 暴击率
  dmgBonus: number; // 伤害加成
  lvlCharacter: number; // 角色等级
  lvlEnemy: number; // 敌人等级
  defReduction: number; // 减防
  resEnemy: number // 敌人抗性
  resReduction: number; // 减抗
  EM: number; // 元素精通 Elemental Mastery
  reactionCoeff: number; // 反应系数
  reactionBonus: number; // 反应加成
  otherEffect?: (dmg: number) => number; // 其他乘区，目前已知的只有行秋的4命
}


/**
 * Calculator构造函数参数
 *
 * @export
 * @interface ICalculatorParams
 */
export interface ICalculatorParams {
  character: Character; // 角色
  weapon: Weapon; // 武器
  artifactSet: ArtifactSet; // 圣遗物
  enemy: Enemy; // 敌人
  move: Move; // 招式
  buffEffects: BuffEffect[];  // 额外 Buff
  reactionCoeff: number; // 反应系数
}

export type NumberObject = { [key: string]: number };

export enum CritStatus {
  Expect,
  Critic,
  Normal,
}