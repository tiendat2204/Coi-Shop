import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllCategories } from "../../../api/categoryApi";
import { postProduct, editProduct } from "../../../api/productApi";
import { useDispatch } from "react-redux";
import { useDropzone } from "react-dropzone";
import { showNotification } from "../../../redux/notificationSlice";
const ProductForm = ({ product, closeForm, refreshProducts }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    new_price: 0,
    old_price: 0,
    category_id: "",
    description: "",
    createdAt: new Date(),
    size: ["S", "M", "L"],
    quantity: 0,
    status: "active",
    ...(product
      ? { ...product, view: undefined, commentCount: undefined }
      : {}),
  });
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await getAllCategories();
        setCategories(categoriesResponse);
      } catch (error) {
        console.error("Error fetching categories:", error);
        dispatch(
          showNotification({
            message: "Failed to fetch categories",
            type: "error",
          })
        );
      }
    };
    fetchCategories();
  }, [dispatch]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFormData({ ...formData, image: acceptedFiles[0] });
      setImagePreview(URL.createObjectURL(acceptedFiles[0]));
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: ["new_price", "old_price", "quantity"].includes(name)
        ? parseFloat(value)
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm(formData)) {
      dispatch(
        showNotification({
          message: "Please fill in all required fields.",
          type: "error",
        })
      );
      return;
    }
    try {
      const dataToSubmit =
        product && product._id && !(formData.image instanceof File)
          ? { ...formData, image: undefined }
          : { ...formData };

      const response =
        product && product._id
          ? await editProduct(product._id, dataToSubmit)
          : await postProduct(dataToSubmit);

      if (response.status === 200 || response.status === 201) {
        dispatch(
          showNotification({
            message: `${
              product && product._id ? "Edit" : "Post"
            } product success`,
            type: "success",
          })
        );
        refreshProducts();
        closeForm();
      } else {
        throw new Error(
          `${product && product._id ? "Edit" : "Post"} product failed`
        );
      }
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error submitting product form: ${error.message}`,
          type: "error",
        })
      );
    }
  };
  const validateForm = (formData) => {
    const requiredFields = ['name', 'new_price', 'category_id', 'description'];
    for (let field of requiredFields) {
      if (!formData[field] || (typeof formData[field] === 'number' && formData[field] === 0)) {
        return false; 
      }
    }
    return true;
  };
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { y: "-10px", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { delay: 0.1 } },
  };
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={backdropVariants}
      className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
    >
      <motion.section
        variants={modalVariants}
        className="bg-white dark:bg-gray-900 w-full max-w-3xl mx-auto rounded-lg p-8 max-h-[90%] overflow-auto"
      >
        {" "}
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {product ? "Update Product" : "Add Product"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div class="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
            <div class="sm:col-span-2">
              <label
                for="name"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Product Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                value={formData.name}
                onChange={handleChange}
                placeholder="Type product name"
                required
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="new_price"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                New Price
              </label>
              <input
                type="number"
                name="new_price"
                id="new_price"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                value={formData.new_price}
                onChange={handleChange}
                placeholder=""
                required
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="old_price"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Old Price
              </label>
              <input
                type="number"
                name="old_price"
                id="old_price"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                value={formData.old_price}
                onChange={handleChange}
                placeholder=""
                required
              />
            </div>
            {product && product._id ? (
              <div className="w-full">
                <label
                  htmlFor="image"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Product Image
                </label>
                <img
                  src={formData.image}
                  alt="Product Preview"
                  className="my-4 w-28 h-auto object-cover mx-auto rounded-lg"
                />
                <input
                  type="file"
                  name="image"
                  id="image"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setFormData({ ...formData, image: file });
                    setImagePreview(URL.createObjectURL(file));
                  }}
                />
              </div>
            ) : (
              <div
                {...getRootProps()}
                className="border-dashed border-2 border-gray-300 p-4 text-center cursor-pointer w-auto"
              >
                <input {...getInputProps()} 
                />
                <p>Click to select Image</p>
                {imagePreview && (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-4 max-h-40 mx-auto"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, image: "" });
                        setImagePreview("");
                      }}
                      className="mt-2 text-sm bg-red-500 text-white py-1 px-3 rounded"
                    >
                      Remove Image
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="">
              {" "}
              <label
                htmlFor="category_id"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Category
              </label>
              <select
                id="category_id"
                name="category_id"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                value={formData.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                value={formData.description}
                required
                onChange={handleChange}
                placeholder="Write a product description here..."
              ></textarea>
            </div>
            <div>
              <label
                for="quantity"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>
            <div>
              <label
                for="status"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Status
              </label>
              <select
                name="status"
                required
                value={formData.status}
                onChange={handleChange}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="select-none rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            {product ? "Update Product" : "Add Product"}
          </button>
          <div className="flex flex-wrap items-center justify-end  shrink-0 text-blue-gray-500">
            <button
              onClick={closeForm}
              data-ripple-dark="true"
              data-dialog-close="true"
              className="px-6 py-3 mr-1 font-sans text-xs font-bold text-red-500 uppercase transition-all rounded-lg middle none center bg-red-500/10 active:bg-red-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.section>
    </motion.div>
  );
};

export default ProductForm;
