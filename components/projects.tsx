'use client';

import * as React from 'react';
import { Search, SlidersHorizontal, ArrowUpRight, ExternalLink, X, Calendar, Database, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  _id: string;
  title: string;
  description: string;
  problemStatement?: string;
  methodology?: string;
  dataset?: string;
  technologies: string[];
  results?: string;
  businessImpact?: string;
  coverImage: string;
  gallery?: string[];
  liveUrl?: string;
  githubUrl?: string;
  category: string;
  tags?: string[];
}

const defaultProjects: Project[] = [
  {
    _id: '1',
    title: 'E-Commerce Interactive Revenue Analytics',
    description: 'Designed a comprehensive analytics platform and dashboard to track monthly sales, regional performance, and client segment patterns.',
    problemStatement: 'The sales team lacked real-time visibility into region-specific revenue shifts, leading to inefficient marketing allocations.',
    methodology: 'Processed 5M records in BigQuery SQL, performed cohorts analysis in Pandas, and created interactive dashboards with trend modeling.',
    dataset: 'Sales Transactions Dataset (2024-2026, 5.2 million records)',
    technologies: ['SQL', 'Python', 'Power BI', 'Zustand', 'Recharts'],
    results: 'Pinpointed three underperforming regional channels, enabling optimization campaigns that boosted conversions by 14%.',
    businessImpact: 'Discovered a $1.2M annual leakage pattern in transaction processing fees, enabling contract re-negotiation.',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600'
    ],
    liveUrl: '#',
    githubUrl: '#',
    category: 'Power BI',
  },
  {
    _id: '2',
    title: 'Customer Churn Predictor & Segmentation Model',
    description: 'Built an end-to-end Machine Learning pipeline to predict churn risk for users and segment customer behaviors.',
    problemStatement: 'SaaS churn rates rose to 8.4% without clear indicators, causing loss in subscriber lifetime value.',
    methodology: 'Cleaned raw system logs using Python, extracted behavioral features, trained XGBoost and Random Forest classifiers, and output predictions via API.',
    dataset: 'Customer Activity Logs & Subscription Metadata (50,000 active profiles)',
    technologies: ['Python', 'Machine Learning', 'SQL', 'Scikit-Learn'],
    results: 'Achieved 89% precision (F1-score of 0.86) in predicting churn events 30 days before occurrence.',
    businessImpact: 'Aided customer success teams in deploying proactive discount triggers, decreasing churn from 8.4% to 4.2% within one quarter.',
    coverImage: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=600'
    ],
    liveUrl: '#',
    githubUrl: '#',
    category: 'Machine Learning',
  },
  {
    _id: '3',
    title: 'High-Volume BigQuery ETL Pipeline',
    description: 'Developed an automated pipeline feeding analytics views from streaming JSON logs in GCP.',
    problemStatement: 'Raw clickstream data sat uncompressed, creating $5,000/mo query inefficiencies due to full table scans.',
    methodology: 'Restructured ingestion with partitioned and clustered tables. Wrote dbt transformations scheduled in Apache Airflow.',
    dataset: 'Clickstream Event Logs (1.2 billion rows)',
    technologies: ['SQL', 'Python', 'ETL', 'GCP BigQuery', 'dbt'],
    results: 'Reduced query runtime by 72% and lowered cloud billing charges by $3,200/mo.',
    businessImpact: 'Enabled downstream analytics dashboards to refresh in near real-time (5-minute latency down from 24 hours).',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600',
    liveUrl: '#',
    githubUrl: '#',
    category: 'SQL',
  }
];

const categories = ['All', 'Power BI', 'Tableau', 'SQL', 'Python', 'Excel', 'Machine Learning'];

interface ProjectsProps {
  initialProjects?: Project[];
}

export function Projects({ initialProjects }: ProjectsProps) {
  const mockProjects = initialProjects && initialProjects.length > 0 ? initialProjects : defaultProjects;
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('All');

  const filteredProjects = mockProjects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-bold text-primary tracking-widest uppercase">Portfolio</span>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Featured Projects</h2>
        <p className="mt-4 text-base text-muted-foreground">
          Case studies and data pipelines detailing methodologies, data sources, and business outcomes.
        </p>
      </div>

      {/* Controls Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title or technology..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border/60 rounded-xl bg-card text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none"
          />
        </div>

        {/* Categories Tab list */}
        <div className="flex flex-wrap gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:bg-secondary/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((p) => (
          <motion.div
            key={p._id}
            layout
            className="group rounded-2xl bg-card border border-border/40 hover:border-border overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer"
            onClick={() => setSelectedProject(p)}
          >
            <div>
              {/* Image */}
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                <img
                  src={p.coverImage}
                  alt={p.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-md">
                  {p.category}
                </span>
              </div>

              {/* Text info */}
              <div className="p-5 space-y-3">
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              </div>
            </div>

            {/* Tags and Action */}
            <div className="p-5 pt-0">
              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.technologies.slice(0, 3).map((t) => (
                  <span key={t} className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center text-xs font-semibold text-primary group-hover:underline">
                <span>View Case Study</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Case Study Detail Modal Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-y-auto border border-border shadow-2xl flex flex-col"
            >
              {/* Header Image banner */}
              <div className="relative aspect-video sm:aspect-[2.5/1] w-full overflow-hidden bg-muted">
                <img
                  src={selectedProject.coverImage}
                  alt={selectedProject.title}
                  className="object-cover w-full h-full"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contents */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-xs font-bold text-primary tracking-wider uppercase">{selectedProject.category}</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-foreground mt-1">{selectedProject.title}</h3>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border/30">
                  {/* Left Column: Tech Stack & Links */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-foreground flex items-center">
                        <Database className="w-3.5 h-3.5 text-primary mr-1.5" />
                        <span>Dataset Used</span>
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{selectedProject.dataset || 'N/A'}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-foreground">Technologies</h4>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {selectedProject.technologies.map((t) => (
                          <span key={t} className="text-[10px] bg-secondary px-2 py-0.5 rounded text-muted-foreground font-semibold">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <a href={selectedProject.liveUrl} className="flex-1 inline-flex items-center justify-center space-x-1 px-3 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                      <a href={selectedProject.githubUrl} className="flex-1 inline-flex items-center justify-center space-x-1 px-3 py-2 text-xs font-semibold rounded-lg bg-secondary text-foreground hover:bg-border border border-border">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
                        <span>Codebase</span>
                      </a>
                    </div>
                  </div>

                  {/* Right Column: Narrative */}
                  <div className="md:col-span-2 space-y-6 text-xs text-muted-foreground leading-relaxed">
                    <div>
                      <h4 className="text-xs font-bold text-foreground mb-1">Problem Statement</h4>
                      <p>{selectedProject.problemStatement}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground mb-1">Methodology & Execution</h4>
                      <p>{selectedProject.methodology}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-secondary/30 p-4 rounded-xl border border-border/20">
                      <div>
                        <h4 className="text-xs font-bold text-foreground mb-1 flex items-center">
                          <CheckSquare className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                          <span>Results Achieved</span>
                        </h4>
                        <p>{selectedProject.results}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground mb-1 flex items-center">
                          <CheckSquare className="w-3.5 h-3.5 text-blue-500 mr-1" />
                          <span>Business Impact (ROI)</span>
                        </h4>
                        <p>{selectedProject.businessImpact}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
