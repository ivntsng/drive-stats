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
        about: '',
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const API_HOST = import.meta.env.VITE_API_HOST

    async function registerVehicle(e) {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await fetch(`${API_HOST}/vehicles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
                closeRegisterNewVehicleForm()
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
    }, [handleClickOutside])

    return (
        <div className="flex justify-center items-center min-h-screen px-4 py-6 sm:px-6 lg:px-8">
            <Card className="w-[380px] mx-auto p-4">
                <div ref={formRef}>
                    <CardHeader>
                        <CardTitle className="text-center text-2xl font-bold">
                            Register New Vehicle
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={registerVehicle} className="space-y-4">
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
                                },
                                {
                                    id: 'vehicleMileage',
                                    label: 'Mileage of vehicle',
                                    placeholder: '(Ex. 72,629)',
                                    value: formData.mileage,
                                    key: 'mileage',
                                    pattern: /^\d*$/,
                                },
                                {
                                    id: 'aboutVehicle',
                                    label: 'About',
                                    placeholder: '(Ex. My First vehicle)',
                                    value: formData.about,
                                    key: 'about',
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
                                    type="button"
                                    onClick={closeRegisterNewVehicleForm}
                                    className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full md:w-auto"
                                >
                                    {isLoading
                                        ? 'Registering Vehicle to DriveStats...'
                                        : 'Register Vehicle'}
                                </Button>
                            </CardFooter>
                        </form>
                    </CardContent>
                </div>
            </Card>
        </div>
    )
}

export default RegisterVehicleForm
