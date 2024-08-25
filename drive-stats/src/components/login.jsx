import React, {
    useState,
    useContext,
    useRef,
    useCallback,
    useEffect,
} from 'react'
import { UserContext } from '../UserContext'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { useTimer } from './timer' // Import TimerContext

function LoginForm({
    isSignupFormOpen,
    toggleSignUp,
    isLoginFormOpen,
    toggleLogin,
    closeLoginForm,
    toggleSignupForm,
}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { setUser } = useContext(UserContext)
    const { toast } = useToast()
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const formRef = useRef(null)
    const API_HOST = import.meta.env.VITE_API_HOST
    const { startLogoutTimer, clearLogoutTimer } = useTimer()

    async function handleLogin(e) {
        e.preventDefault()
        if (!username || !password) {
            setError('Username and password are required.')
            return
        }
        setIsLoading(true)
        try {
            const formData = new URLSearchParams()
            formData.append('username', username)
            formData.append('password', password)

            const response = await fetch(`${API_HOST}/api/auth/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            })

            if (response.ok) {
                const data = await response.json()
                const { access_token } = data
                sessionStorage.setItem('token', access_token)
                setUser({ username, token: access_token })
                closeLoginForm()
                navigate('vehicles/garage')
                toast({
                    title: 'Logged In',
                    description: `Welcome back, ${username}`,
                })
                startLogoutTimer()
            } else {
                const errorText = await response.text()
                console.error('Login failed:', errorText)
                setError('Wrong username or password.')
            }
        } catch (error) {
            console.error('Error during login:', error)
            setError('Something went wrong. Please try again later.')
        } finally {
            setIsLoading(false)
        }
    }

    const toggleSignUpForm = async (e) => {
        toggleSignUp(!isSignupFormOpen)
        toggleLogin(!isLoginFormOpen)
    }

    const handleClickOutside = useCallback(
        (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                if (typeof closeLoginForm === 'function') {
                    closeLoginForm()
                }
            }
        },
        [closeLoginForm]
    )

    useEffect(() => {
        window.addEventListener('mousedown', handleClickOutside)
        return () => {
            window.removeEventListener('mousedown', handleClickOutside)
        }
    }, [handleClickOutside])

    const handleCancel = () => {
        closeLoginForm()
    }

    return (
        <Card className="w-[95vw] max-w-[400px] sm:w-[80vw] sm:max-w-[450px] lg:w-[60vw] lg:max-w-[500px] mx-auto px-4 sm:px-6 lg:px-8">
            <div ref={formRef}>
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">
                        Login
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="username" className="font-bold">
                                Username
                            </label>
                            <Input
                                id="username"
                                placeholder="Username"
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value.toLowerCase())
                                }
                                autoComplete="current-username"
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="password" className="font-bold">
                                Password
                            </label>
                            <Input
                                id="password"
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <CardFooter className="flex flex-col items-center md:flex-row md:justify-center">
                            <div className="flex flex-row items-center justify-between space-x-2 p-6 pt-0 col-span-full">
                                <Button
                                    type="button"
                                    onClick={handleCancel}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full sm:w-auto"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full md:w-auto"
                                >
                                    {isLoading ? 'Logging in...' : 'Login'}
                                </Button>
                            </div>
                        </CardFooter>
                        <div className="text-center">
                            <p className="text-sm text-gray-500">
                                New to DriveStats?{' '}
                                <button
                                    type="button"
                                    className="text-purple-600 hover:underline focus:outline-none focus:ring"
                                    onClick={toggleSignUpForm}
                                >
                                    Sign up here
                                </button>
                            </p>
                        </div>
                    </form>
                </CardContent>
            </div>
        </Card>
    )
}

export default LoginForm
