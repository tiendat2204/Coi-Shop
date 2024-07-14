import axios from "axios";
import { createAxiosInstance } from "../Components/Ultils/axiosInstance";
const axiosInstance = createAxiosInstance();

export const getAllCategories = async () => {
  try {
    const response = await axios.get("http://localhost:3005/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
export const getCategory = async (id) => {
  try {
    const response = await axios.get(`http://localhost:3005/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error);
    throw error;
  }
};
export const postCategory = async (categoryData) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axiosInstance.post(
      "http://localhost:3005/categories",
      categoryData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const editCategory = async (id, categoryData) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axiosInstance.put(
      `http://localhost:3005/categories/${id}`,
      categoryData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(`Error updating category with id ${id}:`, error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axiosInstance.delete(
      `http://localhost:3005/categories/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(`Error deleting category with id ${id}:`, error);
    throw error;
  }
};
