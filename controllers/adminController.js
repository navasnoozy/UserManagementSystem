const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const randomString = require("randomstring");
const { validationResult } = require("express-validator");

const securePassword = async (password) => {
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
  } catch (error) {
    console.error(error.message);
  }
};

const loginLoad = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const verifyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password); // Await the comparison

      if (passwordMatch) {
        if (userData.is_admin === 0) {
          return res.render("login", {
            message: "Invalid username and password",
          });
        } else {
          req.session.user_id = userData._id;
          return res.redirect("/admin/home");
        }
      } else {
        return res.render("login", {
          message: "Invalid username and password",
        });
      }
    } else {
      return res.render("login", { message: "Invalid username and password" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadDashboard = async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.session.user_id });
    res.render("home", { admin: userData });
  } catch (error) {
    console.log(error.message);
  }
};

const adminDashboard = async (req, res) => {
  try {
    const userData = await User.find({ is_admin: 0 });
    res.render("dashboard", { users: userData });
  } catch (error) {
    console.log(error.message);
  }
};

const loadadduser = async (req, res) => {
  try {
    res.render("adduser");
  } catch (error) {
    console.error(error.message);
  }
};

const addUser = async (req, res) => {
  try {
    const { name, email, admin } = req.body;
    const password = randomString.generate(8);
    spassword = await securePassword(password);

    const user = new User({
      name: name,
      email: email,
      password: spassword,
      is_admin: admin ? 1 : 0,
    });

    const userData = await user.save();
    res.render("adduser", { message: "Adding user was Successfull" });
  } catch (error) {
    console.error(error.message);
  }
};

const editUserload = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await User.findById({ _id: id });

    if (userData) {
      res.render("edituser", { user: userData });
    } else {
      res.redirect("/admin/dashboard");
    }
  } catch (error) {
    console.error(error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id, name, email, admin } = req.body;
    const userData = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: { name: name, email: email, is_admin: admin ? 1 : 0 },
      }
    );

    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await User.deleteOne({ _id: id });
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error(error);
  }
};

const search = async (req, res) => {
  try {
    const { search } = req.body;

    const searchResult = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    });

    res.render("dashboard", { users: searchResult, all: search });
  } catch (error) {
    console.error(error.message);
  }
};

const logout = async (req, res) => {
  try {
    req.session.destroy();
    return res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loginLoad,
  verifyLogin,
  loadDashboard,
  adminDashboard,
  loadadduser,
  addUser,
  editUserload,
  updateUser,
  deleteUser,
  search,
  logout,
};
