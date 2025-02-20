import React, { useContext, useEffect, useState } from 'react'
import { CartContext } from '../Context/CartContext.jsx'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Spinner from '../Spinner/Spinner.jsx';
import empty from '../../assets/Images/Empty-cart.svg';

export default function Cart() {
    let { getLoggedUserCart, removeItemFromCart, updateProductCount, setNumOfCartItems, removeCart } = useContext(CartContext);
    const [cartDetails, setCartDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    let navigate = useNavigate();
    function getOut() {
        localStorage.removeItem('userToken');
        navigate('/');
    }

    async function getCart() {
        setIsLoading(true);
        let res = await getLoggedUserCart();
        if (res?.data?.status === 'success') {
            setCartDetails(res.data.data);
        }
        else {
            if (res?.response?.data?.message == 'Expired Token. please login again') {
                getOut();
            }
        }
        setIsLoading(false);
    }

    async function removeitem(product_Id) {
        let res = await removeItemFromCart(product_Id);
        if (res?.data?.status === 'success') {
            setCartDetails(res.data.data);
            setNumOfCartItems(res?.data?.numOfCartItems);
            toast.success('Item removed Successfuly');
        }
        else {
            (res?.response?.data?.message == 'Expired Token. please login again') ? getOut() : toast.error("Failed to remove item");
        }
    }

    async function updateitems(product_Id, count) {
        let res = await updateProductCount(product_Id, count);
        if (res?.data?.status === 'success') {
            setCartDetails(res.data.data);
            setNumOfCartItems(res?.data?.numOfCartItems);
            toast.success('Quantity updated Successfuly');
        }
        else {
            (res?.response?.data?.message == 'Expired Token. please login again') ? getOut() : toast.error("Failed update quantity");
        }
    }

    async function clearCart() {
        let res = await removeCart();
        if (res?.data?.message === 'success') {
            setCartDetails(null);
            setNumOfCartItems(0);
            toast.success('Cleared Cart Successfuly');
        }
        else {
            (res?.response?.data?.message == 'Expired Token. please login again') ? getOut() : toast.error("Failed Operation");
        }
    }

    useEffect(() => {
        getCart();
        document.title = 'Cart'
    }, []);

    if (isLoading) {
        return <Spinner />
    }

    return <>
        <div className="relative mt-20 md:mt-[5%] overflow-x-auto my-5 shadow-md sm:rounded-lg">
            <table className="w-full mx-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-500 dark:text-gray-100">
                    <tr>
                        <th scope="col" className="px-16 py-3">
                            <span className="sr-only">Image</span>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Product
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Quantity
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Price
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {cartDetails?.products?.map((product) =>
                        <tr key={product.product.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 text-center">
                            <td className="p-4">
                                <img src={product.product.imageCover} className="w-16 md:w-32 max-w-full max-h-full" alt="Product" />
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                {product.product.title}
                            </td>
                            <td className="p-10 flex justify-center items-center mt-10 ">
                                <button onClick={() => updateitems(product.product._id, product.count - 1)} className="p-1 my-auto text-gray-500 bg-white border border-gray-300 rounded-full hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
                                    -
                                </button>
                                <span className="mx-3">{product.count}</span>
                                <button onClick={() => updateitems(product.product._id, product.count + 1)} className="p-1 text-gray-500 bg-white border border-gray-300 rounded-full hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
                                    +
                                </button>
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                {product.price} EGP
                            </td>
                            <td className="p-10 flex flex-col items-center gap-2">
                                <Link to={'/CheckOut'} className='text-white bg-green-700 hover:bg-green-800 px-5 py-2.5 rounded-lg'>CheckOut</Link>
                                <span onClick={() => removeitem(product.product._id)} className="text-red-600 hover:underline cursor-pointer">Remove</span>
                            </td>
                        </tr>)
                    }
                </tbody>
            </table>
            <div className="w-full px-6 py-4 flex items-center justify-center">
                <span onClick={() => clearCart(cartDetails?._id)} className="text-white bg-red-700 hover:bg-red-800 px-5 py-2.5 rounded-lg cursor-pointer">Clear</span>
            </div>
        </div>
    </>
}
