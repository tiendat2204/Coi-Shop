import axios from "axios";
import { createAxiosInstance } from "../Components/Ultils/axiosInstance";
const axiosInstance = createAxiosInstance();
export const getAllProducts = async (searchTerm = "") => {
  const query = searchTerm ? `?search=${searchTerm}` : "";
  try {
    const response = await axios.get(`http://localhost:3005/products${query}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
export const getProduct = async (productId) => {
  try {
    const response = await axios.get(
      `http://localhost:3005/products/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    throw error;
  }
};
export const getProductByCategory = async (categoryId, sortType = null) => {
  try {
    let url = `http://localhost:3005/categories`;

    if (categoryId) {
      url += `/${categoryId}`;
    }

    if (sortType) {
      url += `/products?sort=${sortType}`;
    } else {
      url += `/products`;
    }

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products by category ${categoryId}:`, error);
    throw error;
  }
};
export const getAllComments = async () => {
  try {
    const response = await axios.get(`http://localhost:3005/comments`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};
export const getComments = async (productId) => {
  try {
    const response = await axios.get(`http://localhost:3005/comments/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export const postComment = async (productId, comment) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await axios.post(`http://localhost:3005/comments/${productId}`, comment, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    console.error("Error posting comment:", error);
    throw error;
  }
};
export const editComment = async (commentId, updatedComment) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await axios.put(`http://localhost:3005/comments/${commentId}`, updatedComment, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    console.error("Error editing comment:", error);
    throw error;
  }
};
export const updateCommentStatus = async (commentId, isActive) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await axios.patch(
      `http://localhost:3005/comments/${commentId}/status`,
      { isActive },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating comment status:", error);
    throw error;
  }
};
export const deleteComment = async (commentId) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await axios.delete(`http://localhost:3005/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};
export const postProduct = async (product) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await axiosInstance.post(`http://localhost:3005/products`, product, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data', 
      }
    });
    return response; 
  } catch (error) {
    console.error("Error posting product:", error);
    throw error;
  }
};

export const editProduct = async (productId, updatedProduct) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await axiosInstance.put(`http://localhost:3005/products/${productId}`, updatedProduct, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data', 
      }
    });
    return response; 
  } catch (error) {
    console.error("Error editing product:", error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await axios.delete(`http://localhost:3005/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};