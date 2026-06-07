import { useContext } from 'react';
import toast from 'react-hot-toast';
import { CartContext } from '../component/Context/CartContext';

export function useAddToWishlist() {
    const { addToWishList, setNumOfFavoriteItems } = useContext(CartContext);

    async function addProductToWishlist(productId) {
        const userToken = localStorage.getItem('usertoken');
        if (!userToken) {
            toast.error('You need to log in first!');
            return;
        }

        try {
            const response = await addToWishList(productId);

            if (response?.data?.status === 'success') {
                toast.success('Product added to wishlist!');
                setNumOfFavoriteItems(response.data.count);
            } else {
                toast.error('Error adding product to wishlist');
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
        }
    }

    return { addProductToWishlist };
}
