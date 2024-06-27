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
            const response = await fetch(`${API_HOST}/api/auth/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include', // Include credentials in the request
            })

            if (response.ok) {
                setUsername('')
                setPassword('')
                const data = await response.json()
                const { token, username } = data
                sessionStorage.setItem('token', token)
                sessionStorage.setItem('username', username)
                setUser({ username, token })
                closeLoginForm()
                navigate('vehicles/garage')
                toast({
                    title: 'Logged In',
                    description: `Welcome back, ${username}`,
                })
                startLogoutTimer() // Start the logout timer on successful login
            } else {
                setError('Wrong username or password.')
            }
        } catch (error) {
            console.error('Error: ', error)
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
    }, [])

    return (
        <Card className="w-full md:w-[400px] mx-auto">
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
                                onChange={(e) => setUsername(e.target.value)}
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
                            <div className="w-full md:w-auto mb-2 md:mb-0">
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
