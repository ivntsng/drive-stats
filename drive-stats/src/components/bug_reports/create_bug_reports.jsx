import React, { useContext, useState, useRef } from 'react'
import { useToast } from '@/components/ui/use-toast'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
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
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../UserContext'

export default function CreateBugReportForm() {
    const { toast } = useToast()
    const { user } = useContext(UserContext)
    const formRef = useRef(null)
    const [formData, setFormData] = useState({
        bug_title: '',
        bug_desc: '',
        bug_behavior: '',
        bug_rating: '',
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const API_HOST = import.meta.env.VITE_API_HOST
    const navigate = useNavigate()
    const handleCancel = () => {
        navigate('/') // Navigates back to the home page
    }

    async function createBugReport(e) {
        e.preventDefault()

        if (!formData.bug_behavior) {
            setError(
                'Please select the area where you are experiencing difficulties.'
            )
            return
        }

        if (!formData.bug_rating) {
            setError(
                'Please choose the severity level that you believe best corresponds to this issue.'
            )
            return
        }

        if (!formData.bug_title) {
            setError('Please provide a title for this bug.')
            return
        }

        if (!formData.bug_desc) {
            setError(
                'Kindly provide a detailed description of the bug to help our development team identify and resolve the issue more efficiently.'
            )
            return
        }

        setError('')
        setIsLoading(true)
        try {
            const response = await fetch(`${API_HOST}/bug_report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`,
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            })

            if (response.ok) {
                setFormData({
                    bug_title: '',
                    bug_desc: '',
                    bug_behavior: '',
                    bug_rating: '',
                })
                toast({
                    title: 'Successfully submitted bug report.',
                })
                navigate('/')
            } else {
                setError('There was an error submitting the bug report.')
            }
        } catch (error) {
            setError('An error occurred when trying to submit the bug report.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-[850px]">
                <Card className="rounded-xl border bg-card text-card-foreground shadow">
                    <CardHeader>
                        <CardTitle className="font-semibold leading-none tracking-tight">
                            Report an issue
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            What area of the application did you find the bug?
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={createBugReport} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="area"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Area
                                    </Label>
                                    <Select
                                        onValueChange={(value) => {
                                            setFormData({
                                                ...formData,
                                                bug_behavior: value,
                                            })
                                        }}
                                    >
                                        <SelectTrigger id="area">
                                            <SelectValue placeholder="Select an area" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Main Page">
                                                Main Page
                                            </SelectItem>
                                            <SelectItem value="Login">
                                                Login
                                            </SelectItem>
                                            <SelectItem value="Accounts">
                                                Accounts
                                            </SelectItem>
                                            <SelectItem value="Vehicles">
                                                Vehicles
                                            </SelectItem>
                                            <SelectItem value="Maintenance Logs">
                                                Maintenance Logs
                                            </SelectItem>
                                            <SelectItem value="Other">
                                                Other
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="Severity-level"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Severity Level
                                    </Label>
                                    <Select
                                        onValueChange={(value) => {
                                            setFormData({
                                                ...formData,
                                                bug_rating: value,
                                            })
                                        }}
                                    >
                                        <SelectTrigger id="Severity-level">
                                            <SelectValue placeholder="Select severity level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Low">
                                                Low
                                            </SelectItem>
                                            <SelectItem value="Medium">
                                                Medium
                                            </SelectItem>
                                            <SelectItem value="High">
                                                High
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="subject"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Subject
                                </Label>
                                <Input
                                    id="subject"
                                    placeholder="Ex. Issue with creating a vehicle."
                                    value={formData.bug_title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            bug_title: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="description"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Description
                                </Label>
                                <textarea
                                    id="description"
                                    placeholder="Please try to include all information relevant to your issue - (Steps to reproduce, bug behavior, and what the expected behavior should be)."
                                    value={formData.bug_desc}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            bug_desc: e.target.value,
                                        })
                                    }
                                    className="min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                            {error && <p className="text-red-500">{error}</p>}
                            <div className="flex items-center justify-between space-x-2 p-6 pt-0">
                                <Button
                                    type="button"
                                    onClick={handleCancel}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                                >
                                    {isLoading ? 'Submitting...' : 'Submit'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
