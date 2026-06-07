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
        try {
            return await axios.get(
                `https://ecommerce.routemisr.com/api/v1/wishlist`,
                { headers: getHeaders() }
            );
        } catch (error) {
            console.error('[CartContext] getLoggedWishList failed:', error.response?.data?.message || error.message);
            return error;
        }
    }

    async function addToWishList(product_Id) {
        try {
            return await axios.post(
                `https://ecommerce.routemisr.com/api/v1/wishlist`,
                { productId: product_Id },
                { headers: getHeaders() }
            );
        } catch (error) {
            console.error('[CartContext] addToWishList failed:', error.response?.data?.message || error.message);
            return error;
        }
    }

    async function removeItemFromWishList(product_Id) {
        try {
            return await axios.delete(
                `https://ecommerce.routemisr.com/api/v1/wishlist/${product_Id}`,
                { headers: getHeaders() }
            );
        } catch (error) {
            console.error('[CartContext] removeItemFromWishList failed:', error.response?.data?.message || error.message);
            return error;
        }
    }

    // ----------->> Cart Functions <<-----------

    async function getLoggedUserCart() {
        try {
            return await axios.get(
                `https://ecommerce.routemisr.com/api/v1/cart`,
                { headers: getHeaders() }
            );
        } catch (error) {
            console.error('[CartContext] getLoggedUserCart failed:', error.response?.data?.message || error.message);
            return error;
        }
    }

    // CHANGED: addToCart now also updates cartDetails in context after a successful add.
    // Before: it only returned the response and left cartDetails untouched.
    // Now: Cart.jsx reads cartDetails from context, so it updates instantly.
    async function addToCart(product_Id) {
        let res;
        try {
            res = await axios.post(
                `https://ecommerce.routemisr.com/api/v1/cart`,
                { productId: product_Id },
                { headers: getHeaders() }
            );
        } catch (error) {
            console.error('[CartContext] addToCart failed:', error.response?.data?.message || error.message);
            return error;
        }

        // If successful, sync cartDetails and counter in context
        if (res?.data?.status === 'success') {
            setCartDetails(res.data.data);
            setNumOfCartItems(res.data.numOfCartItems);
            setCartId(res.data.data._id);
        }

        return res;
    }

    async function removeItemFromCart(product_Id) {
        try {
            return await axios.delete(
                `https://ecommerce.routemisr.com/api/v1/cart/${product_Id}`,
                { headers: getHeaders() }
            );
        } catch (error) {
            console.error('[CartContext] removeItemFromCart failed:', error.response?.data?.message || error.message);
            return error;
        }
    }

    async function updateProductCount(product_Id, count) {
        try {
            return await axios.put(
                `https://ecommerce.routemisr.com/api/v1/cart/${product_Id}`,
                { count: count },
                { headers: getHeaders() }
            );
        } catch (error) {
            console.error('[CartContext] updateProductCount failed:', error.response?.data?.message || error.message);
            return error;
        }
    }

    async function onlinePayment(cartId, shippingAddress) {
        const url = `${window.location.protocol}//${window.location.host}`;
        try {
            return await axios.post(
                `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${url}`,
                { shippingAddress: shippingAddress },
                { headers: getHeaders() }
            );
        } catch (error) {
            console.error('[CartContext] onlinePayment failed:', error.response?.data?.message || error.message);
            return error;
        }
    }

    async function cashPayment(cartId, shippingAddress) {
        try {
            return await axios.post(
                `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
                { shippingAddress: shippingAddress },
                { headers: getHeaders() }
            );
        } catch (error) {
            console.error('[CartContext] cashPayment failed:', error.response?.data?.message || error.message);
            return error;
        }
    }

    async function removeCart() {
        try {
            return await axios.delete(
                `https://ecommerce.routemisr.com/api/v1/cart`,
                { headers: getHeaders() }
            );
        } catch (error) {
            console.error('[CartContext] removeCart failed:', error.response?.data?.message || error.message);
            return error;
        }
    }

    async function getLoggedUserOrders(userId) {
        try {
            return await axios.get(
                `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`
            );
        } catch (error) {
            console.error('[CartContext] getLoggedUserOrders failed:', error.response?.data?.message || error.message);
            return error;
        }
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