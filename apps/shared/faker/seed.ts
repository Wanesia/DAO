import mongoose from 'mongoose';
import { UserGenerator } from './user.generator';
import { EnsembleGenerator } from './ensemble.generator';
import 'dotenv/config';
import * as dotenv from 'dotenv';
dotenv.config({ path: 'apps/api/.env' });
 
async function seedDatabase() {
  try {
    await mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/dao');

    const users = await UserGenerator.generate(50);
    const { ensembles, posts } = EnsembleGenerator.generate(users, 10);

    await mongoose.connection.dropDatabase();

    await mongoose.connection.collection('users').insertMany(users);
    await mongoose.connection.collection('ensembles').insertMany(ensembles);
    await mongoose.connection.collection('posts').insertMany(posts);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
