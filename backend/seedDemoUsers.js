const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const users = [
  { name: "James Patient", email: "james@email.com", password: "Patient@123", role: "patient" },
  { name: "Sarah Doctor", email: "sarah@healthsys.com", password: "Doctor@123", role: "doctor" },
  { name: "Admin Setup", email: "admin@healthsys.com", password: "Admin@123", role: "admin" }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
        console.log(`Created user: ${u.email} as ${u.role}`);
      } else {
        // update password to ensure it matches
        exists.password = u.password;
        await exists.save();
        console.log(`Updated user: ${u.email}`);
      }
    }
    console.log("Done");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
