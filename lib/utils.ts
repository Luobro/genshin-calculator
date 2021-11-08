import { mapValues } from 'lodash';
import { StatsBonus, NumberObject } from "./interface";

export const bonusMerger = (prev: StatsBonus, curr: Partial<StatsBonus>): StatsBonus => mapValues(prev, (v: number, k) => v + (curr[k as keyof StatsBonus] || 0));

export const calculateRateFlat = ({
  whiteValue,
  rateBonus,
  flatBonus,
}: NumberObject): number => whiteValue * (1 + rateBonus) + flatBonus;