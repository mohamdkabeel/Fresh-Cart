import React from 'react'
import mainSlider from '../../assets/Images/slider-image-3.7e5c9f7a513f6db6dd5e.jpeg'
import slid1 from '../../assets/Images/slider-image-2.e510b0de8a4d96a1d5ad.jpeg'
import slide2 from '../../assets/Images/slider-image-1.3c3940ee0f1c3b17ff9a.jpeg'
import Slider from "react-slick";

export default function MainSlider() {
    var settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 mx-4 md:mx-10 px-4 md:px-10 mt-20 md:mt-[5%] gap-0">
            <div className="md:col-span-3">
                <Slider {...settings}>
                    <img src={mainSlider} className='w-full h-auto md:h-[400px]' />
                    <img src={slid1} className='w-full h-auto md:h-[400px]' />
                    <img src={slide2} className='w-full h-auto md:h-[400px]' />
                </Slider>
            </div>

            <div className="hidden md:flex flex-col ">
                <img src={slid1} className='w-full h-auto md:h-[200px]' />
                <img src={slide2} className='w-full h-auto md:h-[200px]' />
            </div>
        </div>
    )
}

