
import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { QuizQuestion } from '../types';

interface Props {
  quiz: QuizQuestion;
  onClose: () => void;
}

export const QuizModal: React.FC<Props> = ({ quiz, onClose }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const isCorrect = selected === quiz.correctIndex;

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      {/* Container: Flex column to separate Header (fixed) from Body (scrollable) */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-lg w-full relative shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* FIXED HEADER: Title & Close Button */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-900 shrink-0">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500 shrink-0">
                  <HelpCircle size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">Quick Check</h3>
           </div>

           {/* Redesigned Close Button */}
           <button 
              onClick={onClose} 
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-full transition-colors border border-transparent hover:border-zinc-600 group"
              aria-label="Close"
           >
              <X size={20} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-200" />
           </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            <p className="text-lg text-zinc-200 mb-6 font-medium leading-relaxed">
              {quiz.question}
            </p>

            <div className="space-y-3 mb-6">
              {quiz.options.map((option, idx) => (
                <button
                  key={idx}
                  disabled={submitted}
                  onClick={() => setSelected(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    submitted && idx === quiz.correctIndex 
                      ? 'bg-green-500/20 border-green-500 text-white' 
                      : submitted && selected === idx && idx !== quiz.correctIndex
                      ? 'bg-red-500/20 border-red-500 text-white'
                      : selected === idx 
                      ? 'bg-blue-600 border-blue-500 text-white' 
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-750'
                  }`}
                >
                   <div className="flex items-center justify-between">
                     <span>{option}</span>
                     {submitted && idx === quiz.correctIndex && <CheckCircle size={16} className="text-green-500 shrink-0 ml-2" />}
                     {submitted && selected === idx && idx !== quiz.correctIndex && <AlertCircle size={16} className="text-red-500 shrink-0 ml-2" />}
                   </div>
                </button>
              ))}
            </div>

            {!submitted ? (
              <button 
                onClick={handleSubmit} 
                disabled={selected === null}
                className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
              >
                Submit Answer
              </button>
            ) : (
              <div className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-900/20 border-green-800' : 'bg-red-900/20 border-red-800'} animate-in fade-in zoom-in duration-300`}>
                 <p className={`text-sm font-bold mb-1 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                   {isCorrect ? 'Correct!' : 'Incorrect'}
                 </p>
                 <p className="text-sm text-zinc-300 mb-4">
                   {quiz.explanation}
                 </p>
                 
                 <button 
                    onClick={onClose} 
                    className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-lg"
                 >
                    {isCorrect ? "Move to Next Level" : "Continue Anyway"} <ArrowRight size={16} />
                 </button>
              </div>
            )}
        </div>

      </div>
    </div>
  );
};
