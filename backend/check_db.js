const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const checkManagers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/neostats');
    const managers = await User.find({ role: 'CaseManager' });
    console.log(`Found ${managers.length} case managers:`);
    managers.forEach(m => console.log(`- ${m.name} (${m.email})`));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkManagers();
