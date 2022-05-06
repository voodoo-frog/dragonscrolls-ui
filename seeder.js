const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

const models = require('./models');

const Class = require('./models/class');
const Feature = require('./models/feature');
const Race = require('./models/race');
const Spell = require('./models/spell');
const Subclass = require('./models/subclass');
const Trait = require('./models/trait');

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
const races = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/races.json`, 'utf-8')
);
const spells = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/spells.json`, 'utf-8')
);
const subclasses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/subclasses.json`, 'utf-8')
);
const traits = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/traits.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    // models.forEach(async (model) => {
    //   await model.deleteMany();
    // });
    await Class.deleteMany();
    await Feature.deleteMany();
    await Race.deleteMany();
    await Spell.deleteMany();
    await Subclass.deleteMany();
    await Trait.deleteMany();

    await Class.insertMany(classes);
    await Feature.insertMany(features);
    await Race.insertMany(races);
    await Spell.insertMany(spells);
    await Subclass.insertMany(subclasses);
    await Trait.insertMany(traits);

    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    models.forEach(async (model) => {
      await model.deleteMany();
    });

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
