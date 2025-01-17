const Person = require("../models/person");

async function seedDatabase(persons) {
    await Person.deleteMany();
    await Person.insertMany(persons)
    console.log("database seeded with test users.")
}

module.exports = { seedDatabase }

