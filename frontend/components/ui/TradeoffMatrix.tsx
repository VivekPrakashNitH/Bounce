import React, { useState } from 'react';

interface TradeoffOption {
    id: string;
    name: string;
    pros: string[];
    cons: string[];
    whenToUse: string;
    votes?: number;
}

interface TradeoffMatrixProps {
    concept: string;
    question: string;
    options: TradeoffOption[];
    onVote?: (optionId: string) => void;
}

/**
 * Interactive trade-off comparison matrix.
 * Users can vote on which approach they'd choose — builds community consensus.
 */
export const TradeoffMatrix: React.FC<TradeoffMatrixProps> = ({
    concept,
    question,
    options,
    onVote,
}) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [hasVoted, setHasVoted] = useState(false);
    const totalVotes = options.reduce((sum, o) => sum + (o.votes || 0), 0);

    const handleVote = (id: string) => {
        if (hasVoted) return;
        setSelectedId(id);
        setHasVoted(true);
        onVote?.(id);
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #1a1a2e 100%)',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            marginTop: '24px',
        }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '24px' }}>⚖️</span>
                <div>
                    <h3 style={{ color: '#e2e8f0', margin: 0, fontSize: '18px' }}>
                        Trade-off Analysis — {concept}
                    </h3>
                </div>
            </div>

            <p style={{
                color: '#c4b5fd', fontSize: '15px', lineHeight: '1.6',
                margin: '0 0 20px', fontStyle: 'italic',
            }}>
                {question}
            </p>

            {/* Options grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: options.length <= 2 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
            }}>
                {options.map(option => {
                    const isSelected = selectedId === option.id;
                    const votePercent = totalVotes > 0 ? Math.round(((option.votes || 0) / totalVotes) * 100) : 0;

                    return (
                        <div key={option.id} style={{
                            background: isSelected
                                ? 'rgba(168, 85, 247, 0.12)'
                                : 'rgba(30, 41, 59, 0.6)',
                            borderRadius: '12px',
                            padding: '20px',
                            border: `1px solid ${isSelected ? 'rgba(168, 85, 247, 0.5)' : 'rgba(51, 65, 85, 0.5)'}`,
                            cursor: hasVoted ? 'default' : 'pointer',
                            transition: 'all 0.3s',
                        }} onClick={() => handleVote(option.id)}>
                            {/* Option name */}
                            <h4 style={{
                                color: isSelected ? '#c084fc' : '#e2e8f0',
                                margin: '0 0 12px', fontSize: '16px', fontWeight: 600,
                            }}>
                                {option.name}
                                {isSelected && ' ✓'}
                            </h4>

                            {/* Pros */}
                            <div style={{ marginBottom: '10px' }}>
                                <span style={{ color: '#22c55e', fontSize: '12px', fontWeight: 600 }}>PROS</span>
                                {option.pros.map((pro, i) => (
                                    <div key={i} style={{
                                        color: '#86efac', fontSize: '13px', padding: '2px 0',
                                        display: 'flex', gap: '6px',
                                    }}>
                                        <span>+</span> {pro}
                                    </div>
                                ))}
                            </div>

                            {/* Cons */}
                            <div style={{ marginBottom: '10px' }}>
                                <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: 600 }}>CONS</span>
                                {option.cons.map((con, i) => (
                                    <div key={i} style={{
                                        color: '#fca5a5', fontSize: '13px', padding: '2px 0',
                                        display: 'flex', gap: '6px',
                                    }}>
                                        <span>−</span> {con}
                                    </div>
                                ))}
                            </div>

                            {/* When to use */}
                            <div style={{
                                background: 'rgba(99, 102, 241, 0.1)', borderRadius: '6px',
                                padding: '8px 10px', marginBottom: '10px',
                            }}>
                                <span style={{ color: '#6366f1', fontSize: '11px', fontWeight: 600 }}>WHEN TO USE</span>
                                <p style={{ color: '#a5b4fc', fontSize: '12px', margin: '4px 0 0', lineHeight: '1.4' }}>
                                    {option.whenToUse}
                                </p>
                            </div>

                            {/* Vote bar (shown after voting) */}
                            {hasVoted && totalVotes > 0 && (
                                <div style={{ marginTop: '8px' }}>
                                    <div style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        fontSize: '12px', color: '#94a3b8', marginBottom: '4px',
                                    }}>
                                        <span>{option.votes || 0} votes</span>
                                        <span>{votePercent}%</span>
                                    </div>
                                    <div style={{
                                        height: '4px', borderRadius: '2px', background: '#1e293b', overflow: 'hidden',
                                    }}>
                                        <div style={{
                                            height: '100%', borderRadius: '2px',
                                            background: isSelected ? '#a855f7' : '#475569',
                                            width: `${votePercent}%`, transition: 'width 0.5s ease',
                                        }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {!hasVoted && (
                <p style={{
                    textAlign: 'center', color: '#64748b', fontSize: '13px',
                    marginTop: '16px', marginBottom: 0,
                }}>
                    Click an option to cast your vote — see how other engineers think
                </p>
            )}
        </div>
    );
};
