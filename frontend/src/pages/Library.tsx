import { BookOpen, Search, Clock, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../utils/tw';

interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  url: string;
  source: string;
}

const ARTICLES: Article[] = [
  {
    id: '1',
    title: 'First Trimester Guide: What to Expect',
    category: 'Pregnancy Stages',
    readTime: '8 min',
    summary: 'Everything you need to know about the first 12 weeks of your pregnancy, from body changes to your first prenatal visit.',
    url: 'https://www.mayoclinic.org/healthy-lifestyle/pregnancy-week-by-week/in-depth/pregnancy/art-20047205',
    source: 'Mayo Clinic'
  },
  {
    id: '2',
    title: 'Nutrition Tips for a Healthy Pregnancy',
    category: 'Nutrition',
    readTime: '6 min',
    summary: 'Eating well is one of the best things you can do for your baby. Learn which nutrients are most important and which foods to avoid.',
    url: 'https://www.acog.org/womens-health/faqs/nutrition-during-pregnancy',
    source: 'ACOG'
  },
  {
    id: '3',
    title: 'Safe Exercises During Pregnancy',
    category: 'Wellness',
    readTime: '5 min',
    summary: 'Staying active can help you feel better and prepare for labor. Discover safe ways to exercise through all three trimesters.',
    url: 'https://www.nhs.uk/pregnancy/keeping-well/exercise/',
    source: 'NHS'
  },
  {
    id: '4',
    title: 'Understanding Preeclampsia',
    category: 'Medical',
    readTime: '10 min',
    summary: 'Learn about the signs, symptoms, and risks of preeclampsia, and why regular blood pressure checks are so important.',
    url: 'https://www.preeclampsia.org/signs-and-symptoms',
    source: 'Preeclampsia Foundation'
  },
  {
    id: '5',
    title: 'Preparing for Labor and Delivery',
    category: 'Birth',
    readTime: '12 min',
    summary: 'From making a birth plan to knowing when it is time to go to the hospital, here is how to prepare for your big day.',
    url: 'https://www.unicef.org/parenting/child-care/preparing-for-labor',
    source: 'UNICEF'
  }
];

export default function Library() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(ARTICLES.map(a => a.category)))];

  const filteredArticles = ARTICLES.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-maternal-900 tracking-tight">Educational Library</h1>
        <p className="text-maternal-600 mt-2 text-lg">Reliable resources and curated articles to support you through your journey.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-maternal-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search articles, symptoms, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-maternal-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-maternal-500 transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-2 pb-2 md:pb-0 overflow-x-auto no-scrollbar">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-5 py-3.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all",
                selectedCategory === category 
                  ? "bg-maternal-600 text-white shadow-md active:scale-95" 
                  : "bg-white text-maternal-600 border border-maternal-200 hover:border-maternal-400"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <a 
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-3xl border border-maternal-100 p-8 flex flex-col hover:border-maternal-300 hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="bg-maternal-50 text-maternal-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  {article.category}
                </span>
                <span className="flex items-center gap-1.5 text-maternal-400 text-xs font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTime} read
                </span>
              </div>
              <h3 className="text-2xl font-bold text-maternal-900 group-hover:text-maternal-600 transition-colors leading-tight mb-4">
                {article.title}
              </h3>
              <p className="text-maternal-600 leading-relaxed mb-8 flex-1">
                {article.summary}
              </p>
              <div className="flex items-center justify-between pt-6 border-t border-maternal-50 mt-auto">
                <span className="text-sm font-bold text-maternal-400 uppercase tracking-widest">{article.source}</span>
                <div className="flex items-center gap-1 text-maternal-600 font-bold group-hover:gap-2 transition-all">
                  Read Article
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </a>
          ))
        ) : (
          <div className="md:col-span-2 text-center py-20 bg-white border border-maternal-100 border-dashed rounded-3xl">
             <div className="bg-maternal-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-maternal-300" />
              </div>
            <h3 className="text-xl font-bold text-maternal-800">No articles found</h3>
            <p className="text-maternal-500 mt-2">Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>

      <footer className="mt-20 p-10 bg-maternal-900 rounded-[2.5rem] text-white overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-4 italic">Need more specific help?</h3>
          <p className="text-maternal-200 mb-8 max-w-xl text-lg opacity-90">
            Our Care Assistant can help you understand your symptoms or provide personalized guidance based on your health data.
          </p>
          <a 
            href="/chat" 
            className="inline-flex items-center gap-2 bg-white text-maternal-900 px-8 py-4 rounded-2xl font-bold hover:bg-maternal-100 shadow-xl transition-all active:scale-95"
          >
            Talk to Care Assistant
            <ChevronRight className="w-5 h-5" />
          </a>
        </div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-maternal-800 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-maternal-700 rounded-full opacity-30 blur-3xl"></div>
      </footer>
    </div>
  );
}
