//intialize express routers
const router = require("express").Router();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const { ensureAuth } = require("../middleware/auth");
const product = require("../models/product");
const Category = require("../models/category");
const cloudinary = require("../utils/cloudinary");
const mongoose = require("mongoose");
const async = require("async");
const upload = require("../utils/multer");
const payment = require("../models/paymodel");
const axios = require("axios");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { requireAuth } = require("../admin/adminMiddleware/auth");

const getAllProducts = async (req,res) => {
    const products = await product
      .find({})
      .populate(["category", "user"])
      .sort({ createdAt: -1 })
      .lean();
    console.log(products);
    const user = req.user;
    limit = req.query.limit;
    req.query.page = ~~(products.length / req.query.limit);
    console.log(req.query.page);
    const categories = await Category.find({}).sort({ createdAt: -1 }).lean();
    res.render("home-page", {
      products,
      categories,
      user,
    });
  }

const filterProductsByCategory = async (req, res) => {
    let catees = ["shirts", "sportwears", "outwears", "beverage", "Footwears"];
    const user = req.user;
  
    let cates = [];
    //let productFilt;
    const products = await product
      .find({})
      .populate(["category", "user"])
      .sort({ createdAt: -1 })
      .lean();
    const categories = await Category.find({}).sort({ createdAt: -1 }).lean();
    categories.forEach((cat) => {
      cates.push(cat.category);
    });
    const category = req.query.category;
    switch (category) {
      case "shirts":
        var productFilt = products.filter(
          (product) => product.category.category === "shirts"
        );
        break;
      case "sportwears":
        var productFilt = products.filter(
          (product) => product.category.category === "sportwears"
        );
        break;
      case "outwears":
        var productFilt = products.filter(
          (product) => product.category.category === "outwears"
        );
        break;
      case "beverage":
        var productFilt = products.filter(
          (product) => product.category.category === "beverage"
        );
        break;
      case "Footwears":
        var productFilt = products.filter(
          (product) => product.category.category === "Footwears"
        );
        break;
    }
  
    res.render("productfilter", {
      products,
      cates,
      productFilt,
      user,
    })
}

const getProductById = async (req, res) => {
    const user = req.user;
    const userEmail = req.user.email;
    const firstName = req.user.firstName;
    const lastName = req.user.lastName;
    const id = mongoose.Types.ObjectId(req.params.id);
    const Product = await product.findById(id).populate("category").lean();

    try {
    const ngnAmount = Product.price * 500;
    res.render("product-page", {
        Product,
        userEmail,
        user,
        ngnAmount,
        firstName,
        lastName,
        csrfToken: req.csrfToken(),
    });
    } catch (err) {
    console.error(err);
    res.render("error/404");
    }
};

const productPaymentById = async (req, res) =>  {
    //assert the populate db relationship
    req.body.user = req.user.id;
    //create an array to store payment data in the db
    var arr = [];
    async.waterfall(
      [
        function (done) {
          let pay = new payment({
            amount: req.body.amount,
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
          });
          //push the newly created data into the array
          arr.push(pay);
          pay.save((err) => {
            done(err, pay);
          });
        },
      ],
      function (err) {
        if (err) {
          console.error(err);
          res.redirect("/");
          return next(err);
        } else {
          return res.redirect("/process/complete");
        }
      }
    );
  }

const addProductGet =  async (req, res) => {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
      //console.log(categories)
      res.render("addproduct", {
        categories: categories,
        csrfToken: req.csrfToken(),
      });
    } catch (err) {
      console.error(err);
      res.render("error/500");
    }
  }

const addProductPost = async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      //assert the populate db relationship
      req.body.user = req.user.id;
      req.body.token = token;

      let Product = new product({
        category: req.body.category,
        name: req.body.name,
        image: result.secure_url,
        description: req.body.description,
        price: req.body.price,
      });
      await Product.save();
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.render("error/500");
    }
  }
const login = (req, res) => {
    res.render("login");
  }

module.exports = {
    getAllProducts,
    filterProductsByCategory,
    getProductById,
    productPaymentById,
    addProductGet,
    addProductPost,
    login,
}