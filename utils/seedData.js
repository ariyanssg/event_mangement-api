import mongoose from 'mongoose';
import Restaurant from '../models/Restaurant.js';
import Event from '../models/Event.js';
import { connectDB } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const seedRestaurants = [
  {
    _id: new mongoose.Types.ObjectId('61b6fa7db0f0f8e3bc44c7d9'),
    name: 'The Jazz Lounge',
    address: '123 Banani Road, Dhaka',
    phone: '+880123456789',
    email: 'info@jazzlounge.com',
    is_active: true
  },
  {
    _id: new mongoose.Types.ObjectId('61b6fa7db0f0f8e3bc44c7da'),
    name: 'Sunset Bistro',
    address: '456 Gulshan Avenue, Dhaka',
    phone: '+880987654321',
    email: 'contact@sunsetbistro.com',
    is_active: true
  }
];

const seedEvents = [
  {
    restaurant_id: new mongoose.Types.ObjectId('61b6fa7db0f0f8e3bc44c7d9'),
    event_title: 'Live Jazz Night',
    event_description: 'Join us for an amazing night of live jazz music and delicious food.',
    cover_image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
    entry_fee_per_person: 500,
    start_date: new Date('2025-07-15'),
    end_date: new Date('2025-07-15'),
    start_time: '19:00',
    end_time: '23:00',
    contact_address: '123 Banani Road, Dhaka',
    email: 'events@jazzlounge.com',
    mobile: '+880123456789',
    is_active: true
  },
  {
    restaurant_id: new mongoose.Types.ObjectId('61b6fa7db0f0f8e3bc44c7da'),
    event_title: 'Wine Tasting Evening',
    event_description: 'Experience the finest wines paired with gourmet cuisine.',
    cover_image: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg',
    entry_fee_per_person: 750,
    start_date: new Date('2025-07-20'),
    end_date: new Date('2025-07-20'),
    start_time: '18:00',
    end_time: '22:00',
    contact_address: '456 Gulshan Avenue, Dhaka',
    email: 'events@sunsetbistro.com',
    mobile: '+880987654321',
    is_active: true
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Restaurant.deleteMany({});
    await Event.deleteMany({});
    
    // Insert seed data
    await Restaurant.insertMany(seedRestaurants);
    console.log('✅ Restaurants seeded successfully');
    
    await Event.insertMany(seedEvents);
    console.log('✅ Events seeded successfully');
    
    console.log('🌱 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (process.argv[2] === '--seed') {
  seedDatabase();
}

export { seedDatabase };