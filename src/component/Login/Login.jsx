import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import axios from 'axios'
import * as yup from 'yup';
import { CartContext } from '../Context/CartContext';
import FormField from '../FormField/FormField';
import { usePageTitle } from '../../Hooks/usePageTitle';

export default function Login() {
    let { setuserlogin } = useContext(CartContext)
    const Navigate = useNavigate();
    usePageTitle('LOGIN');

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

    return (
        <div className="container mt-20 flex justify-center items-center px-4">
            <form onSubmit={formik.handleSubmit} className='mb-5 w-full md:w-[65%] max-w-md mt-7'>
                <div className="caption">
                    <h1 className='mt-1 register text-3xl text-center md:text-left'>
                        Login Now :
                    </h1>
                </div>

                <FormField id="email" label="Email" type="email" formik={formik} />
                <FormField id="password" label="Password" type="password" formik={formik} />

                <button type="submit" className="mb-5 w-full text-white bg-green-300 hover:bg-green-500 focus:ring-4 focus:ring-green-500 font-medium rounded-lg text-sm px-5 py-2.5">
                    {isloading ? <i className="fa fa-spinner fa-spin"></i> : 'Login'}
                </button>

                <p className="text-center"> Don&apos;t have an account? <Link to="/register" className='text-blue-500 font-bold'>Register</Link> </p>

                {apierror ? <div className="mt-2 p-4 mb-4 text-sm text-red-900 rounded-lg bg-red-50">
                    {apierror}
                </div> : null}
            </form>
        </div>
    )
}
