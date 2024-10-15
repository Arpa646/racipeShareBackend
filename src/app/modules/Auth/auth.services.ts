import { TLoginUser } from './auth.interface';
import { UserRegModel } from "../Registration/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// JWT secret for tokens
const JWT_SECRET = "your_secret_key";

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
 
  const user = await UserRegModel.findOne({
    email: payload.email,
    password: payload.password
  });
  
  if (!user) {
    throw new Error("This user is not found!");

  }
  // checking if the user is already deleted

  //const isDeleted = user?.isDeleted;
  const isDeleted = user?.$isDeleted();

  if (isDeleted) {
    throw new Error("This user is not found!");

  }

  //checking if the password is correct

  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    user?.password
  );

  //create token and sent to the  client

  const jwtPayload = {
    userId: user.email,
    useremail: user._id,
    role: user.role,
  };
  console.log('for create token',jwtPayload);

  const accessToken = jwt.sign(jwtPayload, "jjjnn" as string, {
    expiresIn: "10d",
  });
  const refreshToken = jwt.sign(jwtPayload, "production" as string, {
    expiresIn: "365d",
  });






  return [accessToken,user,refreshToken];
};

// Password Reset Request - Send Email with Reset Link
const requestPasswordReset = async (email: string) => {
  const user = await UserRegModel.findOne({ email });

  if (!user) {
    throw new Error("User not found!");
  }

  // Create JWT reset token
  const secret = JWT_SECRET + user.password;
  const token = jwt.sign({ email: user.email, id: user._id }, secret, { expiresIn: "5m" });

  const link = `http://localhost:5000/api/auth/reset-password/${user._id}`;

  // Send Email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "arpakhan114@gmail.com",
      pass: "ycvc oevf bofa itrf",
    },
  });

  transporter.sendMail({
    from: 'arpakhan114@gmail.com',
    to: email,
    subject: 'Test Email',
    text: link
  }, (error: any, info: any) => {
    if (error) {
      return console.log(error);
    }
    console.log('Email sent: ' + info.response);
  });
  

  // console.log(transporter)
  // const mailOptions = {
  //   from: "arpakhan114@gmail.com",
  //   to: email,
  //   subject: "Password Reset",
  //   text: `Click the link to reset your password: ${link}`,
  // };

  //await transporter.sendMail(mailOptions);
  return link;
};



// Reset Password with Token
const changePass = async (id: string,  newPassword: string) => {
  const user = await UserRegModel.findById(id);
  if (!user) {
    throw new Error("User not found!");
  }

 
  try {
    // Verify the token


    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await UserRegModel.updateOne({ _id: id }, { password: newPassword });

    return "Password has been reset successfully";
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};


export const AuthServices = {
  loginUser,
  requestPasswordReset,
  changePass
  // resetPassword,
};
