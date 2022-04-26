const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');
const Class = require('./models/class');

// Load env variables
dotenv.config({ path: __dirname + "/.env.local" });
// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((error) => console.log("DB Connection Failed", error.message));

// Read JSON files
const classes = JSON.parse(fs.readFileSync(`${__dirname}/_data/classes.json`, 'utf-8'));

// Import into DB
const importData = async () => {
  try {
    await Class.deleteMany();
    await Class.insertMany(classes)

    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Class.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData()
} else if (process.argv[2] === '-d') {
  deleteData()
}