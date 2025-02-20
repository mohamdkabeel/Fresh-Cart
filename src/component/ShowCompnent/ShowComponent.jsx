import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../Context/CartContext'
import toast from 'react-hot-toast'
import { userContetx } from '../Context/Usercontext'
import { Hearts } from "react-loader-spinner";
import styles from '../Wishlist/Wishlist'

export default function ShowComponent() {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setloading] = useState(null)
    const [products, setProducts] = useState([])

    const { numOfCartItems, setNumOfCartItems, numOfFavoriteItems, setNumOfFavoriteItems, getLoggedWishList, setWishListDetails } = useContext(CartContext)
    if (loading) {
        return <Spinner />
    }
    let { addToCart } = useContext(CartContext)
    let { addToWishList } = useContext(CartContext)
    let { wishListDetails } = useContext(CartContext)
    let { removeItemFromWishList } = useContext(CartContext)
    console.log(wishListDetails);

    function checkFavorite() {
        wishListDetails?.forEach(element => {
            if (element?._id == wishListDetails._id) {
                setIsFavorite(false);
            }
        });
    }

    async function addproducttocart(product_Id) {
        try {
            const userToken = localStorage.getItem("usertoken");
            if (!userToken) {
                toast.error("You need to log in first!");
                return;
            }
            let response = await addToCart(product_Id);
            if (response.data.status === "success") {
                toast.success("Product is added to cart!");
                setNumOfCartItems(numOfCartItems + 1);
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
            let { data } = await addToWishList(product_Id);
            if (data.status === 'success') {
                toast.success("Product is added to wishlist!");
                getWishListInfo();
                setNumOfFavoriteItems(numOfFavoriteItems + 1);
            } else {
                toast.error("Error adding product to wishlist");
            }
        } catch (error) {
            console.error("Error adding item to wishlist:", error);
        }
    }

    async function deleteProductFromWishList(product_Id) {
        let res = await removeItemFromWishList(product_Id);
        if (res?.data?.status === 'success') {
            setIsFavorite(false);
            toast.success('Item removed Successfully');
            getWishListInfo();
        } else {
            console.log('error');
        }
    }

    function getProducts() {
        axios.get(`https://ecommerce.routemisr.com/api/v1/products`)
            .then(({ data }) => {
                setProducts(data.data)
            })
            .catch((error) => {
                console.error('error');
            })
    }

    async function getWishListInfo() {
        let res = await getLoggedWishList();
        if (res?.data?.status === 'success') {
            setNumOfFavoriteItems(res?.data?.count);
            setWishListDetails(res?.data?.data);
        } else {
            (res?.response?.data?.message === 'Expired Token. please login again' || res?.request?.statusText === 'Unauthorized') ?
                getOut() : setNumOfFavoriteItems(0);
        }
    }

    useEffect(() => {
        getProducts();
        if (loading) {
            return <Spinner />
        }
        checkFavorite()
    }, [])

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
                                        } className='heart text-2xl p-2'>
                                        <i className="fa-solid fa-heart text-gray-300 hover:text-[#dc3545] focus:text-[#dc3545]"></i>
                                    </Link>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p>{product.price} EGP</p>
                                    <p>{product.ratingsAverage} <i className="fas fa-star text-yellow-500"></i></p>
                                </div>
                            </Link>
                            <button onClick={() => addproducttocart(product.id)} className='btn px-4 py-2 w-full rounded-lg text-white bg-green-600 btn-primary'>Add to Cart</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
