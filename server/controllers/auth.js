import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mailTransport from "../utils/mailTransport.js";

export class AuthController {
  async register(req, res) {
    try {
      const { username, password, email, repeatPassword } = req.body;

      if (!username || !password || !email || !repeatPassword)
        return res
          .status(StatusCodes.NO_CONTENT)
          .json({ message: "Content can not be empty" });

      if (password === repeatPassword) {
        const isUsed = await User.findOne({ username });

        if (isUsed) {
          return res.json({
            message: "This username already is taken",
          });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = new User({
          username,
          password: hash,
          email,
        });

        // const token = jwt.sign(
        //   {
        //     id: newUser._id,
        //   },
        //   process.env.JWT_SECRET,
        //   { expiresIn: "30d" }
        // );

        const v_token = jwt.sign(
          {
            id: newUser._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

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
          // token,
          message: "An Email sent to your account please verify",
        });
      } else return res.json({ message: "Different passwords" });
    } catch (error) {
      res.json({ message: "Creating user error" });
    }
  }
  async login(req, res) {
    try {
      const { usernameOrEmail, password } = req.body;
      let user = await User.findOne({ username: usernameOrEmail });
      if (!user) {
        user = await User.findOne({ email: usernameOrEmail });
      }
      if (!user) {
        return res.json({ success: false, message: "User not exist" });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.json({ success: false, message: "Uncorrect password" });
      }

      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );
      const v_token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      if (!user.verified) {
        const url = `${process.env.BASE_URL}verify/${v_token}`;
        mailTransport().sendMail({
          from: process.env.USER,
          to: user.email,
          subject: "Verify your email account",
          html: `<h1>${url}</h1>`,
        });
        return res.json({ message: "An Email sent to your account again" });
      }
      res.json({
        token,
        user,
        message: "You are signed in",
      });
    } catch (error) {
      console.log(error);
      return res.json({ message: "Autorization error" });
    }
  }
  async logout(req, res) {
    req.logout();
    req.session = null;
    res.redirect("/login");
  }
  async verifyEmail(req, res) {
    const token = req.params.token;
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.id);
    if (!user)
      return res.json({ success: false, message: "Sorry, user not found!" });

    if (user.verified)
      return res.json({
        success: false,
        message: "This account is already verified!",
      });

    user.verified = true;
    await user.save();
    res.json({ success: true, message: "Your email is verified" });
  }
  async getMe(req, res) {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.json({
          message: "That user is not exist",
        });
      }

      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      res.json({
        user,
        token,
      });
      // res.json(user)
    } catch (error) {
      res.json({ message: "Not access" });
    }
  }
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user)
        return res.json({ msg: "This email is not registered in our system" });

      const v_token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // здесь ссылка на страницу с полями, в по нажатию на эту кнопку уже вот эта ссылка
      const url = `${process.env.BASE_URL}recover/${v_token}`;
      mailTransport().sendMail({
        from: process.env.USER,
        to: user.email,
        subject: "Reset your password",
        html: `<h1>${url}</h1>`,
      });
      res.json({ message: "Re-send the password, please check your email" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async reset(req, res) {
    const { new_password, confirm_password } = req.body;

    if (!new_password || !confirm_password)
      return res
        .status(StatusCodes.NO_CONTENT)
        .json({ message: "Content can not be empty" });

    const token = req.params.token;
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.id);
    if (!user)
      return res.json({ success: false, message: "Sorry, user not found!" });

    if (new_password != confirm_password)
      return res.json({ message: "Passwords are different" });

    const isPasswordCorrect = await bcrypt.compare(new_password, user.password);
    if (isPasswordCorrect)
      return res.json({
        message: "Your new password has to be different from your old",
      });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(new_password, salt);

    user.password = hash;
    await user.save();
    res.json({ success: true, message: "Your password was changed" });
  }
}
