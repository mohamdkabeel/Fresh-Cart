import React from 'react'
import { Navigate } from 'react-router-dom'


export default function Protectedroute(props) {
    console.log(props);

    if (localStorage.getItem('usertoken') !== null) {
        return props.children;
    }
    else {
        return <Navigate to="/login" />
    }

}
