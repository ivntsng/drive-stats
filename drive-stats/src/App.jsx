import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './MainPage'
import CreateVehicle from './components/vehicles/CreateVehicle'
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

const API_HOST = import.meta.env.VITE_API_HOST

if (!API_HOST) {
    throw new Error('VITE_API_HOST is not defined')
}

function App() {
    const [user, setUser] = useState(null)

    useEffect(() => {
        // Check for token in session storage during initialization
        const token = sessionStorage.getItem('token')
        if (token) {
            // Set user context if token exists
            setUser({ token })
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
                        </Routes>
                    </div>
                </UserContext.Provider>
            </ThemeProvider>
        </BrowserRouter>
    )
}

export default App
