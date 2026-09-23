import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext.jsx';
import { SCHEMES } from '../data/schemes.js';
import { FrictionBadge } from '../components/StatusBadge.jsx';
import { Search, X, Layers } from 'lucide-react';
import { getAppLanguage } from '../i18n/index.js';

export function SchemesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setSchemeModalData } = useApp();
  const isHindi = getAppLanguage() === 'hi';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: t('schemes.categories.all') },
    { id: 'incomeSupport', label: t('schemes.categories.incomeSupport') },
    { id: 'cropInsurance', label: t('schemes.categories.cropInsurance') },
    { id: 'irrigation', label: t('schemes.categories.irrigation') },
    { id: 'solarMachinery', label: t('schemes.categories.solarMachinery') },
    { id: 'creditKCC', label: t('schemes.categories.creditKCC') }
  ];

  const filteredSchemes = SCHEMES.filter(s => {
    const matchQuery = !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.hindiName && s.hindiName.includes(searchQuery)) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory = selectedCategory === 'all' || s.category === selectedCategory;

    return matchQuery && matchCategory;
  });

  return (
    <div className="px-4 py-4 space-y-4 pb-28 animate-fade-in">
      
      {/* Search Header */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-gov space-y-3">
        <div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase">
            National Directory
          </span>
          <h1 className="text-base sm:text-lg font-black text-slate-900 mt-1">{t('schemes.title')}</h1>
          <p className="text-[11px] text-slate-500">{t('schemes.subtitle')}</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('schemes.searchPlaceholder')}
            className="input-gov text-xs pl-9 py-2.5 rounded-xl"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 font-bold text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Horizontal Filter Rail */}
        <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pt-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scheme Cards */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
            {t('schemes.showingCount', { count: filteredSchemes.length })}
          </span>
        </div>

        {filteredSchemes.map(scheme => (
          <div
            key={scheme.id}
            className="card-gov p-4 space-y-3 bg-white border border-slate-200 shadow-gov hover:border-emerald-600 active:scale-[0.99] transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-800 border border-slate-200 uppercase">
                    {scheme.code}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {scheme.level}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm mt-1 leading-snug">
                  {isHindi ? (scheme.hindiName || scheme.name) : scheme.name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-emerald-900 font-mono">{scheme.payoutFormatted}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
              {isHindi ? (scheme.hindiDescription || scheme.description) : scheme.description}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-slate-400 font-medium">{t('schemes.effort')}</span>
                <FrictionBadge friction={scheme.friction} />
              </div>

              <button
                onClick={() => setSchemeModalData(scheme)}
                className="btn-gov-secondary text-[10px] py-1.5 px-3 font-bold"
              >
                {t('schemes.rulesBtn')}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
