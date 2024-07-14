import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-14 ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <a href="/" className="flex justify-center ">
            <img src="../Assets/b6369f5af65f4784b48a40cb52761386.png" alt="" />
          </a>
          <ul className="text-lg flex items-center justify-center flex-col gap-7 md:flex-row md:gap-12 transition-all duration-500 py-16 mb-10 border-b border-gray-200">
            <li>
              <a href="/" className="text-gray-800 hover:text-gray-900">
                Home
              </a>
            </li>
            <li>
              <a href="/category" className=" text-gray-800 hover:text-gray-900">
                Products
              </a>
            </li>
            <li>
              <a href="/about" className=" text-gray-800 hover:text-gray-900">
                About
              </a>
            </li>
            <li>
              <a href="/contact" className=" text-gray-800 hover:text-gray-900">
                Contact
              </a>
            </li>
            <li>
              <a href="/" className=" text-gray-800 hover:text-gray-900">
                Support
              </a>
            </li>
          </ul>
        
          <span className="text-lg text-gray-500 text-center block">
            ©<a href="/">Coi Shop</a> 2024, All rights
            reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
