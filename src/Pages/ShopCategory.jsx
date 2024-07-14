import React from "react";
import Category from "../Components/Category/Category";

const ShopCategory = ({ searchTerm }) => {
  return (
    <div>
      <Category searchTerm={searchTerm} />
    </div>
  );
};

export default ShopCategory;
