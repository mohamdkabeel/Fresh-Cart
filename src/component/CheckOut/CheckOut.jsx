import { useState } from "react";
import toast from 'react-hot-toast';
import { usePageTitle } from '../../Hooks/usePageTitle';

export default function CheckOut() {
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    usePageTitle('CheckOut');
    const handlePayment = () => {
        if (!cardNumber || !expiry || !cvv) {
            toast.error("Please fill in all fields");
            return;
        }
        else {
            toast.success("Payment processed successfully!");
        }
    };


    return (
        <div className="flex items-center justify-center w-full min-h-screen">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Payment Details</h2>

                <div className="flex gap-3 justify-center text-3xl mb-4">
                    <i className="fa-brands fa-cc-visa text-blue-600"></i>
                    <i className="fa-brands fa-cc-mastercard text-red-600"></i>
                    <i className="fa-brands fa-cc-paypal text-blue-500"></i>
                </div>

                <label className="block mb-2 text-gray-600">Card Number</label>
                <div className="relative mb-3">
                    <input
                        type="text"
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                    />
                    <i className="fa-regular fa-credit-card absolute right-3 top-3 text-gray-400 text-xl"></i>
                </div>

                <div className="flex gap-4">
                    <div className="w-1/2">
                        <label className="block mb-2 text-gray-600">Expiry</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block mb-2 text-gray-600">CVV</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                        />
                    </div>
                </div>

                <button onClick={handlePayment} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-lg font-semibold">
                    Pay Now
                </button>
            </div>
        </div>
    );
}
