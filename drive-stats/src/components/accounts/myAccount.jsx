import React, { useContext, useState } from 'react'
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
    const [selectedSection, setSelectedSection] = useState('Account')
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
                    method: 'PUT',
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
            setError('An error occurred when trying to update your password.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-4 md:p-10 space-y-6 pb-16">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your account settings.
                </p>
            </div>
            <div
                data-orientation="horizontal"
                role="none"
                className="shrink-0 bg-border h-[1px] w-full"
                style={{ marginBottom: '20px', marginTop: '20px' }}
            ></div>
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="lg:w-1/5">
                    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                        <button
                            className={`inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 justify-start ${
                                selectedSection === 'Account'
                                    ? 'bg-muted hover:bg-muted'
                                    : 'hover:bg-transparent hover:underline'
                            }`}
                            onClick={() => setSelectedSection('Account')}
                        >
                            Account
                        </button>
                        <button
                            className={`inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 justify-start ${
                                selectedSection === 'Bug Report Status'
                                    ? 'bg-muted hover:bg-muted'
                                    : 'hover:bg-transparent hover:underline'
                            }`}
                            onClick={() =>
                                setSelectedSection('Bug Report Status')
                            }
                        >
                            Bug Report Status
                        </button>
                        <button
                            className={`inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 justify-start ${
                                selectedSection === 'Feature Request'
                                    ? 'bg-muted hover:bg-muted'
                                    : 'hover:bg-transparent hover:underline'
                            }`}
                            onClick={() =>
                                setSelectedSection('Feature Request')
                            }
                        >
                            Feature Request
                        </button>
                    </nav>
                </aside>
                <div className="flex-1 lg:max-w-2xl">
                    <div className="space-y-6">
                        {selectedSection === 'Account' && (
                            <div>
                                <h3 className="text-lg font-medium">Account</h3>
                                <p className="text-sm text-muted-foreground">
                                    Update your account settings.
                                </p>
                                <div
                                    data-orientation="horizontal"
                                    role="none"
                                    className="shrink-0 bg-border h-[1px] w-full"
                                    style={{
                                        marginBottom: '20px',
                                        marginTop: '20px',
                                    }}
                                ></div>
                                <form
                                    onSubmit={updateAccountSettings}
                                    className="space-y-8"
                                >
                                    <div className="space-y-2">
                                        <Label
                                            className="text-sm font-medium leading-none"
                                            htmlFor="username"
                                        >
                                            Username
                                        </Label>
                                        <Input
                                            type="text"
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
                                            id="username-description"
                                            className="text-[0.8rem] text-muted-foreground"
                                        >
                                            This is the name that will be
                                            displayed on your profile.
                                        </p>
                                    </div>
                                    <div className="space-y-2 flex flex-col">
                                        <Label
                                            className="text-sm font-medium leading-none"
                                            htmlFor="email"
                                        >
                                            Email
                                        </Label>
                                        <Input
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
                                            className="text-sm font-medium leading-none"
                                            htmlFor="current-password"
                                        >
                                            Current Password
                                        </Label>
                                        <Input
                                            type="password"
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="Current password"
                                            id="current-password"
                                            aria-describedby="current-password-description"
                                            aria-invalid="false"
                                            name="current-password"
                                            value={formData.current_password}
                                            autoComplete="off"
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    current_password:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2 flex flex-col">
                                        <Label
                                            className="text-sm font-medium leading-none"
                                            htmlFor="new-password"
                                        >
                                            New Password
                                        </Label>
                                        <Input
                                            type="password"
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="New password"
                                            id="new-password"
                                            aria-describedby="new-password-description"
                                            aria-invalid="false"
                                            name="new-password"
                                            value={formData.new_password}
                                            autoComplete="off"
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    new_password:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2 flex flex-col">
                                        <Label
                                            className="text-sm font-medium leading-none"
                                            htmlFor="confirm-password"
                                        >
                                            Confirm Password
                                        </Label>
                                        <Input
                                            type="password"
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="Confirm password"
                                            id="confirm-password"
                                            aria-describedby="confirm-password-description"
                                            aria-invalid="false"
                                            name="confirm-password"
                                            value={formData.confirm_password}
                                            autoComplete="off"
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    confirm_password:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    {error && (
                                        <p className="text-red-500">{error}</p>
                                    )}
                                    <Button
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                                        type="submit"
                                        disabled={isLoading}
                                    >
                                        Update account
                                    </Button>
                                </form>
                            </div>
                        )}
                        {selectedSection === 'Bug Report Status' && (
                            <div>
                                <h3 className="text-lg font-medium">
                                    Bug Report Status
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Check the status of your previously
                                    submitted bug reports.{' '}
                                    <strong>
                                        <span style={{ color: 'red' }}>
                                            (Feature In Development)
                                        </span>
                                    </strong>
                                </p>
                                <div
                                    data-orientation="horizontal"
                                    role="none"
                                    className="shrink-0 bg-border h-[1px] w-full"
                                    style={{
                                        marginBottom: '20px',
                                        marginTop: '20px',
                                    }}
                                ></div>
                            </div>
                        )}
                        {selectedSection === 'Feature Request' && (
                            <div>
                                <h3 className="text-lg font-medium">
                                    Feature Request
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Got a suggestion to make DriveStats better?
                                    Share it with us!{' '}
                                    <strong>
                                        <span style={{ color: 'red' }}>
                                            (Feature In Development)
                                        </span>
                                    </strong>
                                </p>
                                <div
                                    data-orientation="horizontal"
                                    role="none"
                                    className="shrink-0 bg-border h-[1px] w-full"
                                    style={{
                                        marginBottom: '20px',
                                        marginTop: '20px',
                                    }}
                                ></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
