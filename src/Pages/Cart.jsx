import React, { useEffect, useState } from "react";
import { formatPrice } from "../Components/Ultils/formatPrice.js";
import { useDispatch, useSelector } from "react-redux";
import { adjustQuantity, removeFromCart } from "../redux/cartSlice.js";
import { showNotification } from "../redux/notificationSlice.js";
import { getProduct } from "../api/productApi.jsx";
import { Link } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const cartItems = useSelector((state) => state.cart.items);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = subtotal;
  const handleRemove = (id, size) => {
    const item = { _id: id, size: size };
    setIsOpen(true);
    setItemToRemove(item);
  };

  const closeModal = () => {
    setIsOpen(false);
    setItemToRemove(null);
  };
  const confirmRemoval = () => {
    if (itemToRemove) {
      dispatch(removeFromCart(itemToRemove));
    }
    closeModal();
    dispatch(
      showNotification({
        message: "Product has been successfully removed!",
        type: "success",
      })
    );
  };
  const increaseQuantity = async (id, size) => {
    try {
      const product = await getProduct(id);
      const cartItem = cartItems.find(
        (item) => item._id === id && item.size === size
      );
      if (cartItem && cartItem.quantity + 1 > product.quantity) {
        dispatch(
          showNotification({
            message:
              "Cannot add more items to the cart than available in stock.",
            type: "error",
          })
        );
        return;
      }

      dispatch(
        adjustQuantity({
          _id: id,
          size: size,
          quantity: cartItem.quantity + 1,
        })
      );
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
  };
  const decreaseQuantity = (id, size) => {
    const newCartItems = cartItems.map((item) =>
      item._id === id && item.size === size
        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
        : item
    );
    const updatedItem = newCartItems.find(
      (item) => item._id === id && item.size === size
    );
    if (updatedItem) {
      dispatch(
        adjustQuantity({
          _id: updatedItem._id,
          size: updatedItem.size,
          quantity: updatedItem.quantity,
        })
      );
    }
  };
  if (!cartItems) {
    return <div>Product not found in cart</div>;
  }

  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 mt-28">
        <div className="mx-auto max-w-3xl">
          <header className="text-center">
            <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
              Your Cart
            </h1>
          </header>
          {cartItems.length === 0 ? (
            <div className="text-center mt-40">
              <p className="text-lg text-gray-600">No products in cart.</p>
            </div>
          ) : (
            <div className="mt-8">
              <ul className="space-y-4">
                {cartItems.map((item) => (
                  <li
                    key={`${item._id}-${item.size}`}
                    className="flex items-center gap-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="size-40 rounded object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="text-lg text-gray-900">{item.name}</h3>

                      <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                        <div>
                          <dt className="inline  text-base ">Price: </dt>
                          <dd className="inline  text-base">
                            {" "}
                            {formatPrice(item.price)}
                          </dd>
                        </div>
                      </dl>
                      <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                        <div>
                          <dt className="inline  text-base ">Size: </dt>
                          <dd className="inline  text-base"> {item.size}</dd>
                        </div>
                      </dl>
                    </div>
                    <div className="flex flex-1 items-center justify-center ">
                      <button
                        className="group rounded-l-full px-4 py-2 border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        onClick={() => decreaseQuantity(item._id, item.size)}
                      >
                        <svg
                          className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                        >
                          <path
                            d="M16.5 11H5.5"
                            stroke=""
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                          <path
                            d="M16.5 11H5.5"
                            stroke=""
                            strokeOpacity="0.2"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                          <path
                            d="M16.5 11H5.5"
                            stroke=""
                            strokeOpacity="0.2"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                      <input
                        type="text"
                        className="border-y border-gray-200 outline-none text-gray-900 font-semibold text-lg w-full max-w-[118px] min-w-[80px] placeholder:text-gray-900 px-4 py-[5px] text-center bg-transparent"
                        placeholder="1"
                        value={item.quantity}
                        onChange={() => {}}
                        readOnly
                      />
                      <button
                        className="group rounded-r-full px-4 py-2 border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        onClick={() => increaseQuantity(item._id, item.size)}
                      >
                        <svg
                          className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                        >
                          <path
                            d="M11 5.5V16.5M16.5 11H5.5"
                            stroke=""
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                          <path
                            d="M11 5.5V16.5M16.5 11H5.5"
                            stroke=""
                            strokeOpacity="0.2"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                          <path
                            d="M11 5.5V16.5M16.5 11H5.5"
                            stroke=""
                            strokeOpacity="0.2"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="flex flex-1 items-center justify-center gap-2">
                      <button
                        className="text-gray-600 transition hover:text-red-600"
                        onClick={() => handleRemove(item._id, item.size)}
                      >
                        <span className="sr-only">Remove item</span>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
                <div className="mx-auto w-auto">
                  <img
                    src="/Assets/logo-no-background.png"
                    alt=""
                    className=" w-32 h-auto object-cover"
                  />
                </div>
                <div className="w-screen max-w-lg space-y-4">
                  <dl className="space-y-0.5 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <dt>Subtotal</dt>
                      <dd>{formatPrice(subtotal)}</dd>
                    </div>

                    <div className="flex justify-between !text-base font-medium">
                      <dt>Total</dt>
                      <dd>{formatPrice(total)}</dd>
                    </div>
                  </dl>

                  <div className="flex justify-end">
                    <Link to="/checkout">
                      <a
                        href="/"
                        className="block rounded bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600"
                      >
                        Checkout
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
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
                Are you sure you want to remove the product from the cart?
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
    </section>
  );
};

export default Cart;
