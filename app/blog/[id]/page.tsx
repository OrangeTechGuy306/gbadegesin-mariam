import connectDB from '@/lib/db';
import Blog from '@/models/blog';
import { BlogDetailView } from '@/components/blog-detail-view';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import mongoose from 'mongoose';
import { cache } from 'react';

export const dynamic = 'force-dynamic';

// Request-scoped cache to deduplicate database queries between metadata and rendering
const getBlog = cache(async (id: string) => {
  const conn = await connectDB();
  if (!conn) return null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Blog.findById(id).lean();
  }
  return null;
});

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  let blog: any = null;
  try {
    blog = await getBlog(id);
  } catch (e) {
    console.error('Error fetching blog metadata from database:', e);
  }



  if (!blog) {
    return {
      title: "Article Not Found | Gbadegesin Mariam Omowumi",
    };
  }

  return {
    title: blog.title,
    description: blog.summary,
    openGraph: {
      title: blog.title,
      description: blog.summary,
      type: "article",
      publishedTime: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : undefined,
      images: [
        {
          url: blog.coverImage,
          alt: blog.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.summary,
      images: [blog.coverImage],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { id } = await params;

  let blog: any = null;
  let isFromDb = false;

  try {
    blog = await getBlog(id);
    if (blog) {
      isFromDb = true;
    }
  } catch (err) {
    console.error('Error fetching blog from database inside BlogDetailPage:', err);
  }

  // Fallback if not found in live DB or DB connection failed
  if (!blog) {
    notFound();
  }

  // Format serializable fields for client boundary passing
  const formattedBlog = {
    _id: blog._id.toString(),
    title: blog.title,
    slug: blog.slug,
    content: blog.content,
    summary: blog.summary,
    coverImage: blog.coverImage,
    category: blog.category,
    tags: blog.tags || [],
    views: isFromDb ? (blog.views || 0) + 1 : blog.views || 0, // Add 1 locally if incrementing live DB views
    likes: blog.likes || 0,
    publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) : '',
    comments: blog.comments?.map((c: any) => ({
      _id: c._id?.toString() || Math.random().toString(),
      name: c.name,
      text: c.text,
      createdAt: c.createdAt ? new Date(c.createdAt).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }) : '',
    })) || [],
  };

  return <BlogDetailView blog={formattedBlog} />;
}
