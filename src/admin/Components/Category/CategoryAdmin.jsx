import React, { useEffect, useState } from "react";
import { getAllCategories, deleteCategory } from "../../../api/categoryApi";
import { Dialog, DialogBody, DialogFooter } from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../../redux/notificationSlice";
import CategoryForm from "./CategoryForm";

const CategoryAdmin = () => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const fetchCategories = async () => {
    try {
      const categoriesResponse = await getAllCategories();
      setCategories(categoriesResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
      dispatch(
        showNotification({
          message: "Failed to fetch categories",
          type: "error",
        })
      );
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleViewClick = (desc) => {
    setDescription(desc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openFormForEdit = (category) => {
    setCurrentCategory(category);
    setIsFormOpen(true);
  };

  const openFormForAdd = () => {
    setCurrentCategory(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const refreshCategories = () => {
    fetchCategories();
  };

  const openDeleteDialog = (categoryId) => {
    setCategoryToDelete(categoryId);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      const response = await deleteCategory(categoryToDelete);
      if (response.status === 200) {
        dispatch(
          showNotification({
            message: "Category deleted successfully",
            type: "success",
          })
        );
        refreshCategories();
      } else {
        dispatch(
          showNotification({
            message: "Failed to delete category",
            type: "error",
          })
        );
      }
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error deleting category: ${error.message}`,
          type: "error",
        })
      );
    } finally {
      closeDeleteDialog();
    }
  };

  return (
    <div className="relative flex flex-col w-full h-auto text-gray-700 bg-white shadow-md rounded-xl bg-clip-border border-2">
      <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white rounded-none bg-clip-border h-auto">
        <div className="flex flex-col justify-between gap-8 mb-4 md:flex-row md:items-center">
          <div>
            <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              Categories
            </h5>
            <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
              Manage your categories here
            </p>
          </div>
          <div className="flex w-full gap-2 shrink-0 md:w-max">
            <button
              onClick={openFormForAdd}
              className="select-none rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              Add Category
            </button>
          </div>
        </div>
      </div>
      <div className="p-6 px-0 overflow-scroll">
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Name
                </p>
              </th>
              <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Status
                </p>
              </th>
              <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
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
            {categories.map((category) => (
              <tr key={category._id}>
                <td className="p-4 border-b border-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-bold leading-normal text-blue-gray-900 truncate w-auto">
                    {category.name}
                  </p>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <div className="w-max">
                    <div
                      className={`relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap ${
                        category.status === "Inactive"
                          ? "bg-red-500/20 text-red-900"
                          : "bg-green-500/20 text-green-900"
                      }`}
                    >
                      <span>{category.status}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    {category.view}
                  </p>
                </td>
                <td className="p-4 border-b border-blue-gray-50 items-center text-center">
                  <button
                    className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                    onClick={() => openFormForEdit(category)}
                  >
                    <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        className="w-4 h-4"
                      >
                        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
                      </svg>
                    </span>
                  </button>
                  <button
                    onClick={() => openDeleteDialog(category._id)}
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
            ))}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <CategoryForm
          category={currentCategory}
          closeForm={closeForm}
          refreshCategories={refreshCategories}
        />
      )}
      <Dialog open={isDeleteDialogOpen} handler={closeDeleteDialog}>
        <DialogBody>
          <p>Are you sure you want to delete this categories?</p>
        </DialogBody>
        <DialogFooter>
          <button
            className="select-none rounded-lg bg-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            onClick={handleDeleteCategory}
          >
            Yes, Delete
          </button>
          <button
            className="ml-2 select-none rounded-lg bg-gray-200 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            onClick={closeDeleteDialog}
          >
            Cancel
          </button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default CategoryAdmin;
