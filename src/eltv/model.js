// eLTV model: the Tskhay-Charney formula, scenario presets and chart series.
// The numbers, formulas and preset rules are copied unchanged from the original
// ELTV calculator (eltv-calculator.jsx). Change the look in EltvApp.jsx / eltv.css,
// not here, unless the model itself is being revised.

export const TOOLTIPS = {
  revenue:
    'Total annual revenue collected in the previous period, divided by the total number of full-time equivalent (FTE) employees. This measures how effectively the organization converts talent into revenue.',
  cost: 'The fully loaded annual financial commitment per employee, which includes base salary, target bonuses, and benefits.',
  rampUp:
    'The exact number of months required for a new hire to reach full contribution. The model assumes employees operate at 50% productivity during this integration phase.',
  retention:
    'The annualized percentage of employees who remain with the organization. The study identifies an 80% threshold, below which replacement drag severely erodes financial returns.',
  engagement:
    'The average employee engagement metric (0-100), typically reflecting the percentage of employees who reported being engaged. The model treats this as a financial multiplier, where high engagement dynamically boosts productivity and protects retention.',
  avgTenure:
    'The raw, average length of time (in years) an employee remains with the organization, allowing their net value to compound.',
  effectiveTenure:
    'The adjusted tenure used in the Tskhay-Charney formula. It subtracts the 50% productivity drag incurred during the ramp-up period from the raw average tenure to reflect actual economic output.',
};

export const DEFAULTS = {
  headcount: 250,
  revenue: 183000,
  cost: 140000,
  retention: 75,
  engagement: 60,
  avgTenure: 4,
  rampUp: 6,
};

export const MAX_TENURE_YEARS = 10;
export const TIME_HORIZON_MONTHS = 36;
export const clamp = (n, min, max) => Math.min(max, Math.max(min, Number.isFinite(n) ? n : min));

export function computeELTV({ revenue, cost, rampUp, retention, avgTenure }) {
  const retentionFactor = retention / 100;
  const rawTenure = Math.min(avgTenure, MAX_TENURE_YEARS);
  const effectiveTenure = Math.max(rawTenure - 0.5 * (rampUp / 12), 0);
  const overhead = 0.2 * cost;
  const valueCreated = (revenue - cost) * effectiveTenure * retentionFactor;
  const net = valueCreated - overhead;
  return { rawTenure, effectiveTenure, retentionFactor, overhead, valueCreated, net };
}

export function buildTimeSeries({ revenue, cost, rampUp, retention }) {
  const retentionDecimal = retention / 100;
  const overhead = 0.2 * cost;
  const monthlyCost = cost / 12;
  const monthlyRevenueFull = revenue / 12;
  let cumulative = -overhead;
  const points = [{ month: 0, value: cumulative }];
  for (let m = 1; m <= TIME_HORIZON_MONTHS; m++) {
    const rampActive = m <= rampUp;
    const monthlyRevenue = rampActive ? monthlyRevenueFull * 0.5 : monthlyRevenueFull;
    const survival = Math.pow(retentionDecimal, m / 12);
    const monthlyNet = (monthlyRevenue - monthlyCost) * survival;
    cumulative += monthlyNet;
    points.push({ month: m, value: cumulative });
  }
  return points;
}

const trimZero = (s) => (s.endsWith('.0') ? s.slice(0, -2) : s);
export function fmtUSD(n) {
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  if (abs >= 1000000) return sign + '$' + trimZero((abs / 1000000).toFixed(abs >= 10000000 ? 0 : 1)) + 'M';
  if (abs >= 1000) return sign + '$' + trimZero((abs / 1000).toFixed(abs >= 10000 ? 0 : 1)) + 'K';
  return sign + '$' + Math.round(abs).toLocaleString('en-US');
}
export const fmtUSDSigned = (n) => (n >= 0 ? '+' : '-') + fmtUSD(Math.abs(n)).replace('-', '');
export const fmtYears = (n) => n.toFixed(1) + ' yrs';
export const fmtPct = (n) => Math.round(n) + '%';

export const FIELDS = [
  { key: 'revenue', label: 'Annual revenue per FTE', min: 0, max: 500000, step: 1000, prefix: '$' },
  { key: 'cost', label: 'Annual employee cost', min: 0, max: 300000, step: 1000, prefix: '$' },
  { key: 'retention', label: 'Retention rate', min: 0, max: 99, step: 1, suffix: '%' },
  { key: 'engagement', label: 'Engagement score', min: 0, max: 100, step: 1, suffix: '/100' },
  { key: 'avgTenure', label: 'Average tenure', min: 0, max: 10, step: 0.5, suffix: 'yrs' },
  { key: 'rampUp', label: 'Ramp-up time', min: 0, max: 24, step: 1, suffix: 'mo' },
];
export const HEADCOUNT_FIELD = { key: 'headcount', label: 'Headcount modeled', min: 1, max: 100000, step: 10, suffix: 'FTEs' };

