import React, {
    useState,
    useContext,
    useRef,
    useCallback,
    useEffect,
} from 'react'
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

export function handleLogout(setUser) {
    sessionStorage.removeItem('token')
    setUser(null)
}

function LoginForm({
    isSignupFormOpen,
    toggleSignUp,
    isLoginFormOpen,
    toggleLogin,
    closeLoginForm,
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

    async function handleLogin(e) {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await fetch(`${API_HOST}/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })

            if (response.ok) {
                setUsername('')
                setPassword('')
                const data = await response.json()
                const { token, username } = data
                sessionStorage.setItem('token', token)
                setUser({ username, token })
                toast({
                    title: 'Logged In',
                    description: `Welcome back, ${username}`,
                })
                closeLoginForm()
            } else {
                setError('Wrong username or password.')
            }
        } catch (error) {
            console.error('Error: ', error)
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
                            <div className="w-full md:w-auto md:mr-4 mb-2 md:mb-0">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full md:w-auto"
                                >
                                    {isLoading ? 'Logging in...' : 'Login'}
                                </Button>
                            </div>
                            <div className="w-full md:w-auto">
                                <div className="md:hidden">
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
                                <div className="hidden md:block">
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
                            </div>
                        </CardFooter>
                    </form>
                </CardContent>
            </div>
        </Card>
    )
}

export default LoginForm
