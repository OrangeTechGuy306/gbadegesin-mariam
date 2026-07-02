import bcrypt from 'bcryptjs';
import User from '@/models/user';

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
}
