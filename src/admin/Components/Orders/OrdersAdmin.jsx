import React, { useEffect, useState } from "react";
import { getAllOrders } from "../../../api/orderApi";
import { useDispatch } from "react-redux";
import { showNotification } from "../../../redux/notificationSlice";
import OrderDetailsAdmin from "./OrdersDetailAdmin";
import OrdersForm from "./OrdersForm";
import {
  formatPrice,
  formatDate,
} from "../../../Components/Ultils/formatPrice";
import { getStatusStyle } from "../Ultils/statusOrder";
const OrdersAdmin = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      const ordersResponse = await getAllOrders();

      setOrders(ordersResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
      dispatch(
        showNotification({
          message: "Failed to fetch orders",
          type: "error",
        })
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openFormForEdit = (order) => {
    setCurrentOrder(order);
    setIsFormOpen(true);
  };

  const openDetails = (order) => {
    setCurrentOrder(order);
    setIsDetailsOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
  };

  const refreshOrders = () => {
    fetchOrders();
  };

  return (
    <div className="relative flex flex-col w-full h-auto text-gray-700 bg-white shadow-md rounded-xl bg-clip-border border-2">
      <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white rounded-none bg-clip-border h-auto">
        <div className="flex flex-col justify-between gap-8 mb-4 md:flex-row md:items-center">
          <div>
            <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              Orders
            </h5>
            <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
              Manage your orders here
            </p>
          </div>
          <div className="flex w-full gap-2 shrink-0 md:w-max">
            <button
              className="select-none rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              onClick={() => setIsFormOpen(true)}
            >
              Add Order
            </button>
          </div>
        </div>
      </div>
      <div className="p-6 px-0 overflow-scroll">
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Name
                </p>
              </th>
              <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Email
                </p>
              </th>
              <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Status
                </p>
              </th>
              <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Total Price
                </p>
              </th>
              <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Payment Method
                </p>
              </th>
              <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50 text-center">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Create At
                </p>
              </th>
              <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70 text-center">
                  Action
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="p-4 border-b border-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-bold leading-normal text-blue-gray-900 truncate w-auto">
                    {order.name}
                  </p>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 truncate w-auto">
                    {order.email}
                  </p>
                </td>

                <td className="p-4 border-b border-blue-gray-50">
                  <div className="w-max">
                    <div
                      className={`relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      <span>{order.status}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 truncate w-auto">
                    {formatPrice(order.totalPrice)}
                  </p>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 truncate w-auto">
                    {order.paymentMethod}
                  </p>
                </td>
                <td className="p-4 border-b border-blue-gray-50 text-center">
                  <p className="font-sans text-sm font-normal leading-normal text-blue-gray-900 truncate">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </td>
                <td className="p-4 border-b border-blue-gray-50 items-center text-center">
                  <button
                    className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                    onClick={() => openFormForEdit(order)}
                  >
                    <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        className="w-4 h-4"
                      >
                        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
                      </svg>
                    </span>
                  </button>
                  <button
                    className="relative h-10 max-h-[40px] w-20 max-w-[90px] ml-2 select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all  disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none border"
                    type="button"
                    onClick={() => openDetails(order)}
                  >
                    View Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <OrdersForm
          order={currentOrder}
          closeForm={closeForm}
          refreshOrders={refreshOrders}
        />
      )}

      {isDetailsOpen && (
        <OrderDetailsAdmin order={currentOrder} closeModal={closeDetails} />
      )}
    </div>
  );
};

export default OrdersAdmin;
