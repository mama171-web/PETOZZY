import React, { useState, useEffect } from 'react';
import { Flame, Heart, ArrowRight, ArrowLeft, CheckCircle2, BookOpen } from 'lucide-react';
import { Language, LegalBlogArticle } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { LEGAL_BLOG_ARTICLES } from '../data/content';

interface LegalBlogPageProps {
  currentLang: Language;
  initialArticleId?: string | null;
  onClearInitialArticle?: () => void;
}

export const LegalBlogPage: React.FC<LegalBlogPageProps> = ({
  currentLang,
  initialArticleId,
  onClearInitialArticle,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<LegalBlogArticle | null>(() => {
    if (!initialArticleId) return null;
    return LEGAL_BLOG_ARTICLES.find((a) => a.id === initialArticleId) || null;
  });

  useEffect(() => {
    if (initialArticleId) {
      const found = LEGAL_BLOG_ARTICLES.find((a) => a.id === initialArticleId) || null;
      setActiveArticle(found);
    }
  }, [initialArticleId]);

  const categories = [
    { key: 'all', label: t.blog.allCategories },
    {
      key: 'ceramica',
      label:
        currentLang === 'pt'
          ? 'Arte & Cerâmica'
          : currentLang === 'es'
            ? 'Cerámica Artesanal'
            : 'Ceràmica Artesanal',
    },
    {
      key: 'bienestar',
      label:
        currentLang === 'pt'
          ? 'Bem-Estar Animal'
          : currentLang === 'es'
            ? 'Bienestar Animal'
            : 'Benestar Animal',
    },
  ];

  const filteredArticles =
    selectedCategory === 'all'
      ? LEGAL_BLOG_ARTICLES
      : LEGAL_BLOG_ARTICLES.filter((a) => a.categoryKey === selectedCategory);

  if (activeArticle) {
    const PillarIcon = activeArticle.categoryKey === 'ceramica' ? Flame : Heart;
    return (
      <section className="py-12 lg:py-20 bg-[#F7F9FC] min-h-[75vh]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => {
              setActiveArticle(null);
              onClearInitialArticle?.();
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#1E324B] bg-white px-4 py-2 rounded-full border border-[#C3D1E2] mb-8 hover:bg-[#EDF2F8] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.blog.backToBlog}</span>
          </button>

          <article className="bg-white rounded-3xl p-6 sm:p-10 border border-[#C3D1E2] shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="font-bold text-[#3B5B82]">{activeArticle.categoryLabel[currentLang]}</span>
              <span aria-hidden="true">·</span>
              <span>{activeArticle.date}</span>
              <span aria-hidden="true">·</span>
              <span>{activeArticle.readTime}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E324B] leading-snug text-balance">
              {activeArticle.title[currentLang]}
            </h1>

            {/* Key Takeaways Card */}
            <div className="bg-[#EDF2F8] rounded-2xl p-5 border border-[#C3D1E2] space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#1E324B] flex items-center gap-2">
                <PillarIcon className="w-4 h-4 text-[#3B5B82]" />
                <span>{t.blog.keyPointsTitle}</span>
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                {activeArticle.keyPoints[currentLang].map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#243B53] shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed font-medium pt-2">
              {activeArticle.content[currentLang].map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </article>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-20 bg-[#F7F9FC] min-h-[75vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-[#3B5B82] mb-2">
            {t.blog.kicker}
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E324B] tracking-tight mb-4 text-balance">
            {t.blog.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            {t.blog.subtitle}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 text-xs font-bold rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.key
                  ? 'bg-[#243B53] text-white border-[#243B53]'
                  : 'bg-white text-slate-700 border-[#C3D1E2] hover:bg-[#EDF2F8]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C3D1E2] shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-3">
                <span className="font-bold text-[#3B5B82]">{article.categoryLabel[currentLang]}</span>
                <span aria-hidden="true">·</span>
                <span>{article.date}</span>
                <span aria-hidden="true">·</span>
                <span>{article.readTime}</span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-[#1E324B] leading-snug mb-3">
                {article.title[currentLang]}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-5 flex-1">
                {article.summary[currentLang]}
              </p>

              {/* Key Preview Bullets */}
              <div className="bg-[#EDF2F8]/70 rounded-2xl p-4 mb-6 space-y-1.5 text-xs text-slate-700">
                {article.keyPoints[currentLang].slice(0, 2).map((point, idx) => (
                  <p key={idx} className="flex items-start gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-[#3B5B82] shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{point}</span>
                  </p>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveArticle(article);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#243B53] hover:text-[#3B5B82] cursor-pointer mt-auto"
              >
                <span>{t.blog.readArticle}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
