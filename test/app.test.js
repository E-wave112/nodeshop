//a primer on unit testing
const supertest = require("supertest");
const app = require("../app");
const Product = require("../models/product");
const mongoose = require("mongoose");

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
//create a testcase to get a single product in the database
test("GET /product/:id", async () => {
  const product = await Product.create({name:"jean",image:"image",cloudinary_id:"id"
,description:"a cool clothes",price:200,available:true });

  await supertest(app).get("/product/" + product._id)
    .expect(302)
    .then((response) => {
      // expect(response.body._id).toBe(product._id);
      expect(response.body.name).toBe(product.name);
      expect(response.body.image).toBe(product.image);
      expect(response.body.cloudinary_id).toBe(product.cloudinary_id);
      expect(response.body.description).toBe(product.description);
      expect(response.body.price).toBe(product.price);
      expect(response.body.available).toBe(product.available);
    });
});
