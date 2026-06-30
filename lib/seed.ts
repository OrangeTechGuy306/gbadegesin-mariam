import bcrypt from 'bcryptjs';
import User from '@/models/user';
import Project from '@/models/project';
import Skill from '@/models/skill';
import Experience from '@/models/experience';
import Testimonial from '@/models/testimonial';
import Blog from '@/models/blog';
import {
  fallbackSkills,
  fallbackProjects,
  fallbackExperiences,
  fallbackTestimonials,
  fallbackBlogs,
} from './fallback-data';

export async function seedDatabase() {
  // 1. Seed Super Admin if none exists
  const superAdmin = await User.findOne({ role: 'SUPER_ADMIN' });
  if (!superAdmin) {
    const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@mariamgbadegesin.com';
    const adminPassword = process.env.SUPER_ADMIN_PASSWORD || 'AdminPassword123!';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await User.create({
      name: 'Gbadegesin Mariam Omowumi',
      email: adminEmail,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isVerified: true,
    });
    console.log('Seeded Super Admin user successfully!');
  }

  // 2. Seed Skills if they do not exist
  for (const skill of fallbackSkills) {
    const exists = await Skill.findOne({ name: skill.name });
    if (!exists) {
      await Skill.create(skill);
      console.log(`Seeded missing skill: ${skill.name}`);
    }
  }

  // 3. Seed Projects if they do not exist
  for (const proj of fallbackProjects) {
    const exists = await Project.findOne({ title: proj.title });
    if (!exists) {
      const { _id, ...projectData } = proj;
      await Project.create(projectData);
      console.log(`Seeded missing project: ${proj.title}`);
    }
  }

  // 4. Seed Experiences if they do not exist
  for (const exp of fallbackExperiences) {
    const exists = await Experience.findOne({ title: exp.title, company: exp.company });
    if (!exists) {
      await Experience.create(exp);
      console.log(`Seeded missing experience: ${exp.title} at ${exp.company}`);
    }
  }

  // 5. Seed Testimonials if they do not exist
  for (const testimonial of fallbackTestimonials) {
    const exists = await Testimonial.findOne({ name: testimonial.name });
    if (!exists) {
      const { _id, ...testimonialData } = testimonial;
      await Testimonial.create(testimonialData);
      console.log(`Seeded missing testimonial from: ${testimonial.name}`);
    }
  }

  // 6. Seed Blogs if they do not exist
  for (const blog of fallbackBlogs) {
    const exists = await Blog.findOne({ title: blog.title });
    if (!exists) {
      const { _id, ...blogData } = blog;
      await Blog.create({
        ...blogData,
        publishedAt: blogData.publishedAt ? new Date(blogData.publishedAt) : new Date(),
        comments: blogData.comments?.map(({ _id, ...cRest }) => ({
          ...cRest,
          createdAt: cRest.createdAt ? new Date(cRest.createdAt) : new Date(),
        })) || [],
      });
      console.log(`Seeded missing blog: ${blog.title}`);
    }
  }
}
