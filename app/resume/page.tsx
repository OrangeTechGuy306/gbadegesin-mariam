'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Printer, Download, Mail, Phone, MapPin, Globe, Database, Award } from 'lucide-react';

export default function ResumePage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-secondary/20 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0 print:px-0">
      {/* Action Header bar (Hidden when printing) */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-6 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>
        <div className="flex space-x-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-card border border-border/80 hover:bg-secondary text-foreground transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
          <a
            href="#"
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download DOCX</span>
          </a>
        </div>
      </div>

      {/* Resume Document Wrapper */}
      <article className="max-w-4xl mx-auto bg-card border border-border/40 p-8 sm:p-12 rounded-3xl shadow-lg print:border-none print:shadow-none print:rounded-none print:p-0">
        {/* Header Grid */}
        <header className="border-b border-border/60 pb-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">Gbade Gesin</h1>
            <p className="text-sm font-bold text-primary tracking-wide uppercase">Senior Data Analyst / BI Engineer</p>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">
              Results-oriented Data Analyst with 5+ years of experience building statistical modeling pipelines, transactional data cohorts, ETL frameworks, and interactive business intelligence tools.
            </p>
          </div>
          
          {/* Contact details */}
          <div className="space-y-2 text-xs text-muted-foreground md:text-right">
            <div className="flex items-center justify-start md:justify-end space-x-2">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span>mariamgbadegesin15@gmail.com</span>
            </div>
            <div className="flex items-center justify-start md:justify-end space-x-2">
              <Phone className="w-3.5 h-3.5 text-primary" />
              <span>+2349057589271, +2347018313016</span>
            </div>
            <div className="flex items-center justify-start md:justify-end space-x-2">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>Lagos, Nigeria</span>
            </div>
            <div className="flex items-center justify-start md:justify-end space-x-2">
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span>gbadegesin.com</span>
            </div>
          </div>
        </header>

        {/* Content columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          {/* Main Column */}
          <div className="md:col-span-2 space-y-8">
            {/* Experience */}
            <section className="space-y-4">
              <h2 className="text-sm font-extrabold tracking-wider uppercase text-foreground border-b border-border/40 pb-2 flex items-center">
                <Database className="w-4 h-4 text-primary mr-1.5" />
                <span>Professional Experience</span>
              </h2>

              <div className="space-y-6">
                {/* Stripe */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start text-xs font-bold text-foreground">
                    <div>
                      <h3 className="text-sm font-bold">Senior Data Analyst</h3>
                      <p className="text-primary mt-0.5">Stripe Analytics Division • San Francisco, CA</p>
                    </div>
                    <span className="text-muted-foreground font-semibold">2024 - Present</span>
                  </div>
                  <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1 leading-relaxed">
                    <li>Design and deploy BigQuery SQL metrics pipelines monitoring settlement volumes across $10B+ pricing tiers.</li>
                    <li>Developed automated anomaly detection tools, flagging transaction fee leakages and saving $1.2M annually.</li>
                    <li>Orchestrated user segment dashboards with dbt, reducing query execution costs by 45%.</li>
                  </ul>
                </div>

                {/* Vercel */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start text-xs font-bold text-foreground">
                    <div>
                      <h3 className="text-sm font-bold">Data Analyst II</h3>
                      <p className="text-primary mt-0.5">Vercel Performance Team • Remote</p>
                    </div>
                    <span className="text-muted-foreground font-semibold">2022 - 2024</span>
                  </div>
                  <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1 leading-relaxed">
                    <li>Led analytics telemetry tracking for deployment funnels, improving conversion paths by 8%.</li>
                    <li>Built real-time streaming dashboards tracking serverless cold-start spikes across edge infrastructure nodes.</li>
                    <li>Authored analytics reports for product leadership to guide roadmap allocations.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Education */}
            <section className="space-y-4">
              <h2 className="text-sm font-extrabold tracking-wider uppercase text-foreground border-b border-border/40 pb-2 flex items-center">
                <Award className="w-4 h-4 text-primary mr-1.5" />
                <span>Education</span>
              </h2>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-foreground">
                  <div>
                    <h3 className="font-bold">M.S. in Data Analytics</h3>
                    <p className="text-primary mt-0.5">University of California, Berkeley</p>
                  </div>
                  <span className="text-muted-foreground font-semibold">2020 - 2022</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Specialized in econometrics, statistical testing, and predictive ML pipelines. Thesis: "Time-series forecasting models for web server capacity routing".
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Skills */}
            <section className="space-y-4">
              <h2 className="text-sm font-extrabold tracking-wider uppercase text-foreground border-b border-border/40 pb-2">
                Technical Skills
              </h2>
              <div className="space-y-3 text-xs text-muted-foreground">
                <div>
                  <h4 className="font-bold text-foreground">Databases</h4>
                  <p className="mt-0.5">SQL (PostgreSQL, BigQuery, Snowflake)</p>
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Languages</h4>
                  <p className="mt-0.5">Python (Pandas, NumPy, Scikit-Learn), R</p>
                </div>
                <div>
                  <h4 className="font-bold text-foreground">BI Tools</h4>
                  <p className="mt-0.5">Power BI, Tableau, Looker Studio</p>
                </div>
                <div>
                  <h4 className="font-bold text-foreground">ETL & Ops</h4>
                  <p className="mt-0.5">dbt, Apache Airflow, git, CI/CD</p>
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Analytics</h4>
                  <p className="mt-0.5">A/B Testing, Cohort Analysis, Segment Analysis</p>
                </div>
              </div>
            </section>

            {/* Certifications */}
            <section className="space-y-4">
              <h2 className="text-sm font-extrabold tracking-wider uppercase text-foreground border-b border-border/40 pb-2">
                Certifications
              </h2>
              <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                <li>
                  <strong className="text-foreground">Google Advanced Data Analytics</strong>
                  <p>Google Professional Certification</p>
                </li>
                <li>
                  <strong className="text-foreground">Microsoft Power BI Associate</strong>
                  <p>Microsoft Credential PL-300</p>
                </li>
                <li>
                  <strong className="text-foreground">Tableau Desktop Specialist</strong>
                  <p>Tableau Certification Board</p>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </article>
    </div>
  );
}
