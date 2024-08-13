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
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from '@/components/ui/pagination'
import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { CheckIcon } from '@radix-ui/react-icons'

function ConfirmDialog({ onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Card className="w-[380px]">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center">
                        Confirm Deletion
                    </CardTitle>
                    <CardDescription>
                        Are you sure you want to delete this vehicle? This
                        action cannot be undone.
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

export default function VehicleDetail() {
    const { vehicle_id } = useParams()
    const { user, setUser } = useContext(UserContext)
    const [vehicle, setVehicle] = useState(null)
    const [vehicleStats, setVehicleStats] = useState([])
    const [showVehicleDetails, setShowVehicleDetails] = useState(true)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const API_HOST = import.meta.env.VITE_API_HOST
    const navigate = useNavigate()
    const { toast } = useToast()

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

    const fetchVehicle = async (id, token) => {
        try {
            const response = await axios.get(`${API_HOST}/vehicles/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setVehicle(response.data)
        } catch (error) {
            if (error.response && error.response.status === 403) {
                toast({
                    title: 'Access Denied',
                    description:
                        'You do not have permission to view this vehicle.',
                })
                navigate('/') // Redirect to home or another safe page
            } else if (error.response && error.response.status === 404) {
                toast({
                    title: 'Vehicle Not Found',
                    description:
                        'The vehicle you are looking for does not exist.',
                })
                navigate('/') // Redirect to home or another safe page
            } else {
                console.error(
                    'There was an error fetching the vehicle details!',
                    error
                )
            }
        }
    }

    const deleteVehicle = async (id, token) => {
        try {
            const response = await axios.delete(
                `${API_HOST}/vehicles/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (response.status === 200) {
                console.log('Vehicle deleted successfully.')
                navigate('/')
                toast({
                    title: 'Vehicle Deleted',
                })
            } else {
                console.log('Failed to delete the vehicle.')
            }
        } catch (error) {
            console.error('Error deleting the vehicle:', error)
        }
    }

    const handleDeleteClick = () => {
        setShowConfirmDialog(true)
    }

    const handleConfirmDelete = () => {
        setShowConfirmDialog(false)
        deleteVehicle(vehicle.id, user.token)
    }

    const handleCancelDelete = () => {
        setShowConfirmDialog(false)
    }

    const fetchVehicleStats = async (id, token) => {
        try {
            const response = await axios.get(
                `${API_HOST}/vehicle_stats/all/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const stats = response.data
                .map((stat) => {
                    return Object.keys(stat).reduce((acc, key) => {
                        if (
                            stat[key] !== 0 &&
                            key !== 'id' &&
                            key !== 'vehicle_id' &&
                            key !== 'last_update_timestamp'
                        ) {
                            acc.push({
                                name: key,
                                value: stat[key],
                                last_update_timestamp:
                                    stat.last_update_timestamp,
                            })
                        }
                        return acc
                    }, [])
                })
                .flat()

            // Create a dictionary to keep only the most recent entry for each type
            const uniqueStats = stats.reduce((acc, stat) => {
                if (
                    !acc[stat.name] ||
                    new Date(acc[stat.name].last_update_timestamp) <
                        new Date(stat.last_update_timestamp)
                ) {
                    acc[stat.name] = stat
                }
                return acc
            }, {})

            // Convert the dictionary back into an array
            const filteredStats = Object.values(uniqueStats)

            setVehicleStats(filteredStats)
        } catch (error) {
            console.error(
                'There was an error fetching the vehicle statistics!',
                error
            )
        }
    }

    useEffect(() => {
        const getUserAndVehicle = async () => {
            const userData = await fetchUser()
            if (userData && userData.token) {
                await fetchVehicle(vehicle_id, userData.token)
            }
        }

        getUserAndVehicle()
    }, [vehicle_id])

    const handleNext = async () => {
        if (user && user.token) {
            await fetchVehicleStats(vehicle_id, user.token)
            setShowVehicleDetails(false)
        }
    }

    const handlePrevious = () => {
        setShowVehicleDetails(true)
    }

    const handleEditClick = () => {
        navigate(`/vehicles/garage/update/${vehicle.id}`)
    }

    if (!vehicle) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-full max-w-md p-6 rounded-lg shadow-md border border-gray-300 text-center">
                    We ran into an issue loading your vehicle! Try refreshing
                    the page and if nothing happens please submit a bug report.
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
            {showVehicleDetails ? (
                <Card className="overflow-hidden w-full max-w-2xl">
                    <CardHeader className="flex flex-row items-start bg-muted/50">
                        <div className="grid gap-0.5">
                            <CardTitle className="group flex items-center gap-2 text-lg">
                                Vehicle Details: {vehicle.vehicle_name}
                            </CardTitle>
                            <CardDescription>
                                About: {vehicle.about}
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
                                    <DropdownMenuItem
                                        onClick={handleDeleteClick}
                                    >
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
                                        <strong>VIN:</strong>
                                    </span>
                                    <span>{vehicle.vin}</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        <strong>Year:</strong>
                                    </span>
                                    <span>{vehicle.year}</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        <strong>Mileage:</strong>
                                    </span>
                                    <span>{vehicle.mileage}</span>
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                        <div className="text-xs text-muted-foreground">
                            Created: {vehicle.created_date}
                        </div>
                        <Pagination className="ml-auto mr-0 w-auto">
                            <PaginationContent>
                                <PaginationItem>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-6 w-6"
                                        onClick={handleNext}
                                    >
                                        <ChevronRight className="h-3.5 w-3.5" />
                                        <span className="sr-only">Next</span>
                                    </Button>
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </CardFooter>
                </Card>
            ) : (
                <Card className="overflow-hidden w-full max-w-2xl">
                    <CardHeader className="flex flex-row items-start bg-muted/50">
                        <div className="grid gap-0.5">
                            <CardTitle className="group flex items-center gap-2 text-lg">
                                Maintenance Log:
                            </CardTitle>
                            <CardDescription>
                                Most recent logs for vehicle:{' '}
                                {vehicle.vehicle_name}
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
                                    <DropdownMenuItem>
                                        Edit Current Log
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        Add New Log
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 text-sm">
                        <div className="grid gap-3">
                            <ul className="grid gap-3">
                                {vehicleStats.map((stat, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="text-muted-foreground">
                                            <strong>
                                                {stat.name.replace(/_/g, ' ')}:
                                            </strong>
                                        </span>
                                        <span>{stat.value} miles</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                        <Pagination className="ml-auto mr-0 w-auto">
                            <PaginationContent>
                                <PaginationItem>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-6 w-6"
                                        onClick={handlePrevious}
                                    >
                                        <ChevronLeft className="h-3.5 w-3.5" />
                                        <span className="sr-only">
                                            Previous
                                        </span>
                                    </Button>
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </CardFooter>
                </Card>
            )}
            {showConfirmDialog && (
                <ConfirmDialog
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </div>
    )
}
