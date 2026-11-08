import { useMemo, useState } from 'react';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceDot,
  ResponsiveContainer,
} from 'recharts';
import { Mountain, HeartPulse, Cpu, TrendingDown, Zap, TrendingUp, Minus, Lightbulb, Check, Info } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { home } from '../content/site.js';
import { eltvPage } from '../content/eltv.js';
import {
  TOOLTIPS,
  DEFAULTS,
  TIME_HORIZON_MONTHS,
  FIELDS,
  HEADCOUNT_FIELD,
  PRESETS,
  clamp,
  computeELTV,
  buildTimeSeries,
  applyEngagementEffect,
  getInsight,
  fieldDisplay,
  fmtUSD,
  fmtUSDSigned,
  fmtYears,
  fmtPct,
} from './model.js';
import './eltv.css';

// Chart colors: black and grey, with red for negative value and key numbers.
const INK = '#222222';
const MUTED = '#6b6b6b';
const FAINT = '#8b8b8b';
const RULE = '#e2e2e2';
const RED = '#ED2434';
const FONT = "'Jost', 'Futura', 'Century Gothic', 'Helvetica Neue', Arial, sans-serif";

const PRESET_ICONS = {
  retentionCliff: Mountain,
  engagementTurnaround: HeartPulse,
  aiMultiplier: Cpu,
  macroSqueeze: TrendingDown,
  blackSwanTalentCrunch: Zap,
};

// Hover or keyboard-focus the "i" to read the definition.
function InfoTip({ text, wide }) {
  return (
    <span className={`tip${wide ? ' tip-wide' : ''}`}>
      <button type="button" className="tip-trigger" aria-label="What this means">
        <Info size={13} aria-hidden="true" />
      </button>
      <span role="tooltip" className="tip-body">
        {text}
      </span>
    </span>
  );
}

function NumberField({ field, value, onChange, id }) {
  return (
    <div className="num-field">
      {field.prefix && <span className="num-affix">{field.prefix}</span>}
      <input
        id={id}
        type="number"
        inputMode="decimal"
        value={value}
        min={field.min}
        max={field.max}
        step={field.step}
        onChange={(e) => onChange(clamp(Number(e.target.value), field.min, field.max))}
      />
      {field.suffix && <span className="num-affix">{field.suffix}</span>}
    </div>
  );
}

