import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
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

const ServiceLogPage = () => {
    const API_HOST = import.meta.env.VITE_API_HOST
    const { vehicle_id } = useParams()
    const { user, setUser } = useContext(UserContext)
    const [vehicleLogs, setVehicleLogs] = useState([])
    const totalCost = vehicleLogs.reduce((acc, log) => acc + log.cost, 0)

    const fetchVehicleLogs = async (id, token) => {
        try {
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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-4xl p-0 sm:p-6 md:p-8 rounded-lg shadow-md mb-[170px]">
                <div className="overflow-x-auto rounded-lg border border-gray-300 p-4">
                    <Table className="min-w-full">
                        <TableCaption className="text-center">
                            {vehicleLogs.length === 0 ? (
                                <>No service logs found.</>
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
                                    Service Date
                                </TableHead>
                                <TableHead className="text-center font-bold">
                                    Service Type
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
                                <TableRow key={index}>
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

export default ServiceLogPage
