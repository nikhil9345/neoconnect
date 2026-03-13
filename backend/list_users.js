const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const listAllUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/neostats');
    const users = await User.find({}).select('name email role');
    console.log(`Total users: ${users.length}`);
    users.forEach(u => console.log(`- ${u.name} (${u.email}) [${u.role}]`));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

listAllUsers();
