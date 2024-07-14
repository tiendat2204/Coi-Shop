import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../api/productApi";
import Item from "../Item/Item";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Popular = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllProducts();
        const sortedData = data.sort((a, b) => b.view - a.view);
        setProducts(sortedData.slice(0, 10));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-white py-12 ">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
        POPULAR IN VIEW
      </h1>
      <hr className="max-w-xl mx-auto border-t-2 border-gray-300" />
      <div className="mt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-x-10">
  <Slider {...settings}>
    {products.map((product) => (
      <div className="px-2" key={product._id}> 
        <Item key={product._id} product={product} />
      </div>
    ))}
  </Slider>
</div>
    </div>
  );
};

export default Popular;