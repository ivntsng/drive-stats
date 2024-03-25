import React, { useState, useContext } from 'react'
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

export function handleLogout(setUser) {
    // Clear token from session storage
    sessionStorage.removeItem('token')
    setUser(null) // Clear user context
}

function LoginForm({ toggle }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { setUser } = useContext(UserContext)
    const { toast } = useToast()
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
                const data = await response.json()
                const { token, username } = data
                sessionStorage.setItem('token', token)
                setUser({ username, token })
                toggle()
                toast({
                    title: 'Logged In',
                    description: `Welcome back, ${username}`,
                })
            } else {
                console.error('Login Failed')
            }
        } catch (error) {
            console.error('Error: ', error)
        } finally {
            setIsLoading(false)
        }
    }

    function handleLogout() {
        // Clear token from session storage
        sessionStorage.removeItem('token')
        setUser(null) // Clear user context
        setUsername('')
        setPassword('')
    }

    return (
        <Card className="w-full md:w-[500px] mx-auto">
            <CardHeader>
                <CardTitle className="flex justify-center text-2xl font-bold">
                    Login
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
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
                        <div className="flex flex-col space-y-1.5">
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
                    </div>
                    <CardFooter className="flex md:justify-between mt-4">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    )
}

export default LoginForm
