import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../Context/CartContext'
import toast from 'react-hot-toast'
import { userContetx } from '../Context/Usercontext'
import Spinner from '../Spinner/Spinner'

export default function ShowComponent() {
    const [isFavorite, setIsFavorite] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const {
        numOfCartItems,
        setNumOfCartItems,
        numOfFavoriteItems,
        setNumOfFavoriteItems,
        getLoggedWishList,
        setWishListDetails,
        addToCart,
        addToWishList,
        wishListDetails,
        removeItemFromWishList,
    } = useContext(CartContext);

    // CHANGED: addproducttocart now sets numOfCartItems from the API response
    // instead of manually doing numOfCartItems + 1.
    // This keeps the counter always in sync with the real cart data.
    async function addproducttocart(product_Id) {
        try {
            const userToken = localStorage.getItem("usertoken");
            if (!userToken) {
                toast.error("You need to log in first!");
                return;
            }

            let response = await addToCart(product_Id);

            if (response?.data?.status === "success") {
                toast.success("Product is added to cart!");
                // Use the count returned by the API — not a manual +1
                setNumOfCartItems(response.data.numOfCartItems);
            } else {
                toast.error("Error adding product to cart");
            }
        } catch (error) {
            console.error("Error adding cart:", error);
        }
    }

    async function addwishlist(product_Id) {
        try {
            const userToken = localStorage.getItem("usertoken");
            if (!userToken) {
                toast.error("You need to log in first!");
                return;
            }

            let response = await addToWishList(product_Id);

            if (response?.data?.status === 'success') {
                toast.success("Product is added to wishlist!");
                getWishListInfo();
                setNumOfFavoriteItems(response.data.count || numOfFavoriteItems + 1);
            } else {
                toast.error(response?.response?.data?.message || "Error adding product to wishlist");
            }
        } catch (error) {
            toast.error("Error adding product to wishlist");
            console.error("[ShowComponent] addwishlist failed:", error);
        }
    }

    async function deleteProductFromWishList(product_Id) {
        let res = await removeItemFromWishList(product_Id);
        if (res?.data?.status === 'success') {
            setIsFavorite(false);
            toast.success('Item removed Successfully');
            getWishListInfo();
        } else {
            toast.error('Failed to remove item from wishlist');
            console.error('[ShowComponent] deleteProductFromWishList failed:', res?.response?.data?.message || 'Unknown error');
        }
    }

    function getProducts() {
        setLoading(true);
        axios.get(`https://ecommerce.routemisr.com/api/v1/products`)
            .then(({ data }) => {
                setProducts(data.data);
                setError(null);
            })
            .catch((err) => {
                console.error('[ShowComponent] Failed to fetch products:', err.response?.data?.message || err.message);
                setError('Failed to load products.');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    async function getWishListInfo() {
        let res = await getLoggedWishList();
        if (res?.data?.status === 'success') {
            setNumOfFavoriteItems(res?.data?.count);
            setWishListDetails(res?.data?.data);
        } else {
            setNumOfFavoriteItems(0);
        }
    }

    useEffect(() => {
        getProducts();
    }, []);

    if (loading) return <Spinner />;

    if (error) {
        return (
            <div className="container px-10 text-center py-8">
                <p className="text-red-600 text-lg">{error}</p>
                <button onClick={getProducts} className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="container px-10">
            <div className="row flex flex-wrap py-8 items-center">
                {products.map((product) => (
                    <div key={product.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 px-2 py-5">
                        <div className="product">
                            <Link to={`/Productdetails/${product.id}/${product.category.name}`} key={product.id}>
                                <img className='w-full' src={product.imageCover} alt={product.name} />
                                <h2>{product.name}</h2>
                                <p>{product.category.name}</p>
                                <div className="info flex flex-row justify-between items-center">
                                    <p className='text-xl font-normal text-gray-800 mb-4'>{product.title.split(' ').splice(0, 2).join(' ')}</p>
                                    <Link
                                        style={{ color: isFavorite ? '#dc3545' : '#bdbdbd' }}
                                        onClick={() =>
                                            isFavorite ? deleteProductFromWishList(product._id) : addwishlist(product._id)
                                        }
                                        className='heart text-2xl p-2'>
                                        <i className="fa-solid fa-heart text-gray-300 hover:text-[#dc3545] focus:text-[#dc3545]"></i>
                                    </Link>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p>{product.price} EGP</p>
                                    <p>{product.ratingsAverage} <i className="fas fa-star text-yellow-500"></i></p>
                                </div>
                            </Link>
                            {/* UNCHANGED UI: same button, now correctly wired to addproducttocart */}
                            <button
                                onClick={() => addproducttocart(product.id)}
                                className='btn px-4 py-2 w-full rounded-lg text-white bg-green-600 btn-primary'>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}