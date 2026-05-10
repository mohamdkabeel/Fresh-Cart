import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import empty from '../../assets/Images/NoProducts.svg';
import Spinner from '../Spinner/Spinner';
// ADDED: Import CartContext so we can call addToCart and update the counter
import { CartContext } from '../Context/CartContext';
import toast from 'react-hot-toast';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedSort, setSelectedSort] = useState("default");

    // ADDED: Pull addToCart and setNumOfCartItems from context
    const { addToCart, setNumOfCartItems } = useContext(CartContext);

    async function getProducts() {
        try {
            const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/products`);
            setProducts(data.data);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        getProducts();
    }, []);

    // ADDED: Add to cart handler — same pattern as ShowComponent
    // Updates the Navbar counter using the count returned by the API
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
                // Sync counter with the real number from the API
                setNumOfCartItems(response.data.numOfCartItems);
            } else {
                toast.error("Error adding product to cart");
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    }

    const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
    const handleSortChange = (e) => setSelectedSort(e.target.value);

    const filteredProducts = selectedCategory === "all"
        ? products
        : products.filter((product) => product.category.name.toLowerCase() === selectedCategory.toLowerCase());

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (selectedSort === "lp") return a.price - b.price;
        if (selectedSort === "hp") return b.price - a.price;
        if (selectedSort === "lr") return a.ratingsAverage - b.ratingsAverage;
        if (selectedSort === "hr") return b.ratingsAverage - a.ratingsAverage;
        return 0;
    });

    if (error) return <div>Error: {error.message}</div>;
    if (loading) return <Spinner />;

    return (
        <div className="p-10 mt-10">
            <div className="flex flex-col md:flex-row justify-between items-center mt-10 mb-6 px-5 md:px-10">
                <h1 className="text-2xl md:text-3xl font-bold">All Products</h1>
                <div className="flex flex-col md:flex-row gap-4">
                    <div>
                        <label className="block text-lg font-medium">Category</label>
                        <select
                            onChange={handleCategoryChange}
                            className="border rounded-lg p-2 text-lg w-full md:w-auto"
                        >
                            <option value="all">All</option>
                            <option value="music">Music</option>
                            <option value="men's fashion">Men's Fashion</option>
                            <option value="women's fashion">Women's Fashion</option>
                            <option value="supermarket">SuperMarket</option>
                            <option value="baby & toys">Baby & Toys</option>
                            <option value="home">Home</option>
                            <option value="books">Books</option>
                            <option value="beauty & health">Beauty & Health</option>
                            <option value="mobiles">Mobiles</option>
                            <option value="electronics">Electronics</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-lg font-medium">Sort by</label>
                        <select
                            onChange={handleSortChange}
                            className="border rounded-lg p-2 text-lg w-full md:w-auto"
                        >
                            <option value="default">Select Option</option>
                            <option value="lp">Lowest Price</option>
                            <option value="hp">Highest Price</option>
                            <option value="lr">Lowest Rating</option>
                            <option value="hr">Highest Rating</option>
                        </select>
                    </div>
                </div>
            </div>

            {sortedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center">
                    <img src={empty} alt="No Products" className="w-full md:w-1/2 h-auto my-10 p-10" />
                    <p className="text-xl font-semibold text-gray-600 mt-4">No products available</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {sortedProducts.map((product) => (
                        <div key={product.id} className="product p-4 rounded-lg">
                            <Link to={`/Productdetails/${product.id}/${product.category.name}`}>
                                <img className='w-full' src={product.imageCover} alt={product.name} />
                                <h2>{product.name}</h2>
                                <p>{product.category.name}</p>
                                <p className='text-xl font-normal text-gray-800 mb-4'>
                                    {product.title.split(' ').splice(0, 2).join(' ')}
                                </p>
                                <div className="flex justify-between items-center">
                                    <p>{product.price} EGP</p>
                                    <p>{product.ratingsAverage} <i className="fas fa-star text-yellow-500"></i></p>
                                </div>
                            </Link>
                            {/* CHANGED: Button now calls addproducttocart — it was a dead button before */}
                            <button
                                onClick={() => addproducttocart(product.id)}
                                className='btn px-4 py-2 w-full rounded-lg text-white bg-green-600 btn-primary'>
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}