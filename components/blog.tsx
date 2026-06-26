'use client';

import * as React from 'react';
import { Search, Calendar, Heart, Eye, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Blog {
  _id: string;
  title: string;
  summary: string;
  category: string;
  publishedAt: string;
  views: number;
  likes: number;
  coverImage: string;
}

const defaultBlogs: Blog[] = [
  {
    _id: '1',
    title: 'Optimizing SQL Queries: Cohort Analysis Over 10M Rows',
    summary: 'Discover how clustering, window functions, and partitioning reduced cloud query latency by 72% and saved thousands in monthly cloud costs.',
    category: 'SQL Performance',
    publishedAt: 'May 12, 2026',
    views: 1240,
    likes: 182,
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=400',
  },
  {
    _id: '2',
    title: 'Understanding Customer Churn with XGBoost Predictions',
    summary: 'A step-by-step methodology explaining predictive feature selection, hyperparameter tuning, and embedding models directly into CRM triggers.',
    category: 'Machine Learning',
    publishedAt: 'Apr 28, 2026',
    views: 890,
    likes: 98,
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400',
  },
];

interface BlogProps {
  initialBlogs?: Blog[];
}

export function Blog({ initialBlogs }: BlogProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const mockBlogs = initialBlogs && initialBlogs.length > 0 ? initialBlogs : defaultBlogs;

  const filteredBlogs = mockBlogs.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/20">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div className="max-w-2xl space-y-2 text-left">
          <span className="text-xs font-bold text-primary tracking-widest uppercase">Articles</span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Data Analytics Blog</h2>
          <p className="text-muted-foreground text-sm">
            Insights on query optimization, feature engineering, statistical methods, and visualization dashboard best practices.
          </p>
        </div>

        {/* Search */}
        <div className="relative mt-6 md:mt-0 w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border/60 rounded-xl bg-card text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredBlogs.map((b) => (
          <motion.article
            key={b._id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-6 p-5 rounded-2xl bg-card border border-border/40 hover:border-border transition-all"
          >
            {/* Image */}
            <div className="w-full sm:w-44 h-44 rounded-xl overflow-hidden bg-muted flex-shrink-0">
              <Link href={`/blog/${b._id}`}>
                <img
                  src={b.coverImage}
                  alt={b.title}
                  className="object-cover w-full h-full hover:scale-103 transition-transform"
                />
              </Link>
            </div>

            {/* Text details */}
            <div className="flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {b.category}
                </span>
                <Link href={`/blog/${b._id}`}>
                  <h3 className="text-sm font-bold text-foreground leading-snug hover:text-primary transition-colors cursor-pointer">
                    {b.title}
                  </h3>
                </Link>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {b.summary}
                </p>
              </div>

              {/* Footer row */}
              <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t border-border/20">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {b.publishedAt}
                  </span>
                  <span className="flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    {b.views}
                  </span>
                  <span className="flex items-center">
                    <Heart className="w-3 h-3 mr-1 text-red-500 fill-red-500/10" />
                    {b.likes}
                  </span>
                </div>
                <Link href={`/blog/${b._id}`} className="flex items-center text-primary font-bold hover:underline cursor-pointer">
                  <span>Read</span>
                  <ArrowRight className="w-3 h-3 ml-0.5" />
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
