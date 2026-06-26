import connectDB from '@/lib/db';
import Skill from '@/models/skill';
import Project from '@/models/project';
import Experience from '@/models/experience';
import Testimonial from '@/models/testimonial';
import BlogModel from '@/models/blog';
import { ClientCanvas } from '@/components/client-canvas';
import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { About } from '@/components/about';
import { Skills } from '@/components/skills';
import { Projects } from '@/components/projects';
import { DashboardShowcase } from '@/components/dashboard-showcase';
import { Testimonials } from '@/components/testimonials';
import { Blog } from '@/components/blog';
import { Contact } from '@/components/contact';
import { Footer } from '@/components/footer';
import { Chatbot } from '@/components/chatbot';
import {
  fallbackSkills,
  fallbackProjects,
  fallbackExperiences,
  fallbackTestimonials,
  fallbackBlogs,
} from '@/lib/fallback-data';


export default async function Home() {
  let skills: any[] = [];
  let projects: any[] = [];
  let experiences: any[] = [];
  let testimonials: any[] = [];
  let blogs: any[] = [];

  try {
    const conn = await connectDB();
    if (conn) {
      skills = await Skill.find({}).lean();
      projects = await Project.find({}).sort({ createdAt: -1 }).lean();
      experiences = await Experience.find({}).sort({ startDate: -1 }).lean();
      testimonials = await Testimonial.find({}).sort({ createdAt: -1 }).lean();
      blogs = await BlogModel.find({ status: 'published' }).sort({ publishedAt: -1 }).lean();
    } else {
      console.warn('Database connection is not available. Defaulting to local portfolio datasets.');
    }
  } catch (err) {
    console.error('Database connection or query failed in homepage. Loading static fallbacks. Error:', err);
  }

  // Gracefully degrade to static/mock records if query is empty or failed
  const finalSkills = skills && skills.length > 0 ? skills : fallbackSkills;
  const finalProjects = projects && projects.length > 0 ? projects : fallbackProjects;
  const finalExperiences = experiences && experiences.length > 0 ? experiences : fallbackExperiences;
  const finalTestimonials = testimonials && testimonials.length > 0 ? testimonials : fallbackTestimonials;
  const finalBlogs = blogs && blogs.length > 0 ? blogs : fallbackBlogs;

  // Format items for safe client boundary passing
  const formattedSkills = finalSkills.map((s: any) => ({
    name: s.name,
    proficiency: s.proficiency,
    category: s.category,
    value: s.radarValue || 8,
  }));

  const formattedProjects = finalProjects.map((p: any) => ({
    _id: p._id ? p._id.toString() : Math.random().toString(),
    title: p.title,
    description: p.description,
    problemStatement: p.problemStatement || '',
    methodology: p.methodology || '',
    dataset: p.dataset || '',
    technologies: p.technologies || [],
    results: p.results || '',
    businessImpact: p.businessImpact || '',
    coverImage: p.coverImage,
    gallery: p.gallery || [],
    liveUrl: p.liveUrl || '#',
    githubUrl: p.githubUrl || '#',
    category: p.category || 'General',
    tags: p.tags || [],
    featured: p.featured || false,
  }));

  const formattedExperiences = finalExperiences.map((e: any) => ({
    year: `${e.startDate} - ${e.endDate}`,
    role: e.title,
    company: e.company,
    description: e.description || '',
    type: e.type || 'work',
  }));

  const formattedTestimonials = finalTestimonials.map((t: any) => ({
    _id: t._id ? t._id.toString() : Math.random().toString(),
    name: t.name,
    role: t.role,
    company: t.company,
    text: t.text,
    rating: t.rating || 5,
    avatar: t.avatar || '',
  }));

  const formattedBlogs = finalBlogs.map((b: any) => ({
    _id: b._id ? b._id.toString() : Math.random().toString(),
    title: b.title,
    summary: b.summary,
    category: b.category || 'General',
    publishedAt: b.publishedAt ? new Date(b.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }) : '',
    views: b.views || 0,
    likes: b.likes || 0,
    coverImage: b.coverImage,
  }));

  // Schema.org JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Gbadegesin Mariam Omowumi",
    "jobTitle": "Senior Data Analyst & BI Engineer",
    "url": "https://gbadegesin.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Lagos",
      "addressCountry": "NG"
    },
    "sameAs": [
      "https://github.com/Kanyin-D-analyst",
      "https://linkedin.com"
    ],
    "knowsAbout": [
      "SQL Performance Optimization",
      "Cohort Analysis",
      "Machine Learning Predictions",
      "Business Intelligence Dashboards",
      "ETL Pipelines"
    ]
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Schema.org Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 3D background canvas */}
      <ClientCanvas />

      {/* Navigation header */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Banner */}
        <Hero />

        {/* Biography & Timeline */}
        <About initialExperiences={formattedExperiences} />

        {/* Skills inventory */}
        <Skills initialSkills={formattedSkills} />

        {/* Projects listings */}
        <Projects initialProjects={formattedProjects} />

        {/* Analytics Interactive mockup dashboard */}
        <DashboardShowcase />

        {/* Testimonials */}
        <Testimonials initialTestimonials={formattedTestimonials} />

        {/* Blog grid */}
        <Blog initialBlogs={formattedBlogs} />

        {/* Form and bookings */}
        <Contact />
      </main>

      {/* Floating AI Agent Chatbot assistant */}
      <Chatbot />

      {/* Footer */}
      <Footer />
    </div>
  );
}
