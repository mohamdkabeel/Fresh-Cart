import React from 'react'

export default function Footer() {
    return <>
        <footer className="bg-gray-100 p-8 text-center">
            <div className="max-w-4xl mx-auto">
                {/* App Download Section */}
                <h2 className="text-2xl font-semibold">Get the FreshCart app</h2>
                <p className="text-gray-600">We will send you a link, open it on your phone to download the app</p>

                <div className="flex justify-between items-center mt-4">
                    <input
                        type="email"
                        placeholder="Email .."
                        className="p-2 border border-gray-300 rounded-l w-3/4 focus:outline-none"
                    />
                    <button className="bg-green-500 text-white btn px-4 py-2 rounded-r">Share App Link</button>
                </div>

                {/* Payment & Download Section */}
                <div className="mt-6 border-t border-gray-300 pt-4 flex flex-wrap justify-between items-center">
                    {/* Payment Partners */}
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600">Payment Partners</span>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Amazon_Pay_logo.svg" alt="Amazon Pay" className="h-6 cursor-pointer" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MasterCard" className="h-6 cursor-pointer" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6 cursor-pointer " />
                    </div>

                    {/* App Store & Google Play */}
                    <div className="flex space-x-4">
                        <a href="#" className="block"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10" /></a>
                        <a href="#" className="block"><img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Apple_App_Store_logo.svg" alt="App Store" className="h-10" /></a>
                    </div>
                </div>
            </div>
        </footer>
    </>
}
