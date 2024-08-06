import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../../api/productApi";
import { formatPrice } from "../../../Components/Ultils/formatPrice";
import { getAllCategories } from "../../../api/categoryApi";
import Description from "./Description";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import ProductForm from "./ProductForm";
import { deleteProduct } from "../../../api/productApi";
import { useDispatch } from "react-redux";
import { showNotification } from "../../../redux/notificationSlice";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useParams } from "react-router-dom";

const ProductAdmin = () => {
  const dispatch = useDispatch();
  const { productId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProductsAndCategories = async (searchQuery = "") => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        getAllProducts(searchQuery),
        getAllCategories(),
      ]);

      const categoryMap = categoriesResponse.reduce(
        (map, category) => ({
          ...map,
          [category._id]: category.name,
        }),
        {}
      );

      setProducts(productsResponse);
      setCategoryMap(categoryMap);

      if (productId && productsResponse.length > 0) {
        const product = productsResponse.find(
          (product) => product._id === productId
        );
        setCurrentProduct(product);
        setSearchTerm(product?._id || "");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      dispatch(
        showNotification({
          message: "Failed to fetch products or categories",
          type: "error",
        })
      );
    }
  };

  useEffect(() => {
    fetchProductsAndCategories(productId);
  }, [productId]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProductsAndCategories(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleViewClick = (desc) => {
    setDescription(desc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openFormForEdit = (product) => {
    setCurrentProduct(product);
    setIsFormOpen(true);
  };

  const openFormForAdd = () => {
    setCurrentProduct(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const refreshProducts = () => {
    fetchProductsAndCategories();
  };

  const openDeleteDialog = (productId) => {
    setProductToDelete(productId);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      const response = await deleteProduct(productToDelete);
      if (response.status === 200) {
        dispatch(
          showNotification({
            message: "Product deleted successfully",
            type: "success",
          })
        );
        refreshProducts();
      } else {
        dispatch(
          showNotification({
            message: "Failed to delete product",
            type: "error",
          })
        );
      }
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error deleting product: ${error.message}`,
          type: "error",
        })
      );
    } finally {
      closeDeleteDialog();
    }
  };

  return (
    <div class="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-xl bg-clip-border border-2">
      <div class="relative mx-4 mt-4 text-gray-700 bg-white rounded-none bg-clip-border h-auto">
        <div class="flex flex-col justify-between gap-8 mb-4 md:flex-row md:items-center h-auto">
          <div>
            <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              Recent Transactions
            </h5>
            <p class="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
              These are details about the last transactions
            </p>
          </div>
          <div class="flex w-full gap-2 shrink-0 md:w-max">
            <div className="lg:w-96">
              <Input
                label="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={openFormForAdd}
              class="select-none rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>
      <div class="p-6 px-0 overflow-scroll">
        <table class="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Name
                </p>
              </th>
              <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Category
                </p>
              </th>
              <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  New Price
                </p>
              </th>
              <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Old Price
                </p>
              </th>
              <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Description
                </p>
              </th>
              <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Status
                </p>
              </th>
              <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Quantity
                </p>
              </th>
              <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  View
                </p>
              </th>
              <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70 text-center">
                  Action
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
          {products.length > 0 ? (
    products.map((product) => (
              <tr key={product._id}>
                <td class="p-4 border-b border-blue-gray-50">
                  <div class="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt="Spotify"
                      class="relative inline-block h-16 w-16 !rounded-full border border-blue-gray-50 bg-blue-gray-50/50 object-contain object-center p-1"
                    />
                    <p class="block font-sans text-sm antialiased font-bold leading-normal text-blue-gray-900 truncate w-auto">
                      {product.name}
                    </p>
                  </div>
                </td>
                <td class="p-4 border-b border-blue-gray-50">
                  <p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    {categoryMap[product.category_id] || "Unknown"}
                  </p>
                </td>
                <td class="p-4 border-b border-blue-gray-50">
                  <p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    {formatPrice(product.old_price)}
                  </p>
                </td>
                <td class="p-4 border-b border-blue-gray-50">
                  <p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    {formatPrice(product.new_price)}
                  </p>
                </td>
                <td class="p-4 border-b border-blue-gray-50">
                  <button
                    data-ripple-light="true"
                    data-dialog-target="dialog"
                    class="flex select-none items-center gap-3 rounded-lg bg-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                    onClick={() => handleViewClick(product.description)}
                  >
                    View
                  </button>
                </td>
                <td class="p-4 border-b border-blue-gray-50">
                  <div class="w-max">
                    <div class="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-green-900 uppercase rounded-md select-none whitespace-nowrap bg-green-500/20">
                      <span class=""> {product.status}</span>
                    </div>
                  </div>
                </td>
                <td class="p-4 border-b border-blue-gray-50">
                  <p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    {product.quantity}
                  </p>
                </td>
                <td class="p-4 border-b border-blue-gray-50">
                  <p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    {product.view}
                  </p>
                </td>
                <td class="p-4 border-b border-blue-gray-50">
                  <button
                    class="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                    button
                    onClick={() => openFormForEdit(product)}
                  >
                    <span class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        class="w-4 h-4"
                      >
                        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
                      </svg>
                    </span>
                  </button>
                  <button
                    onClick={() => openDeleteDialog(product._id)}
                    class="relative h-10 max-h-[40px] w-10 max-w-[40px] ml-2 select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-red-500/10 active:bg-red-500/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                  >
                    <span class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        class="w-4 h-4"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M6 6a1 1 0 011-1h10a1 1 0 110 2H7a1 1 0 01-1-1zM9 9a1 1 0 00-1 1v8a1 1 0 102 0V10a1 1 0 00-1-1zm6 0a1 1 0 00-1 1v8a1 1 0 102 0V10a1 1 0 00-1-1zm-3 1a1 1 0 112 0v8a1 1 0 11-2 0V10z"
                          clip-rule="evenodd"
                        />
                        <path
                          fill-rule="evenodd"
                          d="M4 4a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zM3 7a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </span>
                  </button>
                </td>
              </tr>
            ))
  ) : (
    <tr>
      <td colspan="9" class="p-4 text-center mt-72">Không có sản phẩm.</td>
    </tr>
  )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Description description={description} closeModal={closeModal} />
      )}
      {isFormOpen && (
        <ProductForm
          product={currentProduct}
          closeForm={closeForm}
          refreshProducts={refreshProducts}
        />
      )}
      <Dialog open={isDeleteDialogOpen} handler={closeDeleteDialog}>
        <DialogBody>
          <p>Bạn có muốn xóa sản phẩm này?</p>
        </DialogBody>
        <DialogFooter>
          <button
            className="select-none rounded-lg bg-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            onClick={handleDeleteProduct}
          >
            Vâng , Xóa
          </button>
          <button
            className="ml-2 select-none rounded-lg bg-gray-200 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            onClick={closeDeleteDialog}
          >
            Hủy
          </button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ProductAdmin;

