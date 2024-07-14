import React, { useEffect, useMemo, useState } from "react";
import { getAllProducts, getProductByCategory } from "../../api/productApi.jsx";
import Item from "../Item/Item";
import {
  Dialog,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  XMarkIcon,
  ChevronDownIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import { getAllCategories } from "../../api/categoryApi.jsx";
import Loading from "../Loading/Loading.jsx";
const sortOptions = [
  { name: "Newest", sort: "newest", current: true },
  { name: "Price: Low to High", sort: "price-asc", current: false },
  { name: "Price: High to Low", sort: "price-desc", current: false },
];

export default function Category({ searchTerm }) {
  console.log(searchTerm);

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const itemsPerPage = 12;
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showNoProductsMessage, setShowNoProductsMessage] = useState(false);
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getAllProducts(searchTerm);
        setProducts(allProducts);
        setFilteredProducts(allProducts);
        setShowNoProductsMessage(allProducts.length === 0);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const allCategories = await getAllCategories();
        setCategories(allCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredProducts.length / itemsPerPage);
  }, [filteredProducts.length]);

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCategorySelect = async (categoryId) => {
    try {
      setLoadingProducts(true);
      const productsByCategory = await getProductByCategory(categoryId);
      setFilteredProducts(productsByCategory);
      setShowNoProductsMessage(productsByCategory.length === 0);
      setCategoryId(categoryId || "");
    } catch (error) {
      console.error(
        `Failed to fetch products for category ${categoryId}:`,
        error
      );
    } finally {
      setLoadingProducts(false);
    }
  };

  return (
    <div className="bg-white">
      <Transition show={mobileFiltersOpen}>
        <Dialog
          className="relative z-40 lg:hidden"
          onClose={setMobileFiltersOpen}
        >
          <Transition.Child
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <Transition.Child
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed inset-0 z-40 flex ml-auto w-full max-w-xs flex-col h-full overflow-y-auto bg-white py-4 pb-12 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-28">
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Products
          </h1>
          <div className="flex items-center">
            <div className="flex space-x-4">
              <SortMenu
                categoryId={categoryId}
                setFilteredProducts={setFilteredProducts}
                setLoadingProducts={setLoadingProducts}
              />
              <CategoryMenu
                categories={categories}
                onCategorySelect={handleCategorySelect}
                selectedCategory={categoryId}
              />
            </div>
            <button
              type="button"
              className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <span className="sr-only">Filters</span>
              <FunnelIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <section aria-labelledby="products-heading" className="pt-6 pb-24">
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>
          {showNoProductsMessage && (
            <div className="grid h-80 place-content-center bg-white px-4">
              <h1 className="uppercase tracking-widest text-gray-500">
                No product found
              </h1>
            </div>
          )}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {loadingProducts ? (
                <div className="lg:col-span-4">
                  <Loading />
                </div>
              ) : (
                currentItems.map((product) => (
                  <Item key={product._id} product={product} />
                ))
              )}
            </div>
          </div>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            paginate={paginate}
          />
        </section>
      </main>
    </div>
  );
}

function SortMenu({ categoryId, setFilteredProducts, setLoadingProducts }) {
  const handleSortSelect = async (sortType) => {
    try {
      setLoadingProducts(true);
      const sortedProducts = await getProductByCategory(categoryId, sortType);
      setFilteredProducts(sortedProducts);
    } catch (error) {
      console.error(`Failed to fetch products with sort ${sortType}:`, error);
    } finally {
      setLoadingProducts(false);
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
        Sort
        <ChevronDownIcon
          className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
          aria-hidden="true"
        />
      </MenuButton>
      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {sortOptions.map((option) => (
              <MenuItem key={option.sort}>
                {({ active }) => (
                  <button
                    onClick={() => handleSortSelect(option.sort)}
                    className={classNames(
                      option.current
                        ? "font-medium text-gray-900"
                        : "text-gray-500",
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm w-full text-left"
                    )}
                  >
                    {option.name}
                  </button>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}

function CategoryMenu({ categories, onCategorySelect, selectedCategory }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
        Categories
        <ChevronDownIcon
          className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
          aria-hidden="true"
        />
      </MenuButton>
      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {categories.map((category) => (
              <MenuItem key={category._id}>
                {({ active }) => (
                  <button
                    onClick={() => onCategorySelect(category._id)}
                    className={classNames(
                      "flex items-center justify-between",
                      active || selectedCategory === category._id
                        ? "bg-gray-100"
                        : "",
                      "block px-4 py-2 text-sm w-full text-left"
                    )}
                  >
                    {category.name}
                  </button>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}

function Pagination({ totalPages, currentPage, paginate }) {
  return (
    <div className="flex justify-center mt-6">
      <nav className="block">
        <ul className="flex pl-0 list-none flex-wrap rounded">
          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i}
              className="first:ml-0 text-xs font-semibold flex items-center"
            >
              <button
                onClick={() => paginate(i + 1)}
                className={classNames(
                  "flex items-center justify-center w-8 h-8 border border-gray-300 rounded-full mx-1",
                  currentPage === i + 1
                    ? "bg-indigo-500 text-white"
                    : "bg-white text-gray-500"
                )}
              >
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
