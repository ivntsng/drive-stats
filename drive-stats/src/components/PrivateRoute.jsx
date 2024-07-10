import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../UserContext'

const PrivateRoute = ({ children }) => {
    const { user } = useContext(UserContext)

    if (user) {
        return children
    } else {
        return <Navigate to="/" />
    }
}

export default PrivateRoute
