import * as React from 'react';
import connectDB from '@/lib/db';
import Skill from '@/models/skill';
import { AdminSkillsManager } from '@/components/admin-skills-manager';

async function getSkills() {
  try {
    const conn = await connectDB();
    if (!conn) {
      console.warn('Database connection failed in getSkills. Returning empty array.');
      return [];
    }
    const list = await Skill.find({}).sort({ category: 1, name: 1 });
    return JSON.parse(JSON.stringify(list));
  } catch (err) {
    console.error('Failed to retrieve skills:', err);
    return [];
  }
}

export default async function AdminSkillsPage() {
  const skills = await getSkills();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Skills Catalog</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage skill inventories, adjust proficiency stats, and set values for Radar or Bubble chart coordinates.
        </p>
      </div>

      <AdminSkillsManager initialSkills={skills} />
    </div>
  );
}
