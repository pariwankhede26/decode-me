import React from "react";
import { IconFocus, IconNutrition, IconPattern, IconChat, IconShield } from "./Icons";

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenPrivacyCenter: () => void;
  onOpenLegalModal: (mode: "tos" | "privacy") => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onOpenPrivacyCenter,
  onOpenLegalModal,
}) => {
  return (
    <div className="min-h-screen relative z-10 selection:bg-[#FFE4EF] selection:text-[#E11D74] pb-24">
      {/* Minimal Top Bar */}
      <header className="sticky top-0 z-40 bg-[rgba(255,255,255,0.72)] backdrop-blur-md border-b border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
          {/* Logo */}
          <div className="logo-brand">
            Decode <span>Me</span>
          </div>

          {/* Links and CTA */}
          <div className="flex items-center space-x-8 text-xs">
            <nav className="hidden md:flex items-center space-x-7 text-[var(--muted)] font-medium">
              <a href="#features" className="hover:text-[var(--rose)] transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-[var(--rose)] transition-colors">
                How it works
              </a>
              <a href="#privacy" className="hover:text-[var(--rose)] transition-colors">
                Privacy
              </a>
            </nav>

            <button
              onClick={onGetStarted}
              className="btn-shimmer text-xs py-2.5 px-6"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* Main Landing Sections */}
      <main className="max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <section className="relative pt-20 pb-20 md:pt-28 md:pb-28 text-center">
          <div className="relative max-w-3xl mx-auto space-y-6">
            <span className="chip-pill text-xs py-1.5 px-4 font-semibold text-[var(--rose)]">
              AI-Powered Personal Digital Twin
            </span>

            <h1 className="gradient-title">
              Understand your habits. <br className="hidden sm:inline" />
              Focus with quiet clarity.
            </h1>

            <p className="text-base md:text-lg text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
              Decode Me connects your focus sessions, screen habits, nutrition, and daily sleep patterns into a calm, coherent reflection of how you thrive.
            </p>

            <div className="pt-2">
              <button
                onClick={onGetStarted}
                className="btn-shimmer text-sm py-4 px-9 shadow-lg"
              >
                Explore Your Digital Twin
              </button>
            </div>
          </div>

          {/* Preview Mockup Card */}
          <div className="relative mt-16 max-w-4xl mx-auto">
            <div className="card-aesthetic text-left p-6 md:p-8">
              {/* Mockup header */}
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-4 mb-6 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="font-fraunces text-base font-semibold text-[var(--text)]">
                    Twin status &middot; Active rhythm
                  </span>
                </div>
                <div className="chip-pill text-xs py-1 px-3.5">
                  Balance <b>77 / 100</b>
                </div>
              </div>

              {/* Mockup split grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
                {/* Left side preview */}
                <div className="md:col-span-7 space-y-3.5">
                  <div className="box-desc space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-fraunces text-base font-semibold text-[var(--text)]">Focus Guardian</span>
                      <span className="chip-pill text-[10px] py-0.5 px-2">52 min focused</span>
                    </div>
                    <p className="text-[var(--muted)] text-xs">
                      DBMS Unit 3: 2 distraction loops prevented through mindful contextual friction.
                    </p>
                  </div>

                  <div className="box-desc space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-fraunces text-base font-semibold text-[var(--text)]">Nutrition Twin</span>
                      <span className="chip-pill text-[10px] py-0.5 px-2">~645 kcal</span>
                    </div>
                    <p className="text-[var(--muted)] text-xs">
                      Dal, rice, and fresh vegetables: correlated with sustained afternoon mental stamina.
                    </p>
                  </div>
                </div>

                {/* Right side preview */}
                <div className="md:col-span-5 box-desc flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[var(--rose)] block mb-1">
                      Discovered Correlation (r = -0.68)
                    </span>
                    <p className="font-fraunces text-base text-[var(--text)] leading-snug">
                      Pre-study entertainment scrolling closely associates with lower session completion.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[var(--line)] mt-3 flex justify-between text-[11px] text-[var(--muted)]">
                    <span>Cohort: 2,000</span>
                    <span className="font-semibold text-[var(--rose)]">94% confidence</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-28 border-t border-[var(--line)]">
          <div className="max-w-xl mx-auto text-center mb-16 space-y-3">
            <h2 className="font-fraunces text-3xl md:text-4xl font-medium text-[var(--text)]">
              Built to connect every habit
            </h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Standard tools measure numbers in isolation. Decode Me connects them to illuminate the subtle conditions behind your best days.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-aesthetic space-y-3.5">
              <div className="w-10 h-10 rounded-full bg-[var(--blush)] border border-[var(--line)] flex items-center justify-center text-[var(--rose)] text-lg">
                <IconFocus className="w-5 h-5 text-[var(--rose)]" />
              </div>
              <h3 className="font-fraunces text-2xl font-medium text-[var(--text)]">Focus Guardian</h3>
              <p className="text-xs md:text-sm text-[var(--muted)] leading-relaxed">
                Context-aware distraction alerts and protected focus sessions that learn your true schedule rhythms.
              </p>
            </div>

            <div className="card-aesthetic space-y-3.5">
              <div className="w-10 h-10 rounded-full bg-[var(--blush)] border border-[var(--line)] flex items-center justify-center text-[var(--rose)] text-lg">
                <IconNutrition className="w-5 h-5 text-[var(--rose)]" />
              </div>
              <h3 className="font-fraunces text-2xl font-medium text-[var(--text)]">Nutrition Twin</h3>
              <p className="text-xs md:text-sm text-[var(--muted)] leading-relaxed">
                Photo-based meal analysis linking nutritional balance and energy to afternoon cognitive endurance.
              </p>
            </div>

            <div className="card-aesthetic space-y-3.5">
              <div className="w-10 h-10 rounded-full bg-[var(--blush)] border border-[var(--line)] flex items-center justify-center text-[var(--rose)] text-lg">
                <IconPattern className="w-5 h-5 text-[var(--rose)]" />
              </div>
              <h3 className="font-fraunces text-2xl font-medium text-[var(--text)]">Pattern Engine</h3>
              <p className="text-xs md:text-sm text-[var(--muted)] leading-relaxed">
                Discovers correlations across your daily routine using 2,000 real student lifestyle baselines.
              </p>
            </div>

            <div className="card-aesthetic space-y-3.5">
              <div className="w-10 h-10 rounded-full bg-[var(--blush)] border border-[var(--line)] flex items-center justify-center text-[var(--rose)] text-lg">
                <IconChat className="w-5 h-5 text-[var(--rose)]" />
              </div>
              <h3 className="font-fraunces text-2xl font-medium text-[var(--text)]">Ask My Twin</h3>
              <p className="text-xs md:text-sm text-[var(--muted)] leading-relaxed">
                Conversational AI interface to query your personal habit data and uncover your ideal productivity moments.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 md:py-28 border-t border-[var(--line)]">
          <div className="max-w-xl mx-auto text-center mb-16 space-y-3">
            <h2 className="font-fraunces text-3xl md:text-4xl font-medium text-[var(--text)]">
              How it works
            </h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Three gentle steps from daily activity to personalized routine intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-aesthetic space-y-3.5">
              <span className="font-fraunces text-3xl text-[var(--rose)] font-semibold block">01</span>
              <h3 className="font-fraunces text-xl font-medium text-[var(--text)]">Connect signals</h3>
              <p className="text-xs md:text-sm text-[var(--muted)] leading-relaxed">
                Record your focus sessions, screen budgets, meal photos, and reflections with total control.
              </p>
            </div>

            <div className="card-aesthetic space-y-3.5">
              <span className="font-fraunces text-3xl text-[var(--rose)] font-semibold block">02</span>
              <h3 className="font-fraunces text-xl font-medium text-[var(--text)]">Discover patterns</h3>
              <p className="text-xs md:text-sm text-[var(--muted)] leading-relaxed">
                Our pattern engine observes connections between sleep duration, screen scrolling, and task follow-through.
              </p>
            </div>

            <div className="card-aesthetic space-y-3.5">
              <span className="font-fraunces text-3xl text-[var(--rose)] font-semibold block">03</span>
              <h3 className="font-fraunces text-xl font-medium text-[var(--text)]">Calibrate daily</h3>
              <p className="text-xs md:text-sm text-[var(--muted)] leading-relaxed">
                Receive contextual smart nudges, respectful distraction interventions, and tailored offline hobby breaks.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section id="privacy" className="py-20 md:py-28 border-t border-[var(--line)]">
          <div className="card-aesthetic max-w-3xl mx-auto text-center p-8 md:p-12 space-y-6">
            <div className="w-12 h-12 rounded-full bg-[var(--blush)] border border-[var(--line)] mx-auto flex items-center justify-center text-[var(--rose)]">
              <IconShield className="w-6 h-6 text-[var(--rose)]" />
            </div>

            <div className="space-y-3">
              <h2 className="font-fraunces text-3xl md:text-4xl font-medium text-[var(--text)]">
                Your digital twin belongs to you
              </h2>
              <p className="text-xs md:text-sm text-[var(--muted)] max-w-lg mx-auto leading-relaxed">
                We believe in complete user sovereignty. All telemetry is strictly permissioned, never sold to advertisers, and can be purged or exported with a single click.
              </p>
            </div>

            <div>
              <button
                onClick={onOpenPrivacyCenter}
                className="btn-shimmer text-xs py-3 px-7"
              >
                Inspect Privacy Control Center &rarr;
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--line)] py-10 text-xs text-[var(--muted)] max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="logo-brand text-sm">
          Decode <span>Me</span> &middot; <span className="font-sans font-normal text-xs text-[var(--muted)]">Personal Digital Twin</span>
        </div>

        <div className="flex items-center space-x-6">
          <button
            onClick={() => onOpenLegalModal("tos")}
            className="hover:text-[var(--rose)] transition-colors bg-transparent border-0 cursor-pointer"
          >
            Terms of Service
          </button>
          <button
            onClick={() => onOpenLegalModal("privacy")}
            className="hover:text-[var(--rose)] transition-colors bg-transparent border-0 cursor-pointer"
          >
            Privacy Policy
          </button>
        </div>
      </footer>
    </div>
  );
};
