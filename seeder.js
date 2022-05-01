const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');
const Class = require('./models/class');
const Feature = require('./models/feature');

// Load env variables
dotenv.config({ path: __dirname + '/.env.local' });
// Connect to DB
mongoose
  .connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('DB Connected'))
  .catch((error) => console.log('DB Connection Failed', error.message));

// Read JSON files
const classes = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/classes.json`, 'utf-8')
);
const features = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/features.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await Class.deleteMany();
    await Feature.deleteMany();
    await Class.insertMany(classes);
    await Feature.insertMany(features);

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
    await Feature.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
