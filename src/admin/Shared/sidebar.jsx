import React from "react";
import { Link } from "react-router-dom"; // Import Link
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { logoutUser } from "../../api/usersApi";

export function Sidebar() {
  const logout = () => {
    localStorage.removeItem("accessToken");
    logoutUser();
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };
  return (
    <Card className="h-full w-full !max-w-[15rem] p-4 shadow-xl shadow-blue-gray-900/5 border-r fixed left-0 top-0 bg-gray-900 rounded-none ">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="white">
          Coi Shop
        </Typography>
      </div>
      <List className="text-white ">
        <Link to="/admin" className="hover:underline flex ">
          <ListItem className="!w-3/4">
            <ListItemPrefix>
              <PresentationChartBarIcon className="h-5 w-5" />
            </ListItemPrefix>
            Dashboard
          </ListItem>
        </Link>
        <Link to="/admin/products" className="hover:underline flex">
          <ListItem className="!w-3/4">
            <ListItemPrefix>
              <ShoppingBagIcon className="h-5 w-5" />
            </ListItemPrefix>
            Product
          </ListItem>
        </Link>
        <Link to="/admin/category" className="hover:underline flex">
          <ListItem className="!w-3/4">
            <ListItemPrefix>
              <InboxIcon className="h-5 w-5" />
            </ListItemPrefix>
            Category
          </ListItem>
        </Link>
        <Link to="/admin/users" className="hover:underline flex">
          <ListItem className="!w-3/4">
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            Users
          </ListItem>
        </Link>
        <Link to="/admin/orders" className="hover:underline flex">
          <ListItem className="!w-3/4">
            <ListItemPrefix>
              <ShoppingBagIcon className="h-5 w-5" />
            </ListItemPrefix>
            Orders
          </ListItem>
        </Link>
        <Link to="/admin/comments" className="hover:underline flex">
          <ListItem className="!w-3/4">
            <ListItemPrefix>
              <ShoppingBagIcon className="h-5 w-5" />
            </ListItemPrefix>
            Comments
          </ListItem>
        </Link>
        <Link
          to="#"
          className="hover:underline flex"
          onClick={(e) => {
            e.preventDefault();
            logout();
          }}
        >
          <ListItem className="!w-3/4">
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>
            Log Out
          </ListItem>
        </Link>
      </List>
    </Card>
  );
}
