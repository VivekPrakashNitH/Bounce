import React from 'react';
import { X, GraduationCap } from 'lucide-react';
import { COURSE_CONTENT } from '../../data/courseContent';
import { GameState } from '../../types';

interface RoadmapModalProps {
    trackId: string;
    trackLabel: string;
    trackLevels: GameState[];
    currentLevelIndex: number;
    onJumpToLevel: (idx: number) => void;
    onClose: () => void;
}

export const RoadmapModal: React.FC<RoadmapModalProps> = ({
    trackId,
    trackLabel,
    trackLevels,
    currentLevelIndex,
    onJumpToLevel,
    onClose,
}) => {
    return (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-200">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 max-w-2xl w-full relative max-h-[90vh] flex flex-col shadow-2xl">
                <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
                    <X />
                </button>
                <div className="flex-shrink-0 mb-8 border-b border-zinc-900 pb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
                        <GraduationCap className="text-white" /> {trackLabel} Roadmap
                    </h2>
                </div>

                <div className="space-y-4 relative overflow-y-auto custom-scrollbar flex-1 pr-4">
                    <div className="absolute left-3 top-2 bottom-2 w-px bg-zinc-800" />
                    {trackLevels.map((level, idx) => {
                        const levelData = COURSE_CONTENT.find(l => l.id === level);
                        return (
                            <div
                                key={level}
                                onClick={() => onJumpToLevel(idx)}
                                className="relative pl-10 py-3 group cursor-pointer hover:bg-zinc-900 rounded-xl transition-all border border-transparent hover:border-zinc-800"
                            >
                                <div
                                    className={`absolute left-[5px] top-5 w-2 h-2 rounded-full ring-4 ring-zinc-950 transition-colors ${idx <= currentLevelIndex ? 'bg-white' : 'bg-zinc-800 group-hover:bg-zinc-600'}`}
                                />
                                <h3 className={`font-bold text-sm tracking-wide ${idx === currentLevelIndex ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-200'}`}>
                                    {levelData?.title ?? level}
                                </h3>
                                <p className="text-xs text-zinc-600 mt-1 leading-relaxed group-hover:text-zinc-500">{levelData?.description}</p>
                                {idx === currentLevelIndex && (
                                    <span className="inline-block mt-2 text-[9px] bg-white text-black font-bold px-2 py-0.5 rounded-sm shadow-lg shadow-white/20">CURRENT</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
