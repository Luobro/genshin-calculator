import Calculator from './lib/calculator';
import {
  character,
  weapon,
  artifactSet,
  enemy,
  buffEffects,
  move
} from './build';

const calculator = new Calculator({
  character,
  weapon,
  artifactSet,
  enemy,
  buffEffects,
  move,
  reactionCoeff: 1.5
});

console.log('当前面板', calculator.currentStats);
console.log('期望伤害', calculator.getDamage(0));
console.log('暴击伤害', calculator.getDamage(1));
console.log('非暴击伤害', calculator.getDamage(2));