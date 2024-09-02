import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../../redux/notificationSlice";
import { Rating, Switch } from "@material-tailwind/react";
import { getAllComments, updateCommentStatus } from "../../../api/productApi";
import { Link, useNavigate } from "react-router-dom";
const CommentsAdmin = () => {
  const dispatch = useDispatch();
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const fetchComments = async () => {
    try {
      const commentsResponse = await getAllComments();
      setComments(commentsResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
      dispatch(
        showNotification({
          message: "Failed to fetch comments",
          type: "error",
        })
      );
    }
  };

  useEffect(() => {
    fetchComments();
  }, );

  const refreshComments = () => {
    fetchComments();
  };

  const handleStatusChange = async (commentId, newStatus) => {
    await updateCommentStatusVip(commentId, newStatus);
  };

  const updateCommentStatusVip = async (commentId, newStatus) => {
    try {
      const response = await updateCommentStatus(commentId, newStatus);
      if (response.status === 200) {
        dispatch(
          showNotification({
            message: "Comment status updated successfully",
            type: "success",
          })
        );
        refreshComments();
      } else {
        dispatch(
          showNotification({
            message: "Failed to update comment status",
            type: "error",
          })
        );
      }
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error updating comment status: ${error.message}`,
          type: "error",
        })
      );
    }
  };
  const handleProductClick = (e, productId) => {
    e.preventDefault(); 
    navigate(`/admin/products/${productId}`);
  };
  return (
    <div className="relative flex flex-col w-full h-auto text-gray-700 bg-white shadow-md rounded-xl bg-clip-border border-2">
      <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white rounded-none bg-clip-border h-auto">
        <div className="flex flex-col justify-between gap-8 mb-4 md:flex-row md:items-center">
          <div>
            <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              Comments
            </h5>
            <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
              Manage your comments here
            </p>
          </div>
        </div>
      </div>
      <div className="p-6 px-0 overflow-scroll">
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Username
                </p>
              </th>
              <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Comment
                </p>
              </th>
              <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Product
                </p>
              </th>
              <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70 text-center">
                  Rating
                </p>
              </th>
              <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Status
                </p>
              </th>
              <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70 text-center">
                  Action
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment._id}>
                <td className="p-4 border-b border-blue-gray-50">
                  <div className="flex items-center gap-3">
                    <img
                      src={comment.photoUser || "../Assets/avatar.png"}
                      alt="User"
                      className="relative inline-block h-16 w-16 !rounded-full border border-blue-gray-50 bg-blue-gray-50/50 object-contain object-center p-1"
                    />
                    <p className="block font-sans text-sm antialiased font-bold leading-normal text-blue-gray-900 truncate w-auto">
                      {comment.username}
                    </p>
                  </div>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <Link
                    href="#"
                    onClick={(e) => handleProductClick(e, comment.productId)}
                    className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 truncate w-auto  hover:underline"
                  >
                    {comment.productId}
                  </Link>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 truncate w-auto">
                    {comment.commentText}
                  </p>
                </td>
                <td
                  className="
                p-4 border-b border-blue-gray-50 text-center"
                >
                  <Rating value={comment.rating} readonly />
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <div className="w-max">
                    <div
                      className={`relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap ${
                        comment.isActive
                          ? "bg-green-500/20 text-green-900"
                          : "bg-red-500/20 text-red-900"
                      }`}
                    >
                      <span>{comment.isActive ? "Active" : "Inactive"}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <div className="flex justify-center items-center h-full">
                    <Switch
                      label="Status Comment"
                      checked={comment.isActive}
                      onChange={() =>
                        handleStatusChange(
                          comment._id,
                          comment.isActive ? false : true
                        )
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommentsAdmin;
