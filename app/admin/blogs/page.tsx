import * as React from 'react';
import connectDB from '@/lib/db';
import Blog from '@/models/blog';
import { AdminBlogsManager } from '@/components/admin-blogs-manager';

async function getBlogs() {
  try {
    const conn = await connectDB();
    if (!conn) {
      console.warn('Database connection failed in getBlogs. Returning empty array.');
      return [];
    }
    const list = await Blog.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(list));
  } catch (err) {
    console.error('Failed to retrieve blogs:', err);
    return [];
  }
}

export default async function AdminBlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Blog Publisher</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Compose new data articles, publish tutorials, and moderate reader comments.
        </p>
      </div>

      <AdminBlogsManager initialBlogs={blogs} />
    </div>
  );
}
