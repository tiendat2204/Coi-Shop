import React from "react";
import "./Hero.css";
import Spline from "@splinetool/react-spline";

const Hero = () => {
  return (
    <section className="py-28 pb-5 ">
    <div className="max-w-screen-xl mx-auto text-gray-600 gap-x-10 items-center justify-between overflow-hidden md:flex md:px-8">
      <div className="flex-none space-y-5 px-4 sm:max-w-lg md:px-0 lg:max-w-md">
        <h1 className="text-sm text-indigo-600 font-medium">
          Over 200 Unique Design Templates
        </h1>
        <h1 className="  text-gray-800 text-3xl font-bold">
          Coi Shop brings a new style to your wardrobe.
        </h1>
        <p>
          With a combination of tradition and modernity, Coi is proud to create
          high-quality fashion products suitable for all ages.
        </p>
        <div className="items-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
          <a
            href="/"
            className="block py-2 px-4 text-center text-white font-white bg-black border border-transparent duration-150 hover:border-black hover:bg-white hover:text-black rounded-lg  hover:shadow-none"
          >
            Discover Now
          </a>
          <a
            href="/"
            className="flex items-center justify-center gap-x-2 py-2 px-4 text-gray-700 hover:text-gray-500 font-medium duration-150 active:bg-gray-100 border rounded-lg md:inline-flex"
          >
            View Collection
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
      <div className="flex-none mt-14 md:mt-0 md:max-w-4xl px-4 sm:px-6 lg:px-8">
  <Spline scene="https://prod.spline.design/ENQiNuOO9ryiKSb2/scene.splinecode" />
</div>
    </div>
  </section>
  );
};

export default Hero;
