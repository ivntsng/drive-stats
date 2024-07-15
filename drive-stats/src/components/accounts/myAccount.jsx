import React, { useContext, useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserContext } from '../../UserContext'
import { useNavigate } from 'react-router-dom'

export default function MyAccount() {
    const { toast } = useToast()
    const { user } = useContext(UserContext)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const API_HOST = import.meta.env.VITE_API_HOST
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: user.username,
        current_password: '',
        new_password: '',
        confirm_password: '',
    })

    async function updateAccountSettings(e) {
        e.preventDefault()

        if (!formData.current_password) {
            setError('Current password field is empty.')
            return
        }

        if (!formData.new_password) {
            setError('New password field is empty.')
            return
        }

        if (formData.new_password !== formData.confirm_password) {
            setError('New password and confirm password do not match.')
            return
        }

        setError('')
        setIsLoading(true)

        try {
            const response = await fetch(
                `${API_HOST}/account/update-password`,
                {
                    method: `PUT`,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user?.token}`,
                    },
                    body: JSON.stringify(formData),
                    credentials: 'include',
                }
            )

            if (response.ok) {
                setFormData({
                    username: '',
                    current_password: '',
                    new_password: '',
                    confirm_password: '',
                })
                toast({
                    title: 'Successfully updated your password.',
                })
                navigate('/')
            } else {
                setError('There was an error updating your password.')
            }
        } catch (error) {
            setError('An error occured when trying to update your password.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="hidden space-y-6 p-10 pb-16 md:block">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your account settings.
                </p>
            </div>
            <div
                data-orientation="horizontal"
                role="none"
                className="shrink-0 bg-border h-[1px] w-full my-6"
            ></div>
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5">
                    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                        <a
                            className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 bg-muted hover:bg-muted justify-start"
                            href="/examples/forms/account"
                        >
                            Account
                        </a>
                        <a
                            className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 hover:bg-transparent hover:underline justify-start"
                            href="/examples/forms/appearance"
                        >
                            Bug Report Status
                        </a>
                        <a
                            className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 hover:bg-transparent hover:underline justify-start"
                            href="/examples/forms/appearance"
                        >
                            Feature Request
                        </a>
                    </nav>
                </aside>
                <div className="flex-1 lg:max-w-2xl">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium">Account</h3>
                            <p className="text-sm text-muted-foreground">
                                Update your account settings. Check your bug
                                report status. Request a new feature.
                            </p>
                        </div>
                        <div
                            data-orientation="horizontal"
                            role="none"
                            className="shrink-0 bg-border h-[1px] w-full"
                        ></div>
                        <form
                            onSubmit={updateAccountSettings}
                            className="space-y-8"
                        >
                            <div className="space-y-2">
                                <Label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="username"
                                >
                                    Username
                                </Label>
                                <Input
                                    type="text"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Your username"
                                    id="username"
                                    aria-describedby="username-description"
                                    aria-invalid="false"
                                    name="username"
                                    value={user.username}
                                    autoComplete="off"
                                    disabled
                                />
                                <p
                                    id="name-description"
                                    className="text-[0.8rem] text-muted-foreground"
                                >
                                    This is the name that will be displayed on
                                    your profile.
                                </p>
                            </div>
                            <div className="space-y-2 flex flex-col">
                                <Label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="email"
                                >
                                    Email
                                </Label>
                                <Input
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Current e-mail"
                                    id="email"
                                    aria-describedby="email-description"
                                    aria-invalid="false"
                                    name="email"
                                    value={user.email}
                                    disabled
                                    autoComplete="off"
                                />
                            </div>
                            <div className="space-y-2 flex flex-col">
                                <Label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="current-password"
                                >
                                    Current Password
                                </Label>
                                <Input
                                    type="password"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Current password"
                                    id="current-password"
                                    aria-describedby="current-password"
                                    aria-invalid="false"
                                    name="current-password"
                                    value={formData.current_password}
                                    autoComplete="off"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            current_password: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2 flex flex-col">
                                <Label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="new-password"
                                >
                                    New Password
                                </Label>
                                <Input
                                    type="password"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="New password"
                                    id="new-password"
                                    aria-describedby="new-password"
                                    aria-invalid="false"
                                    name="new-password"
                                    value={formData.new_password}
                                    autoComplete="off"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            new_password: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2 flex flex-col">
                                <Label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="confirm-password"
                                >
                                    Confirm Password
                                </Label>
                                <Input
                                    type="password"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Confirm password"
                                    id="confirm-password"
                                    aria-describedby="confirm-password"
                                    aria-invalid="false"
                                    name="confirm-password"
                                    value={formData.confirm_password}
                                    autoComplete="off"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            confirm_password: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            {error && <p className="text-red-500">{error}</p>}
                            <Button
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                                type="submit"
                                disabled={isLoading}
                            >
                                Update account
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
