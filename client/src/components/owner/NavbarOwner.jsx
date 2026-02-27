import React from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useSelector } from "react-redux";

const NavbarOwner = () => {
  // const {user} = useAppContext()
  // const user = useSelector((state) => state.user.userData)

  return (
    <div
      className="flex items-center justify-between px-6 md:px-10
     py-4 text-gray-500 border-b border-borderColor relative 
     transition-all"
    >
      <Link to="/">
        <img src={assets.logo} className="h-7" alt="" />
      </Link>
      {/* <p>Welcome , {user?.name || "Owner"}</p> */}
    </div>
  );
};

export default NavbarOwner;