export function fieldDisplay(field, value) {
  if (field.prefix) return fmtUSD(value);
  if (field.key === 'avgTenure') return `${Number(value).toFixed(1)} yrs`;
  return `${Math.round(value)}${field.suffix === '%' ? '%' : field.suffix === '/100' ? ' / 100' : ' ' + field.suffix}`;
}

// Moving the Future engagement slider also moves revenue and retention.
export function applyEngagementEffect(engagementValue, baseline) {
  const delta = engagementValue - baseline.engagement;
  const revenueField = FIELDS.find((f) => f.key === 'revenue');
  const revenue = clamp(baseline.revenue * (1 + delta * 0.01), revenueField.min, revenueField.max);
  const retention = clamp(baseline.retention + delta * 0.5, 0, 99);
  return { revenue, retention };
}

// Scenario presets: pure functions of the baseline. Icons are attached in EltvApp.jsx.
export const PRESETS = {
  retentionCliff: {
    label: '80% Retention Cliff',
    description: 'Secure 82% retention to unlock compounding.',
    compute: (b) => ({ ...b, retention: b.retention < 82 ? 82 : b.retention }),
  },
  engagementTurnaround: {
    label: 'Engagement Turnaround',
    description: 'Raise engagement to 75% to improve productivity and loyalty.',
    compute: (b) => ({
      ...b,
      engagement: 75,
      revenue: b.revenue * 1.1,
      retention: clamp(b.retention * 1.1, 0, 99),
    }),
  },
  aiMultiplier: {
    label: 'AI Multiplier',
    description: 'Drive a 20% productivity gain through AI tooling without adding headcount.',
    compute: (b) => ({ ...b, revenue: b.revenue * 1.2 }),
  },
  macroSqueeze: {
    label: 'Macro Squeeze',
    description: 'Stress-test margins against a 10% revenue drop paired with 8% cost inflation.',
    compute: (b) => ({ ...b, revenue: b.revenue * 0.9, cost: b.cost * 1.08 }),
  },
  blackSwanTalentCrunch: {
    label: 'Black Swan Talent Crunch',
    description: 'Model a severe labor shock with 2x ramp times and aggressive poaching by competitors.',
    compute: (b) => ({ ...b, rampUp: b.rampUp * 2, retention: clamp(b.retention - 15, 0, 99) }),
  },
};

export function getInsight(activePreset, baseline, deltaPerEmployee, totalDelta) {
  const gained = deltaPerEmployee >= 0;
  const magnitude = fmtUSD(Math.abs(deltaPerEmployee));
  const totalMagnitude = fmtUSD(Math.abs(totalDelta));

  if (activePreset === 'custom') {
    if (Math.abs(deltaPerEmployee) < 1) return 'Future State currently matches your baseline. Adjust a slider or apply a scenario to stress-test it.';
    return gained
      ? `This combination adds ${magnitude} of eLTV per employee over your baseline: ${totalMagnitude} across your modeled workforce.`
      : `This combination erodes ${magnitude} of eLTV per employee versus your baseline: a ${totalMagnitude} exposure across your modeled workforce.`;
  }

  switch (activePreset) {
    case 'retentionCliff':
      return baseline.retention >= 82
        ? 'Your current retention already clears the 82% threshold, so this scenario has no further effect.'
        : `Clearing the 82% retention threshold is worth ${magnitude} more per employee (${totalMagnitude} in aggregate) with no change to cost or revenue.`;
    case 'engagementTurnaround':
      return gained
        ? `Engagement recovery pays for itself: the 10% revenue and retention lift is worth ${magnitude} per employee, ${totalMagnitude} in total.`
        : `Even with the modeled lift, engagement recovery doesn't clear your baseline: ${magnitude} per employee short.`;
    case 'aiMultiplier':
      return `A 20% output lift from AI adoption is worth ${magnitude} more per employee (${totalMagnitude} across the modeled workforce) with retention risk unchanged.`;
    case 'macroSqueeze':
      return gained
        ? `Despite the inflationary pressure, this scenario still nets a gain of ${magnitude} per employee.`
        : `A stagflation shock (revenue down 10%, cost up 8% on inflation) is a double squeeze that costs ${magnitude} per employee, ${totalMagnitude} across the modeled workforce.`;
    case 'blackSwanTalentCrunch':
      return gained
        ? `Even with the talent shock, this scenario still nets a gain of ${magnitude} per employee.`
        : `Aggressive poaching plus a doubled ramp-up time costs ${magnitude} per employee as competitors capture your bench: ${totalMagnitude} at risk across the workforce.`;
    default:
      return '';
  }
}
