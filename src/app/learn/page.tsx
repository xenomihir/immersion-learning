import Link from 'next/link';
import ForcesExplorer from '@/components/ForcesExplorer';

/* ── Scenario modes ── */
const scenarioModes = [
  {
    name: 'Focused',
    icon: 'target',
    description: 'Trace causal chains within a single domain. You\'ll analyze one historical event in depth, identifying the sequence of forces that led to a specific outcome.',
    iconBg: 'bg-cobalt-accent/10',
    iconColor: 'text-cobalt-accent',
    titleColor: 'text-cobalt-accent',
  },
  {
    name: 'Immersive',
    icon: 'landscape',
    description: 'Identify forces operating across multiple domains simultaneously. These cross-system scenarios test your ability to see how economic, political, and financial forces interact.',
    iconBg: 'bg-crimson-accent/10',
    iconColor: 'text-crimson-accent',
    titleColor: 'text-crimson-accent',
  },
  {
    name: 'Fork',
    icon: 'fork_right',
    description: 'Explore counterfactual "what-if" scenarios. Assess how different decisions at key junctures would have altered the probability distribution of outcomes.',
    iconBg: 'bg-secondary/10',
    iconColor: 'text-secondary',
    titleColor: 'text-secondary',
  },
];

/* ── Difficulty levels ── */
const difficultyLevels = [
  { level: 1, name: 'Foundation', description: 'Well-known events with clear causal chains. Good starting point.', width: 'w-[20%]' },
  { level: 2, name: 'Developing', description: 'Moderately known events requiring deeper analysis.', width: 'w-[40%]' },
  { level: 3, name: 'Advanced', description: 'Complex multi-force interactions with less obvious outcomes.', width: 'w-[60%]' },
  { level: 4, name: 'Expert', description: 'Obscure events where pattern recognition is key.', width: 'w-[80%]' },
  { level: 5, name: 'Master', description: 'Highly complex scenarios with subtle, interacting forces.', width: 'w-full' },
];

