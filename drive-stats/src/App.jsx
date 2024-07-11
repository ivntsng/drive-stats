import React, { useState, useEffect } from 'react'
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

    useEffect(() => {
        const token = sessionStorage.getItem('token')
        const username = sessionStorage.getItem('username')
        if (token && username && !user) {
            setUser({ token, username })
        }
    }, [user])

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
