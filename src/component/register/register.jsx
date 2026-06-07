import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import axios from 'axios'
import * as yup from 'yup';
import FormField from '../FormField/FormField';
import { usePageTitle } from '../../Hooks/usePageTitle';

export default function Register() {
    const Navigate = useNavigate();
    usePageTitle('REGISTER');

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
            .then(() => {
                Navigate('/Login')
                setisloading(false)
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

    return <>
        <div className="container mt-20 ">
            <form onSubmit={formik.handleSubmit} className=' mb-5 w-[65%]  mx-auto mt-7'>
                <div className="caption ml-0 pl-0">
                    <h1 className='mt-1 register text-3xl'>
                        Register Now :
                    </h1>
                </div>

                <FormField id="name" label="Name" type="text" formik={formik} />
                <FormField id="email" label="Email" type="email" formik={formik} />
                <FormField id="password" label="Password" type="password" formik={formik} />
                <FormField id="rePassword" label="rePassword" type="password" formik={formik} />
                <FormField id="phone" label="Telephone" type="tel" formik={formik} name="phone" />

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
