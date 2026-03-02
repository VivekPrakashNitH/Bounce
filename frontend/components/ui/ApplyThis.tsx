import React, { useState } from 'react';
import { PROJECT_STAGES, LEVEL_TO_STAGE_MAP } from '../../data/projectCurriculum';
import { GameState } from '../../types';
import { Lightbulb, Code, ChevronDown, ChevronUp, Rocket } from 'lucide-react';

interface ApplyThisProps {
    /** The current game level being viewed */
    currentLevel: GameState;
    /** Callback when user wants to view their project */
    onViewProject?: () => void;
}

/**
 * Bridge component shown after a teaching demo.
 * Connects the concept just learned to the user's evolving project.
 */
export const ApplyThis: React.FC<ApplyThisProps> = ({ currentLevel, onViewProject }) => {
    const [expanded, setExpanded] = useState(false);

    const stageId = LEVEL_TO_STAGE_MAP[currentLevel];
    if (!stageId) return null; // Level has no project mapping (e.g., gaming, some cyber levels)

    const stage = PROJECT_STAGES.find(s => s.id === stageId);
    if (!stage) return null;

    return (
        <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 overflow-hidden">
            {/* Header — always visible */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-emerald-500/10 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                        Apply This to Your Project
                    </span>
                    <span className="text-[10px] text-zinc-500 px-2 py-0.5 bg-zinc-800 rounded-full">
                        Stage {stage.number}: {stage.title}
                    </span>
                </div>
                {expanded ? (
                    <ChevronUp className="w-4 h-4 text-zinc-500" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                )}
            </button>

            {/* Expanded Content */}
            {expanded && (
                <div className="px-4 pb-4 space-y-4">
                    {/* What you just learned → What to build */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 bg-zinc-900/50 rounded-lg border border-white/5">
                            <div className="flex items-center gap-1.5 mb-2">
                                <Lightbulb className="w-3 h-3 text-amber-400" />
                                <span className="text-[10px] text-amber-400 uppercase tracking-widest font-medium">
                                    What You Learned
                                </span>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed">{stage.description}</p>
                        </div>

                        <div className="p-3 bg-zinc-900/50 rounded-lg border border-white/5">
                            <div className="flex items-center gap-1.5 mb-2">
                                <Code className="w-3 h-3 text-blue-400" />
                                <span className="text-[10px] text-blue-400 uppercase tracking-widest font-medium">
                                    Your Task
                                </span>
                            </div>
                            <p className="text-xs text-zinc-300 leading-relaxed font-medium">{stage.projectTask}</p>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5">
                        {stage.skills.map(skill => (
                            <span key={skill} className="text-[9px] px-2 py-0.5 rounded-full border border-emerald-500/20 text-emerald-500/70">
                                {skill}
                            </span>
                        ))}
                    </div>

                    {/* CTA */}
                    {onViewProject && (
                        <button
                            onClick={onViewProject}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                            <Rocket className="w-3 h-3" />
                            View My Project
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
