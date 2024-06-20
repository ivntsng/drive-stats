import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './MainPage'
import CreateVehicle from './components/vehicles/CreateVehicle'
import VehicleDetail from './components/vehicles/VehicleDetail'
import NavBar from './NavBar'
import { ThemeProvider } from '@/components/theme-provider'
import React, { useState, useEffect } from 'react'
import { UserContext } from './UserContext'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import Garage from './components/vehicles/Garage'

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
                        </Routes>
                    </div>
                </UserContext.Provider>
            </ThemeProvider>
        </BrowserRouter>
    )
}

export default App
