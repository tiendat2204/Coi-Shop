import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  registerUser,
  loginUser,
  getUser,
  sendMailForgotPass,
} from "../../api/usersApi";
import { showNotification } from "../../redux/notificationSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const LoginRegister = ({ onClose, initialModalType }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modalType, setModalType] = useState(initialModalType);
  const showLoginForm = () => setModalType("login");
  const showRegisterForm = () => setModalType("register");
  const showResetPasswordForm = () => setModalType("resetPassword");
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();
    const userData = {
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    };

    if (userData.password !== userData.confirmPassword) {
      dispatch(
        showNotification({
          message: "Passwords do not match!",
          type: "error",
        })
      );
      return;
    }

    try {
      const response = await registerUser(userData);
      if (response) {
        dispatch(
          showNotification({
            message: "Registration successful!",
            type: "success",
          })
        );
        setModalType("login");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        dispatch(
          showNotification({
            message: "Email already exists",
            type: "error",
          })
        );
      } else {
        dispatch(
          showNotification({
            message: "An error occurred. Please try again.",
            type: "error",
          })
        );
      }
    }
  };
  const handleLogin = async (event) => {
    event.preventDefault();
    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await loginUser(loginData);
      if (response) {
        localStorage.setItem("accessToken", response.accessToken);
        const userData = await getUser(response.accessToken);
        if (userData.status === "inactive") {
          dispatch(
            showNotification({
              message: "Your account is blocked.",
              type: "error",
            })
          );
          return; 
        }
        if (userData.role === 1) {
          setTimeout(() => {
            navigate("/admin");
          }, 2000);
        } else {
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        }
        dispatch(
          showNotification({
            message: "Login successful!",
            type: "success",
          })
        );

        onClose();
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        dispatch(
          showNotification({
            message: "Invalid email or password",
            type: "error",
          })
        );
      } else {
        dispatch(
          showNotification({
            message: "An error occurred. Please try again.",
            type: "error",
          })
        );
      }
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    try {
      const res = await sendMailForgotPass(email);
      if (res.status === 200) {
        dispatch(
          showNotification({
            message: "A password reset link has been sent to your email.",
            type: "success",
          })
        );
        setEmail("");
      } else {
        console.error(
          "Failed to send password reset email due to an unknown error."
        );
        dispatch(
          showNotification({
            message: "Failed to send password reset link. Please try again.",
            type: "error",
          })
        );
      }
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      dispatch(
        showNotification({
          message: "Failed to send password reset link. Please try again.",
          type: "error",
        })
      );
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3005/auth/google";
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: "-100vh" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "-100vh" }}
      id="login-popup"
      tabIndex="-1"
      className="bg-black/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 h-full items-center justify-center flex"
    >
      <div className="relative p-4 w-full max-w-md h-full md:h-auto">
        <div className="relative bg-white rounded-lg shadow">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center popup-close"
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="#c6c7c7"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close popup</span>
          </button>

          <div className="p-5">
            <h3 className="text-2xl mb-0.5 font-medium"></h3>
            <p className="mb-4 text-sm font-normal text-gray-800"></p>

            <div className="text-center">
              <p className="mb-3 text-2xl font-semibold leading-5 text-slate-900">
                {modalType === "login"
                  ? "Login to your account"
                  : "Create an account"}
              </p>
              <p className="mt-2 text-sm leading-4 text-slate-600">
                {modalType === "login"
                  ? "You must be logged in to perform this action."
                  : "Sign up to get started."}
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-2">
              <button
                onClick={handleGoogleLogin}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="h-[18px] w-[18px]"
                />
                Continue with Google
              </button>
            </div>

            <div className="flex w-full items-center gap-2 py-6 text-sm text-slate-600">
              <div className="h-px w-full bg-slate-200"></div>
              OR
              <div className="h-px w-full bg-slate-200"></div>
            </div>

            <form
              className="w-full"
              onSubmit={
                modalType === "login"
                  ? handleLogin
                  : modalType === "register"
                  ? handleRegister
                  : handleResetPassword
              }
            >
              {modalType === "register" && (
                <>
                  <label htmlFor="Name" className="sr-only">
                    Name
                  </label>
                  <input
                    name="Name"
                    type="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="Name"
                    required
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
                    placeholder="Name of User"
                  />
                </>
              )}

              {(modalType !== "resetPassword" ||
                modalType === "resetPassword") && (
                <>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
                    placeholder="Email Address"
                  />
                </>
              )}

              {modalType !== "resetPassword" && (
                <>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
                    placeholder="Password"
                  />
                </>
              )}

              {modalType === "register" && (
                <>
                  <label htmlFor="confirm-password" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    name="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
                    placeholder="Confirm Password"
                  />
                </>
              )}

              {modalType === "login" && (
                <p className="mb-3 mt-2 text-sm text-gray-500">
                  Forgot your password?{" "}
                  <button
                    type="button"
                    onClick={showResetPasswordForm}
                    className="font-medium text-[#4285f4]"
                  >
                    Reset password
                  </button>
                </p>
              )}

              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-gray-400"
              >
                {modalType === "login"
                  ? "Continue"
                  : modalType === "register"
                  ? "Sign Up"
                  : "Reset Password"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-600">
              {modalType === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={showRegisterForm}
                    className="font-medium text-[#4285f4]"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={showLoginForm}
                    className="font-medium text-[#4285f4]"
                  >
                    Log in
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginRegister;
