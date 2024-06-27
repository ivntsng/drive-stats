import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './MainPage'
import CreateVehicle from './components/vehicles/CreateVehicle'
import VehicleDetail from './components/vehicles/VehicleDetail'
import VehicleStat from './components/vehicle_stats/CreateStatLog'
import CreateBugReportForm from './components/bug_reports/create_bug_reports'
import NavBar from './NavBar'
import { ThemeProvider } from '@/components/theme-provider'
import React, { useState, useEffect } from 'react'
import { UserContext } from './UserContext'
import Garage from './components/vehicles/Garage'
import { TimerProvider } from './components/timer'

const API_HOST = import.meta.env.VITE_API_HOST

if (!API_HOST) {
    throw new Error('VITE_API_HOST is not defined')
}

function App() {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const token = sessionStorage.getItem('token')
        const username = sessionStorage.getItem('username')
        if (token && username) {
            setUser({ token, username })
        }
    }, [])

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
                                    element={<CreateVehicle />}
                                />
                                <Route
                                    path="/vehicles/garage"
                                    element={<Garage />}
                                />
                                <Route
                                    path="/vehicles/garage/:vehicle_id"
                                    element={<VehicleDetail />}
                                />
                                <Route
                                    path="/vehicles/garage/maintenance-log/"
                                    element={<VehicleStat />}
                                />
                                <Route
                                    path="/bug-report/create"
                                    element={<CreateBugReportForm />}
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
