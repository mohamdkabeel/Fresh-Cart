import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import App from "../../App";
import { Hearts } from "react-loader-spinner";
import Layout from "../Layout/Layout";


export default function Spinner({ children }) {
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <div className="relative">
            {loading && (
                <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
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
                    {!loading && null}

                </div>
            )}
            {children}
        </div>
    );
}
