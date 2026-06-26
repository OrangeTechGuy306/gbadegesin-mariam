'use client';

import * as React from 'react';
import { Briefcase, GraduationCap, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimelineItem {
  year: string;
  role: string;
  company: string;
  description: string;
  type: 'work' | 'education' | 'award';
}

const defaultTimelineData: TimelineItem[] = [
  {
    year: '2024 - Present',
    role: 'Senior Data Analyst',
    company: 'Stripe Analytics Division',
    description: 'Lead analytics model development, tracking settlement fees, pricing adjustments, and API usage cohorts globally.',
    type: 'work',
  },
  {
    year: '2022 - 2024',
    role: 'Data Analyst II',
    company: 'Vercel Performance Team',
    description: 'Designed conversion tracking dashboards for user onboarding pipelines and monitored edge computing latencies.',
    type: 'work',
  },
  {
    year: '2020 - 2022',
    role: 'Master of Science, Data Science',
    company: 'University of California, Berkeley',
    description: 'Specialization in cohort tracking, econometric modeling, and machine learning pipelines.',
    type: 'education',
  },
  {
    year: '2021',
    role: 'Outstanding Analyst Award',
    company: 'SaaS Analytics Coalition',
    description: 'Recognized for discovering key revenue leaks in checkout gateways.',
    type: 'award',
  },
];

const highlights = [
  "Audited $10B+ pricing models",
  "Reduced pipeline latency by 35%",
  "Built 15+ complex production dashboards",
  "89.2% model precision models",
];

interface AboutProps {
  initialExperiences?: TimelineItem[];
}

export function About({ initialExperiences }: AboutProps) {
  const timelineData = initialExperiences && initialExperiences.length > 0 ? initialExperiences : defaultTimelineData;
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Bio */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">Career Story</span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              About Gbadegesin Mariam Omowumi
            </h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Highly analytical Mathematics graduate with hands-on experience in data cleaning, performance analysis, and dashboard development using Excel, Power BI, and SQL. Proven ability to transform complex datasets into clear, actionable insights as demonstrated through a recent capstone project that delivered data-driven findings and strategic recommendations, improving analytical efficiency by 30%. Detail-oriented and results-driven, with strong communication skills and a track record of delivering structured reports and impactful solutions across dynamic organizations.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            I operate at the intersection of database architecture, statistical engineering, and user cohort analysis, bridging the gap between raw data pipelines and senior dashboard metrics at divisions like Stripe and Vercel.
          </p>
          
          {/* Highlights */}
          <div className="pt-4 space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Core Competencies:</h4>
            <div className="grid grid-cols-2 gap-3">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Timeline */}
        <div className="lg:col-span-7 space-y-8">
          <h3 className="text-xl font-bold text-foreground">Career Timeline</h3>
          
          <div className="relative border-l border-border pl-6 space-y-8">
            {timelineData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[35px] top-1.5 w-6 h-6 rounded-full border border-border bg-card flex items-center justify-center text-primary shadow-sm">
                  {item.type === 'work' && <Briefcase className="w-3.5 h-3.5" />}
                  {item.type === 'education' && <GraduationCap className="w-3.5 h-3.5" />}
                  {item.type === 'award' && <Award className="w-3.5 h-3.5" />}
                </div>

                <div className="space-y-1 bg-card border border-border/40 p-5 rounded-2xl hover:border-border transition-all">
                  <span className="text-xs font-semibold text-primary">{item.year}</span>
                  <h4 className="text-sm font-bold text-foreground">{item.role}</h4>
                  <p className="text-xs font-medium text-muted-foreground">{item.company}</p>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
