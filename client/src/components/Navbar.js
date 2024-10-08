import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { logout, profile } = useContext(AuthContext);

  const handleLogout = async () => {
    const response = await logout();
    if (response) {
      console.log("Logout successfully");
    }
  };

  return (
    <>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden"
          >
            &#9776;
          </label>{" "}
          <a className="btn btn-ghost text-xl ml-2">OMS</a>
          {profile && (
            <p>
              {profile.user_id} - {profile.username}
            </p>
          )}
        </div>
        <div className="flex-none gap-2">
          <div className="form-control">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto"
            />
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
