import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Spinner from '../Spinner/Spinner';

export default function Brands() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function displayBrand() {
        try {
            let { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/brands');
            setBrands(data.data);
        } catch (err) {
            console.error('[Brands] Failed to fetch brands:', err.response?.data?.message || err.message);
            setError('Failed to load brands. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        displayBrand();
    }, []);

    if (loading) return <Spinner />;

    if (error) {
        return (
            <div className="container mt-20 md:mt-[5%] text-center">
                <p className="text-red-600 text-lg">{error}</p>
                <button onClick={() => { setError(null); setLoading(true); displayBrand(); }} className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-20 md:mt-[5%]">
            <h2 className='flex justify-center items-center mb-4 text-2xl font-bold'>All Brands</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {brands?.map((brand) => (
                    <div key={brand.id} className="mx-auto px-2 py-5">
                        <div className="product mb-3 mx-auto">
                            <div className="text-dark block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-green-950 text-center">
                                <img src={brand.image} alt={brand.name} className="w-full h-auto object-contain" />
                                <p className="mt-2 font-normal text-gray-900 text-lg">{brand.name}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
