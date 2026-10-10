require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const User = require('../models/User');
const Job = require('../models/Job');
const Team = require('../models/Team');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas for seeding...');

    // Clear existing
    await User.deleteMany({});
    await Job.deleteMany({});
    await Team.deleteMany({});

    // 1. Create Users
    const worker = await User.create({
      name: 'Rajesh Sharma',
      email: 'worker@buildconnect.com',
      password: 'password123',
      role: 'worker',
      tradeCategory: 'Plumber',
      dailyWageExpectation: 850,
      phone: '+91 98765 43210',
      isVerified: true,
      isAvailable: true,
      bio: 'Master certified plumber with 8+ years experience in CPVC pipelines and sanitary installations.',
      skills: ['CPVC Piping', 'Drain Cleaning', 'Sanitary Fittings', 'Pressure Testing'],
      location: { city: 'Mumbai', state: 'Maharashtra', pincode: '400050' },
      rating: { average: 4.9, count: 24 },
    });

    const worker2 = await User.create({
      name: 'Amit Verma',
      email: 'worker2@buildconnect.com',
      password: 'password123',
      role: 'worker',
      tradeCategory: 'Mason',
      dailyWageExpectation: 900,
      phone: '+91 98333 44556',
      isVerified: true,
      isAvailable: true,
      bio: 'Skilled civil mason specializing in AAC block masonry and tiling.',
      skills: ['AAC Blocks', 'Plastering', 'Grouting'],
      location: { city: 'Mumbai', state: 'Maharashtra', pincode: '400050' },
      rating: { average: 4.7, count: 18 },
    });

    const worker3 = await User.create({
      name: 'Suresh Patel',
      email: 'worker3@buildconnect.com',
      password: 'password123',
      role: 'worker',
      tradeCategory: 'Electrician',
      dailyWageExpectation: 950,
      phone: '+91 98200 77889',
      isVerified: true,
      isAvailable: true,
      bio: 'Licensed wireman with 10 years experience in commercial & domestic electrification.',
      skills: ['MCB DB Wiring', 'Three Phase', 'Appliance Repair'],
      location: { city: 'Mumbai', state: 'Maharashtra', pincode: '400052' },
      rating: { average: 4.8, count: 32 },
    });

    const contractor = await User.create({
      name: 'Vikram Malhotra',
      email: 'contractor@buildconnect.com',
      password: 'password123',
      role: 'contractor',
      companyName: 'Malhotra Civil Works & MEP',
      phone: '+91 98220 12345',
      isVerified: true,
      location: { city: 'Mumbai', state: 'Maharashtra' },
      rating: { average: 4.8, count: 42 },
    });

    const builder = await User.create({
      name: 'Aditya Singhania',
      email: 'builder@buildconnect.com',
      password: 'password123',
      role: 'builder',
      organizationName: 'Skyline Urban Infra Developers',
      phone: '+91 98111 99887',
      isVerified: true,
      location: { city: 'Mumbai', state: 'Maharashtra' },
      rating: { average: 5.0, count: 68 },
    });

    const domestic = await User.create({
      name: 'Priya Kapoor',
      email: 'domestic@buildconnect.com',
      password: 'password123',
      role: 'domestic',
      phone: '+91 99887 65432',
      isVerified: true,
      location: { city: 'Mumbai', state: 'Maharashtra', pincode: '400050' },
    });

    // 2. Create Teams
    // Team 1: Led by Rajesh Sharma, with a pending join request from Amit Verma
    const team1 = await Team.create({
      name: 'Western Plumbing & Sanitary Team',
      leaderId: worker._id,
      workerIds: [],
      pendingRequests: [worker2._id],
      tradeCategories: ['Plumber'],
      maxSize: 10,
      description: 'Quick response emergency plumbing and sanitary installation crew.',
      location: { city: 'Mumbai', state: 'Maharashtra' },
    });
    await User.findByIdAndUpdate(worker._id, { currentTeamId: team1._id });

    // Team 2: Led by Suresh Patel (Visible in Explore Teams feed)
    const team2 = await Team.create({
      name: 'Apex Electrical & MEP Services Team',
      leaderId: worker3._id,
      workerIds: [],
      pendingRequests: [],
      tradeCategories: ['Electrician'],
      maxSize: 12,
      description: 'High-voltage and domestic electrical installation specialist squad.',
      location: { city: 'Mumbai', state: 'Maharashtra' },
    });
    await User.findByIdAndUpdate(worker3._id, { currentTeamId: team2._id });

    // 3. Create Jobs
    // A. Contractor Labor Request (Visible in Worker Feed for Plumber)
    const contractorJob1 = await Job.create({
      title: 'Commercial Piping & Sanitary Installation - Bandra Complex',
      description: 'Require skilled plumbers for 4-inch drain pipe installation, fixture mounting, and line pressure testing for a 6-floor commercial site.',
      targetAudience: 'worker',
      employerType: 'contractor',
      postedBy: contractor._id,
      tradeCategory: 'Plumber',
      headcountNeeded: 3,
      hiringMode: 'both',
      budget: { amount: 950, type: 'daily' },
      urgency: 'this_week',
      location: { address: 'Plot 44, Bandra Kurla Complex', city: 'Mumbai', state: 'Maharashtra' },
      status: 'open',
    });

    // B. Domestic Client Micro-Job (Visible in Worker Feed for Plumber)
    const domesticJob1 = await Job.create({
      title: 'Kitchen Sink Leak & Tap Replacement',
      description: 'Under-sink drainage pipe is leaking water on the floor cabinet. Need washers replaced and new quarter-turn mixer tap fitted.',
      targetAudience: 'worker',
      employerType: 'domestic',
      postedBy: domestic._id,
      tradeCategory: 'Plumber',
      headcountNeeded: 1,
      hiringMode: 'solo',
      budget: { amount: 650, type: 'fixed' },
      urgency: 'today',
      location: { address: 'Flat 402, Sea Green Apartments, Bandra West', city: 'Mumbai', pincode: '400050' },
      status: 'open',
      applications: [
        {
          applicantId: worker._id,
          proposedTimeline: 'Can reach within 30 minutes with required CPVC parts and tools.',
          coverLetter: 'Certified plumber with 8+ years experience. Will replace washers and fit tap swiftly.',
          status: 'pending',
          appliedAt: new Date(),
        },
      ],
    });

    // C. Builder Commercial Tender (Visible in Contractor Tender Feed)
    const builderTender1 = await Job.create({
      title: 'Skyline Horizon Phase 2 – MEP & Plumbing Sub-Contract',
      description: 'Turnkey contract for complete plumbing, sewage piping, fire-fighting line integration, and rainwater harvesting installation across Towers A & B (28 floors). Qualified MEP contractors with valid license required.',
      targetAudience: 'contractor',
      employerType: 'builder',
      postedBy: builder._id,
      isTender: true,
      projectPhase: 'Tower B Civil & MEP Phase 2',
      totalBudget: 4800000,
      timeline: { durationMonths: 6 },
      tradeRequirements: [
        { category: 'Plumber', headcount: 12 },
        { category: 'Welder', headcount: 6 },
        { category: 'Electrician', headcount: 8 },
      ],
      location: { address: 'Skyline Horizon Site, Linking Road Ext', city: 'Mumbai', state: 'Maharashtra' },
      status: 'open',
    });

    // D. Builder Direct Labor Site
    const builderDirectJob = await Job.create({
      title: 'Immediate Need: 8 Blockwork Masons for Tower A Exterior',
      description: 'AAC block masonry work for perimeter walls. Scaffolding and mortar mixture provided on site.',
      targetAudience: 'worker',
      employerType: 'builder',
      postedBy: builder._id,
      isTender: false,
      tradeCategory: 'Mason',
      headcountNeeded: 8,
      hiringMode: 'both',
      budget: { amount: 1000, type: 'daily' },
      urgency: 'this_week',
      location: { city: 'Mumbai', state: 'Maharashtra' },
      status: 'open',
    });

    console.log('✅ BuildConnect Database Seeded Successfully with Refined Structure!');
    console.log(`
 Demo Accounts:
 👷 Worker (Leader):  worker@buildconnect.com  / password123 (Trade: Plumber, Team Leader)
 👷 Worker 2:         worker2@buildconnect.com / password123 (Trade: Mason, Join Request Pending)
 🏢 Contractor:        contractor@buildconnect.com / password123
 🏛️ Builder:           builder@buildconnect.com    / password123
 🏠 Homeowner:         domestic@buildconnect.com   / password123
    `);

    process.exit(0);
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seed();
