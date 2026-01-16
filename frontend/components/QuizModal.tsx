
import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
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
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
           <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500">
              <HelpCircle size={20} />
           </div>
           <h3 className="text-xl font-bold text-white">Quick Check</h3>
        </div>

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
                 {submitted && idx === quiz.correctIndex && <CheckCircle size={16} className="text-green-500" />}
                 {submitted && selected === idx && idx !== quiz.correctIndex && <AlertCircle size={16} className="text-red-500" />}
               </div>
            </button>
          ))}
        </div>

        {!submitted ? (
          <button 
            onClick={handleSubmit} 
            disabled={selected === null}
            className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Submit Answer
          </button>
        ) : (
          <div className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-900/20 border-green-800' : 'bg-red-900/20 border-red-800'}`}>
             <p className={`text-sm font-bold mb-1 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
               {isCorrect ? 'Correct!' : 'Incorrect'}
             </p>
             <p className="text-sm text-zinc-300">
               {quiz.explanation}
             </p>
             <button onClick={onClose} className="mt-4 text-xs underline text-zinc-500 hover:text-white">
                Close
             </button>
          </div>
        )}

      </div>
    </div>
  );
};
