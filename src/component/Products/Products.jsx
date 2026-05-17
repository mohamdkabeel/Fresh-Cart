import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import empty from '../../assets/Images/NoProducts.svg';
import Spinner from '../Spinner/Spinner';

// ── Design Patterns ──────────────────────────────────────────
// import SortStrategy from './sortingStrategies';          // STRATEGY
import SortStrategy from '../../Strategies/sortingStrategies';          // STRATEGY
import CartEventManager from '../../Observer/cartEventManager';       // OBSERVER (event bus)
import { useAddToCart } from '../../Hooks/useAddToCart';           // OBSERVER (hook)

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSort, setSelectedSort] = useState('default');

    // OBSERVER — hook that owns the add-to-cart side-effect pipeline
    const { addProductToCart } = useAddToCart();

    // ── Data fetching ─────────────────────────────────────────
    async function getProducts() {
        try {
            const { data } = await axios.get(
                'https://ecommerce.routemisr.com/api/v1/products'
            );
            setProducts(data.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    }

    useEffect(() => {
        getProducts();
    }, []);

    // ── OBSERVER — subscribe to cart events ──────────────────
    // Any component can listen here without coupling to the cart
    // context or to the Products component itself.
    useEffect(() => {
        const unsubUpdated = CartEventManager.on('cartUpdated', ({ numOfCartItems }) => {
            // Example: could update a local badge, analytics, etc.
            console.log('[Products] Cart updated — items in cart:', numOfCartItems);
        });

        const unsubError = CartEventManager.on('cartError', ({ error: err }) => {
            console.warn('[Products] Cart error observed:', err);
        });

        // Clean up subscriptions when the component unmounts
        return () => {
            unsubUpdated();
            unsubError();
        };
    }, []);

    // ── Filtering ─────────────────────────────────────────────
    const filteredProducts =
        selectedCategory === 'all'
            ? products
            : products.filter(
                (p) => p.category.name.toLowerCase() === selectedCategory.toLowerCase()
            );

    // ── STRATEGY — delegate sorting to the strategy map ──────
    const sortedProducts = SortStrategy.apply(selectedSort, filteredProducts);

    // ── Render guards ─────────────────────────────────────────
    if (error) return <div>Error: {error.message}</div>;
    if (loading) return <Spinner />;

    // ── UI (unchanged from original) ─────────────────────────
    return (
        <div className="p-10 mt-10">
            {/* Header + filters */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-10 mb-6 px-5 md:px-10">
                <h1 className="text-2xl md:text-3xl font-bold">All Products</h1>

                <div className="flex flex-col md:flex-row gap-4">
                    {/* Category filter */}
                    <div>
                        <label className="block text-lg font-medium">Category</label>
                        <select
                            onChange={(e) => setSelectedCategory(e.target.value)}
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

                    {/* Sort filter — STRATEGY keys drive the options */}
                    <div>
                        <label className="block text-lg font-medium">Sort by</label>
                        <select
                            onChange={(e) => setSelectedSort(e.target.value)}
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

            {/* Product grid */}
            {sortedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center">
                    <img
                        src={empty}
                        alt="No Products"
                        className="w-full md:w-1/2 h-auto my-10 p-10"
                    />
                    <p className="text-xl font-semibold text-gray-600 mt-4">
                        No products available
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {sortedProducts.map((product) => (
                        <div key={product.id} className="product p-4 rounded-lg">
                            <Link
                                to={`/Productdetails/${product.id}/${product.category.name}`}
                            >
                                <img
                                    className="w-full"
                                    src={product.imageCover}
                                    alt={product.name}
                                />
                                <h2>{product.name}</h2>
                                <p>{product.category.name}</p>
                                <p className="text-xl font-normal text-gray-800 mb-4">
                                    {product.title.split(' ').splice(0, 2).join(' ')}
                                </p>
                                <div className="flex justify-between items-center">
                                    <p>{product.price} EGP</p>
                                    <p>
                                        {product.ratingsAverage}{' '}
                                        <i className="fas fa-star text-yellow-500"></i>
                                    </p>
                                </div>
                            </Link>

                            {/* OBSERVER — button delegates to the hook */}
                            <button
                                onClick={() => addProductToCart(product.id)}
                                className="btn px-4 py-2 w-full rounded-lg text-white bg-green-600 btn-primary"
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}