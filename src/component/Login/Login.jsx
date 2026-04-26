import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import axios from 'axios'
import * as yup from 'yup';
import { userContetx } from '../Context/Usercontext';
import { CartContext } from '../Context/CartContext';

export default function Login() {
    let { setuserlogin, userlogin } = useContext(CartContext)
    const Navigate = useNavigate();
    let validationSchema = yup.object({
        email: yup.string().email('email is invalid').required('email is required'),
        password: yup.string().matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must be strong').required('password is required'),
    })
    function HandleLogin(formikvalue) {
        setisloading(true)
        axios.post(
            'https://ecommerce.routemisr.com/api/v1/auth/signin',
            formikvalue
        )
            .then((response) => {
                if (response.data.message == 'success') {
                    localStorage.setItem('usertoken', response.data.token);
                    localStorage.setItem('userinfo', JSON.stringify(response.data.user));
                    Navigate('/')
                    setisloading(false)
                    setuserlogin(response.data.token)
                }
            })
            .catch(() => {
                setisloading(false)
                setapierror('Email or password is incorrect please try again or contact us')
            })
    }

    let formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema,
        onSubmit: HandleLogin,
    })

    const [apierror, setapierror] = useState('');
    const [isloading, setisloading] = useState(false);
    useEffect(() => { document.title = "LOGIN" }, [])


    return (
        <div className="container mt-20 flex justify-center items-center px-4">
            <form onSubmit={formik.handleSubmit} className='mb-5 w-full md:w-[65%] max-w-md mt-7'>
                <div className="caption">
                    <h1 className='mt-1 register text-3xl text-center md:text-left'>
                        Login Now :
                    </h1>
                </div>
                <div className="z-0 w-full mb-5 mt-5">
                    <label className='text-gray-700' htmlFor='email'>Email</label>
                    <input type="email" id='email' onChange={formik.handleChange} onBlur={formik.handleBlur} className='form-control mt-1 px-4 mb-2 block py-2.5 w-full text-sm text-dark bg-white rounded border border-gray-200 focus:outline-none focus:shadow-lg' name='email' required />
                </div>
                {formik.errors.email && formik.touched.email ? (
                    <div className="p-4 mb-4 text-sm text-red-900 rounded-lg bg-red-50">
                        {formik.errors.email}
                    </div>
                ) : null}

                <div className="z-0 w-full mb-5 mt-5">
                    <label className="text-gray-700" htmlFor="password">Password</label>
                    <input type="password" id="password" onChange={formik.handleChange} onBlur={formik.handleBlur} className="form-control mt-1 px-4 mb-2 block py-2.5 w-full text-sm text-dark bg-white rounded border border-gray-200 focus:outline-none focus:shadow-lg" name="password" required />
                </div>
                {formik.errors.password && formik.touched.password ? (
                    <div className="p-4 mb-4 text-sm text-red-900 rounded-lg bg-red-50">
                        {formik.errors.password}
                    </div>
                ) : null}

                <button type="submit" className="mb-5 w-full text-white bg-green-300 hover:bg-green-500 focus:ring-4 focus:ring-green-500 font-medium rounded-lg text-sm px-5 py-2.5">
                    {isloading ? <i className="fa fa-spinner fa-spin"></i> : 'Login'}
                </button>

                <p className="text-center"> Don't have an account? <Link to="/register" className='text-blue-500 font-bold'>Register</Link> </p>

                {apierror ? <div className="mt-2 p-4 mb-4 text-sm text-red-900 rounded-lg bg-red-50">
                    {apierror}
                </div> : null}
            </form>
        </div>
    )
}
