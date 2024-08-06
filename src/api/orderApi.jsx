import axios from "axios";
import { createAxiosInstance } from "../Components/Ultils/axiosInstance";
const axiosInstance = createAxiosInstance();
export const postOrders = async (orderData) => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:3005/orders/checkout",
      orderData,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};
export const postOrdersMomo = async (orderData) => {
  console.log(orderData);
  try {
    const response = await axios.post(
      "http://localhost:3005/orders/checkout/momo",
      { orderDetails: orderData },  
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error("Failed to process MoMo payment");
  }
};
export const updateOrder = async (orderId, updateData) => {
  try {
    const response = await axiosInstance.put(
      `http://localhost:3005/orders/${orderId}`,
      updateData,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};
export const getAllOrders = async () => {
  try {
    const response = await axiosInstance.get("http://localhost:3005/orders", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};
export const cancelOrder = async (orderId) => {
  try {
    const response = await axiosInstance.put(
      `http://localhost:3005/orders/cancel/${orderId}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error canceling order:", error);
    throw error;
  }
};