import React, { useState, useEffect } from "react";
// import logo from "../../assets/Images/";
import logo from "../../assets/Images/product-icon.jpg";
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
            <nav className="bg-gray-100 fixed top-0 left-0 right-0 z-10 shadow-sm">
                <div className="container mx-auto flex justify-between items-center px-4 py-1.5">

                    {/* Logo + Brand */}
                    <Link to={"/"} className="flex items-center gap-2">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-16 h-auto object-contain"
                        />

                        <h1 className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-green-500 to-emerald-700 bg-clip-text text-transparent">
                            Baazarna
                        </h1>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-lg"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? "✖" : "☰"}
                    </button>

                    {/* Links */}
                    {userToken && (
                        <ul
                            className={`${menuOpen ? "block" : "hidden"
                                } md:flex flex-col md:flex-row absolute md:static top-12 left-0 w-full md:w-auto bg-gray-100 md:bg-transparent text-center md:text-left transition-all duration-300`}
                        >
                            <li className="py-1 md:py-0 md:px-2 text-sm hover:text-green-600 transition">
                                <Link to={""}>Home</Link>
                            </li>

                            <li className="py-1 md:py-0 md:px-2 text-sm hover:text-green-600 transition">
                                <Link to={"Cart"}>Cart</Link>
                            </li>

                            <li className="py-1 md:py-0 md:px-2 text-sm hover:text-green-600 transition">
                                <Link to={"Products"}>Products</Link>
                            </li>

                            <li className="py-1 md:py-0 md:px-2 text-sm hover:text-green-600 transition">
                                <Link to={"Brands"}>Brands</Link>
                            </li>
                        </ul>
                    )}

                    {/* Right Side */}
                    <div className="flex items-center gap-2">

                        {userToken && (
                            <ul className="hidden md:flex items-center gap-2 text-sm">

                                <li>
                                    <i className="fa-brands fa-facebook cursor-pointer hover:text-blue-600 transition"></i>
                                </li>

                                <li>
                                    <i className="fa-brands fa-instagram cursor-pointer hover:text-pink-500 transition"></i>
                                </li>

                                <li>
                                    <i className="fa-brands fa-twitter cursor-pointer hover:text-sky-500 transition"></i>
                                </li>

                                <li>
                                    <i className="fa-brands fa-tiktok cursor-pointer hover:text-black transition"></i>
                                </li>

                                {/* Wishlist */}
                                <li>
                                    <Link to={"/Wishlist"} className="relative">
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] rounded-full px-1">
                                            {numOfFavoriteItems}
                                        </span>

                                        <i className="fa-solid fa-heart text-base text-red-500"></i>
                                    </Link>
                                </li>

                                {/* Cart */}
                                <li>
                                    <Link to={"/Cart"} className="relative">
                                        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[9px] rounded-full px-1">
                                            {numOfCartItems}
                                        </span>

                                        <i className="fa-solid fa-cart-shopping text-base text-green-500"></i>
                                    </Link>
                                </li>
                            </ul>
                        )}

                        {/* Auth */}
                        <div className="text-sm">
                            {!userToken ? (
                                <>
                                    <Link to={"Login"} className="px-1 hover:text-green-600 transition">
                                        Login
                                    </Link>

                                    <Link to={"register"} className="px-1 hover:text-green-600 transition">
                                        Register
                                    </Link>
                                </>
                            ) : (
                                <span
                                    className="cursor-pointer hover:text-red-500 transition"
                                    onClick={logOut}
                                >
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
