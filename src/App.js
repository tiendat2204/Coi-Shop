import React, { Suspense, lazy, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loading from "./Components/Loading/Loading";
import useDelay from "./hook/useDelay";
import ProductDetail from "./Pages/ProductDetail";
import Notification from "./Components/Ultils/Notification";
import Infomation from "./Components/Infomation/Infomation";
import ForgotPassword from "./Components/FogotPassword/FogotPassword";
import Checkout from "./Components/Checkout/Checkout";
import { showNotification } from "./redux/notificationSlice";
import About from "./Components/About/About";
import Contact from "./Components/Contact/Contact";
import AdminLayout from "./admin/Layouts/AdminLayout";
import UserLayout from "./Pages/UserLayout";
import DashboardAdmin from "./admin/Components/Dash/DashboardAdmin";
import ProductAdmin from "./admin/Components/Product/ProductAdmin";
import CategoryAdmin from "./admin/Components/Category/CategoryAdmin";
import UsersAdmin from "./admin/Components/Users/UsersAdmin";
import OrdersAdmin from "./admin/Components/Orders/OrdersAdmin";
import CommentsAdmin from "./admin/Components/Comments/CommentsAdmin";
import Thankyou from "./Pages/Thankyou";

const Shop = lazy(() => import("./Pages/Shop"));
const ShopCategory = lazy(() => import("./Pages/ShopCategory"));
const Cart = lazy(() => import("./Pages/Cart"));

function App() {
  const dispatch = useDispatch();
  const loading = useDelay();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const message = urlParams.get("message");

    if (message === "Block") {
      dispatch(
        showNotification({ message: "Your account is blocked", type: "error" })
      );
    } else if (token) {
      localStorage.setItem("accessToken", token);
      dispatch(
        showNotification({ message: "Login successful!", type: "success" })
      );
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Notification />
      {loading ? (
        <Loading />
      ) : (
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route element={<UserLayout setSearchTerm={setSearchTerm} />}>
              <Route path="/Coi-Shop" element={<Shop />} />
              <Route
                path="/category"
                element={<ShopCategory searchTerm={searchTerm} />}
              />
              <Route path="/about" element={<About />} />
              <Route path="/infomation" element={<Infomation />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/thankyou" element={<Thankyou />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardAdmin />} />
              <Route path="products/:productId?" element={<ProductAdmin />} />

              <Route path="category" element={<CategoryAdmin />} />
              <Route path="users" element={<UsersAdmin />} />
              <Route path="orders" element={<OrdersAdmin />} />
              <Route path="comments" element={<CommentsAdmin />} />
            </Route>
          </Routes>
        </Suspense>
      )}
    </BrowserRouter>
  );
}

export default App;
