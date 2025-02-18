
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";



export let CartContext = createContext();

export default function CartContextProvider(props) {

    let headers = {
        token: localStorage.getItem('usertoken'),
    }

    // ----------->> Cart <<----------- 

    const [cartId, setCartId] = useState(null);
    const [numOfCartItems, setNumOfCartItems] = useState(0);

    async function addToCart(product_Id) {
        return axios.post(`https://ecommerce.routemisr.com/api/v1/cart`,
            {
                productId: product_Id
            },
            {
                headers: headers
            }).then((res) => res).catch((error) => error);
    }

    async function getLoggedUserCart() {
        return axios.get(`https://ecommerce.routemisr.com/api/v1/cart`, { headers })
            .then((res) => res)
            .catch((error) => error);
    }

    async function removeItemFromCart(product_Id) {
        return axios.delete(`https://ecommerce.routemisr.com/api/v1/cart/${product_Id}`, { headers })
            .then((res) => res)
            .catch((error) => error);
    }

    async function updateProductCount(product_Id, count) {
        return axios.put(`https://ecommerce.routemisr.com/api/v1/cart/${product_Id}`, {
            count: count,
        }, { headers })
            .then((res) => res)
            .catch((error) => error);
    }

    async function onlinePayment(cartId, shippingAddress) {
        const url = `${window.location.protocol}//${window.location.host}`;
        console.log(url);
        return axios.post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${url}`, {
            shippingAddress: shippingAddress,
        }, { headers })
            .then((res) => res)
            .catch((error) => error);
    }

    async function cashPayment(cartId, shippingAddress) {
        return axios.post(`https://ecommerce.routemisr.com/api/v1/orders/${cartId}`, {
            shippingAddress: shippingAddress,
        }, { headers })
            .then((res) => res)
            .catch((error) => error);
    }

    async function removeCart() {
        return axios.delete(`https://ecommerce.routemisr.com/api/v1/cart`, { headers })
            .then((res) => res)
            .catch((error) => error);
    }

    async function getLoggedUserOrders(userId) {
        return axios.get(`https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`)
            .then((res) => res)
            .catch((error) => error);
    }






    // ----------->> Wish List <<-----------

    const [numOfFavoriteItems, setNumOfFavoriteItems] = useState(0);
    const [wishListDetails, setWishListDetails] = useState([]);

    async function getLoggedWishList() {
        return axios.get(`https://ecommerce.routemisr.com/api/v1/wishlist`, { headers })
            .then((res) => res)
            .catch((error) => error);
    }
    async function addToWishList(product_Id) {
        return axios.post(`https://ecommerce.routemisr.com/api/v1/wishlist`,
            {
                productId: product_Id
            },
            {
                headers: headers
            }).then((res) => res).catch((error) => error);

    }

    async function removeItemFromWishList(product_Id) {
        return axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${product_Id}`, { headers })
            .then((res) => res)
            .catch((error) => error);
    }



    return <CartContext.Provider value={{
        cartId,
        setCartId,
        numOfCartItems,
        setNumOfCartItems,
        addToCart,
        getLoggedUserCart,
        removeItemFromCart,
        updateProductCount,
        onlinePayment,
        cashPayment,
        removeCart,
        getLoggedUserOrders,
        wishListDetails,
        setWishListDetails,
        numOfFavoriteItems,
        setNumOfFavoriteItems,
        getLoggedWishList,
        addToWishList,
        removeItemFromWishList,
        // checklogin,
        // userlogin,

    }} >
        {props.children}
    </CartContext.Provider>
}