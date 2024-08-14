import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineDashboard } from "react-icons/ai";
import { BiFoodMenu } from "react-icons/bi";
import { LuUsers } from "react-icons/lu";
import { MdOutlineCategory } from "react-icons/md";
import { MdOutlineSettings } from "react-icons/md";
const Sidebar = () => {
  return (
    <div className="drawer-side">
      <label
        htmlFor="my-drawer-2"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
        <li>
          <Link to="/dashboard">
            <AiOutlineDashboard className="text-xl" />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/dashboard/menu">
            <BiFoodMenu className="text-xl" />
            Menus
          </Link>
        </li>{" "}
        <li>
          <Link to="/dashboard/category">
            <MdOutlineCategory className="text-xl" />
            Category
          </Link>
        </li>
        <li>
          <Link to="/dashboard/employee">
            <LuUsers className="text-xl" />
            Employee
          </Link>
        </li>{" "}
        <li>
          <Link to="/dashboard">
            <MdOutlineSettings className="text-xl" />
            Settings
          </Link>
        </li>{" "}
      </ul>
    </div>
  );
};

export default Sidebar;
