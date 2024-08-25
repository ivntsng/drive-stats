import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

function SignupForm({
    isSignupFormOpen,
    toggleSignUp,
    isLoginFormOpen,
    toggleLogin,
    closeSignupForm,
    login,
}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showLoginForm, setShowLoginForm] = useState(false)
    const [error, setError] = useState('')
    const { toast } = useToast()
    const API_HOST = import.meta.env.VITE_API_HOST
    const formRef = useRef(null)

    const handleSignUp = async (e) => {
        e.preventDefault()
        if (!username || !password) {
            setError('Username and password are required.')
            return
        }
        if (!email) {
            setError('Email is required.')
            return
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match!')
            return
        }
        setError('')
        setIsLoading(true)
        try {
            const lowerCaseUsername = username.toLowerCase()
            const lowerCaseEmail = email.toLowerCase()
            const checkUser = await fetch(
                `${API_HOST}/check/users/${lowerCaseUsername}`
            )
            const checkEmail = await fetch(
                `${API_HOST}/check/email/${lowerCaseEmail}`
            )
            if (checkUser.status !== 500) {
                setError('Username already exists!')
                setIsLoading(false)
                return
            }
            if (checkEmail.status !== 500) {
                setError('Email is already registered!')
                setIsLoading(false)
                return
            }

            const response = await fetch(`${API_HOST}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email }),
            })

            if (response.ok) {
                setUsername('')
                setPassword('')
                setConfirmPassword('')
                setEmail('')
                setShowLoginForm(false)
                const data = await response.json()
                toast({
                    title: 'Account Successfully Created',
                    description: `Please sign in, ${username}!`,
                })
                closeSignupForm()
            } else {
                console.error('Account Creation Failed')
            }
        } catch (error) {
            console.error('Error: ', error)
        } finally {
            setIsLoading(false)
        }
    }

    const toggleLoginForm = async (e) => {
        toggleSignUp(!isSignupFormOpen)
        toggleLogin(true)
    }

    const handleClickOutside = useCallback(
        (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                closeSignupForm()
            }
        },
        [closeSignupForm]
    )

    useEffect(() => {
        window.addEventListener('mousedown', handleClickOutside)
        return () => {
            window.removeEventListener('mousedown', handleClickOutside)
        }
    }, [handleClickOutside])

    const handleCancel = () => {
        closeSignupForm()
    }

    return (
        <Card className="w-[95vw] max-w-[400px] sm:w-[80vw] sm:max-w-[450px] lg:w-[60vw] lg:max-w-[500px] mx-auto px-4 sm:px-6 lg:px-8">
            <div ref={formRef}>
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">
                        Sign Up
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="username" className="font-bold">
                                Username
                            </label>
                            <Input
                                id="username"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
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
                                autoComplete="new-password"
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label
                                htmlFor="confirm-password"
                                className="font-bold"
                            >
                                Confirm Password
                            </label>
                            <Input
                                id="confirm-password"
                                placeholder="Confirm Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                autoComplete="new-password"
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="email" className="font-bold">
                                Email
                            </label>
                            <Input
                                id="email"
                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
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
                                    {isLoading ? 'Signing up...' : 'Sign Up'}
                                </Button>
                            </div>
                        </CardFooter>
                        <div className="text-center">
                            <p className="text-sm text-gray-500">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    className="text-purple-600 hover:underline focus:outline-none focus:ring"
                                    onClick={toggleLoginForm}
                                >
                                    Log in here
                                </button>
                            </p>
                        </div>
                    </form>
                </CardContent>
            </div>
        </Card>
    )
}

export default SignupForm
