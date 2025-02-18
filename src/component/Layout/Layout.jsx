import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { Outlet, useLocation } from 'react-router-dom'
import '../../index.css'
import { ClipLoader } from 'react-spinners'
import { Hearts } from "react-loader-spinner";


export default function Layout() {

    const [loading, setLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setLoading(true); // تشغيل التحميل عند تغيير الصفحة
        const timer = setTimeout(() => {
            setLoading(false); // إخفاء التحميل بعد 1 ثانية
        }, 1000);
        return () => clearTimeout(timer); // تنظيف التايمر عند كل تغيير في الصفحة
    }, [location.pathname]);

    return <>
        <Navbar />
        <div className="container mx-auto">
            <div className="relative">
                {loading && (
                    <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-95 z-50">
                        <Hearts
                            height="80"
                            width="80"
                            color="#4fa94d"
                            ariaLabel="hearts-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                        />
                    </div>
                )}
            </div>
            {!loading && <Outlet />}

        </div>
        <Footer />
    </>
}
