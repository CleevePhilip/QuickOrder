import React from "react";
import Sidebar from "./Sidebar";

const Drawer = ({ children }) => {
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col ">
          {/* Page content here */}
          {children}
        </div>
        <Sidebar />
      </div>
    </>
  );
};

export default Drawer;
