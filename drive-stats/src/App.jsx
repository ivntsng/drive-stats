import React, { useState, useEffect, useContext } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './MainPage'
import CreateVehicle from './components/vehicles/CreateVehicle'
import VehicleDetail from './components/vehicles/VehicleDetail'
import VehicleStat from './components/vehicle_stats/CreateStatLog'
import CreateBugReportForm from './components/bug_reports/create_bug_reports'
import NavBar from './NavBar'
import { ThemeProvider } from '@/components/theme-provider'
import { UserContext } from './UserContext'
import Garage from './components/vehicles/Garage'
import { TimerProvider } from './components/timer'
import ProtectedRoute from './components/ProtectedRoute'
import { useToast } from '@/components/ui/use-toast'

const API_HOST = import.meta.env.VITE_API_HOST

if (!API_HOST) {
    throw new Error('VITE_API_HOST is not defined')
}

function App() {
    const [user, setUser] = useState(() => {
        const token = sessionStorage.getItem('token')
        const username = sessionStorage.getItem('username')
        if (token && username) {
            return { token, username }
        }
        return null
    })
    const { toast } = useToast()

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch(
                    `${API_HOST}/api/auth/authenticate`,
                    {
                        method: 'GET',
                        credentials: 'include',
                    }
                )

                if (response.ok) {
                    const data = await response.json()
                    const { id, username, token } = data
                    if (token) {
                        sessionStorage.setItem('token', token)
                        sessionStorage.setItem('username', username)
                        setUser({ id, username, token })
                        toast({
                            title: 'Authenticated',
                            description: `Welcome back, ${username}`,
                        })
                    } else {
                        console.warn('Token is missing in the response')
                    }
                } else {
                    console.warn('User is not authenticated')
                }
            } catch (error) {
                console.error('Error during authentication check:', error)
            }
        }

        checkAuthStatus()
    }, [API_HOST, setUser, toast])

    const value = { user, setUser }
    return (
        <BrowserRouter>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <UserContext.Provider value={value}>
                    <TimerProvider>
                        <NavBar />
                        <div className="container">
                            <Routes>
                                <Route path="/" element={<MainPage />} />
                                <Route
                                    path="/vehicles/register"
                                    element={
                                        <ProtectedRoute
                                            element={<CreateVehicle />}
                                        />
                                    }
                                />
                                <Route
                                    path="/vehicles/garage"
                                    element={
                                        <ProtectedRoute element={<Garage />} />
                                    }
                                />
                                <Route
                                    path="/vehicles/garage/:vehicle_id"
                                    element={
                                        <ProtectedRoute
                                            element={<VehicleDetail />}
                                        />
                                    }
                                />
                                <Route
                                    path="/vehicles/garage/maintenance-log/"
                                    element={
                                        <ProtectedRoute
                                            element={<VehicleStat />}
                                        />
                                    }
                                />
                                <Route
                                    path="/bug-report/create"
                                    element={
                                        <ProtectedRoute
                                            element={<CreateBugReportForm />}
                                        />
                                    }
                                />
                            </Routes>
                        </div>
                    </TimerProvider>
                </UserContext.Provider>
            </ThemeProvider>
        </BrowserRouter>
    )
}

export default App
