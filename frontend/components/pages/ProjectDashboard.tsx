import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectApi, UserProjectDTO, getAccessToken } from '../../services/api';
import { PROJECT_STAGES, getNextStage } from '../../data/projectCurriculum';
import { Home, Rocket, Check, Lock, Play, ChevronRight, Clock } from 'lucide-react';

type LoadState = 'loading' | 'no-auth' | 'no-project' | 'loaded' | 'error';

export const ProjectDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [loadState, setLoadState] = useState<LoadState>('loading');
    const [project, setProject] = useState<UserProjectDTO | null>(null);
    const [error, setError] = useState('');

    const fetchProject = useCallback(async () => {
        if (!getAccessToken()) {
            setLoadState('no-auth');
            return;
        }
        try {
            const data = await projectApi.getMyProject();
            setProject(data);
            setLoadState('loaded');
        } catch {
            setLoadState('no-project');
        }
    }, []);

    useEffect(() => { fetchProject(); }, [fetchProject]);

    const handleInit = async () => {
        try {
            const data = await projectApi.init();
            setProject(data);
            setLoadState('loaded');
        } catch (e: any) {
            setError(e.message || 'Failed to initialize project');
            setLoadState('error');
        }
    };

    const getStageStatus = (stageId: string) => {
        if (!project) return 'locked';
        const found = project.stages.find(s => s.stageId === stageId);
        return found?.status ?? 'locked';
    };

    const getStageIcon = (status: string) => {
        switch (status) {
            case 'completed': return <Check className="w-4 h-4" />;
            case 'in_progress': return <Play className="w-4 h-4" />;
            default: return <Lock className="w-3 h-3" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400';
            case 'in_progress': return 'bg-amber-500/20 border-amber-500/40 text-amber-400';
            default: return 'bg-zinc-800/50 border-white/5 text-zinc-600';
        }
    };

    const completedCount = project?.stages.filter(s => s.status === 'completed').length ?? 0;
    const progressPercent = Math.round((completedCount / PROJECT_STAGES.length) * 100);

    // --- Render: Loading / No Auth / No Project ---
    if (loadState === 'loading') {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="animate-pulse text-zinc-500 text-sm">Loading project...</div>
            </div>
        );
    }

    if (loadState === 'no-auth') {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
                <Rocket className="w-12 h-12 text-zinc-600" />
                <p className="text-zinc-400 text-sm">Sign in to start your evolving project.</p>
                <button
                    onClick={() => navigate('/home')}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm transition-colors"
                >
                    Go to Home
                </button>
            </div>
        );
    }

    if (loadState === 'no-project') {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6 px-4">
                <div className="text-center max-w-md">
                    <Rocket className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">Start Your Backend Journey</h1>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                        Build one evolving backend project across 9 stages — from a single-file server to a
                        fully observable, horizontally-scaled production system.
                    </p>
                    <button
                        onClick={handleInit}
                        className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-emerald-900/30"
                    >
                        Initialize My Project
                    </button>
                </div>
            </div>
        );
    }

    if (loadState === 'error') {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <p className="text-red-400 text-sm">{error}</p>
            </div>
        );
    }

    // --- Render: Dashboard ---
    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Header */}
            <div className="border-b border-white/5 bg-zinc-900/50 backdrop-blur-md">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/home')}
                            className="text-zinc-500 hover:text-white transition-colors"
                        >
                            <Home className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">{project!.projectName}</h1>
                            <p className="text-xs text-zinc-500 uppercase tracking-widest">Evolving Project</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <span className="text-emerald-400 font-bold text-lg">{progressPercent}%</span>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Complete</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4">
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {/* Stages Timeline */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                <div className="space-y-3">
                    {PROJECT_STAGES.map((stage, idx) => {
                        const status = getStageStatus(stage.id);
                        const isCurrent = project!.currentStage === stage.id;

                        return (
                            <div
                                key={stage.id}
                                className={`relative flex items-start gap-4 p-4 rounded-xl border transition-all ${isCurrent
                                    ? 'bg-emerald-500/5 border-emerald-500/30 ring-1 ring-emerald-500/20'
                                    : status === 'completed'
                                        ? 'bg-zinc-900/30 border-white/5'
                                        : 'bg-zinc-900/20 border-white/5 opacity-60'
                                    }`}
                            >
                                {/* Stage Number + Status */}
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center ${getStatusColor(status)}`}>
                                    {status === 'locked' ? (
                                        <span className="text-xs font-bold">{stage.number}</span>
                                    ) : (
                                        getStageIcon(status)
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className={`font-semibold text-sm ${status === 'locked' ? 'text-zinc-600' : 'text-white'}`}>
                                            {stage.title}
                                        </h3>
                                        <span className={`text-[10px] uppercase tracking-widest ${status === 'locked' ? 'text-zinc-700' : 'text-zinc-500'}`}>
                                            {stage.subtitle}
                                        </span>
                                        {isCurrent && (
                                            <span className="text-[9px] uppercase tracking-widest bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-xs leading-relaxed ${status === 'locked' ? 'text-zinc-700' : 'text-zinc-400'}`}>
                                        {stage.projectTask}
                                    </p>
                                    {/* Skills */}
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {stage.skills.map(skill => (
                                            <span key={skill} className={`text-[9px] px-2 py-0.5 rounded-full border ${status === 'locked'
                                                ? 'border-white/5 text-zinc-700'
                                                : 'border-white/10 text-zinc-500'
                                                }`}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    {/* Time estimate */}
                                    <div className={`flex items-center gap-1 mt-2 text-[10px] ${status === 'locked' ? 'text-zinc-700' : 'text-zinc-600'}`}>
                                        <Clock className="w-3 h-3" />
                                        <span>~{stage.estimatedMinutes} min</span>
                                    </div>
                                </div>

                                {/* Action */}
                                {isCurrent && (
                                    <button
                                        onClick={() => navigate(`/course/system-design`)}
                                        className="flex-shrink-0 self-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
                                    >
                                        Continue <ChevronRight className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
