import React, { useState, useEffect } from 'react';
import { ReflectionData } from '../types/game';
import { sounds } from '../utils/audio';
import { 
  PenTool, 
  Sparkles, 
  CheckCircle2, 
  Send, 
  Award, 
  BookOpen, 
  HeartHandshake
} from 'lucide-react';

interface ReflectionSectionProps {
  hasPassed95: boolean;
  onOpenCertificate: () => void;
  onGoToChapters: () => void;
}

export const ReflectionSection: React.FC<ReflectionSectionProps> = ({
  hasPassed95,
  onOpenCertificate,
  onGoToChapters
}) => {
  const [reflection, setReflection] = useState<ReflectionData>(() => {
    const saved = localStorage.getItem('qq_reflection_data');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      mostChallenging: '',
      dailyObservation: '',
      customSentenceCountable: '',
      customSentenceUncountable: '',
      keyTakeaway: ''
    };
  });

  const [submitted, setSubmitted] = useState(false);
  const [grammarCheckResult, setGrammarCheckResult] = useState<{
    countableValid: boolean;
    uncountableValid: boolean;
    feedback: string;
  } | null>(null);

  useEffect(() => {
    if (reflection.submittedAt) {
      setSubmitted(true);
    }
  }, [reflection.submittedAt]);

  const validateSentences = () => {
    const countWords = ['many', 'several', 'few', 'a few', 'each', 'every', 'both', 'a couple of', 'numerous'];
    const uncountWords = ['much', 'little', 'a little', 'a great deal of', 'a bit of', 'amount of'];

    const countFound = countWords.some(w => reflection.customSentenceCountable.toLowerCase().includes(w));
    const uncountFound = uncountWords.some(w => reflection.customSentenceUncountable.toLowerCase().includes(w));

    let feedbackMsg = '';
    if (countFound && uncountFound) {
      feedbackMsg = 'Exceptional work! You successfully integrated targeted quantifiers for both countable and uncountable nouns!';
    } else if (countFound) {
      feedbackMsg = 'Great countable sentence! Make sure your second sentence uses an uncountable quantifier like "much", "a little", or "a great deal of".';
    } else if (uncountFound) {
      feedbackMsg = 'Great uncountable sentence! Make sure your first sentence uses a countable quantifier like "many", "several", or "a few".';
    } else {
      feedbackMsg = 'Try incorporating specific quantifiers from the Codex (like "several", "a few", "much", or "a little") in your examples!';
    }

    setGrammarCheckResult({
      countableValid: countFound,
      uncountableValid: uncountFound,
      feedback: feedbackMsg
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playCorrect();
    validateSentences();
    const updated = {
      ...reflection,
      submittedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    };
    setReflection(updated);
    setSubmitted(true);
    localStorage.setItem('qq_reflection_data', JSON.stringify(updated));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 text-white">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
              Final Learning Reflection
            </span>
            <span className="text-xs text-slate-400">
              Metacognition & Grammar Application
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Cinzel',serif] text-white">
            Grammar Journey Reflection Journal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Consolidate your learning from Inspector Lexi, Master Alchemist Caelum, and Architect Soren. Thoughtful reflection cements your mastery of English quantifiers.
          </p>
        </div>

        {/* Reflection Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Prompt 1 */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-2">
            <label className="block text-sm font-bold text-amber-300">
              1. Which quantifier concept was most challenging for you, and what helped you understand it?
            </label>
            <p className="text-xs text-slate-400">
              e.g., distinguishing countable nouns like coins vs uncountable advice/furniture, understanding "few" vs "a few", or polite requests with "some".
            </p>
            <textarea
              required
              rows={3}
              value={reflection.mostChallenging}
              onChange={(e) => setReflection({ ...reflection, mostChallenging: e.target.value })}
              placeholder="Reflect on what tripped you up and how you solved it..."
              className="w-full p-3.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
            />
          </div>

          {/* Prompt 2 */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-2">
            <label className="block text-sm font-bold text-amber-300">
              2. How will understanding quantifiers improve your everyday reading and essay writing?
            </label>
            <p className="text-xs text-slate-400">
              Consider tone precision, avoiding common pitfalls (like "much books" or "many advice"), and subject-verb agreement.
            </p>
            <textarea
              required
              rows={3}
              value={reflection.dailyObservation}
              onChange={(e) => setReflection({ ...reflection, dailyObservation: e.target.value })}
              placeholder="Explain how you will use quantifiers to write with greater nuance and clarity..."
              className="w-full p-3.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
            />
          </div>

          {/* Prompt 3: Sentence Application */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div>
              <label className="block text-sm font-bold text-amber-300">
                3. Demonstrate Your Mastery: Compose Two Original Sentences
              </label>
              <p className="text-xs text-slate-400">
                Write two authentic sentences showing proper quantifier selection.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-blue-300 block mb-1">
                  Sentence A (Countable Noun with e.g. several, many, a few, few, each):
                </span>
                <input
                  type="text"
                  required
                  value={reflection.customSentenceCountable}
                  onChange={(e) => setReflection({ ...reflection, customSentenceCountable: e.target.value })}
                  placeholder="e.g., Several archeologists found a few ancient artifacts buried beneath the sand."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <span className="text-xs font-semibold text-emerald-300 block mb-1">
                  Sentence B (Uncountable Noun with e.g. much, a little, little, a great deal of):
                </span>
                <input
                  type="text"
                  required
                  value={reflection.customSentenceUncountable}
                  onChange={(e) => setReflection({ ...reflection, customSentenceUncountable: e.target.value })}
                  placeholder="e.g., The wise mentor offered a great deal of advice before we embarked on the journey."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Grammar feedback banner if evaluated */}
          {grammarCheckResult && (
            <div className="p-4 bg-indigo-950/60 border border-indigo-500/40 rounded-2xl text-xs sm:text-sm text-indigo-200 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-300 mb-0.5">Grammar Inspector Review:</div>
                {grammarCheckResult.feedback}
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-5">
            <button
              type="button"
              onClick={onGoToChapters}
              className="text-xs text-slate-400 hover:text-white px-3 py-2"
            >
              Back to Chapters
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>{submitted ? 'Update Saved Reflection' : 'Save & Submit Reflection'}</span>
            </button>
          </div>
        </form>

        {/* Certificate banner if unlocked */}
        {hasPassed95 && (
          <div className="bg-gradient-to-r from-amber-500/20 via-slate-900 to-indigo-500/20 border border-amber-400/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">
                  Your Certificate of Mastery is Ready!
                </h4>
                <p className="text-xs text-slate-300">
                  You scored 95%+ and completed your learning reflection.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenCertificate}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-transform active:scale-95 shrink-0 flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>View & Print Certificate</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
