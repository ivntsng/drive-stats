import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
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

export default function VehicleDetail() {
    const { vehicle_id } = useParams()
    const [vehicle, setVehicle] = useState(null)
    const [vehicleStats, setVehicleStats] = useState(null)
    const [showVehicleDetails, setShowVehicleDetails] = useState(true)
    const API_HOST = import.meta.env.VITE_API_HOST

    const fetchVehicle = async (id) => {
        try {
            const response = await axios.get(`${API_HOST}/vehicles/${id}`)
            setVehicle(response.data)
        } catch (error) {
            console.error(
                'There was an error fetching the vehicle details!',
                error
            )
        }
    }

    const fetchVehicleStats = async (id) => {
        try {
            const response = await axios.get(`${API_HOST}/vehicle_stats/${id}`)
            setVehicleStats(response.data)
        } catch (error) {
            console.error(
                'There was an error fetching the vehicle statistics!',
                error
            )
        }
    }

    useEffect(() => {
        fetchVehicle(vehicle_id)
    }, [vehicle_id])

    const handleNext = () => {
        fetchVehicleStats(vehicle_id)
        setShowVehicleDetails(false)
    }

    const handlePrevious = () => {
        setShowVehicleDetails(true)
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
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Delete</DropdownMenuItem>
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
                                {vehicleStats?.last_oil_change != null &&
                                    vehicleStats.last_oil_change !== 0 && (
                                        <li className="flex items-center justify-between">
                                            <span className="text-muted-foreground">
                                                <strong>
                                                    Last Oil Change:
                                                </strong>
                                            </span>
                                            <span>
                                                {vehicleStats.last_oil_change}
                                            </span>
                                        </li>
                                    )}
                                {vehicleStats?.last_tire_rotation != null &&
                                    vehicleStats.last_tire_rotation !== 0 && (
                                        <li className="flex items-center justify-between">
                                            <span className="text-muted-foreground">
                                                <strong>
                                                    Last Tire Rotation:
                                                </strong>
                                            </span>
                                            <span>
                                                {
                                                    vehicleStats.last_tire_rotation
                                                }
                                            </span>
                                        </li>
                                    )}
                                {vehicleStats?.last_tire_change != null &&
                                    vehicleStats.last_tire_change !== 0 && (
                                        <li className="flex items-center justify-between">
                                            <span className="text-muted-foreground">
                                                <strong>
                                                    Last Tire Change:
                                                </strong>
                                            </span>
                                            <span>
                                                {vehicleStats.last_tire_change}
                                            </span>
                                        </li>
                                    )}
                                {vehicleStats?.last_air_filter != null &&
                                    vehicleStats.last_air_filter !== 0 && (
                                        <li className="flex items-center justify-between">
                                            <span className="text-muted-foreground">
                                                <strong>
                                                    Last Air Filter Change:
                                                </strong>
                                            </span>
                                            <span>
                                                {vehicleStats.last_air_filter}
                                            </span>
                                        </li>
                                    )}
                                {vehicleStats?.last_brake_flush != null &&
                                    vehicleStats.last_brake_flush !== 0 && (
                                        <li className="flex items-center justify-between">
                                            <span className="text-muted-foreground">
                                                <strong>
                                                    Last Brake Flush:
                                                </strong>
                                            </span>
                                            <span>
                                                {vehicleStats.last_brake_flush}
                                            </span>
                                        </li>
                                    )}
                                {vehicleStats?.last_brake_rotor != null &&
                                    vehicleStats.last_brake_rotor !== 0 && (
                                        <li className="flex items-center justify-between">
                                            <span className="text-muted-foreground">
                                                <strong>
                                                    Last Brake Rotor Change:
                                                </strong>
                                            </span>
                                            <span>
                                                {vehicleStats.last_brake_rotor}
                                            </span>
                                        </li>
                                    )}
                                {vehicleStats?.last_brake_pad != null &&
                                    vehicleStats.last_brake_pad !== 0 && (
                                        <li className="flex items-center justify-between">
                                            <span className="text-muted-foreground">
                                                <strong>
                                                    Last Brake Pad Change:
                                                </strong>
                                            </span>
                                            <span>
                                                {vehicleStats.last_brake_pad}
                                            </span>
                                        </li>
                                    )}
                                {vehicleStats?.last_coolant_flush != null &&
                                    vehicleStats.last_coolant_flush !== 0 && (
                                        <li className="flex items-center justify-between">
                                            <span className="text-muted-foreground">
                                                <strong>
                                                    Last Coolant Flush:
                                                </strong>
                                            </span>
                                            <span>
                                                {
                                                    vehicleStats.last_coolant_flush
                                                }
                                            </span>
                                        </li>
                                    )}
                                {vehicleStats?.last_transmission_fluid_flush !=
                                    null &&
                                    vehicleStats.last_transmission_fluid_flush !==
                                        0 && (
                                        <li className="flex items-center justify-between">
                                            <span className="text-muted-foreground">
                                                <strong>
                                                    Last Transmission Fluid
                                                    Flush:
                                                </strong>
                                            </span>
                                            <span>
                                                {
                                                    vehicleStats.last_transmission_fluid_flush
                                                }
                                            </span>
                                        </li>
                                    )}
                                {vehicleStats?.last_cabin_filter_change !=
                                    null &&
                                    vehicleStats.last_cabin_filter_change !==
                                        0 && (
                                        <li className="flex items-center justify-between">
                                            <span className="text-muted-foreground">
                                                <strong>
                                                    Last Cabin Filter Change:
                                                </strong>
                                            </span>
                                            <span>
                                                {
                                                    vehicleStats.last_cabin_filter_change
                                                }
                                            </span>
                                        </li>
                                    )}
                                {vehicleStats?.last_wiper_blades_change !=
                                    null &&
                                    vehicleStats.last_wiper_blades_change !==
                                        0 && (
                                        <li className="flex items-center justify-between">
                                            <span className="text-muted-foreground">
                                                <strong>
                                                    Last Wiper Blade Replaced:
                                                </strong>
                                            </span>
                                            <span>
                                                {
                                                    vehicleStats.last_wiper_blades_change
                                                }
                                            </span>
                                        </li>
                                    )}
                            </ul>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                        <div className="text-xs text-muted-foreground">
                            Lastest Update:{' '}
                            {vehicleStats?.last_update_timestamp ||
                                'There is no maintenance log available for this vehicle yet - Add one here'}
                        </div>
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
        </div>
    )
}
