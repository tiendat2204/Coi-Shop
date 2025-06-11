import React, { useEffect, useState } from "react";
import { formatPrice } from "../Ultils/formatPrice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { postOrders, postOrdersMomo } from "../../api/orderApi";
import { showNotification } from "../../redux/notificationSlice";
import { clearCart } from "../../redux/cartSlice";
import { getUser } from "../../api/usersApi";
const Checkout = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [shippingFee, setShippingFee] = useState(null);
  const [subtotal, setSubtotal] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("MoMo");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const token = "2355ce9f-0954-11ef-be92-2ad6ca7ca6ac";

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      fetchDistricts(selectedProvince);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchWards(selectedDistrict);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedWard) {
      calculateShippingFee(selectedDistrict, selectedWard);
    }
  }, [selectedWard, selectedDistrict]);

  useEffect(() => {
    fetchProvinces();
  }, []);
  useEffect(() => {
    const newSubtotal = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setSubtotal(newSubtotal);
  }, [cart]);
  useEffect(() => {
    const newTotalPrice =
      cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0) +
      shippingFee;
    setTotalPrice(newTotalPrice);
  }, [cart, shippingFee]);
  const fetchProvinces = async () => {
    try {
      const response = await axios.get(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
        {
          headers: { token },
        }
      );
      setProvinces(response.data.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchDistricts = async (provinceId) => {
    try {
      const response = await axios.get(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceId}`,
        {
          headers: { token },
        }
      );
      setDistricts(response.data.data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchWards = async (districtId) => {
    try {
      const response = await axios.get(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`,
        {
          headers: { token },
        }
      );
      setWards(response.data.data);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const calculateShippingFee = async (districtId, wardId) => {
    try {
      const serviceId = await getServiceId(districtId);
      const shippingInfo = {
        service_id: parseInt(serviceId),
        shop_id: 5048497,
        from_district_id: 1461,
        from_ward_code: "21316",
        to_district_id: parseInt(districtId),
        to_ward_code: wardId.toString(),
        insurance_value: 0,
        weight: 300,
        length: 10,
        width: 10,
        height: 10,
      };

      const response = await axios.post(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        shippingInfo,
        {
          headers: {
            "Content-Type": "application/json",
            token,
          },
        }
      );
      setShippingFee(response.data.data.total);
    } catch (error) {
      console.error("Error calculating shipping fee:", error);
    }
  };

  const getServiceId = async (districtId) => {
    try {
      const service = {
        shop_id: 5048497,
        from_district: 1461,
        to_district: parseInt(districtId),
      };

      const response = await axios.post(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services",
        service,
        {
          headers: {
            "Content-Type": "application/json",
            token,
          },
        }
      );
      return response.data.data[0].service_id;
    } catch (error) {
      console.error("Error getting service ID:", error);
    }
  };
  const handlePostOrder = async (event) => {
    event.preventDefault();
    if (
      !name ||
      !email ||
      !phoneNumber ||
      !address ||
      !selectedProvince ||
      !selectedDistrict ||
      !selectedWard ||
      !paymentMethod
    ) {
      dispatch(
        showNotification({
          message: "Please fill in all required fields before proceeding.",
          type: "error",
        })
      );
      return;
    }
    try {
      const ordersData = await getOrderData();

      let response;
      switch (paymentMethod) {
        case "MoMo":
          response = await postOrdersMomo(ordersData);
          break;
        case "COD":
          response = await postOrders(ordersData);
          break;
        case "Bank":
          dispatch(
            showNotification({
              message:
                "Bank Transfer payment method is currently not supported.",
              type: "error",
            })
          );
          return;
        default:
          throw new Error("Invalid payment method");
      }

      if (response.status === 201) {
        dispatch(
          showNotification({
            message: "Order has been successfully placed!",
            type: "success",
          })
        );
        setAddress("");
        setEmail("");
        setName("");
        setPhoneNumber("");
        setSelectedDistrict("");
        setSelectedProvince("");
        setSelectedWard("");
        dispatch(clearCart());
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } else if (response.status === 200 && paymentMethod === "MoMo") {
        const { payUrl, resultCode } = response.data;

        if (resultCode === 0) {
          window.location.href = payUrl;
          setAddress("");
          setEmail("");
          setName("");
          setPhoneNumber("");
          setSelectedDistrict("");
          setSelectedProvince("");
          setSelectedWard("");
          dispatch(clearCart());
        } else {
          dispatch(
            showNotification({
              message: "MoMo payment failed. Please try again.",
              type: "error",
            })
          );
        }
      } else {
        dispatch(
          showNotification({
            message: "Error placing order. Please try again.",
            type: "error",
          })
        );
        console.error("Error placing order");
      }
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error: ${error.message}. Please try again.`,
          type: "error",
        })
      );
      console.error("Error:", error);
    }
  };
  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setDistricts([]);
    setWards([]);
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setWards([]);
  };
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };
  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
  };
  const getOrderData = async () => {
    const selectedProvinceName =
      provinces.find(
        (province) => province.ProvinceID.toString() === selectedProvince
      )?.ProvinceName || "";
    const selectedDistrictName =
      districts.find(
        (district) => district.DistrictID.toString() === selectedDistrict
      )?.DistrictName || "";
    const selectedWardName =
      wards.find((ward) => ward.WardCode === selectedWard)?.WardName || "";
    const accessToken = localStorage.getItem("accessToken");
    const userInfo = await getUser(accessToken);
    const id = userInfo._id;
    const orderData = {
      name: name,
      email: email,
      address: `${address} ,Xã/Phường: ${selectedWardName}  Quận/Huyện: ${selectedDistrictName},Thành phố/Tỉnh: ${selectedProvinceName},`,
      shippingFee: shippingFee,
      product: cart.items,
      phoneNumber: phoneNumber,
      paymentMethod: paymentMethod,
      subtotal: subtotal,
      totalPrice: totalPrice,
      userId: id,
    };
    return orderData;
  };
  return (
    <div className="mt-40">
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
        <div className="px-4 pt-8">
          <p className="text-xl font-medium">Order Summary</p>
          <p className="text-gray-400">
            Check your items. And select a suitable shipping method.
          </p>
          <div className="mt-5 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
            {cart.items.map((item, i) => (
              <div
                key={i}
                className="flex flex-col rounded-lg bg-white sm:flex-row items-center"
              >
                <img
                  className="m-2 h-28 w-30 rounded-md border object-cover object-center"
                  src={item.image}
                  alt=""
                />
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
          </div>

          <p className="mt-6 text-lg font-medium">Payment Methods</p>
          <form className="mt-3 grid gap-2">
            <div className="relative">
              <input
                className="peer hidden"
                id="radio_1"
                type="radio"
                name="radio"
                value="MoMo"
                checked={paymentMethod === "MoMo"}
                onChange={handlePaymentMethodChange}
              />
              <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
              <label
                className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-3"
                htmlFor="radio_1"
              >
                <img
                  className="w-14 object-contain"
                  src="../Assets/momo.jpg"
                  alt="MoMo"
                />
                <div className="ml-5">
                  <span className="mt-2 font-semibold">MoMo</span>
                  <p className="text-slate-500 text-sm leading-6">
                    Pay using MoMo e-wallet
                  </p>
                </div>
              </label>
            </div>
            <div className="relative">
              <input
                className="peer hidden"
                id="radio_2"
                type="radio"
                name="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={handlePaymentMethodChange}
              />
              <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
              <label
                className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-3"
                htmlFor="radio_2"
              >
                <img
                  className="w-14 object-contain"
                  src="../Assets/free-delivery-6965.png"
                  alt="COD"
                />
                <div className="ml-5">
                  <span className="mt-2 font-semibold">
                    Cash on Delivery (COD)
                  </span>
                  <p className="text-slate-500 text-sm leading-6">
                    Pay when you receive the product
                  </p>
                </div>
              </label>
            </div>
            <div className="relative">
              <input
                className="peer hidden"
                id="radio_3"
                type="radio"
                name="radio"
                value="Bank"
                checked={paymentMethod === "Bank"}
                onChange={handlePaymentMethodChange}
              />
              <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
              <label
                className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-3"
                htmlFor="radio_3"
              >
                <img
                  className="w-14 object-contain"
                  src="../Assets/cod.png"
                  alt="Bank"
                />
                <div className="ml-5">
                  <span className="mt-2 font-semibold">Bank Transfer</span>
                  <p className="text-slate-500 text-sm leading-6">
                    Pay via bank transfer
                  </p>
                </div>
              </label>
            </div>
          </form>
        </div>
        <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
          <p className="text-xl font-medium">Payment Details</p>
          <p className="text-gray-400">
            Complete your order by providing your payment details.
          </p>
          <div className="">
            <label
              htmlFor="email"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              Email
            </label>
            <div className="relative">
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="your.email@gmail.com"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
            </div>
            <label
              htmlFor="name"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm uppercase shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Your full name here"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                  />
                </svg>
              </div>
            </div>
            <label
              htmlFor="phone-number"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              Phone Number
            </label>
            <div className="relative">
              <input
                type="text"
                id="phone-number"
                name="phone-number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm uppercase shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Your phone number here"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V5zM3 11a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 17a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM17 5a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V5zM17 11a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2zM17 17a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2zM9 5a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H10a1 1 0 01-1-1V5zM9 11a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H10a1 1 0 01-1-1v-2zM9 17a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H10a1 1 0 01-1-1v-2z"
                  />
                </svg>
              </div>
            </div>
            <div className="relative flex justify-around items-center md:flex gap-3">
              <select
                value={selectedProvince}
                onChange={handleProvinceChange}
                className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm uppercase shadow-sm mt-4"
              >
                <option value="">Select Province</option>
                {provinces.map((province) => (
                  <option key={province.ProvinceID} value={province.ProvinceID}>
                    {province.ProvinceName}
                  </option>
                ))}
              </select>

              <select
                value={selectedDistrict}
                onChange={handleDistrictChange}
                className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm uppercase shadow-sm mt-4"
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district.DistrictID} value={district.DistrictID}>
                    {district.DistrictName}
                  </option>
                ))}
              </select>

              <select
                value={selectedWard}
                onChange={handleWardChange}
                className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm uppercase shadow-sm mt-4"
              >
                <option value="">Select Ward</option>
                {wards.map((ward) => (
                  <option key={ward.WardCode} value={ward.WardCode}>
                    {ward.WardName}
                  </option>
                ))}
              </select>
            </div>
            <label
              htmlFor="address"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              Address Detail
            </label>
            <div className="relative">
              <input
                type="text"
                id="address"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm uppercase shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Your address here"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-4 w-4 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
              </div>
            </div>

            <div className="mt-6 border-t border-b py-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Subtotal</p>
                <p className="font-semibold text-gray-900">
                  {" "}
                  {subtotal ? `${formatPrice(subtotal)}` : "0.000đ"}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Shipping</p>
                <p className="font-semibold text-gray-900">
                  {shippingFee
                    ? `${formatPrice(shippingFee)} `
                    : "Calculated at next step"}
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Total</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalPrice ? `${formatPrice(totalPrice)}` : "0.000đ"}
              </p>
            </div>
          </div>
          <button
            onClick={handlePostOrder}
            className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
