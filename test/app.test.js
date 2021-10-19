//a primer on unit testing
const supertest = require("supertest");
const app = require("../app");
const Product = require("../models/product");
const mongoose = require("mongoose");

jest.setTimeout(30000);

it('Testing to see if Jest works', () => {
  expect(1).toBe(1)
})


// connect to mongodb before running a test
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

describe('tests', () => {
  test("GET /", async () => {
    let res = await supertest(app).get('/')
    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();
  })

  test("GET /product/:id", async () => {

    let testId = "605a67748509472e2925dc52"
    let res = await supertest(app).get("/product/" + testId)
    // expect(response.body._id).toBe(product.id);
    expect(res.header['content-type']).toBe('text/plain; charset=utf-8');
    expect(res.body).toBeTruthy();
    expect(res.statusCode).toBe(302);
  });


});
