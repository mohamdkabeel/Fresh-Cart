import axios from 'axios';
import { useState, useEffect } from 'react';
import empty from '../../assets/Images/NoProducts.svg';
import Spinner from '../Spinner/Spinner';
import SortStrategy from '../../Strategies/sortingStrategies';
import CartEventManager from '../../Observer/cartEventManager';
import { useAddToCart } from '../../Hooks/useAddToCart';
import ProductCard from '../ProductCard/ProductCard';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSort, setSelectedSort] = useState('default');

    const { addProductToCart } = useAddToCart();

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

    useEffect(() => {
        const unsubUpdated = CartEventManager.on('cartUpdated', ({ numOfCartItems }) => {
            console.log('[Products] Cart updated — items in cart:', numOfCartItems);
        });

        const unsubError = CartEventManager.on('cartError', ({ error: err }) => {
            console.warn('[Products] Cart error observed:', err);
        });

        return () => {
            unsubUpdated();
            unsubError();
        };
    }, []);

    const filteredProducts =
        selectedCategory === 'all'
            ? products
            : products.filter(
                (p) => p.category.name.toLowerCase() === selectedCategory.toLowerCase()
            );

    const sortedProducts = SortStrategy.apply(selectedSort, filteredProducts);

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
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="border rounded-lg p-2 text-lg w-full md:w-auto"
                        >
                            <option value="all">All</option>
                            <option value="music">Music</option>
                            <option value="men's fashion">Men&apos;s Fashion</option>
                            <option value="women's fashion">Women&apos;s Fashion</option>
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
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={addProductToCart}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
