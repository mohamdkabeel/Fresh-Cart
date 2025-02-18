import { createContext, useEffect, useState } from "react";


export const userContetx = createContext();

export function Usercontextprovider(props) {
    const [userlogin, setuserlogin] = useState(null)

    useEffect(() => {
        if (localStorage.getItem('usertoken') != null) {
            setuserlogin(localStorage.getItem('usertoken'))
        }
    }, [])


    return <userContetx.Provider value={{ userlogin, setuserlogin }}>
        {props.children}
    </userContetx.Provider>
}