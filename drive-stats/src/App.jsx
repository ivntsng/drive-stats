import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './MainPage'
import CreateVehicle from './components/vehicles/CreateVehicle'
import VehicleDetail from './components/vehicles/VehicleDetail'
import VehicleStat from './components/vehicle_stats/CreateStatLog'
import UpdatedVehicleDetail from './components/vehicle_stats/UpdateVehicleDetails'
import CreateBugReportForm from './components/bug_reports/create_bug_reports'
import MaintenanceLogPage from './components/maintenance_logs/MaintenanceLogs'
import MaintenanceLogDetails from './components/maintenance_logs/MaintenanceLogDetails'
import UpdateMaintenanceLog from './components/maintenance_logs/UpdateMaintenanceLog'
import MyAccount from './components/accounts/myAccount'
import NavBar from './NavBar'
import { ThemeProvider } from '@/components/theme-provider'
import { UserContext } from './UserContext'
import Garage from './components/vehicles/Garage'
import { TimerProvider } from './components/timer'
import ProtectedRoute from './components/ProtectedRoute'
import axios from 'axios'

const apiHost = import.meta.env.VITE_API_HOST

if (!apiHost) {
    console.warn('VITE_API_HOST is not defined, using default value')
}

function App() {
    console.log('App component initialized')

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
        if (token) {
            axios
                .get(`${apiHost}/api/auth/authenticate`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                })
                .then((response) => {
                    setUser(response.data)
                })
                .catch((error) => {
                    console.error('User re-authentication failed:', error)
                    sessionStorage.removeItem('token')
                    setUser(null)
                })
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
                                    path="/vehicles/garage/update/:vehicle_id"
                                    element={
                                        <ProtectedRoute
                                            element={<UpdatedVehicleDetail />}
                                        />
                                    }
                                />
                                <Route
                                    path="/vehicles/garage/maintenance/:vehicle_id"
                                    element={
                                        <ProtectedRoute
                                            element={<MaintenanceLogPage />}
                                        />
                                    }
                                />
                                <Route
                                    path="/vehicles/garage/maintenance/maintenance-log/:log_id"
                                    element={
                                        <ProtectedRoute
                                            element={<MaintenanceLogDetails />}
                                        />
                                    }
                                />
                                <Route
                                    path="/vehicles/garage/maintenance/maintenance-log/update/:maintenance_log_id"
                                    element={
                                        <ProtectedRoute
                                            element={<UpdateMaintenanceLog />}
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
                                <Route
                                    path="/accounts/settings"
                                    element={
                                        <ProtectedRoute
                                            element={<MyAccount />}
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
