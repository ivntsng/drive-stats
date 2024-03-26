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

function SignupForm({ toggleSignUp, toggleLogin, closeSignupForm, login }) {
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
        if (password !== confirmPassword) {
            setError('Password do not match!')
            return
        }

        setError('')
        setIsLoading(true)
        try {
            // const usernameCheckResponse = await fetch(
            //     `${API_HOST}/users/${username}`
            // )
            // if (usernameCheckResponse.ok) {
            //     const responseData = usernameCheckResponse.status
            //     console.log(responseData) // This will log the response data
            // } else {
            //     console.error('Failed to fetch user data')
            // }

            const response = await fetch(`${API_HOST}/users/signup`, {
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
        toggleSignUp(false)
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

    return (
        <Card className="w-full md:w-[400px] mx-auto">
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
                            <div className="w-full md:w-auto md:mr-4 mb-2 md:mb-0">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full md:w-auto"
                                >
                                    {isLoading ? 'Signing up...' : 'Sign Up'}
                                </Button>
                            </div>
                            <div className="w-full md:w-auto">
                                <div className="md:hidden">
                                    {' '}
                                    {/* This ensures it's always below on smaller screens */}
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
                                <div className="hidden md:block">
                                    {' '}
                                    {/* This ensures it's always below on larger screens */}
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
                            </div>
                        </CardFooter>
                    </form>
                </CardContent>
            </div>
        </Card>
    )
}

export default SignupForm