export default function LearnPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* ═══════ HERO SECTION ═══════ */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-cobalt-accent/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-cobalt-accent text-[28px]">auto_stories</span>
          </div>
          <div>
            <p className="font-ui-label-sm text-ui-label-sm text-cobalt-accent uppercase tracking-widest">Reference Guide</p>
          </div>
        </div>

        <h1 className="font-ui-label-bold text-[44px] leading-[52px] tracking-tight text-primary mb-4">
          The Forces Framework
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Understanding these forces is the key to pattern recognition across history. Before you enter a scenario,
          familiarize yourself with the taxonomy of forces that drive historical outcomes — then learn to spot the
          same shape wherever it reappears in a new disguise.
        </p>

        <div className="flex gap-3 mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-on-primary font-ui-label-bold text-ui-label-bold py-3 px-6 rounded-lg hover:bg-slate-deep transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
            Start a Scenario
          </Link>
          <a
            href="#forces"
            className="inline-flex items-center gap-2 border border-subtle text-primary font-ui-label-bold text-ui-label-bold py-3 px-6 rounded-lg hover:bg-parchment-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
            Explore Forces
          </a>
        </div>
      </section>

      {/* ═══════ FORCES TAXONOMY ═══════ */}
      <section id="forces" className="mb-20 scroll-mt-28">
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-cobalt-accent text-[24px]">category</span>
          <h2 className="font-ui-label-bold text-[28px] leading-[36px] tracking-tight text-primary">
            Forces Taxonomy
          </h2>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mb-10 max-w-2xl">
          25 forces across 4 categories. Every historical scenario is shaped by a combination of these.
          <strong className="text-primary"> Click any force</strong> to open a detailed explanation and a concrete example of the pattern at work.
        </p>

        <ForcesExplorer />
      </section>

      {/* ═══════ SCENARIO MODES ═══════ */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-cobalt-accent text-[24px]">view_carousel</span>
          <h2 className="font-ui-label-bold text-[28px] leading-[36px] tracking-tight text-primary">
            Scenario Modes
          </h2>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-2xl">
          Three modes of analysis, each testing a different aspect of your historical reasoning.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {scenarioModes.map((mode) => (
            <div
              key={mode.name}
              className="bg-parchment-surface border border-subtle rounded-xl p-6 hover:shadow-[0_8px_24px_rgba(0,0,0,0.05)] transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl ${mode.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <span className={`material-symbols-outlined ${mode.iconColor} text-[26px]`}>{mode.icon}</span>
              </div>
              <h3 className={`font-ui-label-bold text-[18px] leading-[24px] ${mode.titleColor} mb-2`}>
                {mode.name}
              </h3>
              <p className="font-ui-label-md text-ui-label-md text-on-surface-variant leading-relaxed">
                {mode.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ DIFFICULTY LEVELS ═══════ */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-cobalt-accent text-[24px]">signal_cellular_alt</span>
          <h2 className="font-ui-label-bold text-[28px] leading-[36px] tracking-tight text-primary">
            Difficulty Levels
          </h2>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-2xl">
          Scenarios are rated 1–5 based on complexity, obscurity, and the subtlety of interacting forces.
        </p>

        <div className="bg-parchment-surface border border-subtle rounded-xl overflow-hidden">
          {difficultyLevels.map((level, i) => (
            <div
              key={level.level}
              className={`flex items-start gap-5 p-5 ${i < difficultyLevels.length - 1 ? 'border-b border-subtle' : ''} hover:bg-parchment-base/50 transition-colors`}
            >
              <div className="w-10 h-10 rounded-lg bg-slate-deep flex items-center justify-center shrink-0">
                <span className="font-ui-label-bold text-[16px] text-on-primary">{level.level}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <h3 className="font-ui-label-bold text-ui-label-bold text-primary">{level.name}</h3>
                </div>
                <p className="font-ui-label-md text-ui-label-md text-on-surface-variant mb-3">{level.description}</p>
                <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                  <div className={`h-full bg-slate-deep rounded-full ${level.width} transition-all`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ BRIER SCORE & CALIBRATION ═══════ */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-cobalt-accent text-[24px]">analytics</span>
          <h2 className="font-ui-label-bold text-[28px] leading-[36px] tracking-tight text-primary">
            Brier Score &amp; Calibration
          </h2>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-2xl">
          Your performance is measured by how well-calibrated your probability estimates are, not just whether you&apos;re right or wrong.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Brier Score explainer */}
          <div className="bg-parchment-surface border border-subtle rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-cobalt-accent/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-cobalt-accent text-[22px]">functions</span>
              </div>
              <h3 className="font-ui-label-bold text-[18px] leading-[24px] text-primary">The Brier Score</h3>
            </div>
            <p className="font-ui-label-md text-ui-label-md text-on-surface-variant leading-relaxed mb-4">
              The Brier score measures the accuracy of probabilistic predictions. It ranges from <strong className="text-primary">0</strong> (perfect)
              to <strong className="text-primary">2</strong> (worst possible).
            </p>
            <div className="bg-parchment-base rounded-lg p-4 border border-subtle mb-4">
              <p className="font-ui-label-bold text-[13px] text-on-surface-variant text-center tracking-wide mb-2">FORMULA</p>
              <p className="font-ui-label-bold text-[16px] text-primary text-center">
                BS = (1/N) × Σ(f<sub>i</sub> − o<sub>i</sub>)²
              </p>
              <p className="font-ui-label-sm text-ui-label-sm text-on-surface-variant text-center mt-2">
                f = your forecast probability · o = actual outcome (0 or 1)
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cobalt-accent" />
                <span className="font-ui-label-md text-ui-label-md text-on-surface-variant"><strong className="text-primary">0.0 – 0.1</strong> — Excellent calibration</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <span className="font-ui-label-md text-ui-label-md text-on-surface-variant"><strong className="text-primary">0.1 – 0.25</strong> — Good, room to improve</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gold-accent" />
                <span className="font-ui-label-md text-ui-label-md text-on-surface-variant"><strong className="text-primary">0.25 – 0.5</strong> — Developing calibration</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-crimson-accent" />
                <span className="font-ui-label-md text-ui-label-md text-on-surface-variant"><strong className="text-primary">&gt; 0.5</strong> — Significant overconfidence or miscalibration</span>
              </div>
            </div>
          </div>

          {/* Calibration explainer */}
          <div className="bg-parchment-surface border border-subtle rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-crimson-accent/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-crimson-accent text-[22px]">tune</span>
              </div>
              <h3 className="font-ui-label-bold text-[18px] leading-[24px] text-primary">What is Calibration?</h3>
            </div>
            <p className="font-ui-label-md text-ui-label-md text-on-surface-variant leading-relaxed mb-4">
              Calibration measures whether your confidence matches reality. If you say something is &quot;70% likely,&quot; it should happen about 70% of the time.
            </p>
            <div className="flex flex-col gap-4">
              <div className="bg-parchment-base rounded-lg p-4 border border-subtle">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-cobalt-accent text-[18px]">check_circle</span>
                  <span className="font-ui-label-bold text-ui-label-bold text-primary">Well-calibrated</span>
                </div>
                <p className="font-ui-label-md text-ui-label-md text-on-surface-variant leading-relaxed">
                  Events you assign 80% probability to actually occur ~80% of the time. Your confidence tracks reality.
                </p>
              </div>
              <div className="bg-parchment-base rounded-lg p-4 border border-subtle">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-crimson-accent text-[18px]">warning</span>
                  <span className="font-ui-label-bold text-ui-label-bold text-primary">Overconfident</span>
                </div>
                <p className="font-ui-label-md text-ui-label-md text-on-surface-variant leading-relaxed">
                  Events you assign 90% probability to only happen ~60% of the time. You think you know more than you do.
                </p>
              </div>
              <div className="bg-parchment-base rounded-lg p-4 border border-subtle">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">info</span>
                  <span className="font-ui-label-bold text-ui-label-bold text-primary">Underconfident</span>
                </div>
                <p className="font-ui-label-md text-ui-label-md text-on-surface-variant leading-relaxed">
                  Events you assign 40% probability to actually happen ~70% of the time. You undervalue your knowledge.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How it all connects */}
        <div className="mt-8 bg-slate-deep rounded-xl p-6 text-on-primary">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-[24px] text-gold-accent">lightbulb</span>
            <h3 className="font-ui-label-bold text-[18px] leading-[24px]">How It All Connects</h3>
          </div>
          <p className="font-ui-label-md text-[14px] leading-[22px] text-inverse-on-surface max-w-3xl">
            In each scenario, you&apos;ll identify which forces are at play, estimate outcome probabilities, and explain your reasoning.
            Your Brier score tracks <strong className="text-on-primary">prediction accuracy</strong>, force recall measures <strong className="text-on-primary">pattern recognition</strong>,
            and the reasoning score evaluates your <strong className="text-on-primary">causal logic</strong>. Over time, your calibration curve reveals
            systematic biases — and your force blindspots show which categories you consistently miss.
          </p>
          <div className="flex gap-3 mt-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-parchment-base text-primary font-ui-label-bold text-ui-label-bold py-2.5 px-5 rounded-lg hover:bg-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              Begin Your First Scenario
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
