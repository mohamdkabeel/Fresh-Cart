import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function CategoriesSlider(props) {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    function getCategories() {
        axios.get(`https://ecommerce.routemisr.com/api/v1/categories`)
            .then(({ data }) => {
                setCategories(data.data);
                setError(null);
            })
            .catch((error) => {
                console.error('[CategoriesSlider] Failed to fetch categories:', error.response?.data?.message || error.message);
                setError('Failed to load categories.');
            });
    }

    useEffect(() => {
        getCategories();
    }, []);

    var settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 8,
        slidesToScroll: 3,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: false,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    if (error) {
        return (
            <div className="px-10 text-center py-4">
                <p className="text-red-500 text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="px-10">
            <Slider {...settings}>
                {categories.map((category) => (
                    <div key={category.id} className="container mx-auto">
                        <div className='mt-10 text-center'>
                            <img src={category.image} className='category-img w-full' alt={category.name} />
                            <h3 className="text-lg font-semibold mt-2">{category.name}</h3>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}
