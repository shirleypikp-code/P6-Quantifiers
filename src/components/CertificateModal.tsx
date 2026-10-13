import React, { useState, useRef } from 'react';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Award, Printer, X, Sparkles, CheckCircle2, ShieldCheck, Download } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizScorePercent: number;
  onRetakeQuiz: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  quizScorePercent,
  onRetakeQuiz
}) => {
  const [recipientName, setRecipientName] = useState(() => {
    return localStorage.getItem('qq_player_name') || 'Honored Scholar';
  });
  const [recipientClass, setRecipientClass] = useState(() => {
    return localStorage.getItem('qq_player_class') || 'Primary 6-A';
  });
  const [certificateId] = useState(() => {
    return `QQ-${Math.floor(100000 + Math.random() * 900000)}-${new Date().getFullYear()}`;
  });
  const [currentDate] = useState(() => {
    return new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  });

  const certificateRef = useRef<HTMLDivElement>(null);
  const isEligible = quizScorePercent >= 95;

  if (!isOpen) return null;

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  const handleConfetti = () => {
    sounds.playFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-4xl w-full text-white shadow-2xl relative my-auto">
        {/* Modal Close Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isEligible ? (
          <div className="space-y-6">
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Official Recognition
                  </span>
                  <span className="text-xs text-amber-300 font-bold">
                    Score: {quizScorePercent}% (Criteria Met: ≥95%)
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] text-amber-200">
                  Certificate of Grammar Mastery
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleConfetti}
                  className="p-2.5 bg-slate-800 hover:bg-slate-750 text-amber-400 rounded-xl border border-slate-700 text-xs flex items-center gap-1.5 transition-all"
                  title="Celebrate with confetti"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">Celebrate</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </div>

            {/* Recipient Name & Class Customization Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold shrink-0">
                  Name:
                </span>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  maxLength={40}
                  placeholder="Enter student full name..."
                  className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-bold text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold shrink-0">
                  Class:
                </span>
                <input
                  type="text"
                  value={recipientClass}
                  onChange={(e) => setRecipientClass(e.target.value)}
                  maxLength={25}
                  placeholder="Enter class (e.g. Primary 6-A)..."
                  className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-indigo-300 font-bold text-sm focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            {/* Printable Certificate Frame */}
            <div
              ref={certificateRef}
              id="printable-certificate"
              className="bg-amber-50 text-slate-900 p-8 sm:p-12 rounded-2xl border-8 border-amber-800/80 shadow-2xl relative overflow-hidden select-none"
              style={{
                backgroundImage: 'radial-gradient(#d97706 0.75px, transparent 0.75px), radial-gradient(#d97706 0.75px, #fef3c7 0.75px)',
                backgroundSize: '30px 30px',
                backgroundPosition: '0 0, 15px 15px',
                backgroundColor: '#fffbeb'
              }}
            >
              {/* Inner Double Ornate Border */}
              <div className="border-2 border-amber-700 p-6 sm:p-8 rounded-lg relative">
                {/* Corner Ornaments */}
                <div className="absolute top-2 left-2 text-amber-700 text-xl font-serif">✦</div>
                <div className="absolute top-2 right-2 text-amber-700 text-xl font-serif">✦</div>
                <div className="absolute bottom-2 left-2 text-amber-700 text-xl font-serif">✦</div>
                <div className="absolute bottom-2 right-2 text-amber-700 text-xl font-serif">✦</div>

                <div className="text-center space-y-4">
                  <div className="inline-block">
                    <span className="text-[11px] uppercase tracking-[0.3em] font-extrabold text-amber-900 font-mono border-b border-amber-700 pb-1">
                      LEXICON ACADEMY OF ENGLISH GRAMMAR
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-extrabold font-['Cinzel',serif] tracking-wider text-amber-950 uppercase pt-2">
                    Certificate of Mastery
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-700 italic max-w-xl mx-auto">
                    This credential formally certifies that
                  </p>

                  {/* Student Name & Class */}
                  <div className="py-2 space-y-1">
                    <div className="text-2xl sm:text-4xl font-extrabold text-amber-900 font-serif border-b-2 border-amber-800/40 inline-block px-8 pb-1 tracking-wide">
                      {recipientName || 'Honored Scholar'}
                    </div>
                    {recipientClass && (
                      <div className="text-xs sm:text-sm font-bold font-mono text-amber-800 tracking-wider">
                        Class: {recipientClass}
                      </div>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed">
                    has demonstrated distinguished proficiency (<strong>{quizScorePercent}% Score</strong>) in the comprehensive grammar domain of <strong>English Quantifiers</strong> across three core objectives:
                  </p>

                  {/* Mastery Criteria Bullets */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-2xl mx-auto text-left py-2">
                    <div className="bg-amber-100/80 border border-amber-300 rounded-lg p-2.5 text-[11px] text-slate-800">
                      <div className="font-bold text-amber-900 mb-0.5">✦ Objective 1:</div>
                      Identifying quantifiers in diverse literary & informational texts.
                    </div>
                    <div className="bg-amber-100/80 border border-amber-300 rounded-lg p-2.5 text-[11px] text-slate-800">
                      <div className="font-bold text-amber-900 mb-0.5">✦ Objective 2:</div>
                      Distinguishing countable vs uncountable noun compatibility.
                    </div>
                    <div className="bg-amber-100/80 border border-amber-300 rounded-lg p-2.5 text-[11px] text-slate-800">
                      <div className="font-bold text-amber-900 mb-0.5">✦ Objective 3:</div>
                      Applying quantifiers with grammatical nuance in sentences.
                    </div>
                  </div>

                  {/* Signatures & Seal */}
                  <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-amber-700/40 gap-4">
                    {/* Left Sig */}
                    <div className="text-center sm:text-left">
                      <div className="font-['Cinzel',serif] italic font-bold text-amber-950 text-sm">
                        Inspector Lexi
                      </div>
                      <div className="text-[10px] text-slate-600 uppercase tracking-wider font-mono">
                        Lead Detective of Syntax
                      </div>
                    </div>

                    {/* Golden Wax Seal */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-1 shadow-lg flex items-center justify-center border-2 border-amber-700">
                      <div className="w-full h-full rounded-full border border-amber-800 flex flex-col items-center justify-center text-amber-950 text-[9px] font-black uppercase text-center leading-none">
                        <span>★ 95%+ ★</span>
                        <span className="font-extrabold text-[10px]">MASTERY</span>
                        <span>HONORS</span>
                      </div>
                    </div>

                    {/* Right Sig */}
                    <div className="text-center sm:text-right">
                      <div className="font-['Cinzel',serif] italic font-bold text-amber-950 text-sm">
                        Master Caelum
                      </div>
                      <div className="text-[10px] text-slate-600 uppercase tracking-wider font-mono">
                        Grand Alchemist of Language
                      </div>
                    </div>
                  </div>

                  {/* Metadata bottom */}
                  <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono pt-3 border-t border-amber-200">
                    <span>ID: {certificateId}</span>
                    <span>Issued: {currentDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Locked State View */
          <div className="text-center py-8 space-y-6">
            <div className="w-20 h-20 bg-slate-800 text-slate-400 rounded-3xl mx-auto flex items-center justify-center border border-slate-700 shadow-xl">
              <Award className="w-10 h-10 text-amber-400/50" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                Certificate Locked
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-['Cinzel',serif] text-white mt-1">
                95% Score Threshold Required
              </h2>
              <p className="text-sm text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                Your current score is <span className="font-bold text-amber-400 font-mono">{quizScorePercent}%</span>. To generate and print your official Certificate of Grammar Mastery, you need to score at least <strong>95%</strong> on the 10-item quiz.
              </p>
            </div>

            <div className="bg-slate-850 border border-slate-800 rounded-2xl p-5 max-w-md mx-auto text-xs text-slate-300 text-left space-y-2">
              <div className="font-bold text-amber-300">Quick Tips to Reach 95%:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Remember: <span className="text-white">advice, furniture, luggage</span> are uncountable!</li>
                <li>Notice: <span className="text-white">few</span> (negative lack) vs <span className="text-white">a few</span> (positive some).</li>
                <li>Review Chapter 1, 2, and 3 story lessons and minigames!</li>
              </ul>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  onClose();
                  onRetakeQuiz();
                }}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-transform active:scale-95"
              >
                Retake 10-Item Quiz Now
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  onClose();
                }}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-semibold border border-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
