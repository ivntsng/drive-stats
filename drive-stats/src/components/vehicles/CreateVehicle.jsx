import React, { useContext, useState } from 'react'
import { UserContext } from '../../UserContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Label } from '@/components/ui/label'

export default function RegisterVehicleForm() {
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
    const API_HOST = import.meta.env.VITE_API_HOST

    async function registerVehicle(e) {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await fetch(`${API_HOST}/vehicles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`,
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            })

            if (response.ok) {
                const registeredVehicleName = formData.vehicle_name
                setFormData({
                    vehicle_name: '',
                    year: '',
                    make: '',
                    model: '',
                    vin: '',
                    mileage: '',
                    about: '',
                })
                toast({
                    title: `Successfully registered ${registeredVehicleName}.`,
                    description: `You can now view ${registeredVehicleName} in your garage.`,
                })
                navigate('/')
            } else {
                setError('There was an issue registering the vehicle.')
            }
        } catch (error) {
            console.error('Error: ', error)
            setError('An error occurred while registering the vehicle.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        navigate('/') // Navigate back to the home page
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-4 py-6 sm:px-6 lg:px-8">
            <div className="w-full max-w-xl">
                <Card className="rounded-xl border bg-card text-card-foreground shadow">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl font-bold">
                            Register New Vehicle
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={registerVehicle}
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
                                    onChange, // Added this line
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
                                        ? 'Registering Vehicle...'
                                        : 'Register'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
