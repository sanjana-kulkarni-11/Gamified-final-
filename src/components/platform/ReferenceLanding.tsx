import React from 'react';
import { Award, BookOpen, Gamepad2, Play } from 'lucide-react';
import { GameMode } from '../../types/game';

interface ReferenceLandingProps {
  onLaunchGame: (mode: GameMode) => void;
  onNavigate: (tab: 'learn' | 'games' | 'achievements') => void;
  onOpenProfile: () => void;
}

const steps = [
  {
    number: '1',
    title: 'MOVE WITH PURPOSE',
    description: 'Run the city. Learn how better code saves energy.',
    action: 'START A SPRINT',
    icon: Play,
    accent: '#20b9aa',
    run: (props: ReferenceLandingProps) => props.onLaunchGame('endless'),
  },
  {
    number: '2',
    title: 'LEARN THE SYSTEM',
    description: 'Explore BCA concepts, one topic at a time.',
    action: 'OPEN COURSES',
    icon: BookOpen,
    accent: '#20b9aa',
    run: (props: ReferenceLandingProps) => props.onNavigate('learn'),
  },
  {
    number: '3',
    title: 'THINK IT THROUGH',
    description: 'Take a quiz. Score 75% to unlock what comes next.',
    action: 'PLAY & PRACTICE',
    icon: Gamepad2,
    accent: '#20b9aa',
    run: (props: ReferenceLandingProps) => props.onNavigate('games'),
  },
  {
    number: '4',
    title: 'SEE YOUR IMPACT',
    description: 'Build your streak and see how far you have come.',
    action: 'VIEW PROGRESS',
    icon: Award,
    accent: '#20b9aa',
    run: (props: ReferenceLandingProps) => props.onNavigate('achievements'),
  },
];

export const ReferenceLanding: React.FC<ReferenceLandingProps> = (props) => (
  <main className="reference-landing relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black px-4 py-12 text-white sm:px-8">
    <div className="reference-laptop w-full max-w-[1120px]">
      <div className="reference-screen-shell">
        <div className="reference-screen">
          <div className="reference-screen-topline">
            <button className="reference-brand" onClick={() => props.onLaunchGame('endless')} aria-label="Start EcoRush">
              ECO<span>RUSH</span>
            </button>
            <button className="reference-profile" onClick={props.onOpenProfile}>
              PROFILE <span>↗</span>
            </button>
          </div>

          <div className="reference-grid" aria-label="EcoRush learning journey">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <button
                  className={`reference-step reference-step-${index + 1}`}
                  key={step.number}
                  onClick={() => step.run(props)}
                  style={{ '--step-accent': step.accent } as React.CSSProperties}
                >
                  <span className="reference-step-number">{step.number}</span>
                  <span className="reference-step-rule" />
                  <span className="reference-step-title">{step.title}</span>
                  <span className="reference-step-description">{step.description}</span>
                  <span className="reference-step-action"><Icon size={12} />{step.action}<span>↗</span></span>
                </button>
              );
            })}
          </div>

          <div className="reference-screen-caption">
            <span>LEARN BY PLAYING</span>
            <span>01 — 04</span>
          </div>
          <span className="reference-cursor" aria-hidden="true" />
        </div>
      </div>
      <div className="reference-laptop-base"><span /></div>
      <div className="reference-laptop-shadow" />
    </div>
  </main>
);
