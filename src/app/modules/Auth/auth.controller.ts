import { AuthServices } from "./auth.services";
import catchAsync from "../../middleware/asynch";
import { Request, Response } from "express";

// User login
const loginUser = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);
  const [accessToken,user,refreshToken] = await AuthServices.loginUser(req.body);

console.log(refreshToken)


  res.cookie('refreshToken', refreshToken, {
    secure: 'production' === 'production',
    httpOnly: true,
  });

  // sendResponse(res, {
  //   statusCode: 200,
  //   success: true,
  //   message: "User is logged in succesfully!",
  //   Token:accessToken,
  //   data: {
     
  //     data:user
  //   },
  // });
  return res.status(200).send({
    success: true,
    message: "User logged in successfully",
    token: accessToken,
    data: user
  });
});

// Request password reset - send reset link via email
const requestPasswordReset = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  console.log(email)
  const resetLink = await AuthServices.requestPasswordReset(email);

  res.status(200).send({
    success: true,
    message: "Password reset link has been sent to your email.",
    link: resetLink, // Optional for debugging
  });
});


// Reset password using the token
const ChangePassword = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { newPassword } = req.body;
console.log(newPassword,id)
  const result = await AuthServices.changePass(id, newPassword);
  console.log(result)
  res.status(200).send({
    success: true,
    message: result,
  });
});

export const AuthControllers = {
  loginUser,
  requestPasswordReset,
  ChangePassword
  // resetPassword,
};
