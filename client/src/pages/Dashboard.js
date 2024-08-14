import React from "react";
import Drawer from "../components/Drawer";
import Navbar from "../components/Navbar";
import Content from "../components/Content";
import DashboardContent from "./dashboardContents/DashboardContent";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
      <Drawer>
        <Navbar />
        <Content>
          <Outlet />
        </Content>
      </Drawer>
    </>
  );
};

export default Dashboard;
