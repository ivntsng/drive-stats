import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './MainPage'
import NavBar from './NavBar'
import { ThemeProvider } from '@/components/theme-provider'
// import LoginPage from './login';

// All your environment variables in vite are in this object
console.table(import.meta.env)

// When using environment variables, you should do a check to see if
// they are defined or not and throw an appropriate error message
const API_HOST = import.meta.env.VITE_API_HOST

if (!API_HOST) {
    throw new Error('VITE_API_HOST is not defined')
}

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <div className="container">
                    <NavBar />
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                    </Routes>
                </div>
            </ThemeProvider>
        </BrowserRouter>
    )
}

export default App
