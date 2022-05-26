const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let emailRegexVal =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const adminSchema = new mongoose.Schema({
  mail: {
    type: String,
    validate: {
      validator: function (v) {
        return emailRegexVal.test(v);
      },
      message: (mail) => `${mail.value} is not a valid email address !`,
    },
    required: [true, "please enter an email address"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    minlength: [6, "Minimum password length is six characters"],
  },
});



//fire a function before doc has been saved to db
adminSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// static method to login user
adminSchema.statics.login = async function (mail, password) {
  const user = await this.findOne({ mail });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect mail");
};

const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;