function FutureSlider({ field, value, onChange }) {
  const id = `future-${field.key}`;
  return (
    <div>
      <div className="slider-head">
        <label htmlFor={id}>Future</label>
        <span className="tabular">{fieldDisplay(field, value)}</span>
      </div>
      <input
        id={id}
        className="slider"
        type="range"
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function StatRow({ label, value, tooltip }) {
  return (
    <div className="stat-row">
      <span className="stat-row-label">
        {label}
        {tooltip && <InfoTip text={tooltip} />}
      </span>
      <span className="tabular">{value}</span>
    </div>
  );
}

function StepLabel({ n, children }) {
  return (
    <div className="step-label">
      <span className="step-dot" aria-hidden="true">
        {n}
      </span>
      <h2>
        <span className="visually-hidden">Step {n}: </span>
        {children}
      </h2>
    </div>
  );
}

function Simulator() {
  const [baselineVals, setBaselineVals] = useState({ ...DEFAULTS });
  const [futManual, setFutManual] = useState({ ...DEFAULTS });
  const [activePreset, setActivePreset] = useState('custom');

  const setBaselineField = (key, value) => setBaselineVals((prev) => ({ ...prev, [key]: value }));

  const scenario = useMemo(
    () => (activePreset === 'custom' ? futManual : PRESETS[activePreset].compute(baselineVals)),
    [activePreset, futManual, baselineVals]
  );

  const handleFutureChange = (key, value) => {
    setFutManual((prev) => {
      const src = activePreset === 'custom' ? prev : scenario;
      if (key === 'engagement') {
        const derived = applyEngagementEffect(value, baselineVals);
        return { ...src, engagement: value, revenue: derived.revenue, retention: derived.retention };
      }
      return { ...src, [key]: value };
    });
    if (activePreset !== 'custom') setActivePreset('custom');
  };

  const applyPreset = (id) => {
    setActivePreset(id);
    setFutManual(PRESETS[id].compute(baselineVals));
  };

  const baselineStats = useMemo(() => computeELTV(baselineVals), [baselineVals]);
  const scenarioStats = useMemo(() => computeELTV(scenario), [scenario]);

  const deltaPerEmployee = scenarioStats.net - baselineStats.net;
  const totalDelta = deltaPerEmployee * baselineVals.headcount;
  const deltaPct = baselineStats.net !== 0 ? (deltaPerEmployee / Math.abs(baselineStats.net)) * 100 : 0;
  const insight = getInsight(activePreset, baselineVals, deltaPerEmployee, totalDelta);

  const timeSeries = useMemo(() => {
    const baseSeries = buildTimeSeries(baselineVals);
    const scenSeries = buildTimeSeries(scenario);
    return baseSeries.map((p, i) => ({ month: p.month, Baseline: Math.round(p.value), Scenario: Math.round(scenSeries[i].value) }));
  }, [baselineVals, scenario]);

  const zeroOffset = useMemo(() => {
    const values = timeSeries.map((d) => d.Scenario);
    const max = Math.max(...values);
    const min = Math.min(...values);
    if (max <= 0) return 0;
    if (min >= 0) return 1;
    return max / (max - min);
  }, [timeSeries]);

  const breakEvenMonth = useMemo(() => {
    for (let i = 1; i < timeSeries.length; i++) {
      const prev = timeSeries[i - 1];
      const cur = timeSeries[i];
      if (prev.Scenario < 0 && cur.Scenario >= 0) {
        const frac = (0 - prev.Scenario) / (cur.Scenario - prev.Scenario);
        return prev.month + frac * (cur.month - prev.month);
      }
    }
    return null;
  }, [timeSeries]);

  const DeltaIcon = deltaPerEmployee > 0 ? TrendingUp : deltaPerEmployee < 0 ? TrendingDown : Minus;
  const tone = deltaPerEmployee < 0 ? 'is-negative' : 'is-positive';

  return (
    <div className="eltv-grid">
      {/* Step 1: inputs */}
      <section className="eltv-panel eltv-inputs" aria-labelledby="step-1">
        <div id="step-1">
          <StepLabel n={1}>Baseline &amp; Future State Inputs</StepLabel>
        </div>

        <div className="input-card">
          <label className="input-title" htmlFor="baseline-headcount">
            {HEADCOUNT_FIELD.label}
          </label>
          <NumberField
            id="baseline-headcount"
            field={HEADCOUNT_FIELD}
            value={baselineVals.headcount}
            onChange={(v) => setBaselineField('headcount', v)}
          />
        </div>

        {FIELDS.map((field) => (
          <div key={field.key} className="input-card">
            <div className="input-title">
              {field.label}
              <InfoTip text={TOOLTIPS[field.key]} />
            </div>
            <div className="input-pair">
              <div>
                <label className="input-sub" htmlFor={`baseline-${field.key}`}>
                  Baseline
                </label>
                <NumberField
                  id={`baseline-${field.key}`}
                  field={field}
                  value={baselineVals[field.key]}
                  onChange={(v) => setBaselineField(field.key, v)}
                />
              </div>
              <FutureSlider field={field} value={scenario[field.key]} onChange={(v) => handleFutureChange(field.key, v)} />
            </div>
          </div>
        ))}
      </section>

      {/* Steps 2 and 3: results */}
      <div className="eltv-results">
        <section aria-labelledby="step-2">
          <div id="step-2">
            <StepLabel n={2}>Review Financial Impact</StepLabel>
          </div>

          <div className="result-cards">
            <div className="result-card">
              <div className="result-title">Baseline eLTV</div>
              <div className="result-value muted-value tabular">{fmtUSD(baselineStats.net)}</div>
              <StatRow label="Revenue / FTE" value={fmtUSD(baselineVals.revenue)} tooltip={TOOLTIPS.revenue} />
              <StatRow label="Retention" value={fmtPct(baselineVals.retention)} tooltip={TOOLTIPS.retention} />
              <StatRow label="Effective tenure" value={fmtYears(baselineStats.effectiveTenure)} tooltip={TOOLTIPS.effectiveTenure} />
            </div>

            <div className={`result-card result-card-scenario ${tone}`}>
              <div className="result-title">Scenario eLTV</div>
              <div className="result-value tabular" aria-live="polite">
                {fmtUSD(scenarioStats.net)}
              </div>
              <StatRow label="Revenue / FTE" value={fmtUSD(scenario.revenue)} tooltip={TOOLTIPS.revenue} />
              <StatRow label="Retention" value={fmtPct(scenario.retention)} tooltip={TOOLTIPS.retention} />
              <StatRow label="Effective tenure" value={fmtYears(scenarioStats.effectiveTenure)} tooltip={TOOLTIPS.effectiveTenure} />
            </div>
          </div>

          <div className={`delta-bar ${tone}`}>
            <div className="delta-item">
              <DeltaIcon size={18} aria-hidden="true" />
              <div>
                <div className="delta-label">Δ Net eLTV per employee</div>
                <div className="delta-value tabular">
                  {fmtUSDSigned(deltaPerEmployee)}{' '}
                  <span className="delta-pct">
                    ({deltaPerEmployee >= 0 ? '+' : ''}
                    {deltaPct.toFixed(0)}%)
                  </span>
                </div>
              </div>
            </div>
            <div className="delta-item">
              <DeltaIcon size={18} aria-hidden="true" />
              <div>
                <div className="delta-label">Total Delta ({baselineVals.headcount.toLocaleString()} FTEs)</div>
                <div className="delta-value tabular">{fmtUSDSigned(totalDelta)}</div>
              </div>
            </div>
          </div>

          <div className="insight">
            <Lightbulb size={17} aria-hidden="true" />
            <div>
              <div className="insight-title">Executive Insight</div>
              <p aria-live="polite">{insight}</p>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-head">
              <h3>
                eLTV over Employee Lifecycle
                <InfoTip
                  wide
                  text="Cumulative net value per employee from hire to month 36. Starts negative (acquisition overhead), grows slowly during ramp-up when productivity is halved, then accelerates once fully ramped, tapering over time as retention risk compounds."
                />
              </h3>
              <span className="chart-note">Cumulative net value, months 0–36</span>
            </div>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={timeSeries} margin={{ top: 22, right: 16, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset={0} stopColor={INK} stopOpacity={0.14} />
                      <stop offset={zeroOffset} stopColor={INK} stopOpacity={0.14} />
                      <stop offset={zeroOffset} stopColor={RED} stopOpacity={0.28} />
                      <stop offset={1} stopColor={RED} stopOpacity={0.28} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" vertical={false} />
                  <XAxis
                    dataKey="month"
                    type="number"
                    domain={[0, TIME_HORIZON_MONTHS]}
                    ticks={[0, 6, 12, 18, 24, 30, 36]}
                    tickFormatter={(v) => `${v}mo`}
                    tick={{ fontFamily: FONT, fontSize: 12, fill: FAINT }}
                    axisLine={{ stroke: RULE }}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) => fmtUSD(v)}
                    tick={{ fontFamily: FONT, fontSize: 12, fill: FAINT }}
                    axisLine={false}
                    tickLine={false}
                    width={58}
                  />
                  <Tooltip
                    formatter={(v) => fmtUSD(v)}
                    labelFormatter={(v) => `Month ${Math.round(v)}`}
                    contentStyle={{ fontFamily: FONT, fontSize: 13, borderRadius: 3, border: `1px solid ${RULE}` }}
                  />
                  <Legend wrapperStyle={{ fontFamily: FONT, fontSize: 13, color: MUTED }} iconType="plainline" />
                  <ReferenceLine y={0} stroke={INK} strokeWidth={1.5} />
                  {breakEvenMonth != null && (
                    <>
                      <ReferenceLine
                        x={breakEvenMonth}
                        stroke={MUTED}
                        strokeDasharray="3 3"
                        label={{
                          value: `Break-even: Mo ${Math.round(breakEvenMonth)}`,
                          position: 'top',
                          fill: RED,
                          fontSize: 12,
                          fontFamily: FONT,
                          fontWeight: 500,
                        }}
                      />
                      <ReferenceDot x={breakEvenMonth} y={0} r={5} fill={RED} stroke="#FFFFFF" strokeWidth={1.5} />
                    </>
                  )}
                  <Area type="monotone" dataKey="Scenario" stroke={INK} strokeWidth={2.5} fill="url(#splitColor)" dot={false} />
                  <Line type="monotone" dataKey="Baseline" stroke={FAINT} strokeWidth={2} strokeDasharray="4 3" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="presets" aria-labelledby="step-3">
          <div id="step-3">
            <StepLabel n={3}>Apply a Strategic Scenario</StepLabel>
          </div>
          <div className="preset-list">
            {Object.entries(PRESETS).map(([id, p]) => {
              const Icon = PRESET_ICONS[id];
              const active = activePreset === id;
              const previewNet = computeELTV(p.compute(baselineVals)).net;
              const positive = previewNet - baselineStats.net >= 0;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => applyPreset(id)}
                  className={`preset${active ? ' is-active' : ''}`}
                >
                  <span className={`preset-icon ${positive ? 'is-positive' : 'is-negative'}`} aria-hidden="true">
                    <Icon size={15} />
                  </span>
                  <span className="preset-text">
                    <span className="preset-label">{p.label}</span>
                    <span className="preset-desc">{p.description}</span>
                  </span>
                  {active && (
                    <span className="preset-check" aria-hidden="true">
                      <Check size={12} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function EltvApp() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <section className="section eltv-page" aria-labelledby="eltv-title">
          <div className="container">
            <div className="eltv-intro">
              <p className="label">{eltvPage.eyebrow}</p>
              <h1 id="eltv-title">{eltvPage.title}</h1>
              <p className="lead">{eltvPage.intro}</p>
              <div className="formula">
                <span className="formula-name">Powered by the Tskhay-Charney Formula: </span>
                Net eLTV = (Annual Revenue per FTE − Annual Employee Cost) × Effective Tenure × Retention Factor − (20% ×
                Annual Employee Cost)
              </div>
              {eltvPage.collaboration && <p className="muted collab">{eltvPage.collaboration}</p>}
            </div>

            <Simulator />

            <p className="muted eltv-disclaimer">{eltvPage.disclaimer}</p>
          </div>
        </section>

        <section className="section section-alt eltv-cta" aria-labelledby="eltv-cta-title">
          <div className="container eltv-cta-inner">
            <div>
              <h2 id="eltv-cta-title">{eltvPage.ctaTitle}</h2>
              <p className="lead">{eltvPage.ctaBody}</p>
            </div>
            <a className="button" href={home(eltvPage.ctaHref)}>
              {eltvPage.ctaLabel}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
