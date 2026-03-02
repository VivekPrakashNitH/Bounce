import React, { useState } from 'react';

interface CodeStep {
    title: string;
    description: string;
    starterCode: string;
    hint: string;
    solution: string;
}

interface GuidedImplementationProps {
    stageId: string;
    stageName: string;
    steps: CodeStep[];
    language?: string;
}

/**
 * Step-by-step guided code implementation.
 * Shows starter code, hints on demand, and a solution reveal.
 */
export const GuidedImplementation: React.FC<GuidedImplementationProps> = ({
    stageId,
    stageName,
    steps,
    language = 'java',
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

    const step = steps[currentStep];
    if (!step) return null;

    const markComplete = () => {
        setCompletedSteps(prev => new Set(prev).add(currentStep));
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
            setShowHint(false);
            setShowSolution(false);
        }
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            marginTop: '24px',
        }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <span style={{ fontSize: '24px' }}>🔨</span>
                <div>
                    <h3 style={{ color: '#e2e8f0', margin: 0, fontSize: '18px' }}>
                        Guided Implementation — {stageName}
                    </h3>
                    <p style={{ color: '#94a3b8', margin: '4px 0 0', fontSize: '13px' }}>
                        Step {currentStep + 1} of {steps.length} · {completedSteps.size} completed
                    </p>
                </div>
            </div>

            {/* Progress dots */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {steps.map((_, i) => (
                    <div key={i} style={{
                        width: '32px', height: '4px', borderRadius: '2px',
                        background: completedSteps.has(i) ? '#22c55e' : i === currentStep ? '#6366f1' : '#334155',
                        cursor: 'pointer', transition: 'background 0.3s',
                    }} onClick={() => { setCurrentStep(i); setShowHint(false); setShowSolution(false); }} />
                ))}
            </div>

            {/* Step content */}
            <div style={{ marginBottom: '16px' }}>
                <h4 style={{ color: '#c4b5fd', margin: '0 0 8px', fontSize: '15px' }}>
                    {step.title}
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                    {step.description}
                </p>
            </div>

            {/* Starter code */}
            <div style={{
                background: '#0d1117', borderRadius: '8px', padding: '16px',
                fontFamily: '"JetBrains Mono", "Fira Code", monospace', fontSize: '13px',
                color: '#e6edf3', lineHeight: '1.5', overflowX: 'auto',
                border: '1px solid #30363d', marginBottom: '16px',
            }}>
                <div style={{ color: '#8b949e', fontSize: '11px', marginBottom: '8px' }}>
          // {language} — starter code
                </div>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{step.starterCode}</pre>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={() => setShowHint(!showHint)} style={{
                    padding: '8px 16px', borderRadius: '8px', border: '1px solid #fbbf24',
                    background: showHint ? 'rgba(251, 191, 36, 0.15)' : 'transparent',
                    color: '#fbbf24', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s',
                }}>
                    💡 {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
                <button onClick={() => setShowSolution(!showSolution)} style={{
                    padding: '8px 16px', borderRadius: '8px', border: '1px solid #6366f1',
                    background: showSolution ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    color: '#6366f1', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s',
                }}>
                    👁 {showSolution ? 'Hide Solution' : 'Reveal Solution'}
                </button>
                <button onClick={markComplete} style={{
                    padding: '8px 16px', borderRadius: '8px', border: 'none',
                    background: completedSteps.has(currentStep) ? '#22c55e' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                    marginLeft: 'auto', transition: 'all 0.2s',
                }}>
                    {completedSteps.has(currentStep) ? '✓ Completed' : 'Mark Complete →'}
                </button>
            </div>

            {/* Hint */}
            {showHint && (
                <div style={{
                    marginTop: '12px', padding: '12px 16px', borderRadius: '8px',
                    background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.2)',
                    color: '#fde68a', fontSize: '13px', lineHeight: '1.6',
                }}>
                    💡 {step.hint}
                </div>
            )}

            {/* Solution */}
            {showSolution && (
                <div style={{
                    marginTop: '12px', background: '#0d1117', borderRadius: '8px', padding: '16px',
                    fontFamily: '"JetBrains Mono", "Fira Code", monospace', fontSize: '13px',
                    color: '#7ee787', lineHeight: '1.5', overflowX: 'auto',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                }}>
                    <div style={{ color: '#22c55e', fontSize: '11px', marginBottom: '8px' }}>
            // solution
                    </div>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{step.solution}</pre>
                </div>
            )}
        </div>
    );
};
