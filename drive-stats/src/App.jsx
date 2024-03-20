import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './MainPage'
import NavBar from './NavBar'
import { ThemeProvider } from '@/components/theme-provider'
// import LoginPage from './login';

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
