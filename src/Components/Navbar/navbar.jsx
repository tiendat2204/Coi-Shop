import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import LoginRegister from "../LoginRegister/LoginRegister";
import { getUser, logoutUser } from "../../api/usersApi";
import { motion } from "framer-motion";
import { setUser } from "../../redux/userSlice";
import { debounce } from "../Ultils/debounce";
const Navbar = ({ setSearchTerm }) => {
  const [menu, setMenu] = useState("shop");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  const [showLoginRegister, setShowLoginRegister] = useState(false);
  const [modalType, setModalType] = useState("login");
  const [searchTerm, setSearchTermLocal] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const handleShowLoginRegister = (type) => {
    setModalType(type);
    setShowLoginRegister(true);
    
  };
  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      getUser(accessToken)
        .then((userData) => {
          dispatch(
            setUser({
              name: userData.name,
              email: userData.email,
              photo: userData.photo,
            })
          );
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [dispatch]);
  const logout = () => {
    localStorage.removeItem("accessToken");
    logoutUser();
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };
  const handleSearchChange = debounce((searchTerm) => {
    setSearchTermLocal(searchTerm); 
    setSearchTerm(searchTerm); 
    navigate(`/category`);
  }, 300);

  return (
    <div className="fixed top-0 left-0 w-full z-10 flex flex-col md:flex-row justify-between  shadow bg-white p-0 md:px-10 md:p-4">
       
      <div className="flex justify-between items-center w-full md:w-auto gap-10 md:p-0 p-4">
        
        <div className="flex items-center gap-2.5 md:w-full w-2/5 ">
          <a href="/">
            <img
              src="/Assets/logo-no-background.png"
              alt="Logo"
              className="w-15 h-20 object-cover"
            />
          </a>
        </div>
        <div className="flex items-center w-full md:w-auto md:hidden ">
    <div className="relative md:block">
    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
      </div>
      <input
        type="text"
        id="search-navbar"
        className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search..."
        onChange={(e) => handleSearchChange(e.target.value)}

      />
    </div>
   
  </div>
        <button
          className="text-3xl md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          &#9776;
        </button>
       
        
      </div>
      <div className="flex-grow-0"></div>
      
      <ul
        className={`flex-col md:flex-row flex items-center list-none gap-4 md:gap-12 text-black text-lg font-medium  ${
          isMenuOpen ? "flex" : "hidden"
        } md:flex md:justify-center`}
      >
        <li
          className="flex flex-col items-center justify-center gap-0.75 cursor-pointer"
          onClick={() => setMenu("shop")}
        >
          <Link className="no-underline text-black" to="/">
            Shop
          </Link>
          {menu === "shop" && (
            <hr className="w-4/5 h-0.75 rounded bg-red-500" />
          )}
        </li>
        <li
          className="flex flex-col items-center justify-center gap-0.75 cursor-pointer"
          onClick={() => setMenu("category")}
        >
          <Link className="no-underline text-black" to="/category">
            Category
          </Link>
          {menu === "category" && (
            <hr className="w-4/5 h-0.75 rounded bg-red-500" />
          )}
        </li>
        <li
          className="flex flex-col items-center justify-center gap-0.75 cursor-pointer"
          onClick={() => setMenu("about")}
        >
          <Link className="no-underline text-black" to="/about">
            About
          </Link>
          {menu === "about" && (
            <hr className="w-4/5 h-0.75 rounded bg-red-500" />
          )}
        </li>
        <li
          className="flex flex-col items-center justify-center gap-0.75 cursor-pointer"
          onClick={() => setMenu("contact")}
        >
          <Link className="no-underline text-black" to="/contact">
            Contact
          </Link>
          {menu === "contact" && (
            <hr className="w-4/5 h-0.75 rounded bg-red-500" />
          )}
        </li>
       
        {localStorage.getItem("accessToken") ? (
          <li className="flex flex-col items-center justify-center gap-0.75 cursor-pointer md:hidden">
            <div className="relative inline-block">
              <img
                id="avatarButton"
                type="button"
                data-dropdown-toggle="userDropdown"
                data-dropdown-placement="bottom-start"
                className="w-9 h-9 object-cover cursor-pointer rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                src={user.photo || "../Assets/avatar.png"}
                alt="User dropdown"
                onClick={toggleDropdown}
              />
              {isDropdownOpen && (
                <motion.div
                  id="userDropdown"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute right-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                >
                  <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    <div className="text-sm">{user.name}</div>
                    <div className="font-bold truncate">{user.email}</div>
                  </div>
                  <ul
                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="avatarButton"
                  >
                    <li>
                      <Link
                        to="/infomation"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Dashboard
                      </Link>
                    </li>
                  </ul>
                  <div className="py-1">
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        logout();
                      }}
                      href="/"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Sign out
                    </a>
                  </div>
                </motion.div>
              )}
            </div>
          </li>
        ) : (
          <>
            <li className="md:hidden">
              <Link onClick={() => handleShowLoginRegister("login")}>
                <button
                  className="px-4 py-2 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                >
                  <span>Log In</span>
                </button>
              </Link>
            </li>
            <li className="md:hidden">
              <Link onClick={() => handleShowLoginRegister("register")}>
                <button
                  className="select-none rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                >
                  <span>Sign in</span>
                </button>
              </Link>
            </li>
          </>
        )}
        <li className="md:hidden">
          <Link to="/cart">Cart</Link>
        </li>
      
      </ul>
      <div className="flex items-center w-full md:w-auto">
    <div className="relative hidden md:block">
    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
      </div>
      <input
        type="text"
        id="search-navbar"
        className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search..."
        onChange={(e) => handleSearchChange(e.target.value)}
      />
    </div>
   
  </div>
      <div className="hidden md:flex items-center gap-11">
     
  

        {localStorage.getItem("accessToken") ? (
          <>
          
            <div className="relative inline-block">
              <img
                id="avatarButton"
                type="button"
                data-dropdown-toggle="userDropdown"
                data-dropdown-placement="bottom-start"
                className="w-9 h-9 object-cover cursor-pointer rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                src={user.photo || "../Assets/avatar.png"}
                alt="User dropdown"
                onClick={toggleDropdown}
              />
              {isDropdownOpen && (
                <motion.div
                  id="userDropdown"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute right-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                >
                  <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    <div className="text-sm">{user.name}</div>
                    <div className="font-bold truncate">{user.email}</div>
                  </div>
                  <ul
                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="avatarButton"
                  >
                    <li>
                      <Link
                        to="/infomation"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Dashboard
                      </Link>
                    </li>
                  </ul>
                  <div className="py-1">
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        logout();
                      }}
                      href="/"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Sign out
                    </a>
                  </div>
                </motion.div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link onClick={() => handleShowLoginRegister("login")}>
              <button
                className="px-4 py-2 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <span>Log In</span>
              </button>
            </Link>
            <Link onClick={() => handleShowLoginRegister("register")}>
              <button
                className="select-none rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <span>Sign in</span>
              </button>
            </Link>
          </div>
        )}
        <Link to="/cart" className="relative">
          <img
            src="/Assets/cart_icon.png"
            alt="Cart"
            className="h-6 w-6 object-cover"
          />
          <div className="absolute p-0.5 flex justify-center items-center -top-2 -right-2 rounded-full text-xs bg-black text-white w-4/6 h-auto">
            {totalQuantity}
          </div>
        </Link>
      </div>
    
      {showLoginRegister && (
        <LoginRegister
          onClose={() => setShowLoginRegister(false)}
          initialModalType={modalType}
        />
      )}
    </div>
  );
};

export default Navbar;
