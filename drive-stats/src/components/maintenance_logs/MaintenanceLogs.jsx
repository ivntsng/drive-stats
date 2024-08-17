import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../../UserContext'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'

const MaintenanceLogPage = () => {
    const API_HOST = import.meta.env.VITE_API_HOST
    const { vehicle_id } = useParams()
    const { user, setUser } = useContext(UserContext)
    const [vehicleLogs, setVehicleLogs] = useState([])
    const totalCost = vehicleLogs.reduce((acc, log) => acc + log.cost, 0)
    const navigate = useNavigate()
    const { toast } = useToast()

    const fetchVehicleLogs = async (id, token) => {
        try {
            // Fetch the associated vehicle to verify ownership
            const vehicleResponse = await axios.get(
                `${API_HOST}/vehicles/${id}`,
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

            // If the user owns the vehicle, fetch the maintenance logs
            const response = await axios.get(
                `${API_HOST}/api/vehicle-maintenance/maintenance-logs/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            setVehicleLogs(response.data)
        } catch (error) {
            console.error(
                'There was an error fetching the maintenance logs:',
                error
            )
            if (error.response && error.response.status === 403) {
                toast({
                    title: 'Access Denied',
                    description:
                        'You do not have permission to view these maintenance logs.',
                })
                navigate('/')
            } else if (error.response && error.response.status === 404) {
                toast({
                    title: 'Vehicle Not Found',
                    description:
                        'The vehicle you are looking for does not exist.',
                })
                navigate('/')
            } else {
                console.error(
                    'There was an error fetching the vehicle or maintenance logs!',
                    error
                )
            }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const token = sessionStorage.getItem('token')
            if (!token) return

            try {
                const userResponse = await axios.get(
                    `${API_HOST}/api/auth/authenticate`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                )
                setUser(userResponse.data)
                await fetchVehicleLogs(vehicle_id, token)
            } catch (error) {
                console.error('There was an error:', error)
            }
        }

        fetchData()
    }, [vehicle_id])

    const handleLogClick = (maintenance_id) => {
        navigate(
            `/vehicles/garage/maintenance/maintenance-log/${maintenance_id}`
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-4xl p-0 sm:p-6 md:p-8 rounded-lg shadow-md mb-[170px]">
                <div className="overflow-x-auto rounded-lg border border-gray-300 p-4">
                    <Table className="min-w-full">
                        <TableCaption className="text-center">
                            {vehicleLogs.length === 0 ? (
                                <>No Maintenance logs found.</>
                            ) : (
                                <>
                                    You have {vehicleLogs.length} maintenance
                                    logs. Total spent ${totalCost.toFixed(2)}.
                                </>
                            )}
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px] text-center font-bold">
                                    Maintenance Date
                                </TableHead>
                                <TableHead className="text-center font-bold">
                                    Maintenance Type
                                </TableHead>
                                <TableHead className="text-center font-bold">
                                    Mileage
                                </TableHead>
                                <TableHead className="text-center font-bold">
                                    Cost
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vehicleLogs.map((log, index) => (
                                <TableRow
                                    key={index}
                                    onClick={() => handleLogClick(log.id)}
                                    className="cursor-pointer"
                                    style={{
                                        backgroundColor: log.isHovered
                                            ? '#001d3d'
                                            : 'transparent',
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                            '#001d3d')
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                            'transparent')
                                    }
                                >
                                    <TableCell className="text-center">
                                        {log.service_date}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {log.maintenance_type}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {log.mileage}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        ${log.cost}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default MaintenanceLogPage
