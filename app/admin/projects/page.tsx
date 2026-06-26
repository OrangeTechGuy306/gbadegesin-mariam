import * as React from 'react';
import connectDB from '@/lib/db';
import Project from '@/models/project';
import { AdminProjectsManager } from '@/components/admin-projects-manager';

async function getProjects() {
  try {
    await connectDB();
    const list = await Project.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(list)); // Serialize MongoDB object IDs
  } catch (err) {
    console.error('Failed to retrieve projects list:', err);
    return [];
  }
}

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Projects Manager</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Perform CRUD operations on portfolio projects, update case study parameters, and manage images.
        </p>
      </div>

      {/* Interactive Manager Panel */}
      <AdminProjectsManager initialProjects={projects} />
    </div>
  );
}
