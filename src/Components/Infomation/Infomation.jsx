import React, { useState, useEffect } from "react";
import { updateUserInfo, getUser, changePassword } from "../../api/usersApi";
import { showNotification } from "../../redux/notificationSlice";
import { useDispatch } from "react-redux";
import { formatDate, formatPrice } from "../Ultils/formatPrice";
import { updateUser } from "../../redux/userSlice";
import OrderDetail from "./OrderDetail";
import { getStatusStyle } from "../../admin/Components/Ultils/statusOrder";
import { cancelOrder } from "../../api/orderApi";
const Infomation = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userInfo, setUserInfo] = useState({ orders: [] });
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");

  const [password, setPassword] = useState("");
  const [showOldPasswordInput, setShowOldPasswordInput] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleOldPasswordChange = (e) => setOldPassword(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);

  const fetchUserInfo = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        const userInfo = await getUser(accessToken);
        setName(userInfo.name);
        setPhoto(userInfo.photo);

        setEmail(userInfo.email);
        setUserInfo({ ...userInfo });
        console.log(userInfo);
      } catch (error) {
        console.error("Failed to fetch user information", error);
      }
    }
  };
  useEffect(() => {
    fetchUserInfo();
  }, []);
  const refreshUser = () => {
    fetchUserInfo();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      dispatch(
        showNotification({
          message: "Email is not in a valid format.",
          type: "error",
        })
      );
      return;
    }
    const dataUser = { name: name, email: email };
    try {
      const res = await updateUserInfo(dataUser);
      if (res) {
        dispatch(
          showNotification({
            message: "Change information successful!",
            type: "success",
          })
        );
        dispatch(updateUser(dataUser));
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        dispatch(
          showNotification({
            message: "An error occurred. Please try again",
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
  const handleCancelOrder = async (order) => {
    if (order.status !== "Pending") {
      dispatch(
        showNotification({
          message: "Only pending orders can be canceled.",
          type: "error",
        })
      );
      return;
    }
    setSelectedOrder(order);
    setIsOpen(true);
  };
  const confirmRemoval = async () => {
    if (selectedOrder) {
      try {
        const response = await cancelOrder(selectedOrder._id);
        if (response.status === 200) {
          dispatch(
            showNotification({
              message: "Order canceled successfully.",
              type: "success",
            })
          );
          refreshUser();
        } else {
          dispatch(
            showNotification({
              message: "Error canceling order. Please try again.",
              type: "error",
            })
          );
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          dispatch(
            showNotification({
              message: "Cannot cancel this order.",
              type: "error",
            })
          );
        } else {
          dispatch(
            showNotification({
              message: "An unexpected error occurred. Please try again.",
              type: "error",
            })
          );
        }
      }
      setIsOpen(false);
      setSelectedOrder(null);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedOrder(null);
  };
  const handleChangePasswordClick = () => {
    setShowOldPasswordInput(!showOldPasswordInput);
  };
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      dispatch(
        showNotification({
          message: "Please fill in all password fields.",
          type: "error",
        })
      );
      return;
    }

    try {
      const response = await changePassword({ oldPassword, newPassword });
      if (response.status === 200) {
        dispatch(
          showNotification({
            message: "Password changed successfully.",
            type: "success",
          })
        );
        setOldPassword("");
        setNewPassword("");
        handleChangePasswordClick();
      } else {
        dispatch(
          showNotification({
            message: "Error changing password. Please try again.",
            type: "error",
          })
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        dispatch(
          showNotification({
            message: "Invalid password. Please try again.",
            type: "error",
          })
        );
      } else {
        dispatch(
          showNotification({
            message: "An unexpected error occurred. Please try again.",
            type: "error",
          })
        );
      }
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    document.getElementById("modalDetailOrder").showModal();
  };
  return (
    <div className="flex flex-col sm:grid sm:grid-cols-10 gap-4 mb-4 sm:gap-6 sm:mb-5 w-full px-4 sm:px-10 lg:px-10 xl:px-10 m-auto mt-4 sm:mt-40 max-w-screen-xl">
      <section className="bg-white dark:bg-gray-900 sm:col-span-3 mb-4 sm:mb-0 ">
        <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16 border shadow-sm rounded-md ">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            User Information
          </h2>
          <div className="w-full text-center items-center">
            <img
              src={photo || "../Assets/avatar.png"}
              alt="avatar"
              class="inline-block  h-[110px] w-[110px] relative object-cover object-center !rounded-full  border-2 border-gray-900 p-0.5"
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={handleNameChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type your name"
                  required
                />
              </div>
              <div className="sm:col-span-2">
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
                  value={email}
                  onChange={handleEmailChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type your email"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                {showOldPasswordInput && (
                  <div>
                    <label
                      htmlFor="oldPassword"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Old Password
                    </label>
                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      type="password"
                      id="oldPassword"
                      value={oldPassword}
                      onChange={handleOldPasswordChange}
                    />
                    <label
                      htmlFor="newPassword"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      New Password
                    </label>
                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                    />
                    <button
                      type="button"
                      onClick={handleChangePassword}
                      className="mt-4 text-white p-2.5 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 w-full"
                    >
                      Update Password
                    </button>
                  </div>
                )}

                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>

                <div className="flex gap-1 items-center">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    disabled
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Type your new password"
                  />
                  <button
                    type="button"
                    onClick={handleChangePasswordClick}
                    className="text-white p-2.5 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 w-40"
                  >
                    Change Pass
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSubmit}
                type="button"
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              >
                Update User
              </button>
            </div>
          </form>
        </div>
      </section>
      <section className="bg-white dark:bg-gray-900 border shadow-sm rounded-md sm:col-span-7">
        <div className="w-auto px-4 py-8 mx-auto lg:py-16">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Order History
          </h2>
          <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
            <div className="mx-auto max-w-5xl">
              <div className="mt-6 flow-root sm:mt-8">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {userInfo.orders ? (
                    userInfo.orders.map((order) => (
                      <div
                        key={order._id}
                        className="flex flex-wrap items-center gap-y-4 py-6"
                      >
                        <dl className="w-3/4 sm:w-1/4 lg:w-2/12 lg:flex-0">
                          <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                            Order ID:
                          </dt>
                          <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white truncate w-20">
                            <a href="/" className="hover:underline">
                              {order._id}
                            </a>
                          </dd>
                        </dl>

                        <dl className="w-1/2 sm:w-1/4 lg:w-3/12 lg:flex-0">
                          <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                            Date:
                          </dt>
                          <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                            {formatDate(order.createdAt)}
                          </dd>
                        </dl>

                        <dl className="w-1/2 sm:w-1/4 lg:w-28 lg:flex-0">
                          <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                            Price:
                          </dt>
                          <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                            {formatPrice(order.totalPrice)}
                          </dd>
                        </dl>

                        <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                          <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                            Status:
                          </dt>
                          <dd className="me-2 mt-1.5 inline-flex items-center">
                            <div
                              className={`relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap ${getStatusStyle(
                                order.status
                              )}`}
                            >
                              <span>{order.status}</span>
                            </div>
                          </dd>
                        </dl>

                        <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-auto lg:items-center lg:justify-end gap-4">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="w-full inline-flex justify-center rounded-lg  border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 lg:w-auto"
                          >
                            View details
                          </button>
                          <button
                            onClick={() => handleCancelOrder(order)}
                            className={`w-full inline-flex justify-center rounded-lg border px-3 py-2 text-sm font-medium text-white focus:z-10 focus:outline-none focus:ring-4 lg:w-auto ${
                              order.status === "Pending"
                                ? "border-red-300 bg-red-500 hover:bg-red-600 focus:ring-red-300 dark:border-red-700 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                : "border-gray-300 bg-gray-500 cursor-not-allowed"
                            }`}
                            disabled={order.status !== "Pending"}
                          >
                            Cancel Order
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-base font-medium text-gray-500 dark:text-gray-400">
                        No orders found.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {userInfo && Array.isArray(userInfo.orders) && (
        <OrderDetail order={selectedOrder} />
      )}
      {isOpen && (
        <div
          data-dialog-backdrop="dialog-xs"
          data-dialog-backdrop-close="true"
          className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-100 backdrop-blur-sm transition-opacity duration-300"
        >
          <div
            data-dialog="dialog-xs"
            className="relative m-4 w-1/4 min-w-[25%] max-w-[25%] rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 antialiased shadow-2xl"
          >
            <div className="flex items-center p-4 font-sans text-2xl antialiased font-semibold leading-snug shrink-0 text-blue-gray-900">
              Confirm Deletion
            </div>
            <div className="relative p-4 font-sans text-base antialiased font-light leading-relaxed border-t border-b border-t-blue-gray-100 border-b-blue-gray-100 text-blue-gray-500">
              Are you sure you want to cancel this order?
            </div>
            <div className="flex flex-wrap items-center justify-end p-4 shrink-0 text-blue-gray-500">
              <button
                onClick={closeModal}
                data-ripple-dark="true"
                data-dialog-close="true"
                className="px-6 py-3 mr-1 font-sans text-xs font-bold text-red-500 uppercase transition-all rounded-lg middle none center hover:bg-red-500/10 active:bg-red-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              >
                No
              </button>
              <button
                onClick={confirmRemoval}
                data-ripple-light="true"
                data-dialog-close="true"
                className="middle none center rounded-lg bg-gradient-to-tr from-green-600 to-green-400 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Infomation;
