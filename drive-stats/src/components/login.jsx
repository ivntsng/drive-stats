import React, { useState, useEffect } from 'react'
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

function LoginForm({ toggle }) {
    const [username, setUsername] = useState(
        localStorage.getItem('username') || ''
    )
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [token, setToken] = useState(sessionStorage.getItem('token') || '')
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
                localStorage.setItem('token', token)
                localStorage.setItem('username', username)
                setToken(token)
                setUsername(username)
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
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
        setToken('')
        setUsername('') // Clear username on logout
    }

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        if (storedToken) {
            setToken(storedToken)
        }
    }, [])

    return (
        <Card className="w-full md:w-[500px] mx-auto">
            <CardHeader>
                <CardTitle className="flex justify-center text-2xl font-bold">
                    {token ? 'Logged In' : 'Login'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {token ? (
                    <div>
                        <p>Welcome back {username}</p>
                        <Button onClick={handleLogout}>Logout</Button>
                    </div>
                ) : (
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="username" className="font-bold">
                                    Username
                                </label>
                                <Input
                                    id="username"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
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
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>
                    </form>
                )}
            </CardContent>
            {!token && (
                <CardFooter className="flex md:justify-between">
                    <Button
                        variant="outline"
                        onClick={toggle}
                        className="mr-10"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
}

export default LoginForm
