import React from "react";
import { getStatusStyle } from "../../admin/Components/Ultils/statusOrder";

const OrderDetail = ({ order }) => {
  if (!order) {
    return (
      <>
        <dialog id="modalDetailOrder" className="modal">
          <p>Không có đơn hàng</p>
        </dialog>
      </>
    );
  }

  return (
    <>
      <dialog id="modalDetailOrder" className="modal ">
        <div className="modal-box w-full max-w-5xl h-auto">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold">Customer Information</h2>
              <p>
                <strong>Name:</strong> {order.name}
              </p>
              <p>
                <strong>Email:</strong> {order.email}
              </p>
              <p>
                <strong>Phone Number:</strong> {order.phoneNumber}
              </p>
            </div>

            <div
              key={order._id}
              className="flex flex-col md:flex-row gap-4 p-4 border rounded-md"
            >
              <div className="flex-1">
                <h2 className="text-lg font-bold">Order Information</h2>
                <p>
                  <strong>Shipping Fee:</strong>{" "}
                  {order.shippingFee.toLocaleString()} VND
                </p>
                <p>
                  <strong>Payment Method:</strong> {order.paymentMethod}
                </p>
                <p>
                  <strong>Subtotal:</strong> {order.subtotal.toLocaleString()}{" "}
                  VND
                </p>
                <p>
                  <strong>Total Price:</strong>{" "}
                  {order.totalPrice.toLocaleString()} VND
                </p>
                <p className="flex gap-3 items-center">
                  <strong>Order Status:</strong>{" "}
               
                      <span  className={` grid items-center w-auto px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap ${getStatusStyle(
                        order.status
                      )}`}>{order.status}</span>
                  
                </p>
                <p>
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
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
                      <a href={`/product/${item._id}`}>
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
                        <p className="text-lg font-bold">Price: {item.price}</p>
                        <p className="text-sm">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default OrderDetail;
