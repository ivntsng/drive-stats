import React, { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../../UserContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function UpdatedVehicleDetail() {
    const { user } = useContext(UserContext)
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        vehicle_name: '',
        year: '',
        make: '',
        model: '',
        vin: '',
        mileage: '',
        about: '',
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { vehicle_id } = useParams()
    const API_HOST = import.meta.env.VITE_API_HOST

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const response = await axios.get(
                    `${API_HOST}/vehicles/${vehicle_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${user?.token}`,
                        },
                    }
                )
                setFormData(response.data)
            } catch (error) {
                console.error(
                    'There was an error fetching the vehicle details!',
                    error
                )
                setError('Failed to load vehicle details.')
            }
        }

        if (user?.token) {
            fetchVehicle()
        }
    }, [vehicle_id, user?.token, API_HOST])

    async function updateVehicle(e) {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await axios.put(
                `${API_HOST}/vehicles/update/${vehicle_id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            )

            if (response.status === 200) {
                toast({
                    title: `Successfully updated ${formData.vehicle_name}.`,
                    description: 'The vehicle details have been updated.',
                })
                navigate('/')
            } else {
                setError('There was an issue updating the vehicle.')
            }
        } catch (error) {
            console.error('Error updating the vehicle:', error)
            setError('An error occurred while updating the vehicle.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        navigate('/')
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-4 py-6 sm:px-6 lg:px-8">
            <div className="w-full max-w-xl">
                <Card className="rounded-xl border bg-card text-card-foreground shadow">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl font-bold">
                            Updating Vehicle
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={updateVehicle}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            {[
                                {
                                    id: 'vehicleName',
                                    label: 'Vehicle Name',
                                    placeholder: "(Ex. John Doe's Car)",
                                    value: formData.vehicle_name,
                                    key: 'vehicle_name',
                                },
                                {
                                    id: 'vehicleYear',
                                    label: 'Vehicle Year',
                                    placeholder: '(Ex. 2012)',
                                    value: formData.year,
                                    key: 'year',
                                    pattern: /^\d*$/,
                                },
                                {
                                    id: 'vehicleMake',
                                    label: 'Vehicle Make',
                                    placeholder: '(Ex. Toyota)',
                                    value: formData.make,
                                    key: 'make',
                                },
                                {
                                    id: 'vehicleModel',
                                    label: 'Vehicle Model',
                                    placeholder: '(Ex. Camry)',
                                    value: formData.model,
                                    key: 'model',
                                },
                                {
                                    id: 'vehicleVin',
                                    label: 'Vehicle VIN',
                                    placeholder: '(Ex. 4T1BF1FK1CU013354)',
                                    value: formData.vin,
                                    key: 'vin',
                                    onChange: (e) => {
                                        const inputValue =
                                            e.target.value.toUpperCase() // Convert to uppercase
                                        setFormData({
                                            ...formData,
                                            vin: inputValue,
                                        })
                                    },
                                },
                                {
                                    id: 'vehicleMileage',
                                    label: 'Mileage of Vehicle',
                                    placeholder: '(Ex. 72,629)',
                                    value: formData.mileage,
                                    key: 'mileage',
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
                                    onChange,
                                }) => (
                                    <div key={id} className="grid gap-2">
                                        <Label
                                            htmlFor={id}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {label}
                                        </Label>
                                        <Input
                                            id={id}
                                            placeholder={placeholder}
                                            value={value}
                                            onChange={
                                                onChange ||
                                                ((e) => {
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
                                                })
                                            }
                                            autoComplete={`current-${id}`}
                                            className="w-full"
                                        />
                                    </div>
                                )
                            )}
                            <div className="grid gap-2 col-span-full">
                                <Label
                                    htmlFor="aboutVehicle"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    About
                                </Label>
                                <Input
                                    id="aboutVehicle"
                                    placeholder="(Ex. My First Vehicle)"
                                    value={formData.about}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            about: e.target.value,
                                        })
                                    }
                                    autoComplete="current-aboutVehicle"
                                    className="w-full"
                                />
                            </div>
                            {error && <p className="text-red-500">{error}</p>}
                            <div className="flex flex-row items-center justify-between space-x-2 p-6 pt-0 col-span-full">
                                <Button
                                    type="button"
                                    onClick={handleCancel}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full sm:w-auto"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full sm:w-auto"
                                >
                                    {isLoading
                                        ? 'Updating Vehicle...'
                                        : 'Update'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
