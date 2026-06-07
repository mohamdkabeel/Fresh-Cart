import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../Context/CartContext'
import { useAddToCart } from '../../Hooks/useAddToCart'
import { useAddToWishlist } from '../../Hooks/useAddToWishlist'
import ProductCard from '../ProductCard/ProductCard'

export default function ShowComponent() {
    const [isFavorite, setIsFavorite] = useState(false);
    const [products, setProducts] = useState([]);

    const {
        getLoggedWishList,
        setNumOfFavoriteItems,
        setWishListDetails,
        removeItemFromWishList,
    } = useContext(CartContext);

    const { addProductToCart } = useAddToCart();
    const { addProductToWishlist } = useAddToWishlist();

    async function deleteProductFromWishList(product_Id) {
        let res = await removeItemFromWishList(product_Id);
        if (res?.data?.status === 'success') {
            setIsFavorite(false);
            getWishListInfo();
        }
    }

    function getProducts() {
        axios.get(`https://ecommerce.routemisr.com/api/v1/products`)
            .then(({ data }) => {
                setProducts(data.data);
            })
            .catch((error) => {
                console.error('error fetching products', error);
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

    return (
        <div className="container px-10">
            <div className="row flex flex-wrap py-8 items-center">
                {products.map((product) => (
                    <div key={product.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 px-2 py-5">
                        <ProductCard product={product} onAddToCart={addProductToCart}>
                            <div className="info flex flex-row justify-between items-center">
                                <Link
                                    style={{ color: isFavorite ? '#dc3545' : '#bdbdbd' }}
                                    onClick={() =>
                                        isFavorite ? deleteProductFromWishList(product._id) : addProductToWishlist(product._id)
                                    }
                                    className='heart text-2xl p-2'>
                                    <i className="fa-solid fa-heart text-gray-300 hover:text-[#dc3545] focus:text-[#dc3545]"></i>
                                </Link>
                            </div>
                        </ProductCard>
                    </div>
                ))}
            </div>
        </div>
    );
}
