import axios from "axios";
import { createContext, useEffect, useState } from "react";

export let CartContext = createContext();

export default function CartContextProvider(props) {

    // Returns fresh headers on every call so the token is never stale
    function getHeaders() {
        return { token: localStorage.getItem('usertoken') };
    }

    // ----------->> Cart <<-----------

    const [cartId, setCartId] = useState(null);
    const [numOfCartItems, setNumOfCartItems] = useState(0);

    // ----------->> Wish List <<-----------
    // Declared here (above useEffect) so getLoggedWishList is defined before it's called
    const [numOfFavoriteItems, setNumOfFavoriteItems] = useState(0);
    const [wishListDetails, setWishListDetails] = useState([]);

    async function getLoggedWishList() {
        return axios.get(
            `https://ecommerce.routemisr.com/api/v1/wishlist`,
            { headers: getHeaders() }
        ).then((res) => res).catch((error) => error);
    }

    async function addToWishList(product_Id) {
        return axios.post(
            `https://ecommerce.routemisr.com/api/v1/wishlist`,
            { productId: product_Id },
            { headers: getHeaders() }
        ).then((res) => res).catch((error) => error);
    }

    async function removeItemFromWishList(product_Id) {
        return axios.delete(
            `https://ecommerce.routemisr.com/api/v1/wishlist/${product_Id}`,
            { headers: getHeaders() }
        ).then((res) => res).catch((error) => error);
    }

    // CHANGED: Now fetches BOTH cart count AND wishlist count on app load.
    // Previously only cart was fetched, so the heart counter was always 0 after refresh.
    useEffect(() => {
        const userToken = localStorage.getItem('usertoken');
        if (userToken) {
            // Sync cart counter with real API data
            getLoggedUserCart().then((res) => {
                if (res?.data?.status === 'success') {
                    setNumOfCartItems(res.data.numOfCartItems);
                    setCartId(res.data.data._id);
                }
            });

            // ADDED: Sync wishlist counter and data with real API data on load
            getLoggedWishList().then((res) => {
                if (res?.data?.status === 'success') {
                    setNumOfFavoriteItems(res.data.count);
                    setWishListDetails(res.data.data);
                }
            });
        }
    }, []);

    // ----------->> Cart Functions <<-----------

    async function addToCart(product_Id) {
        return axios.post(
            `https://ecommerce.routemisr.com/api/v1/cart`,
            { productId: product_Id },
            { headers: getHeaders() }
        ).then((res) => res).catch((error) => error);
    }

    async function getLoggedUserCart() {
        return axios.get(
            `https://ecommerce.routemisr.com/api/v1/cart`,
            { headers: getHeaders() }
        ).then((res) => res).catch((error) => error);
    }

    async function removeItemFromCart(product_Id) {
        return axios.delete(
            `https://ecommerce.routemisr.com/api/v1/cart/${product_Id}`,
            { headers: getHeaders() }
        ).then((res) => res).catch((error) => error);
    }

    async function updateProductCount(product_Id, count) {
        return axios.put(
            `https://ecommerce.routemisr.com/api/v1/cart/${product_Id}`,
            { count: count },
            { headers: getHeaders() }
        ).then((res) => res).catch((error) => error);
    }

    async function onlinePayment(cartId, shippingAddress) {
        const url = `${window.location.protocol}//${window.location.host}`;
        return axios.post(
            `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${url}`,
            { shippingAddress: shippingAddress },
            { headers: getHeaders() }
        ).then((res) => res).catch((error) => error);
    }

    async function cashPayment(cartId, shippingAddress) {
        return axios.post(
            `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
            { shippingAddress: shippingAddress },
            { headers: getHeaders() }
        ).then((res) => res).catch((error) => error);
    }

    async function removeCart() {
        return axios.delete(
            `https://ecommerce.routemisr.com/api/v1/cart`,
            { headers: getHeaders() }
        ).then((res) => res).catch((error) => error);
    }

    async function getLoggedUserOrders(userId) {
        return axios.get(
            `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`
        ).then((res) => res).catch((error) => error);
    }

    return (
        <CartContext.Provider value={{
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
        }}>
            {props.children}
        </CartContext.Provider>
    );
}