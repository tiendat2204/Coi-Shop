import React from "react";
import { Link } from "react-router-dom";

const Item = ({ product }) => {
  if (!product) return null;

  const formatPriceVND = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="w-full overflow-hidden bg-white ">
   <Link to={`/product/${product._id}`} className="block">
        <img
          className="w-full h-70 object-cover object-center transition-transform duration-500 hover:scale-105"
          src={product.image}
          alt=""
        />
        <div className="p-2">
          <h3 className="mb-2 text-lg ">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-black font-semibold text-sm">
              {formatPriceVND(product.new_price)}
            </span>
            <span className="text-gray-400 text-sm font-medium line-through">
              {formatPriceVND(product.old_price)}
            </span>
          </div>
        </div>
        </Link>
    </div>
  );
};

export default Item;
