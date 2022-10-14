import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const checkAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {

    const token = req.headers.authorization.split(' ')[1];

    try {
      
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decode.id);

      if (!user) {
        return res.json({ success: false, message: '1unauthorized access!' });
      }
      req.user = user;
      next();

    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.json({ success: false, message: '2unauthorized access!' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.json({
          success: false,
          message: 'sesson expired try sign in!',
        });
      }

      res.json({ success: false, message: 'Internal server error!' });
    }
  } else {
    // console.log(req.headers)
    res.json({ success: false, message: '3unauthorized access!' });
  }
};