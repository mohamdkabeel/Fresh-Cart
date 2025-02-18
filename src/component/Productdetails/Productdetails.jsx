import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import { CartContext } from '../Context/CartContext';


export default function Productdetails() {
    let { setNumOfFavoriteItems, addToWishList, removeItemFromWishList } = useContext(CartContext)
    const [productdetails, setProductDetails] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    let { id, category } = useParams();

    function getRelatedProducts(category) {
        axios.get('https://ecommerce.routemisr.com/api/v1/products')
            .then(({ data }) => {
                let allProducts = data.data;
                let related = allProducts.filter((product) => product.category.name === category);
                setRelatedProducts(related);
            })
            .catch((error) => {
                console.error('Error fetching related products', error);
            });
    }

    function getProductDetails(id) {
        axios.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`)
            .then(({ data }) => {
                setProductDetails(data.data);
            })
            .catch((error) => {
                console.error('Error fetching product details', error);
            });
    }

    useEffect(() => {
        getProductDetails(id);
        getRelatedProducts(category);
    }, [id, category]);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div className="container mt-[1%] p-[5%]">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
                <div className="w-full lg:w-1/4 p-5">
                    <Slider {...settings}>
                        {productdetails?.images.map((src, index) => (
                            <img key={index} className="w-full" src={src} alt={productdetails?.name} />
                        ))}
                    </Slider>
                </div>
                <div className="w-full lg:w-3/4">
                    <h2 className="text-2xl mt-2">{productdetails?.title}</h2>
                    <div className="flex justify-between items-center">
                        <p className="text-gray-500 mt-2">{productdetails?.description}</p>
                        <Link onClick={addToWishList}><i className="fa-solid fa-heart text-gray-400 text-3xl hover:text-[#dc3545] focus:text-[#dc3545]"></i></Link>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-xl font-normal">{productdetails?.price} EGP</p>
                        <p>
                            {productdetails?.ratingsAverage}
                            <i className="fa fa-star ml-2 text-yellow-500 text-2xl" aria-hidden="true"></i>
                        </p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <button className="bg-green-500 w-full p-2 text-white rounded-lg flex justify-center items-center">
                            <i className="fa-solid fa-cart-shopping text-white mr-2"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap mt-10">
                {relatedProducts.map((product) => (
                    <div key={product.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/6 p-5">
                        <Link to={`/Productdetails/${product.id}/${product.category.name}`}>
                            <div className="border p-4 rounded-lg shadow-sm hover:shadow-md">
                                <img className="w-full mb-2" src={product.imageCover} alt={product.name} />
                                <h2 className="text-lg font-bold">{product.name}</h2>
                                <p className="text-sm text-gray-600">{product.category.name}</p>
                                <p className="text-xl font-normal text-gray-800 mb-4">{product.title.split(' ').splice(0, 2).join(' ')}</p>
                                <div className="flex justify-between items-center">
                                    <p>{product.price} EGP</p>
                                    <p className='flex justify-between items-center'>{product.ratingsAverage} <i className="fas fa-star text-yellow-500 p-2"></i></p>

                                </div>
                                <button className="w-full bg-green-600 text-white px-4 py-2 mt-2 rounded-lg">Add to Cart</button>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
