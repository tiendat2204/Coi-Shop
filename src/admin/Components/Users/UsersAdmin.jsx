import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../../redux/notificationSlice";
import { getAllUsers, updateUserStatus } from "../../../api/usersApi";
import { Switch } from "@material-tailwind/react";

const UsersAdmin = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);


  const fetchUsers = async () => {
    try {
      const usersResponse = await getAllUsers();
      setUsers(usersResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
      dispatch(
        showNotification({
          message: "Failed to fetch users",
          type: "error",
        })
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const refreshUsers = () => {
    fetchUsers();
  };
  const handleStatusChange = async (userId, newStatus) => {
    await updateStatusUser(userId, newStatus);
  };

  const updateStatusUser = async (userId, newStatus) => {
    try {
      const response = await updateUserStatus(userId, newStatus);
      if (response.status === 200) {
        dispatch(
          showNotification({
            message: "User status updated successfully",
            type: "success",
          })
        );
        refreshUsers();
      } else {
        dispatch(
          showNotification({
            message: "Failed to update user status",
            type: "error",
          })
        );
      }
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error updating user status: ${error.message}`,
          type: "error",
        })
      );
    }
  };

  return (
    <div className="relative flex flex-col w-full h-auto text-gray-700 bg-white shadow-md rounded-xl bg-clip-border border-2">
      <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white rounded-none bg-clip-border h-auto">
        <div className="flex flex-col justify-between gap-8 mb-4 md:flex-row md:items-center">
          <div>
            <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              Users
            </h5>
            <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
              Manage your users here
            </p>
          </div>
          <div className="flex w-full gap-2 shrink-0 md:w-max">
            <button className="select-none rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
              Add User
            </button>
          </div>
        </div>
      </div>
      <div className="p-6 px-0 overflow-scroll">
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Name
                </p>
              </th>
              <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Email
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
            {users.map((user) => (
              <tr key={user._id}>
                <td className="p-4 border-b border-blue-gray-50">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.photo || "../Assets/avatar.png"}
                      alt="User"
                      className="relative inline-block h-16 w-16 !rounded-full border border-blue-gray-50 bg-blue-gray-50/50 object-contain object-center p-1"
                    />
                    <p className="block font-sans text-sm antialiased font-bold leading-normal text-blue-gray-900 truncate w-auto">
                      {user.name}
                    </p>
                  </div>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 truncate w-auto">
                    {user.email}
                  </p>
                </td>

                <td className="p-4 border-b border-blue-gray-50">
                  <div className="w-max">
                    <div
                      className={`relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap ${
                        user.status === "inactive"
                          ? "bg-red-500/20 text-red-900"
                          : "bg-green-500/20 text-green-900"
                      }`}
                    >
                      <span>{user.status}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <div className="flex justify-center items-center h-full">
                    <Switch
                      label="Status User"
                      checked={user.status === "active"}
                      onChange={() =>
                        handleStatusChange(
                          user._id,
                          user.status === "active" ? "inactive" : "active"
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

export default UsersAdmin;
