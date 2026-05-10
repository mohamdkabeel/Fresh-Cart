import React, { useState, useEffect } from "react";
// import logo from "../../assets/Images/product-icon.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { userContetx } from "../Context/Usercontext";
import { CartContext } from "../Context/CartContext";

export default function Navbar() {
    let { numOfCartItems, numOfFavoriteItems, setNumOfFavoriteItems } = useContext(CartContext);
    let { userlogin, setuserlogin } = useContext(userContetx);

    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const userToken = localStorage.getItem("usertoken");

    function logOut() {
        localStorage.removeItem("usertoken");
        localStorage.removeItem("userinfo");
        setuserlogin(null);
        navigate("/Login");
        setNumOfFavoriteItems(0);
    }

    return (
        <>
            <nav className="bg-gray-100 fixed top-0 left-0 right-0 z-10 shadow-md">
                <div className="container mx-auto flex justify-between items-center p-4">
                    <Link to={"/"}>
                        {/* <img width={150} src={logo} alt="Fresh Cart Logo" /> */}
                    </Link>

                    <button
                        className="md:hidden text-2xl"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? "✖" : "☰"}
                    </button>

                    {userToken && (
                        <ul
                            className={`${menuOpen ? "block" : "hidden"
                                } md:flex flex-col md:flex-row absolute md:static top-16 left-0 w-full md:w-auto bg-gray-100 md:bg-transparent text-center md:text-left transition-all duration-300`}
                        >
                            <li className="py-2 md:py-0 md:px-5">
                                <Link to={""}>Home</Link>
                            </li>
                            <li className="py-2 md:py-0 md:px-5">
                                <Link to={"Cart"}>Cart</Link>
                            </li>
                            <li className="py-2 md:py-0 md:px-5">
                                <Link to={"Products"}>Products</Link>
                            </li>
                            <li className="py-2 md:py-0 md:px-5">
                                <Link to={"Brands"}>Brands</Link>
                            </li>
                        </ul>
                    )}

                    <div className="flex items-center ">
                        {userToken && (
                            <ul className="hidden md:flex items-center">
                                <li className="px-3">
                                    <i className="fa-brands fa-facebook cursor-pointer font-bold"></i>
                                </li>
                                <li className="px-3">
                                    <i className="fa-brands fa-instagram cursor-pointer font-bold"></i>
                                </li>
                                <li className="px-3">
                                    <i className="fa-brands fa-twitter cursor-pointer font-bold"></i>
                                </li>
                                <li className="px-3">
                                    <i className="fa-brands fa-tiktok cursor-pointer font-bold"></i>
                                </li>
                                <li className="px-3">
                                    <Link to={"/Wishlist"} className="relative cursor-pointer font-bold">
                                        <span className="absolute top-0 left-0 bg-red-500 text-white text-xs rounded-full px-1">
                                            {numOfFavoriteItems}
                                        </span>
                                        <i className="fa-solid text-2xl fa-heart text-red-500"></i>
                                    </Link>
                                </li>
                                <li className="px-3">
                                    <Link to={"/Cart"} className="relative cursor-pointer font-bold">
                                        <span className="absolute top-0 left-0 bg-green-500 text-white text-xs rounded-full px-1">
                                            {numOfCartItems}
                                        </span>
                                        <i className="fa-solid text-2xl fa-cart-shopping text-green-500"></i>
                                    </Link>
                                </li>
                            </ul>
                        )}

                        <div className="pl-5">
                            {!userToken ? (
                                <>
                                    <Link to={"Login"} className="px-2">
                                        Login
                                    </Link>
                                    <Link to={"register"} className="px-2">
                                        Register
                                    </Link>
                                </>
                            ) : (
                                <span className="cursor-pointer pl-5" onClick={logOut}>
                                    Logout
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
