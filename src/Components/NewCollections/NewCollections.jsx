import React, { useState, useEffect } from "react";
import { getAllProducts } from "../../api/productApi.jsx";
import Item from "../Item/Item";

const NewCollections = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
      <h1 className="text-3xl font-bold text-center my-10">ALL PRODUCTS</h1>
      <hr className="mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentItems.map((product) => (
          <Item key={product._id} product={product} />
        ))}
      </div>
      <div className="flex justify-center items-center space-x-2 mt-8">
        {Array.from({ length: totalPages }, (_, index) => (
        <button
        key={index + 1}
        onClick={() => paginate(index + 1)}
        className={`px-4 py-2 border rounded cursor-pointer transition-all ${
          currentPage === index + 1
            ? "bg-white text-black border-black" 
            : "bg-f8f8f8 text-gray-800 border-gray-200"
        } hover:bg-e9e9e9 hover:-translate-y-1`} 
      >
        {index + 1}
      </button>
        ))}
      </div>
    </div>
  );
};

export default NewCollections;
