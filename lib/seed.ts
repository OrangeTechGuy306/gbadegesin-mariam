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
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@gbadegesin.com';
    const adminPassword = process.env.SUPER_ADMIN_PASSWORD || 'AdminPassword123!';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await User.create({
      name: 'Gbade Gesin',
      email: adminEmail,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isVerified: true,
    });
    console.log('Seeded Super Admin user successfully!');
  }

  // 2. Seed Skills if none exist
  const skillCount = await Skill.countDocuments();
  if (skillCount === 0) {
    await Skill.insertMany(fallbackSkills);
    console.log('Seeded initial skills database!');
  }

  // 3. Seed Projects if none exist
  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
    const projectsToSeed = fallbackProjects.map(({ _id, ...rest }) => rest);
    await Project.insertMany(projectsToSeed);
    console.log('Seeded initial projects database!');
  }

  // 4. Seed Experiences if none exist
  const experienceCount = await Experience.countDocuments();
  if (experienceCount === 0) {
    await Experience.insertMany(fallbackExperiences);
    console.log('Seeded experience timeline data!');
  }

  // 5. Seed Testimonials if none exist
  const testimonialCount = await Testimonial.countDocuments();
  if (testimonialCount === 0) {
    const testimonialsToSeed = fallbackTestimonials.map(({ _id, ...rest }) => rest);
    await Testimonial.insertMany(testimonialsToSeed);
    console.log('Seeded testimonials!');
  }

  // 6. Seed Blogs if none exist
  const blogCount = await Blog.countDocuments();
  if (blogCount === 0) {
    const blogsToSeed = fallbackBlogs.map(({ _id, ...rest }) => ({
      ...rest,
      publishedAt: rest.publishedAt ? new Date(rest.publishedAt) : new Date(),
      comments: rest.comments?.map(({ _id, ...cRest }) => ({
        ...cRest,
        createdAt: cRest.createdAt ? new Date(cRest.createdAt) : new Date(),
      })) || [],
    }));
    await Blog.insertMany(blogsToSeed);
    console.log('Seeded initial blogs!');
  }
}
