import { useContext, useState, useCallback, useEffect } from 'react'
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
        try {
            const response = await axios.get(
                `${API_HOST}/api/auth/authenticate`,
                {
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

    // Function to fetch vehicles by user ID
    const fetchVehicles = async (userId) => {
        try {
            const response = await axios.get(
                `${API_HOST}/vehicles/user/${userId}`
            )
            setVehicles(response.data)
        } catch (error) {
            console.error('There was an error fetching the vehicles!', error)
        }
    }

    const addVehicle = (newVehicle) => {
        setVehicles([...vehicles, newVehicle])
    }

    // useEffect to fetch user and vehicles on component mount
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
                    <Table className="min-w-full">
                        <TableCaption className="text-center">
                            {vehicles.length === 0 ? (
                                <>
                                    You don't have any vehicles registered,
                                    register your vehicle{' '}
                                    <a
                                        href="/vehicles/register"
                                        style={{
                                            color: '#551A8B',
                                            textDecoration: 'underline',
                                        }}
                                    >
                                        here
                                    </a>
                                    !
                                </>
                            ) : (
                                <>
                                    You currently have {vehicles.length}{' '}
                                    vehicles registered.
                                </>
                            )}
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px] text-center font-bold">
                                    Name
                                </TableHead>
                                <TableHead className="text-center font-bold">
                                    Make
                                </TableHead>
                                <TableHead className="text-center font-bold">
                                    Model
                                </TableHead>
                                <TableHead className="text-center font-bold">
                                    Maintenance Logs
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vehicles.map((vehicle) => (
                                <TableRow key={vehicle.vin}>
                                    <TableCell className="font-medium text-center">
                                        <Link
                                            to={`/vehicles/garage/${vehicle.id}`}
                                            className="hover:text-purple-600 hover:underline"
                                        >
                                            {vehicle.vehicle_name}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {vehicle.make}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {vehicle.model}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        Feature In Progress
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
