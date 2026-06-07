import { useContext, useEffect, useState } from "react";
import empty from '../../assets/Images/WishList.svg';
import { CartContext } from "../Context/CartContext";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet';
import Spinner from "../Spinner/Spinner";
import toast from 'react-hot-toast';
import { useAddToCart } from '../../Hooks/useAddToCart';
import { useAuthGuard } from '../../Hooks/useAuthGuard';
import ProductCard from '../ProductCard/ProductCard';

export default function WishList() {
    const [isLoading, setIsLoading] = useState(false);

    let {
        getLoggedWishList,
        removeItemFromWishList,
        setNumOfFavoriteItems,
        setWishListDetails,
        wishListDetails,
    } = useContext(CartContext);

    const { addProductToCart } = useAddToCart();
    const { handleExpiredToken } = useAuthGuard();

    async function getWishList() {
        setIsLoading(true);
        let res = await getLoggedWishList();
        if (res?.data?.status === 'success') {
            setWishListDetails(res.data.data);
            setNumOfFavoriteItems(res.data.count);
        } else if (handleExpiredToken(res)) {
            // handled by hook
        }
        setIsLoading(false);
    }

    async function deleteItem(productId) {
        let res = await removeItemFromWishList(productId);
        if (res?.data?.status === 'success') {
            setNumOfFavoriteItems(res.data.count);
            toast.success('Item removed successfully');
            getWishList();
        } else if (!handleExpiredToken(res)) {
            toast.error("Failed to remove item");
        }
    }

    useEffect(() => {
        getWishList();
    }, []);

    return (
        <>
            <Helmet>
                <title>Wish List</title>
            </Helmet>

            {isLoading ? (
                <Spinner />
            ) : (
                wishListDetails !== null && wishListDetails?.length > 0 ? (
                    <div className="p-10">
                        <h2 className="mt-[4%] text-center text-2xl font-bold">Wish List</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-main-light p-4 my-4">
                            {wishListDetails?.map((product) => (
                                <div key={product._id} className="p-4 bg-white shadow-md rounded-lg">
                                    <ProductCard product={product} onAddToCart={addProductToCart}>
                                        <div className="flex justify-between items-center mt-2">
                                            <Link onClick={() => deleteItem(product._id)} className='p-2'>
                                                <i className="fa-solid fa-heart-circle-xmark fa-2xl text-red-500"></i>
                                            </Link>
                                        </div>
                                    </ProductCard>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className='flex justify-center items-center h-screen'>
                        <img className='max-w-md w-full' src={empty} alt="Empty Wishlist" />
                    </div>
                )
            )}
        </>
    );
}
