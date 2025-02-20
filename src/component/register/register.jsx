import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Formik, useFormik } from 'formik';
import axios from 'axios'
import * as yup from 'yup';
export default function Register() {
    const Navigate = useNavigate();
    let validationSchema = yup.object({
        name: yup.string().min(3, 'name must be > 3').required('name is required'),
        email: yup.string().email('email is invalid').required('email is required'),
        password: yup.string().matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must be strong').required('password is required'),
        rePassword: yup.string().oneOf([yup.ref('password')]).required('rePassword is required'),
        phone: yup.string().matches(/^(?:\+20|0)?1[0-2]\d{8}$/, 'phone number is invalid').required('phone number is required'),
    })
    function HandleRegister(formikvalue) {
        setisloading(true)
        axios.post(
            'https://ecommerce.routemisr.com/api/v1/auth/signup',
            formikvalue
        )
            .then((apirespone) => {
                Navigate('/Login')
                setisloading(false)
                console.log(x.data)
            })
            .catch((apirespone) => {
                setisloading(false)
                setapierror(apirespone?.response?.data?.message)
            })
    }

    let formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            rePassword: '',
            phone: '',
        },
        validationSchema,
        onSubmit: HandleRegister,

    })

    const [apierror, setapierror] = useState('');
    const [isloading, setisloading] = useState(false);
    useEffect(() => {
        document.title = 'RIGISTER'
    }, [])

    return <>
        <div className="container mt-20 ">
            <form onSubmit={formik.handleSubmit} className=' mb-5 w-[65%]  mx-auto mt-7'>
                <div className="caption ml-0 pl-0">
                    <h1 className='mt-1 register text-3xl'>
                        Register Now :
                    </h1>
                </div>
                <div className="z-0 w-full mb-5 mt-5 ">
                    <label className='text-gray-700' htmlFor='name' >Name</label>
                    <input type="text" id='name' onTouchStart={null} onChange={formik.handleChange} onBlur={formik.handleBlur} className='form-control transition-all duration-300 mt-1 px-4 mb-2 block py-2.5 px-0 w-full input text-sm text-dark bg-white hs rounded-l border border-gray-200 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:shadow-xl focus:shadow-gray-300 focus:border-blue-600 peer' name='name' required />
                </div>
                {formik.values?.name && formik.touched?.name && formik.errors?.name ?
                    <div className="p-4 mb-4 text-sm text-red-900 rounded-lg bg-red-50 dark:bg-red-100 dark:text-red-400" role="alert">
                        {formik.errors.name}
                    </div>
                    : null}
                <div className="z-0 w-full mb-5 mt-5 ">
                    <label className='text-gray-700' htmlFor='email' >Email</label>
                    <input type="email" id='email' onChange={formik.handleChange} onBlur={formik.handleBlur} className='form-control mt-1 px-4 mb-2 block py-2.5 px-0 w-full input text-sm transition-all duration-300 text-dark bg-white hs rounded-l border border-gray-100 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:shadow-xl focus:shadow-gray-300 focus:border-blue-600 peer' name='email' required />
                </div>
                {formik.values?.email && formik.touched?.email && formik.errors?.email ?
                    <div className="p-4 mb-4 text-sm text-red-900 rounded-lg bg-red-50 dark:bg-red-100 dark:text-red-400" role="alert">
                        {formik.errors.email}
                    </div>
                    : null}
                <div className="z-0 w-full mb-5 mt-5">
                    <label className="text-gray-700" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="form-control mt-1 px-4 transition-all duration-300 mb-2 block py-2.5 w-full text-sm text-dark bg-white rounded-l border border-gray-200 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:shadow-xl focus:shadow-gray-300 focus:border-blue-600 peer"
                        name="password"
                        required
                    />
                </div>
                {formik.errors.password && formik.touched.password ? (
                    <div className="p-4 mb-4 text-sm text-red-900 rounded-lg bg-red-50 dark:bg-red-100 dark:text-red-400" role="alert">
                        {formik.errors.password}
                    </div>
                ) : null}
                <div className="z-0 w-full mb-5 mt-5">
                    <label className="text-gray-700" htmlFor="rePassword">rePassword</label>
                    <input
                        type="password"
                        id="rePassword"
                        value={formik.values.rePassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="form-control mt-1 px-4 transition-all duration-300 mb-2 block py-2.5 w-full text-sm text-dark bg-white rounded-l border border-gray-200 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:shadow-xl focus:shadow-gray-300 focus:border-blue-600 peer"
                        name="rePassword"
                        required
                    />
                </div>
                {formik.errors.rePassword && formik.touched.rePassword ? (
                    <div className="p-4 mb-4 text-sm text-red-900 rounded-lg bg-red-50 dark:bg-red-100 dark:text-red-400" role="alert">
                        {formik.errors.rePassword}
                    </div>
                ) : null}
                <div className="z-0 w-full mb-5 mt-5 ">
                    <label className='text-gray-700' htmlFor='Tel' >Telphone</label>
                    <input type="tel" id='Tel' onChange={formik.handleChange} onBlur={formik.handleBlur} className='form-control mt-1 px-4 mb-2 block transition-all duration-300 py-2.5 px-0 w-full input text-sm text-dark bg-white hs rounded-l border border-gray-200 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:shadow-xl focus:shadow-gray-300 focus:border-blue-600 peer' name='phone' required />
                </div>
                {formik.values?.phone && formik.touched?.phone && formik.errors?.phone ?
                    <div className="p-4 mb-4 text-sm text-red-900 rounded-lg bg-red-50 dark:bg-red-100 dark:text-red-400" role="alert">
                        {formik.errors.phone}
                    </div>
                    : null}
                <button type="submit" className="mb-5 text-white bg-green-300 hover:bg-green-500 focus:ring-4 focus:ring-green-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-500 dark:hover:bg-green-500 focus:outline-none dark:focus:ring-green-500">
                    {isloading ? <i className="fa fa-spinner fa-spin"></i> : 'Register'}
                </button>
                {apierror ? <div className="p-4 mb-4 text-sm text-red-900 rounded-lg bg-red-50 dark:bg-red-100 dark:text-red-400" role="alert">
                    {apierror}
                </div> : null}
            </form >
        </div >
    </>
}
