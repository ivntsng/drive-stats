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
import { ChevronLeft, ChevronRight, MoreVertical, Copy } from 'lucide-react'

export default function VehicleDetail() {
    const { vehicle_id } = useParams()
    const [vehicle, setVehicle] = useState(null)
    const API_HOST = import.meta.env.VITE_API_HOST

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const response = await axios.get(
                    `${API_HOST}/vehicles/${vehicle_id}`
                )
                setVehicle(response.data)
            } catch (error) {
                console.error(
                    'There was an error fetching the vehicle details!',
                    error
                )
            }
        }

        fetchVehicle()
    }, [vehicle_id])

    if (!vehicle) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
            <Card className="overflow-hidden w-full max-w-2xl">
                <CardHeader className="flex flex-row items-start bg-muted/50">
                    <div className="grid gap-0.5">
                        <CardTitle className="group flex items-center gap-2 text-lg">
                            Vehicle Details: {vehicle.vehicle_name}
                        </CardTitle>
                        <CardDescription>
                            About:
                            hasdblfbgsahbfabfdladsbfljabdfajhsbfhbadslbfabfhajblhfbhdbfalhbfahbas
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
                                <DropdownMenuItem>Trash</DropdownMenuItem>
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
                                >
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                    <span className="sr-only">
                                        Previous Vehicle
                                    </span>
                                </Button>
                            </PaginationItem>
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-6 w-6"
                                >
                                    <ChevronRight className="h-3.5 w-3.5" />
                                    <span className="sr-only">
                                        Next Vehicle
                                    </span>
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </CardFooter>
            </Card>
        </div>
    )
}
