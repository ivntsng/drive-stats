import React, { useContext, useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../UserContext'

const ProtectedRoute = ({ element }) => {
    const { user, setUser } = useContext(UserContext)
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_HOST}/api/auth/authenticate`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${user?.token}`,
                        },
                    }
                )
                console.log('API response:', response)

                if (response.ok) {
                    const data = await response.json()
                    console.log('User data:', data)
                    setUser({ ...user, ...data })
                    setIsAuthenticated(true)
                } else {
                    setIsAuthenticated(false)
                }
            } catch (error) {
                console.error('Error during authentication check:', error)
                setIsAuthenticated(false)
            } finally {
                setIsLoading(false)
            }
        }

        if (user && !isAuthenticated) {
            checkAuth()
        } else if (!user) {
            setIsLoading(false)
        } else {
            setIsLoading(false)
            setIsAuthenticated(true)
        }
    }, [user, setUser, isAuthenticated])

    useEffect(() => {
        console.log('Authentication status:', isAuthenticated)
    }, [isAuthenticated])

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return element
}

export default ProtectedRoute
