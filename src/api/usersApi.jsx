import axios from "axios";
import { createAxiosInstance } from "../Components/Ultils/axiosInstance";
const axiosInstance = createAxiosInstance();
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get("http://localhost:3005/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUser = async (accessToken) => {
  try {
    const response = await axiosInstance.get(`http://localhost:3005/users/id`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID :`, error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:3005/users/register",
      userData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(
      "http://localhost:3005/users/login",
      userData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error login user:", error);
    throw error;
  }
};
export const updateUserInfo = async (userData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    console.log(accessToken);
    const response = await axiosInstance.put(
      "http://localhost:3005/users",
      userData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
};
export const changePassword = async (userData) => {
  try {
    const response = await axiosInstance.put(
      "http://localhost:3005/users/changePassword",
      userData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error changing user password:", error);
    throw error;
  }
};
export const logoutUser = async () => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:3005/users/logout",
      null,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error logging out user:", error);
    throw error;
  }
};
export const sendMailForgotPass = async (email) => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:3005/users/forgotPassword",
      { email },
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error sending forgot password email:", error);
    throw error;
  }
};
export const resetPassword = async (resetToken, newPassword) => {
  try {
    const response = await axiosInstance.post(
      `http://localhost:3005/users/resetpassword`,
      { newPassword, resetToken },
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axiosInstance.put(
      `http://localhost:3005/users/${userId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};
