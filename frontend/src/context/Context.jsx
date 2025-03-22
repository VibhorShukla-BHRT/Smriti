import { createContext, useContext, useState } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

    const [isLoggedIn, setLoggedIn] = useState(false);
    return (
        <AuthContext.Provider value={{ isLoggedIn,setLoggedIn }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=>{
    return useContext(AuthContext);
}