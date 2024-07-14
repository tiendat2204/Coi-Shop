import React from "react";
import { motion } from "framer-motion";

const OrderDetailsAdmin = ({ order, closeModal }) => {
  // Animation settings
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { y: "-10px", opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { delay: 0.1 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={backdropVariants}
      data-dialog-backdrop="animated-dialog"
      data-dialog-backdrop-close="true"
      className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-1 backdrop-blur-sm transition-opacity duration-300"
    >
      <motion.div
        variants={modalVariants}
        data-dialog="animated-dialog"
        data-dialog-mount="opacity-100 translate-y-0 scale-100"
        data-dialog-unmount="opacity-0 -translate-y-28 scale-90 pointer-events-auto"
        data-dialog-transition="transition-all duration-300"
        className="relative m-4 w-full min-w-[40%] max-w-[60%] rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 antialiased shadow-2xl"
      >
        <div className="flex items-center p-4 font-sans text-2xl antialiased font-semibold leading-snug shrink-0 text-blue-gray-900">
          Order Detail
        </div>
        <div
                className="flex flex-col md:flex-row gap-4 p-4 border rounded-md"
              >
                <div className="flex-1">
                  <h2 className="text-lg font-bold">Order Information</h2>
                  <p>
                    <strong>Phone Number:</strong> {order.phoneNumber}
                  </p>
                  <p>
                    <strong>Shipping Fee:</strong>{" "}
                    {order.shippingFee.toLocaleString()} VND
                  </p>
                  <p>
                    <strong>Payment Method:</strong> {order.paymentMethod}
                  </p>
                  <p>
                    <strong>Subtotal:</strong> {order.subtotal.toLocaleString()} VND
                  </p>
                  <p>
                    <strong>Total Price:</strong> {order.totalPrice.toLocaleString()} VND
                  </p>
                  <p>
                    <strong>Order Status:</strong> <span className={`${
                      order.status === "pending"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}>{order.status}</span>
                  </p>
                  <p>
                    <strong>Order Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Address:</strong> {order.address}
                  </p>
                
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold">Products</h2>
                  <ul className="list-disc list-inside">
                    {order.product.map((item, i) => (
                      <div
                        key={i}
                        className="flex flex-col rounded-lg bg-white sm:flex-row items-center border my-3"
                      >
                        <a href={`/product/${item._id}`} >
                        <img
                          className="m-2 h-28 w-30 rounded-md border object-cover "
                          src={item.image}
                          alt=""
                        />
                        </a>

                        <div className="flex w-full flex-col px-4 py-4">
                          <span className="font-semibold">{item.name}</span>
                          <span className="float-right text-gray-400">
                            Size: {item.size}
                          </span>
                          <p className="text-lg font-bold">
                            Price: {item.price}
                          </p>
                          <p className="text-sm">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </ul>
                </div>
              </div>
        <div className="flex flex-wrap items-center justify-end p-4 shrink-0 text-blue-gray-500">
          <button
            onClick={closeModal}
            data-ripple-dark="true"
            data-dialog-close="true"
            className="px-6 py-3 mr-1 font-sans text-xs font-bold text-red-500 uppercase transition-all rounded-lg middle none center hover:bg-red-500/10 active:bg-red-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderDetailsAdmin;
