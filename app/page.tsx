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

export const dynamic = 'force-dynamic';

export default async function Home() {
  await connectDB();

  // Query records
  const skills = await Skill.find({}).lean();
  const projects = await Project.find({}).sort({ createdAt: -1 }).lean();
  const experiences = await Experience.find({}).sort({ startDate: -1 }).lean();
  const testimonials = await Testimonial.find({}).sort({ createdAt: -1 }).lean();
  const blogs = await BlogModel.find({ status: 'published' }).sort({ publishedAt: -1 }).lean();

  // Format MongoDB items for safe client boundary passing
  const formattedSkills = skills.map((s: any) => ({
    name: s.name,
    proficiency: s.proficiency,
    category: s.category,
    value: s.radarValue || 8,
  }));

  const formattedProjects = projects.map((p: any) => ({
    _id: p._id.toString(),
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

  const formattedExperiences = experiences.map((e: any) => ({
    year: `${e.startDate} - ${e.endDate}`,
    role: e.title,
    company: e.company,
    description: e.description || '',
    type: e.type || 'work',
  }));

  const formattedTestimonials = testimonials.map((t: any) => ({
    _id: t._id.toString(),
    name: t.name,
    role: t.role,
    company: t.company,
    text: t.text,
    rating: t.rating || 5,
    avatar: t.avatar || '',
  }));

  const formattedBlogs = blogs.map((b: any) => ({
    _id: b._id.toString(),
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
    "name": "Gbade Gesin",
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
