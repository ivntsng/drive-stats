import React, {
    useContext,
    useState,
    useRef,
    useCallback,
    useEffect,
} from 'react'
import { UserContext } from '../../UserContext'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'

function RegisterVehicleForm({ closeRegisterNewVehicleForm }) {
    const { user } = useContext(UserContext)
    const { toast } = useToast()
    const formRef = useRef(null)
    const [formData, setFormData] = useState({
        vehicle_name: '',
        year: '',
        make: '',
        model: '',
        vin: '',
        mileage: '',
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const API_HOST = import.meta.env.VITE_API_HOST

    async function registerVehicle(e) {
        e.preventDefault()
        try {
            const response = await fetch(`${API_HOST}/vehicles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
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
                })
                toast({
                    title: `Successfully registered ${registeredVehicleName}.`,
                    description: `You can now view ${registeredVehicleName} in your garage.`,
                })
                closeRegisterNewVehicleForm()
            } else {
                setError('There was an issue registering the vehicle.')
            }
        } catch (error) {
            console.error('Error: ', error)
        }
    }

    const handleClickOutside = useCallback(
        (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                if (typeof closeRegisterNewVehicleForm === 'function') {
                    closeRegisterNewVehicleForm()
                }
            }
        },
        [closeRegisterNewVehicleForm]
    )

    useEffect(() => {
        window.addEventListener('mousedown', handleClickOutside)
        return () => {
            window.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full md:w-[400px] mx-auto">
                <div ref={formRef}>
                    <CardHeader>
                        <CardTitle className="text-center text-2xl font-bold">
                            Register New Vehicle
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={registerVehicle} className="space-y-4">
                            <div className="flex flex-col space-y-2">
                                <label
                                    htmlFor="vehicleName"
                                    className="font-bold"
                                >
                                    Vehicle Name
                                </label>
                                <Input
                                    id="vehicleName"
                                    placeholder="(Ex. John Doe's Car)"
                                    value={formData.vehicle_name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            vehicle_name: e.target.value,
                                        })
                                    }
                                    autoComplete="current-vehicleName"
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label
                                    htmlFor="vehicleYear"
                                    className="font-bold"
                                >
                                    Vehicle Year
                                </label>
                                <Input
                                    id="vehicleName"
                                    placeholder="(Ex. 2012)"
                                    value={formData.year}
                                    onChange={(e) => {
                                        const inputYear = e.target.value
                                        // Check if the input is a valid integer
                                        if (/^\d*$/.test(inputYear)) {
                                            setFormData({
                                                ...formData,
                                                year: inputYear,
                                            })
                                        }
                                    }}
                                    autoComplete="current-vehicleYear"
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label
                                    htmlFor="vehicleMake"
                                    className="font-bold"
                                >
                                    Vehicle Make
                                </label>
                                <Input
                                    id="vehicleMake"
                                    placeholder="(Ex. Toyota)"
                                    value={formData.make}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            make: e.target.value,
                                        })
                                    }
                                    autoComplete="current-vehicleMake"
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label
                                    htmlFor="vehicleModel"
                                    className="font-bold"
                                >
                                    Vehicle Model
                                </label>
                                <Input
                                    id="vehicleModel"
                                    placeholder="(Ex. Camry)"
                                    value={formData.model}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            model: e.target.value,
                                        })
                                    }
                                    autoComplete="current-vehicleModel"
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label
                                    htmlFor="vehicleVin"
                                    className="font-bold"
                                >
                                    Vehicle VIN
                                </label>
                                <Input
                                    id="vehicleVin"
                                    placeholder="(Ex. 4T1BF1FK1CU013354)"
                                    value={formData.vin}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            vin: e.target.value,
                                        })
                                    }
                                    autoComplete="current-vehicleVin"
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label
                                    htmlFor="vehicleMileage"
                                    className="font-bold"
                                >
                                    Mileage of vehicle
                                </label>
                                <Input
                                    id="vehicleMileage"
                                    placeholder="(Ex. 72,629)"
                                    value={formData.mileage}
                                    onChange={(e) => {
                                        const inputMileage = e.target.value
                                        if (/^\d*$/.test(inputMileage)) {
                                            setFormData({
                                                ...formData,
                                                mileage: inputMileage,
                                            })
                                        }
                                    }}
                                    autoComplete="current-vehicleMileage"
                                />
                            </div>
                            {error && <p className="text-red-500">{error}</p>}
                            <CardFooter className="flex flex-col items-center md:flex-row md:justify-center">
                                <div className="w-full md:w-auto md:mr-4 mb-2 md:mb-0">
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full md:w-auto"
                                    >
                                        {isLoading
                                            ? 'Registering Vehicle to DriveStats...'
                                            : 'Register Vehicle'}
                                    </Button>
                                </div>
                            </CardFooter>
                        </form>
                    </CardContent>
                </div>
            </Card>
        </div>
    )
}

export default RegisterVehicleForm
