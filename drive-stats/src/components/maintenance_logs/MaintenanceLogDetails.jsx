import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../../UserContext'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react'

function ConfirmDialog({ onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Card className="w-[380px]">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center">
                        Confirm Deletion
                    </CardTitle>
                    <CardDescription>
                        Are you sure you want to delete this maintenance log?
                        This action cannot be undone.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                    <Button onClick={onCancel} variant="outline">
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} variant="destructive">
                        Confirm
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default function MaintenanceLogDetails() {
    const { log_id } = useParams()
    const { user, setUser } = useContext(UserContext)
    const [maintenanceLog, setMaintenanceLog] = useState(null)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const API_HOST = import.meta.env.VITE_API_HOST
    const navigate = useNavigate()
    const { toast } = useToast()

    useEffect(() => {
        const fetchUser = async () => {
            const token = sessionStorage.getItem('token')
            if (!token) return null
            try {
                const response = await axios.get(
                    `${API_HOST}/api/auth/authenticate`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                )
                setUser(response.data)
                return response.data
            } catch (error) {
                console.error(
                    'There was an error fetching the user details!',
                    error
                )
                return null
            }
        }

        const fetchMaintenanceLog = async (logId, token) => {
            try {
                const response = await axios.get(
                    `${API_HOST}/api/vehicle-maintenance/maintenance-log/detail/${logId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                const logData = response.data

                // Fetch the associated vehicle to verify ownership
                const vehicleResponse = await axios.get(
                    `${API_HOST}/vehicles/${logData.vehicle_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                const vehicleData = vehicleResponse.data

                // Check if the current user owns the vehicle
                if (vehicleData.user_id !== user.id) {
                    toast({
                        title: 'Access Denied',
                        description: 'This is not your vehicle.',
                    })
                    navigate('/')
                    return
                }

                setMaintenanceLog(logData)
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    toast({
                        title: 'Access Denied',
                        description:
                            'You do not have permission to view this maintenance log.',
                    })
                    navigate('/')
                } else if (error.response && error.response.status === 404) {
                    toast({
                        title: 'Maintenance Log Not Found',
                        description:
                            'The maintenance log you are looking for does not exist.',
                    })
                    navigate('/')
                } else {
                    console.error(
                        'There was an error fetching the maintenance log details!',
                        error
                    )
                }
            }
        }

        const getUserAndLog = async () => {
            const userData = await fetchUser()
            if (userData && userData.token && log_id) {
                await fetchMaintenanceLog(log_id, userData.token)
            }
        }

        getUserAndLog()
    }, [log_id, API_HOST, navigate, setUser, toast])

    const deleteMaintenanceLog = async (log_id, token) => {
        try {
            const response = await axios.delete(
                `${API_HOST}/api/vehicle-maintenance/maintenance-log/delete/${log_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (response.status === 200) {
                navigate('/')
                toast({
                    title: 'Service Log Deleted.',
                })
            } else {
                console.log('Failed to delete service log.')
            }
        } catch (error) {
            console.error('Error deleting service log: ', error)
        }
    }

    const handleDeleteClick = () => {
        setShowConfirmDialog(true)
    }

    const handleConfirmDelete = () => {
        setShowConfirmDialog(false)
        deleteMaintenanceLog(maintenanceLog.id, user.token)
    }

    const handleCancelDelete = () => {
        setShowConfirmDialog(false)
    }

    const handleEditClick = () => {
        navigate(
            `/vehicles/garage/maintenance/maintenance-log/update/${log_id}`
        )
    }

    if (!maintenanceLog) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-full max-w-md p-6 rounded-lg shadow-md border border-gray-300 text-center">
                    We ran into an issue loading the maintenance log! Try
                    re-logging into your account.
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
            <Card className="overflow-hidden w-full max-w-2xl">
                <CardHeader className="flex flex-row items-start bg-muted/50">
                    <div className="grid gap-0.5">
                        <CardTitle className="group flex items-center gap-2 text-lg">
                            Log Details
                        </CardTitle>
                        <CardDescription>
                            {maintenanceLog.description}
                        </CardDescription>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8"
                                >
                                    <MoreVertical className="h-3.5 w-3.5" />
                                    <span className="sr-only">More</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleEditClick}>
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleDeleteClick}>
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                    <div className="grid gap-3">
                        <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    <strong>Maintenance Type:</strong>
                                </span>
                                <span>{maintenanceLog.maintenance_type}</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    <strong>Mileage:</strong>
                                </span>
                                <span>{maintenanceLog.mileage}</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    <strong>Cost:</strong>
                                </span>
                                <span>${maintenanceLog.cost}</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    <strong>Maintenance Date:</strong>
                                </span>
                                <span>{maintenanceLog.service_date}</span>
                            </li>
                        </ul>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                    <div className="text-xs text-muted-foreground">
                        Created: {maintenanceLog.created_date}
                    </div>
                </CardFooter>
            </Card>
            {showConfirmDialog && (
                <ConfirmDialog
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </div>
    )
}
