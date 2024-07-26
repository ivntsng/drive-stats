import React, { useContext, useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../UserContext'
import { useToast } from '@/components/ui/use-toast'

const ProtectedRoute = ({ element }) => {
    const { user, setUser } = useContext(UserContext)
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        const checkAuth = async () => {
            const token = sessionStorage.getItem('token')
            if (!token) {
                setIsAuthenticated(false)
                setIsLoading(false)
                toast({
                    title: 'Unauthorized',
                    description: 'Please login to access this page.',
                })
                return
            }

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_HOST}/api/auth/authenticate`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                if (response.ok) {
                    const data = await response.json()
                    setUser({ ...user, ...data, token })
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

        checkAuth()
    }, [setUser, toast, user])

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return element
}

export default ProtectedRoute
