import React, { useContext, useState, useRef, useEffect } from 'react'
import { UserContext } from '../../UserContext'
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardFooter,
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
import { useNavigate } from 'react-router-dom'

export default function VehicleStat() {
    const { user, setUser } = useContext(UserContext)
    const [vehicles, setVehicles] = useState([])
    const formRef = useRef(null)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const API_HOST = import.meta.env.VITE_API_HOST
    const { toast } = useToast()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        vehicle_id: '',
        last_oil_change: '',
        last_tire_rotation: '',
        last_tire_change: '',
        last_air_filter: '',
        last_brake_flush: '',
        last_brake_rotor: '',
        last_brake_pad: '',
        last_coolant_flush: '',
        last_transmission_fluid_flush: '',
        last_cabin_filter_change: '',
        last_wiper_blades_change: '',
    })
    const [selectedVehicleName, setSelectedVehicleName] = useState('')

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

    useEffect(() => {
        const getUserAndVehicles = async () => {
            const userData = await fetchUser()
            if (userData && userData.id) {
                await fetchVehicles(userData.id)
            }
        }

        getUserAndVehicles()
    }, [])

    async function createMaintenanceLog(e) {
        e.preventDefault()
        setIsLoading(true)

        const processedFormData = Object.keys(formData).reduce((acc, key) => {
            acc[key] = formData[key] === '' ? 0 : formData[key]
            return acc
        }, {})

        try {
            const response = await fetch(
                `${API_HOST}/vehicle_stats/${formData.vehicle_id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(processedFormData),
                    credentials: 'include',
                }
            )

            if (response.ok) {
                setFormData({
                    vehicle_id: '',
                    last_oil_change: '',
                    last_tire_rotation: '',
                    last_tire_change: '',
                    last_air_filter: '',
                    last_brake_flush: '',
                    last_brake_rotor: '',
                    last_brake_pad: '',
                    last_coolant_flush: '',
                    last_transmission_fluid_flush: '',
                    last_cabin_filter_change: '',
                    last_wiper_blades_change: '',
                })
                setSelectedVehicleName('')
                toast({
                    title: `Successfully created a new maintenance log!`,
                    description: `You can view the maintenance log in your vehicle details.`,
                })
                navigate('/')
            } else {
                setError(`There was an issue creating a maintenance log.`)
            }
        } catch (error) {
            console.error('Error: ', error)
            setError(
                'An error occurred while trying to create a maintenance log.'
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen px-4 py-6 sm:px-6 lg:px-8">
            <Card className="w-[380px] mx-auto p-4">
                <div ref={formRef}>
                    <CardHeader>
                        <CardTitle className="text-center text-2xl font-bold">
                            New Maintenance Log
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={createMaintenanceLog}
                            className="space-y-4"
                        >
                            <div className="flex flex-col space-y-2">
                                <Label
                                    htmlFor="vehicleName"
                                    className="font-bold"
                                >
                                    Choose Vehicle
                                </Label>
                                <Select
                                    onValueChange={(value) => {
                                        const selectedVehicle = vehicles.find(
                                            (vehicle) =>
                                                vehicle.id === Number(value)
                                        )
                                        setFormData({
                                            ...formData,
                                            vehicle_id: selectedVehicle
                                                ? selectedVehicle.id
                                                : '',
                                        })
                                        setSelectedVehicleName(
                                            selectedVehicle
                                                ? selectedVehicle.vehicle_name
                                                : ''
                                        )
                                    }}
                                >
                                    <SelectTrigger id="vehicleName">
                                        <SelectValue placeholder="Select a vehicle">
                                            {selectedVehicleName ||
                                                'Select a vehicle'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vehicles.map((vehicle) => (
                                            <SelectItem
                                                key={vehicle.id}
                                                value={vehicle.id.toString()}
                                            >
                                                {vehicle.vehicle_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {[
                                {
                                    id: 'oilChange',
                                    label: 'Last Oil Change',
                                    placeholder: '(Ex. 55,000)',
                                    value: formData.last_oil_change,
                                    key: 'last_oil_change',
                                    pattern: /^\d*$/,
                                },
                                {
                                    id: 'tireRotation',
                                    label: 'Last Tire Rotation',
                                    placeholder: '(Ex. 24,000)',
                                    value: formData.last_tire_rotation,
                                    key: 'last_tire_rotation',
                                    pattern: /^\d*$/,
                                },
                                {
                                    id: 'tireChange',
                                    label: 'Last Tire Change',
                                    placeholder: '(Ex. 60,000)',
                                    value: formData.last_tire_change,
                                    key: 'last_tire_change',
                                    pattern: /^\d*$/,
                                },
                                {
                                    id: 'engineAirFilter',
                                    label: 'Last Engine Air Filter Change',
                                    placeholder: '(Ex. 15,000)',
                                    value: formData.last_air_filter,
                                    key: 'last_air_filter',
                                    pattern: /^\d*$/,
                                },
                                {
                                    id: 'brakeFluidFlush',
                                    label: 'Last Brake Fluid Flush',
                                    placeholder: '(Ex. 75,000)',
                                    value: formData.last_brake_flush,
                                    key: 'last_brake_flush',
                                    pattern: /^\d*$/,
                                },
                                {
                                    id: 'brakeRotor',
                                    label: 'Last Brake Rotor Replacement',
                                    placeholder: '(Ex. 50,000)',
                                    value: formData.last_brake_rotor,
                                    key: 'last_brake_rotor',
                                    pattern: /^\d*$/,
                                },
                                {
                                    id: 'brakePad',
                                    label: 'Last Brake Pad Replacement',
                                    placeholder: '(Ex. 50,000)',
                                    value: formData.last_brake_pad,
                                    key: 'last_brake_pad',
                                    pattern: /^\d*$/,
                                },
                                {
                                    id: 'coolantFlush',
                                    label: 'Last Coolant Flush',
                                    placeholder: '(Ex. 50,000)',
                                    value: formData.last_coolant_flush,
                                    key: 'last_coolant_flush',
                                    pattern: /^\d*$/,
                                },
                                {
                                    id: 'transmissionFluidFlush',
                                    label: 'Last Transmission Fluid Flush',
                                    placeholder: '(Ex. 50,000)',
                                    value: formData.last_transmission_fluid_flush,
                                    key: 'last_transmission_fluid_flush',
                                    pattern: /^\d*$/,
                                },
                                {
                                    id: 'cabinFilter',
                                    label: 'Last Cabin Filter Replacement',
                                    placeholder: '(Ex. 50,000)',
                                    value: formData.last_cabin_filter_change,
                                    key: 'last_cabin_filter_change',
                                    pattern: /^\d*$/,
                                },
                                {
                                    id: 'wiperBlade',
                                    label: 'Last Wiper Blade Replacement',
                                    placeholder: '(Ex. 15,000)',
                                    value: formData.last_wiper_blades_change,
                                    key: 'last_wiper_blades_change',
                                    pattern: /^\d*$/,
                                },
                            ].map(
                                ({
                                    id,
                                    label,
                                    placeholder,
                                    value,
                                    key,
                                    pattern,
                                }) => (
                                    <div
                                        key={id}
                                        className="flex flex-col space-y-2"
                                    >
                                        <label
                                            htmlFor={id}
                                            className="font-bold"
                                        >
                                            {label}
                                        </label>
                                        <Input
                                            id={id}
                                            placeholder={placeholder}
                                            value={value}
                                            onChange={(e) => {
                                                const inputValue =
                                                    e.target.value
                                                if (
                                                    !pattern ||
                                                    pattern.test(inputValue)
                                                ) {
                                                    setFormData({
                                                        ...formData,
                                                        [key]: inputValue,
                                                    })
                                                }
                                            }}
                                            autoComplete={`current-${id}`}
                                            className="w-full"
                                        />
                                    </div>
                                )
                            )}
                            {error && <p className="text-red-500">{error}</p>}
                            <CardFooter className="flex flex-col md:flex-row md:justify-center space-y-2 md:space-y-0 md:space-x-4">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full md:w-auto"
                                >
                                    {isLoading
                                        ? `Creating Maintenance Log...`
                                        : `Create Maintenance Log`}
                                </Button>
                            </CardFooter>
                        </form>
                    </CardContent>
                </div>
            </Card>
        </div>
    )
}
