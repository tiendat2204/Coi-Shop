import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { showNotification } from "../../../redux/notificationSlice";
import {  updateOrder } from "../../../api/orderApi";

const OrdersForm = ({ order, closeForm, refreshOrders }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: order?.name || "",
    email: order?.email || "",
    phoneNumber: order?.phoneNumber || "",
    address: order?.address || "",
    status: order?.status || "Pending",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm(formData)) {
      dispatch(
        showNotification({
          message: "Please fill in all required fields.",
          type: "error",
        })
      );
      return;
    }

    try {
      const response = await updateOrder(order._id, formData);

      if (response.status === 200) {
        dispatch(
          showNotification({
            message: "Edit order success",
            type: "success",
          })
        );
        refreshOrders();
        closeForm();
      } else {
        throw new Error("Edit order failed");
      }
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error submitting order form: ${error.message}`,
          type: "error",
        })
      );
    }
  };

  const validateForm = (formData) => {
    return formData.name.trim() !== "" && formData.email.trim() !== "" && formData.address.trim() !== "" && formData.status.trim() !== "" && formData.phoneNumber.trim() !== "";
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
    >
      <motion.section
        className="bg-white dark:bg-gray-900 w-full max-w-3xl mx-auto rounded-lg p-8 max-h-[90%] overflow-auto"
      >
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Update Order
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-4">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Order Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                value={formData.name}
                onChange={handleChange}
                placeholder="Type order name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                value={formData.email}
                onChange={handleChange}
                placeholder="Type email"
                required
              />
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Type phone number"
                required
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                value={formData.address}
                onChange={handleChange}
                placeholder="Type address"
                required
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Status
              </label>
              <select
                name="status"
                required
                value={formData.status}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="paymentMethod"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Payment Method
              </label>
              <select
                name="paymentMethod"
                required
                value={formData.paymentMethod}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="MOMO">MOMO</option>
                <option value="BANK">BANK</option>
                <option value="COD">COD</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="select-none rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            Update Order
          </button>
          <button
            onClick={closeForm}
            className="px-6 py-3 ml-4 font-sans text-xs font-bold text-red-500 uppercase transition-all rounded-lg bg-red-500/10 active:bg-red-500/30"
          >
            Cancel
          </button>
        </form>
      </motion.section>
    </motion.div>
  );
};

export default OrdersForm;
