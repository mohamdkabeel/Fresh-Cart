// ─────────────────────────────────────────────────────────────
//  useAddToCart — Custom Hook
//
//  Encapsulates the "add to cart" side-effect pipeline:
//    1. Calls the CartContext addToCart API helper
//    2. Emits Observer events that any subscriber can react to
//    3. Keeps the component itself free of toast / counter logic
//
//  Observer events emitted
//  ───────────────────────
//  'cartUpdated'  → { numOfCartItems }   (on success)
//  'cartError'    → { error }            (on failure)
// ─────────────────────────────────────────────────────────────

import { useContext } from 'react';
import toast from 'react-hot-toast';
import { CartContext } from '../Context/CartContext';
import CartEventManager from './cartEventManager';

/**
 * @returns {{ addProductToCart: (productId: string) => Promise<void> }}
 */
export function useAddToCart() {
    const { addToCart, setNumOfCartItems } = useContext(CartContext);

    async function addProductToCart(productId) {
        const userToken = localStorage.getItem('usertoken');
        if (!userToken) {
            toast.error('You need to log in first!');
            return;
        }

        try {
            const response = await addToCart(productId);

            if (response?.data?.status === 'success') {
                const numOfCartItems = response.data.numOfCartItems;

                // ── Observer: update counter (subscriber 1) ──────────
                setNumOfCartItems(numOfCartItems);

                // ── Observer: notify all other subscribers ───────────
                CartEventManager.emit('cartUpdated', { numOfCartItems });

                // ── Observer: toast notification (subscriber 2) ──────
                // (CartEventManager has a built-in subscriber registered
                //  in Products.jsx via useEffect — see below — but we
                //  also fire the toast here as the primary UX response.)
                toast.success('Product added to cart!');
            } else {
                CartEventManager.emit('cartError', { error: 'Unexpected response' });
                toast.error('Error adding product to cart');
            }
        } catch (error) {
            CartEventManager.emit('cartError', { error });
            console.error('Error adding to cart:', error);
        }
    }

    return { addProductToCart };
}