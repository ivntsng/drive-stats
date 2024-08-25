import { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../UserContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

export default function Garage() {
    const { user, setUser } = useContext(UserContext)
    const [vehicles, setVehicles] = useState([])
    const API_HOST = import.meta.env.VITE_API_HOST

    const fetchUser = async () => {
        const token = sessionStorage.getItem('token')
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

    const fetchVehicles = async (userId) => {
        const token = sessionStorage.getItem('token')
        try {
            const response = await axios.get(
                `${API_HOST}/vehicles/user/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            // Check if response data is an array before setting state
            if (Array.isArray(response.data)) {
                setVehicles(response.data)
            } else {
                console.warn('Unexpected response format:', response.data)
                setVehicles([])
            }
        } catch (error) {
            console.error('There was an error fetching the vehicles!', error)
            setVehicles([])
        }
    }

    useEffect(() => {
        const getUserAndVehicles = async () => {
            const userData = await fetchUser()
            if (userData && userData.id) {
                await fetchVehicles(userData.id)
            }
        }

        getUserAndVehicles()
    }, [])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-4xl p-0 sm:p-6 md:p-8 rounded-lg shadow-md mb-[170px]">
                <p className="mb-4 text-xl font-semibold text-center mb-[50px]">
                    Welcome to your garage, {user?.username}!
                </p>
                <div className="overflow-x-auto rounded-lg border border-gray-300 p-4">
                    <Table className="min-w-full table-fixed">
                        <TableCaption className="text-center">
                            {vehicles.length === 0 ? (
                                <>
                                    Your garage is empty! Register your first
                                    vehicle{' '}
                                    <a
                                        href="/vehicles/register"
                                        style={{
                                            color: '#001d3d',
                                            textDecoration: 'underline',
                                        }}
                                    >
                                        here
                                    </a>
                                    !
                                </>
                            ) : (
                                <>
                                    You have {vehicles.length} vehicles
                                    registered. Click on a vehicle's name to
                                    navigate to vehicle details.
                                </>
                            )}
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/4 text-center font-bold">
                                    Name
                                </TableHead>
                                <TableHead className="w-1/4 text-center font-bold">
                                    Make
                                </TableHead>
                                <TableHead className="w-1/4 text-center font-bold">
                                    Model
                                </TableHead>
                                <TableHead className="w-1/4 text-center font-bold">
                                    Maintenance
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vehicles.map((vehicle) => (
                                <TableRow key={vehicle.vin}>
                                    <TableCell className="w-1/4 font-medium text-center">
                                        <Link
                                            to={`/vehicles/garage/${vehicle.id}`}
                                            className="hover:text-purple-600 hover:underline"
                                        >
                                            {vehicle.vehicle_name}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="w-1/4 text-center">
                                        {vehicle.make}
                                    </TableCell>
                                    <TableCell className="w-1/4 text-center">
                                        {vehicle.model}
                                    </TableCell>
                                    <TableCell className="w-1/4 text-center">
                                        <Link
                                            to={`/vehicles/garage/maintenance/${vehicle.id}`}
                                            className="hover:text-purple-600 hover:underline"
                                        >
                                            Records
                                        </Link>
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
