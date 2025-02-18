import { useContext, useEffect, useState } from "react";
import empty from '../../assets/Images/WishList.svg';
import { CartContext } from "../Context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet';
import Spinner from "../Spinner/Spinner";
import toast from 'react-hot-toast';

export default function WishList() {
    const [isLoading, setIsLoading] = useState(false);
    const [favoriteItems, setFavoriteItems] = useState([]);

    let { getLoggedWishList, removeItemFromWishList, setNumOfFavoriteItems, numOfFavoriteItems, setWishListDetails, wishListDetails, addToCart } = useContext(CartContext);
    let navigate = useNavigate();

    function getOut() {
        localStorage.removeItem('userToken');
        navigate('/');
    }

    async function addproducttocartfromwhishlist(product_Id) {
        try {
            const userToken = localStorage.getItem("usertoken");
            if (!userToken) {
                toast.error("You need to log in first!");
                return;
            }
            let response = await addToCart(product_Id);
            if (response.data.status === "success") {
                toast.success("Product is added to cart!");
                setFavoriteItems([...favoriteItems, product_Id]);
            } else {
                toast.error("Error adding product to cart");
            }
        } catch (error) {
            console.error("Error adding cart:", error);
        }
    }

    async function getWishList() {
        setIsLoading(true);
        let res = await getLoggedWishList();
        if (res?.data?.status === 'success') {
            setWishListDetails(res?.data?.data);
            setNumOfFavoriteItems(res?.data?.count);
        } else if (res?.response?.data?.message === 'Expired Token. please login again') {
            getOut();
        }
        setIsLoading(false);
    }

    async function deleteItem(productId) {
        let res = await removeItemFromWishList(productId);
        if (res?.data?.status === 'success') {
            setNumOfFavoriteItems(res?.data?.count);
            toast.success('Item removed successfully');
            getWishList();
        } else {
            res?.response?.data?.message === 'Expired Token. please login again' ? getOut() : toast.error("Failed to remove item");
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
                                    <Link to={`/Productdetails/${product.id}/${product.category.name}`}>
                                        <img className="w-full rounded-lg" src={product.imageCover} alt={product.name} />
                                        <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
                                        <p className="text-gray-500">{product.category.name}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <p className='text-xl font-normal text-gray-800'>{product.title.split(' ').splice(0, 2).join(' ')}</p>
                                            <Link onClick={() => deleteItem(product._id)} className='p-2'>
                                                <i className="fa-solid fa-heart-circle-xmark fa-2xl text-red-500"></i>
                                            </Link>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <p className="font-bold">{product.price} EGP</p>
                                            <p className="flex items-center">{product.ratingsAverage} <i className="fas fa-star text-yellow-500 ml-1"></i></p>
                                        </div>
                                    </Link>
                                    <button onClick={() => addproducttocartfromwhishlist(product.id)} className='w-full mt-3 py-2 text-white bg-green-600 rounded-lg'>Add to Cart</button>
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
