//a primer on unit testing
const app = require("../app");
const Post = require("../models/product");
const mongoose = require("mongoose");
const supertest = require("supertest");

it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
  })


  //connect to mongodb before running a test
beforeEach((done) => {
  mongoose.connect(process.env.dbURI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done());
});

//drop the test data after a test case
afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done())
  });
});