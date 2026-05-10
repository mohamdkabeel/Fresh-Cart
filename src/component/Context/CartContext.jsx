import axios from "axios";
import { createContext, useEffect, useState } from "react";

export let CartContext = createContext();

export default function CartContextProvider(props) {

    function getHeaders() {
        return { token: localStorage.getItem('usertoken') };
    }

    // ----------->> Cart State <<-----------

    const [cartId, setCartId] = useState(null);
    const [numOfCartItems, setNumOfCartItems] = useState(0);

    // ADDED: cartDetails now lives in context (not inside Cart.jsx local state).
    // This is the fix — when any page calls addToCart, it updates cartDetails here,
    // and Cart.jsx reads from context so it reflects changes instantly.
    const [cartDetails, setCartDetails] = useState(null);

    // ----------->> Wishlist State <<-----------

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

    // ----------->> Cart Functions <<-----------

    async function getLoggedUserCart() {
        return axios.get(
            `https://ecommerce.routemisr.com/api/v1/cart`,
            { headers: getHeaders() }
        ).then((res) => res).catch((error) => error);
    }

    // CHANGED: addToCart now also updates cartDetails in context after a successful add.
    // Before: it only returned the response and left cartDetails untouched.
    // Now: Cart.jsx reads cartDetails from context, so it updates instantly.
    async function addToCart(product_Id) {
        let res = await axios.post(
            `https://ecommerce.routemisr.com/api/v1/cart`,
            { productId: product_Id },
            { headers: getHeaders() }
        ).then((res) => res).catch((error) => error);

        // If successful, sync cartDetails and counter in context
        if (res?.data?.status === 'success') {
            setCartDetails(res.data.data);
            setNumOfCartItems(res.data.numOfCartItems);
            setCartId(res.data.data._id);
        }

        return res; // still return the response so callers can show toast
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

    // Fetch cart + wishlist on app load so counters are correct after refresh
    useEffect(() => {
        const userToken = localStorage.getItem('usertoken');
        if (userToken) {
            getLoggedUserCart().then((res) => {
                if (res?.data?.status === 'success') {
                    setNumOfCartItems(res.data.numOfCartItems);
                    setCartId(res.data.data._id);
                    // ADDED: also populate cartDetails on load
                    setCartDetails(res.data.data);
                }
            });

            getLoggedWishList().then((res) => {
                if (res?.data?.status === 'success') {
                    setNumOfFavoriteItems(res.data.count);
                    setWishListDetails(res.data.data);
                }
            });
        }
    }, []);

    return (
        <CartContext.Provider value={{
            cartId,
            setCartId,
            numOfCartItems,
            setNumOfCartItems,
            cartDetails,        // ADDED to context value
            setCartDetails,     // ADDED to context value
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