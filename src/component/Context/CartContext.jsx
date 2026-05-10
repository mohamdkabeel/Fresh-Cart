import axios from "axios";
import { createContext, useEffect, useState } from "react";

export let CartContext = createContext();

export default function CartContextProvider(props) {

    // Headers read fresh on every request so token is always up to date
    function getHeaders() {
        return { token: localStorage.getItem('usertoken') };
    }

    // ----------->> Cart <<-----------

    const [cartId, setCartId] = useState(null);
    // CHANGED: numOfCartItems now starts as 0 but is fetched from API on mount
    const [numOfCartItems, setNumOfCartItems] = useState(0);

    // ADDED: Fetch the real cart count from the API when the app loads.
    // This fixes the bug where the counter always showed 0 after a refresh.
    useEffect(() => {
        const userToken = localStorage.getItem('usertoken');
        if (userToken) {
            getLoggedUserCart().then((res) => {
                if (res?.data?.status === 'success') {
                    // Sync counter with the actual number of items in the cart
                    setNumOfCartItems(res.data.numOfCartItems);
                    setCartId(res.data.data._id);
                }
            });
        }
    }, []);

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

    // ----------->> Wish List <<-----------

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