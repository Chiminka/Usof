import Post from "../models/Post.js";
import Like from "../models/Like.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";
import mailTransport from "../utils/mailTransport.js";

export class UserController {
  // Get User Posts
  async getMyPosts(req, res) {
    try {
      const user = await User.findById(req.user.id);
      const userId = user.id;

      const arr = await Post.find({ author: { _id: userId } }).sort(
        "-updatedAt"
      );
      res.json(arr);
    } catch (error) {
      res.json({ message: "Something gone wrong" });
    }
  }
  // Create User
  async createUser(req, res) {
    try {
      const { username, password, email, repeatPassword, role } = req.body;

      const user = await User.findById(req.user.id);

      if (user.role == "admin") {
        if (password === repeatPassword) {
          const isUsed = await User.findOne({ username });

          if (isUsed) {
            return res.json({
              message: "This username already is taken",
            });
          }

          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(password, salt);

          if (req.files) {
            let fileName = Date.now().toString() + req.files.image.name;
            const __dirname = dirname(fileURLToPath(import.meta.url));
            req.files.image.mv(path.join(__dirname, "..", "uploads", fileName));

            const newUser = new User({
              username,
              avatar: fileName,
              password: hash,
              email,
              role,
            });

            const token = jwt.sign(
              {
                id: newUser._id,
              },
              process.env.JWT_SECRET,
              { expiresIn: "30d" }
            );

            const v_token = jwt.sign(
              {
                id: newUser._id,
              },
              process.env.JWT_SECRET,
              { expiresIn: "1h" }
            );

            await newUser.save();

            // verification email
            await newUser.save();
            const url = `${process.env.BASE_URL}verify/${v_token}`;
            mailTransport().sendMail({
              from: process.env.USER,
              to: newUser.email,
              subject: "Verify your email account",
              html: `<h1>${url}</h1>`,
            });
            ////////////////////////////////////////

            res.json({
              newUser,
              token,
              message: "An Email sent to your account please verify",
            });
          }

          const newUser = new User({
            username,
            avatar: "",
            password: hash,
            email,
            role,
          });

          const token = jwt.sign(
            {
              id: newUser._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
          );

          const v_token = jwt.sign(
            {
              id: newUser._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );

          await newUser.save();

          // verification email
          await newUser.save();
          const url = `${process.env.BASE_URL}verify/${v_token}`;
          mailTransport().sendMail({
            from: process.env.USER,
            to: newUser.email,
            subject: "Verify your email account",
            html: `<h1>${url}</h1>`,
          });
          ////////////////////////////////////////

          res.json({
            newUser,
            token,
            message: "An Email sent to your account please verify",
          });
        } else return res.json({ message: "Different passwords" });
      } else res.json("you are not admin");
    } catch (error) {
      // console.log(error)
      res.json({ message: "Creating user error" });
    }
  }
  // Get All Users
  async getAll(req, res) {
    try {
      const users = await User.find().sort("-createdAt");

      if (!users) {
        return res.json({ message: "None users" });
      }

      res.json({ users });
    } catch (error) {
      res.json({ message: "Something gone wrong" });
    }
  }
  // Get Users By Id
  async getById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      res.json(user);
    } catch (error) {
      console.log(error);
      res.json({ message: "Something gone wrong" });
    }
  }
  // Remove User
  async removeUser(req, res) {
    try {
      const isadmin = await User.findById(req.user.id);
      const user = await User.findById(req.params.id);

      const user_who_try = isadmin._id;
      const UserId = user._id;

      if (isadmin.role == "admin") {
        const user = await User.findByIdAndDelete(UserId);
        if (!user) return res.json({ message: "That user is not exist" });
        res.json({ message: "User was deleted" });
      } else if (user_who_try.equals(UserId)) {
        const user = await User.findByIdAndDelete(user_who_try);
        if (!user) return res.json({ message: "That user is not exist" });
        res.json({ message: "User was deleted" });
      } else res.json({ message: "no access" });
    } catch (error) {
      // console.log(error)
      res.json({ message: "Something gone wrong" });
    }
  }
  // Update User
  async updateUser(req, res) {
    try {
      const { email, username, password, full_name, rating, role } = req.body;

      const isadmin = await User.findById(req.user.id);
      const user = await User.findById(req.params.id);

      const user_who_try = isadmin._id;
      const UserId = user._id;
      // const userRole = isadmin.role

      // console.log({user_who_try, UserId, userRole})

      if (isadmin.role == "admin" || user_who_try.equals(UserId)) {
        if (req.files) {
          let fileName = Date.now().toString() + req.files.image.name;
          const __dirname = dirname(fileURLToPath(import.meta.url));
          req.files.image.mv(path.join(__dirname, "..", "uploads", fileName));
          user.avatar = fileName || "";
        }

        if (role) user.email = role;
        if (email) user.email = email;
        if (username) user.username = username;
        if (password) {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(password, salt);
          user.password = hash;
        }
        user.full_name = full_name;
        user.rating = rating;

        await user.save();

        res.json(user);
      } else res.json("no access");
    } catch (error) {
      // console.log(error)
      res.json({ message: "Something gone wrong" });
    }
  }
  // Change Avatar
  async changeAvatar(req, res) {
    try {
      const isadmin = await User.findById(req.user.id);
      const user = await User.findById(req.params.id);

      const user_who_try = isadmin._id;
      const UserId = user._id;

      if (isadmin.role == "admin") {
        if (req.files) {
          let fileName = Date.now().toString() + req.files.image.name;
          const __dirname = dirname(fileURLToPath(import.meta.url));
          req.files.image.mv(path.join(__dirname, "..", "uploads", fileName));
          user.avatar = fileName || "";
        }
        await user.save();
        res.json("Avatar was changed");
      } else if (user_who_try.equals(UserId)) {
        if (req.files) {
          let fileName = Date.now().toString() + req.files.image.name;
          const __dirname = dirname(fileURLToPath(import.meta.url));
          req.files.image.mv(path.join(__dirname, "..", "uploads", fileName));
          isadmin.avatar = fileName || "";
        }
        await isadmin.save();
        res.json("Avatar was changed");
      } else res.json({ message: "no access" });
    } catch (error) {
      // console.log(error)
      res.json({ message: "Something gone wrong" });
    }
  }
}
