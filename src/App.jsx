import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './component/Layout/Layout'
import Home from './component/Home/Home'
import Cart from './component/Cart/Cart'
import Product from './component/Product/Product'
import Brands from './component/Brands/Brands'
import Categoris from './component/categoris/categoris'
import Login from './component/Login/Login'
import Register from './component/register/register';
import Productdetails from './component/Productdetails/Productdetails'
import CartContextprovider from './component/Context/CartContext'
import { Toaster } from 'react-hot-toast'
import { Usercontextprovider } from './component/Context/Usercontext'
import Protectedroute from './component/Protectedroute/Protectedroute'
import Products from './component/Products/Products'
import Spinner from './component/Spinner/Spinner'
import CheckOut from './component/CheckOut/CheckOut'
import NOfount from './component/NOfount/NOfount'
import WishList from './component/Wishlist/Wishlist'
import ChatWidget from './component/CatWidget/ChatWidget'

export default function App() {
    let x = createBrowserRouter([
        {
            path: '', element: <Layout />, children: [
                { index: true, element: <Protectedroute><Home /></Protectedroute> },
                { path: 'cart', element: <Protectedroute><Cart /></Protectedroute> },
                { path: 'Product', element: <Protectedroute><Product /></Protectedroute> },
                { path: 'Brands', element: <Protectedroute> <Brands /></Protectedroute> },
                { path: 'Categoris', element: <Protectedroute><Categoris /> </Protectedroute> },
                { path: 'Login', element: <Login /> },
                { path: 'Productdetails/:id/:category', element: <Protectedroute><Productdetails /></Protectedroute> },
                { path: 'register', element: <Register /> },
                { path: 'Products', element: <Protectedroute><Products /> </Protectedroute> },
                { path: 'CheckOut', element: <Protectedroute><CheckOut /> </Protectedroute> },
                { path: 'WishList', element: <Protectedroute><WishList /> </Protectedroute> },
                { path: '*', element: <Protectedroute><NOfount /></Protectedroute> },
            ]
        }
    ])
    return <>

        <Usercontextprovider>
            <CartContextprovider>
                <RouterProvider router={x}></RouterProvider>
                <Toaster />
            </CartContextprovider>
        </Usercontextprovider>
        <ChatWidget />
    </>

}
