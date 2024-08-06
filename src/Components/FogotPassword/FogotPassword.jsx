import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { resetPassword } from "../../api/usersApi";
import { useDispatch } from "react-redux";
import { showNotification } from "../../redux/notificationSlice";
const ForgotPassword = () => {
  const dispatch = useDispatch();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("tokenForgot");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      try {
        const res = await resetPassword(resetToken, password);
        if (res.status === 200) {
          dispatch(
            showNotification({
              message: "Your password has been reset successfully.",
              type: "success",
            })
          );
          setPassword("");
          setConfirmPassword("");
          setPassword("");
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        } else {
          dispatch(
            showNotification({
              message: "Failed to reset password. Please try again.",
              type: "error",
            })
          );
        }
      } catch (error) {
        console.error("Error resetting password:", error);
        dispatch(
          showNotification({
            message:
              "An error occurred while resetting your password. Please try again.",
            type: "error",
          })
        );
      }
    } else {
      console.log("Passwords do not match");
      dispatch(
        showNotification({
          message: "Passwords do not match. Please try again.",
          type: "warning",
        })
      );
    }
  };
  return (
    <div className="relative inset-0 flex items-center justify-center p-4 w-full min-h-screen ">
      <div className="absolute bg-white rounded-lg shadow p-6 w-full max-w-md">
        <div className="text-center">
          <p className="mb-3 text-2xl font-semibold leading-5 text-slate-900">
            Reset Password
          </p>
          <p className="mt-2 text-sm leading-4 text-slate-600">
            Enter your new password.
          </p>
        </div>

        <form className="w-full" onSubmit={handleResetPassword}>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
            placeholder="New Password"
          />

          <label htmlFor="confirm-password" className="sr-only">
            Confirm Password
          </label>
          <input
            name="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
            className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
            placeholder="Confirm New Password"
          />

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-gray-400"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
