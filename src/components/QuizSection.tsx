import React, { useState } from 'react';
import { TEN_ITEM_QUIZ_QUESTIONS } from '../data/quantifierData';
import { QuizQuestion } from '../types/game';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  Sparkles,
  BookOpen,
  ArrowUpRight,
  Trophy
} from 'lucide-react';

interface QuizSectionProps {
  onQuizComplete: (scorePercent: number) => void;
  onOpenCertificate: () => void;
  onGoToReflection: () => void;
  onGoToLeaderboard: () => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  onQuizComplete,
  onOpenCertificate,
  onGoToReflection,
  onGoToLeaderboard
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submittedForCurrent, setSubmittedForCurrent] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const question: QuizQuestion = TEN_ITEM_QUIZ_QUESTIONS[currentIdx] || TEN_ITEM_QUIZ_QUESTIONS[0];
  const userSelectedOption = selectedAnswers[question.id];

  const handleSelect = (option: string) => {
    if (submittedForCurrent || isFinished) return;
    sounds.playClick();
    setSelectedAnswers(prev => ({ ...prev, [question.id]: option }));
    setSubmittedForCurrent(true);

    const isCorrect = option === question.correctAnswer;
    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playIncorrect();
    }
  };

  const handleNext = () => {
    sounds.playClick();
    if (currentIdx + 1 < TEN_ITEM_QUIZ_QUESTIONS.length) {
      setCurrentIdx(i => i + 1);
      setSubmittedForCurrent(false);
    } else {
      // Calculate final score
      let correctCount = 0;
      TEN_ITEM_QUIZ_QUESTIONS.forEach(q => {
        if (selectedAnswers[q.id] === q.correctAnswer) {
          correctCount += 1;
        }
      });
      const percent = Math.round((correctCount / TEN_ITEM_QUIZ_QUESTIONS.length) * 100);
      setIsFinished(true);
      onQuizComplete(percent);

      // Automatically post score to global Leaderboard
      const storedPlayerName = localStorage.getItem('qq_player_name') || 'Student ' + Math.floor(100 + Math.random() * 900);
      fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: storedPlayerName,
          category: 'quiz',
          score: percent,
          accuracyPercent: percent,
          note: percent >= 95 ? '95%+ Certificate Achieved' : `${correctCount}/10 Correct`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        })
      }).catch(err => console.error('Leaderboard post error:', err));

      if (percent >= 95) {
        sounds.playFanfare();
        confetti({ particleCount: 100, spread: 100, origin: { y: 0.6 } });
      }
    }
  };

  const handleRetake = () => {
    sounds.playClick();
    setSelectedAnswers({});
    setCurrentIdx(0);
    setSubmittedForCurrent(false);
    setIsFinished(false);
  };

  // Compute stats if finished
  const totalCorrect = TEN_ITEM_QUIZ_QUESTIONS.filter(
    q => selectedAnswers[q.id] === q.correctAnswer
  ).length;
  const scorePercent = Math.round((totalCorrect / TEN_ITEM_QUIZ_QUESTIONS.length) * 100);
  const passed95 = scorePercent >= 95;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 text-white">
      {!isFinished ? (
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Official Mastery Assessment
                </span>
                <span className="text-xs text-slate-400">
                  Target: 95%+ for Certificate
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] text-white">
                10-Item Quantifier Mastery Quiz
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                Question {currentIdx + 1} of {TEN_ITEM_QUIZ_QUESTIONS.length}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-indigo-500 h-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / TEN_ITEM_QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Active Question */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded border border-indigo-500/30">
                {question.categoryTag}
              </span>
              <span className="text-xs text-slate-400">
                Objective: {question.objective === 'identify' ? 'Identify Quantifiers' : question.objective === 'distinguish' ? 'Countable vs Uncountable' : 'Appropriate Sentence Usage'}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-semibold text-white leading-relaxed">
              {question.prompt}
            </h3>

            {question.contextSentence && (
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl italic text-amber-200 text-sm leading-relaxed shadow-inner">
                {question.contextSentence}
              </div>
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {question.options.map((opt) => {
              const isSelected = userSelectedOption === opt;
              const isCorrect = opt === question.correctAnswer;

              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  disabled={submittedForCurrent}
                  className={`p-4 rounded-xl text-left font-medium text-sm transition-all border transform active:scale-98 ${
                    submittedForCurrent
                      ? isCorrect
                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-md'
                        : isSelected
                        ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                        : 'bg-slate-900/60 border-slate-800 text-slate-500'
                      : 'bg-slate-850 hover:bg-slate-800 border-slate-700 hover:border-amber-400/60 text-white shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {submittedForCurrent && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    )}
                    {submittedForCurrent && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {submittedForCurrent && (
            <div
              className={`p-4 rounded-xl border text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn ${
                userSelectedOption === question.correctAnswer
                  ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/70 border-rose-500/40 text-rose-200'
              }`}
            >
              <div>
                <span className="font-bold">
                  {userSelectedOption === question.correctAnswer ? 'Well done! ' : 'Explanation: '}
                </span>
                {question.explanation}
              </div>

              <button
                onClick={handleNext}
                className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shrink-0 flex items-center justify-center gap-1.5 transition-transform active:scale-95"
              >
                <span>{currentIdx + 1 < TEN_ITEM_QUIZ_QUESTIONS.length ? 'Next Question' : 'View Final Score'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Final Results Screen */
        <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6">
          <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center border shadow-xl ${
            passed95
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-bounce'
              : 'bg-slate-800 text-slate-300 border-slate-700'
          }`}>
            <Award className="w-10 h-10 text-amber-400" />
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
              Assessment Report
            </span>
            <h2 className="text-3xl font-extrabold font-['Cinzel',serif] text-white mt-1">
              {passed95 ? 'Outstanding Mastery Achieved!' : 'Quiz Completed!'}
            </h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto mt-1">
              You scored <span className="font-bold text-amber-300 font-mono text-base">{totalCorrect}/10</span> ({scorePercent}%).
            </p>
          </div>

          {/* Certificate Unlock Banner or Strive Notice */}
          {passed95 ? (
            <div className="bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-indigo-500/20 border border-amber-400/50 rounded-2xl p-6 max-w-lg mx-auto text-center space-y-3 shadow-lg">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-widest">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Certificate Criteria Met (95%+)</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Congratulations! You met the strict 95% threshold. You can now generate, customize, and print your official <strong>Certificate of Grammar Mastery</strong>!
              </p>
              <button
                onClick={onOpenCertificate}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4 text-slate-950" />
                <span>Generate Official Certificate</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="bg-slate-850 border border-slate-700 rounded-2xl p-6 max-w-lg mx-auto text-center space-y-3">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Certificate Status: Locked ({scorePercent}% achieved)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                To generate your certificate, you must reach <strong>at least 95%</strong> (10/10 or review chapters to master tricky traps like countable vs uncountable nouns).
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={handleRetake}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Quiz to Hit 95%</span>
                </button>
              </div>
            </div>
          )}

          {/* Review Question Breakdown */}
          <div className="text-left max-w-2xl mx-auto space-y-2 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Question Summary Breakdown:
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {TEN_ITEM_QUIZ_QUESTIONS.map((q, idx) => {
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns === q.correctAnswer;
                return (
                  <div
                    key={q.id}
                    className="p-3 bg-slate-850/80 border border-slate-800 rounded-xl text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400">Q{idx + 1}.</span>
                      <span className="text-slate-200 truncate max-w-xs">{q.prompt}</span>
                    </div>
                    <span className={`font-semibold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isCorrect ? 'Correct' : `Answer: ${q.correctAnswer}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap justify-center gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={handleRetake}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-semibold border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
            <button
              onClick={onGoToLeaderboard}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-md"
            >
              <Trophy className="w-4 h-4" />
              <span>View Leaderboard</span>
            </button>
            <button
              onClick={onGoToReflection}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md"
            >
              <BookOpen className="w-4 h-4" />
              <span>Proceed to Reflection</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
