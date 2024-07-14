import React, { useState, useEffect } from "react";
import { Rating } from "@material-tailwind/react";
import {
  postComment,
  getProduct,
  getComments,
  editComment,
  deleteComment,
} from "../../api/productApi";
import { getUser } from "../../api/usersApi";
import { useDispatch } from "react-redux";
import { showNotification } from "../../redux/notificationSlice";

const Comment = ({ productId }) => {
  const dispatch = useDispatch();
  const [productData, setProductData] = useState(null);
  const [comments, setComments] = useState([]);
  const [userData, setUserData] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(0);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  async function fetchProductAndComments() {
    try {
      const product = await getProduct(productId);
      const comments = await getComments(productId);
      setProductData(product);
      setComments(comments);
    } catch (error) {
      console.error("Failed to fetch product or comments:", error);
    }
  }
  useEffect(() => {
    fetchProductAndComments();
  }, [productId]);

  const handleCommentSubmit = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        dispatch(
          showNotification({
            message: "Please log in to comment.",
            type: "warning",
          })
        );
        return;
      }
      const userData = await getUser(accessToken);
      setUserData(userData);
      const newComment = {
        userId: userData._id,
        username: userData.name,
        photoUser: userData.photo,
        commentText,
        rating,
        timestamp: new Date().toISOString(),
      };

      const addedComment = await postComment(productId, newComment);
      if (addedComment.status === 201) {
        const updatedComments = await getComments(productId);
        setComments(updatedComments);
        dispatch(
          showNotification({
            message: "Comment added successfully!",
            type: "success",
          })
        );
        setCommentText("");
        setRating(0);
      } else {
        dispatch(
          showNotification({
            message: "Failed to add comment. Please try again.",
            type: "error",
          })
        );
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
      dispatch(
        showNotification({
          message: "Failed to add comment. Please try again.",
          type: "error",
        })
      );
    }
  };
  const handleEditComment = async (commentId) => {
    const commentToEdit = comments.find((comment) => comment._id === commentId);
    setEditingCommentId(commentId);
    setCommentText(commentToEdit.commentText);
    setRating(commentToEdit.rating);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      const updatedComments = comments.filter(
        (comment) => comment._id !== commentId
      );
      setComments(updatedComments);
      dispatch(
        showNotification({
          message: "Comment deleted successfully!",
          type: "success",
        })
      );
    } catch (error) {
      console.error("Failed to delete comment:", error);
      dispatch(
        showNotification({
          message: "Failed to delete comment. Please try again.",
          type: "error",
        })
      );
    }
  };
  const handleUpdateComment = async () => {
    try {
      const updatedComment = {
        commentText,
        rating,
      };
      await editComment(editingCommentId, updatedComment);
      const updatedComments = await getComments(productId);
      setComments(updatedComments);
      setEditingCommentId(null);
      setCommentText("");
      setRating(0);
      dispatch(
        showNotification({
          message: "Comment updated successfully!",
          type: "success",
        })
      );
    } catch (error) {
      console.error("Failed to update comment:", error);
      dispatch(
        showNotification({
          message: "Failed to update comment. Please try again.",
          type: "error",
        })
      );
    }
  };
  const handleToggleDropdown = (commentId) => {
    setOpenDropdownId(openDropdownId === commentId ? null : commentId);
  };
  return (
    <section className="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
      <div className="max-w-4xl mx-auto p-4 border rounded-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
            Discussion ({comments.length})
          </h2>
        </div>
        <form className="mb-6" onSubmit={(e) => e.preventDefault()}>
          <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <label htmlFor="comment" className="sr-only">
              Your comment
            </label>
            <textarea
              id="comment"
              rows="5"
              className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex items-center mb-4">
            <Rating value={rating} onChange={(value) => setRating(value)} />
          </div>
          {editingCommentId ? (
            <button
              className="select-none rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              onClick={handleUpdateComment}
            >
              <span>Update</span>
            </button>
          ) : (
            <button
              className="select-none rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              onClick={handleCommentSubmit}
            >
              <span>Post now</span>
            </button>
          )}
        </form>

        {comments.filter((comnent) => comnent.isActive).length > 0 ? (
          comments
            .filter((comment) => comment.isActive)
            .map((comment) => (
              <article
                key={comment._id}
                className="p-6 mb-3 ml-6 lg:ml-12 text-base bg-white rounded-lg dark:bg-gray-900 border"
              >
                <footer className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                      <img
                        className="mr-2 w-6 h-6 rounded-full"
                        src={comment.photoUser || "../Assets/avatar.png"}
                        alt="Jese Leos"
                      />
                      {comment.username}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <time
                        dateTime={comment.timestamp}
                        title={new Date(comment.timestamp).toDateString()}
                      >
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </time>
                    </p>
                  </div>
                  <div className="relative">
                    <button
                      id="dropdownComment2Button"
                      data-dropdown-toggle="dropdownComment2"
                      className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-40 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                      type="button"
                      onClick={() => handleToggleDropdown(comment._id)}
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 3"
                      >
                        <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                      </svg>
                      <span className="sr-only">Comment settings</span>
                    </button>
                    <div
                      id="dropdownComment2"
                      className={`z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 absolute top-10 ${
                        openDropdownId === comment._id ? "block" : "hidden"
                      }`}
                    >
                      <ul
                        className="py-1 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownMenuIconHorizontalButton"
                      >
                        <li>
                          <button
                            className="block w-full text-left py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => handleEditComment(comment._id)}
                          >
                            Edit
                          </button>
                        </li>
                        <li>
                          <button
                            className="block w-full text-left py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            Remove
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </footer>

                <Rating value={comment.rating} readonly />
                <p className="text-gray-500 dark:text-gray-400">
                  {comment.commentText}
                </p>
              </article>
            ))
        ) : (
          <h2 className="text-center text-gray-500">No comments</h2>
        )}
      </div>
    </section>
  );
};

export default Comment;
