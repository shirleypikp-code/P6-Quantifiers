import React, { useState } from 'react';
import { QUANTIFIER_DICTIONARY } from '../data/quantifierData';
import { QuantifierCategory } from '../types/game';
import { Search, Filter, Sparkles, X, BookOpen } from 'lucide-react';
import { sounds } from '../utils/audio';

interface CodexModalProps {
  onClose?: () => void;
  isEmbedded?: boolean;
}

export const CodexModal: React.FC<CodexModalProps> = ({ onClose, isEmbedded = false }) => {
  const [filter, setFilter] = useState<QuantifierCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  const filteredWords = QUANTIFIER_DICTIONARY.filter(item => {
    const matchesFilter = filter === 'all' || item.category === filter;
    const matchesSearch = item.word.toLowerCase().includes(search.toLowerCase()) ||
      item.definition.toLowerCase().includes(search.toLowerCase()) ||
      item.examples.some(ex => ex.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const content = (
    <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 text-white max-w-5xl mx-auto shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-['Cinzel',serif] text-amber-300">
              The Grand Quantifier Codex
            </h2>
            <p className="text-xs text-slate-400">
              Master dictionary of quantity determiners, usage rules, and grammatical classifications.
            </p>
          </div>
        </div>

        {onClose && !isEmbedded && (
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search quantifiers (e.g. many, little, advice, time)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
          {(['all', 'countable', 'uncountable', 'both'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sounds.playClick();
                setFilter(cat);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All (21)' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dictionary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-1">
        {filteredWords.map((item) => (
          <div
            key={item.word}
            className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/40 rounded-xl p-4 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold font-mono text-amber-200 group-hover:text-amber-300">
                  {item.word}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    item.category === 'countable'
                      ? 'bg-blue-950/70 text-blue-300 border-blue-500/40'
                      : item.category === 'uncountable'
                      ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
                      : 'bg-purple-950/70 text-purple-300 border-purple-500/40'
                  }`}
                >
                  {item.category === 'both' ? 'Count & Uncount' : item.category}
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-3">{item.definition}</p>
            </div>

            <div className="space-y-2 border-t border-slate-700/60 pt-2.5">
              <div className="text-[11px] text-slate-400">
                <span className="font-semibold text-amber-400/90">Examples:</span>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-300 italic">
                  {item.examples.map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>
              {item.tips && (
                <div className="text-[10px] bg-slate-900/60 p-2 rounded-lg border border-slate-700/40 text-amber-300/90 flex items-start gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                  <span>{item.tips}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredWords.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-sm">No quantifiers found matching "{search}".</p>
        </div>
      )}
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      {content}
    </div>
  );
};
