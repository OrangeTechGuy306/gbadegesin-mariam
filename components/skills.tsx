'use client';

import * as React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const defaultSkillsList = [
  { name: 'SQL (PostgreSQL / BigQuery)', proficiency: 92, category: 'SQL', value: 9 },
  { name: 'Python (Pandas / NumPy)', proficiency: 88, category: 'Python', value: 9 },
  { name: 'Power BI Dashboards', proficiency: 85, category: 'Power BI', value: 8 },
  { name: 'Tableau Visualizations', proficiency: 87, category: 'Tableau', value: 8 },
  { name: 'Advanced Excel & VBA', proficiency: 80, category: 'Excel', value: 7 },
  { name: 'R Programming', proficiency: 70, category: 'R', value: 6 },
  { name: 'Statistical Modelling', proficiency: 85, category: 'Statistics', value: 8 },
  { name: 'Machine Learning', proficiency: 75, category: 'Machine Learning', value: 7 },
  { name: 'Data Cleaning', proficiency: 95, category: 'Data Cleaning', value: 10 },
  { name: 'Data Visualization', proficiency: 90, category: 'Data Visualization', value: 10 },
  { name: 'ETL Pipelines', proficiency: 82, category: 'ETL', value: 8 },
  { name: 'Business Intelligence', proficiency: 88, category: 'Business Intelligence', value: 9 },
];

const categories = ['All', 'SQL', 'Python', 'Power BI', 'Tableau', 'Excel', 'Machine Learning', 'Data Cleaning', 'Data Visualization'];

interface SkillItem {
  name: string;
  proficiency: number;
  category: string;
  value: number;
}

interface SkillsProps {
  initialSkills?: SkillItem[];
}

export function Skills({ initialSkills }: SkillsProps) {
  const skillsList = initialSkills && initialSkills.length > 0 ? initialSkills : defaultSkillsList;
  const [activeCategory, setActiveCategory] = React.useState('All');

  const filteredSkills = activeCategory === 'All'
    ? skillsList
    : skillsList.filter((s) => s.category === activeCategory);

  // Data parsed for the Radar Chart
  const radarData = skillsList.slice(0, 7).map((s) => ({
    subject: s.category,
    A: s.value,
    fullMark: 10,
  }));

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-bold text-primary tracking-widest uppercase">Expertise</span>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Skills Inventory</h2>
        <p className="mt-4 text-base text-muted-foreground">
          Detailed overview of analytical proficiencies, database frameworks, and visualization toolkits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: Interactive Progress Bars */}
        <div className="lg:col-span-7 space-y-6">
          {/* Category Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-card text-muted-foreground border-border hover:bg-secondary/40 hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Progress Bars */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill) => (
                <motion.div
                  key={skill.name}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-1.5 p-3 rounded-xl bg-card border border-border/40"
                >
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-foreground">{skill.name}</span>
                    <span className="text-primary">{skill.proficiency}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.proficiency}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Radar Chart Visualization */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-card border border-border/50 shadow-sm glass-card flex items-center justify-center">
          <div className="w-full h-80 text-[10px]">
            <h4 className="text-xs font-bold text-center text-foreground mb-4">Core Skill Profile</h4>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="var(--border)" opacity={0.5} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted)', fontSize: 9 }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: 'var(--muted)', fontSize: 8 }} />
                <Radar
                  name="Proficiency"
                  dataKey="A"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
