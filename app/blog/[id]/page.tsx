import connectDB from '@/lib/db';
import Blog from '@/models/blog';
import { BlogDetailView } from '@/components/blog-detail-view';
import { incrementBlogViewsAction } from '@/server/actions/blog';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

const fallbackBlogs = [
  {
    _id: '1',
    title: 'Optimizing SQL Queries: Cohort Analysis Over 10M Rows',
    slug: 'optimizing-sql-queries-cohort-analysis-over-10m-rows',
    summary: 'Discover how clustering, window functions, and partitioning reduced cloud query latency by 72% and saved thousands in monthly cloud costs.',
    category: 'SQL Performance',
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=600',
    content: `
<p>In high-volume transaction systems, query optimization is the difference between scalable systems and massive cloud bills. In this article, we outline a cohort analytics query optimization case study involving 10 million transaction rows.</p>
<h3>The Problem Statement</h3>
<p>Our daily user retention and cohort models took over 4 minutes to run on standard datasets, leading to dashboard timeouts and high costs in BigQuery and PostgreSQL.</p>
<h3>Optimization Strategies</h3>
<ol>
  <li><strong>Table Partitioning:</strong> Partitioned the events table by date, ensuring queries scan daily increments rather than full historical data.</li>
  <li><strong>Clustering Keys:</strong> Clustered by user ID and event name, bringing user activities close together physically in memory.</li>
  <li><strong>Window Functions over Joins:</strong> Replaced nested self-joins with window functions (<code>LEAD</code>/<code>LAG</code>) to compute time-since-last-activity.</li>
</ol>
<h3>Outcome</h3>
<p>Query execution latency fell from 4.2 minutes to 11.4 seconds, with a 72% reduction in cloud costs.</p>
    `,
    views: 1240,
    likes: 182,
    publishedAt: 'May 12, 2026',
    comments: [
      {
        name: 'Sarah Jenkins',
        text: 'This is brilliant! Replacing our self-joins with window functions saved us so much query time. Thanks for writing this!',
        createdAt: 'May 13, 2026, 10:24 AM',
      }
    ],
    tags: ['SQL', 'BigQuery', 'Optimization', 'Data Engineering'],
  },
  {
    _id: '2',
    title: 'Understanding Customer Churn with XGBoost Predictions',
    slug: 'understanding-customer-churn-with-xgboost-predictions',
    summary: 'A step-by-step methodology explaining predictive feature selection, hyperparameter tuning, and embedding models directly into CRM triggers.',
    category: 'Machine Learning',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600',
    content: `
<p>Retaining users is the primary driver of SaaS growth. To address subscriber attrition, we built an end-to-end churn prediction framework using XGBoost.</p>
<h3>Feature Engineering</h3>
<p>We extracted activity frequency, duration since last login, billing tier changes, and customer support ticket logs. These behavior vectors served as model features.</p>
<h3>Model Optimization</h3>
<p>Using hyperparameter grid searches, the final XGBoost model achieved 89% accuracy in predicting churn events 30 days before they happened.</p>
<h3>Business Deployment</h3>
<p>We tied predictions to automatic discount triggers, helping decrease total churn by 50% in the first quarter.</p>
    `,
    views: 890,
    likes: 98,
    publishedAt: 'Apr 28, 2026',
    comments: [],
    tags: ['Machine Learning', 'Python', 'XGBoost', 'Predictive Modeling'],
  }
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const fallback = fallbackBlogs.find(b => b._id === id);
    if (fallback) {
      return {
        title: fallback.title,
        description: fallback.summary,
      };
    }
    return {
      title: "Article Not Found | Gbade Gesin",
    };
  }

  try {
    await connectDB();
    const blog = await Blog.findById(id).lean();

    if (!blog) {
      return {
        title: "Article Not Found | Gbade Gesin",
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
  } catch (e) {
    return {
      title: "Data Analytics Blog | Gbade Gesin",
    };
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const fallback = fallbackBlogs.find(b => b._id === id);
    if (!fallback) {
      notFound();
    }
    return <BlogDetailView blog={fallback} />;
  }

  await connectDB();
  const blog = await Blog.findById(id).lean();

  if (!blog) {
    notFound();
  }

  // Increment view counter
  await incrementBlogViewsAction(id);

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
    views: (blog.views || 0) + 1, // Add 1 locally to match DB increment on load
    likes: blog.likes || 0,
    publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) : '',
    comments: blog.comments?.map((c: any) => ({
      _id: c._id?.toString(),
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
