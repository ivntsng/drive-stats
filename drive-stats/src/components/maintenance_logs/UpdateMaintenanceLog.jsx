import React, { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../../UserContext'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, ChevronsUpDown } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

const FormSchema = z.object({
    service_date: z.date({
        required_error: 'A maintenance date is required.',
    }),
    vehicle_id: z.string().min(1, 'Please select a vehicle.'),
    maintenance_type: z.string().min(1, 'Please select a maintenance type.'),
    mileage: z.number().optional(),
    cost: z.number().optional(),
    description: z.string().optional(),
})

const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]

const DatePicker = ({ className, date, setDate }) => {
    const [month, setMonth] = useState(
        date ? date.getMonth() : new Date().getMonth()
    )
    const [year, setYear] = useState(
        date ? date.getFullYear() : new Date().getFullYear()
    )
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false)
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false)

    const handleMonthChange = (newMonth) => {
        setMonth(newMonth)
        setIsMonthDropdownOpen(false)
    }

    const handleYearChange = (newYear) => {
        setYear(newYear)
        setIsYearDropdownOpen(false)
    }

    return (
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                        'overflow-hidden dark:text-white',
                        !date && 'text-muted-foreground',
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date instanceof Date && !isNaN(date.getTime()) ? (
                        <span>{format(date, 'MMMM d, yyyy')}</span>
                    ) : (
                        <span className="hidden sm:block">Pick a date</span>
                    )}
                    <ChevronsUpDown className="sm:ml-2 h-4 w-4 shrink-0 opacity-50 " />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <div className="flex justify-center pt-1 relative items-center">
                    <div
                        className="flex justify-between gap-1 w-full"
                        style={{
                            marginRight: '45px',
                            marginLeft: '45px',
                        }}
                    >
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() =>
                                    setIsMonthDropdownOpen(!isMonthDropdownOpen)
                                }
                                className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&amp;>span]:line-clamp-1 pr-1.5 focus:ring-0"
                            >
                                <span style={{ pointerEvents: 'none' }}>
                                    {monthNames[month]}
                                </span>
                                <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 15 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 opacity-50"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </button>
                            {isMonthDropdownOpen && (
                                <div className="absolute z-10 bg-gray-800 border border-gray-700 mt-1 rounded-md shadow-lg">
                                    {monthNames.map((monthName, index) => (
                                        <div
                                            key={monthName}
                                            className="cursor-pointer px-3 py-1 text-sm text-white hover:bg-gray-600"
                                            onClick={() =>
                                                handleMonthChange(index)
                                            }
                                        >
                                            {monthName}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() =>
                                    setIsYearDropdownOpen(!isYearDropdownOpen)
                                }
                                className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&amp;>span]:line-clamp-1 pr-1.5 focus:ring-0"
                            >
                                <span style={{ pointerEvents: 'none' }}>
                                    {year}
                                </span>
                                <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 15 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 opacity-50"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </button>
                            {isYearDropdownOpen && (
                                <div
                                    className="absolute z-10 bg-gray-800 border border-gray-700 mt-1 rounded-md shadow-lg max-h-48 overflow-y-auto"
                                    style={{
                                        scrollbarColor:
                                            'rgba(255, 255, 255, 0.3) transparent',
                                        scrollbarWidth: 'thin',
                                    }}
                                >
                                    {Array.from(
                                        { length: 36 },
                                        (_, i) => year - 17 + i
                                    ).map((yearOption) => (
                                        <div
                                            key={yearOption}
                                            className="cursor-pointer px-3 py-1 text-sm text-white hover:bg-gray-600"
                                            onClick={() =>
                                                handleYearChange(yearOption)
                                            }
                                        >
                                            {yearOption}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <Calendar
                    mode="single"
                    month={new Date(year, month)}
                    onMonthChange={(newMonth) => setMonth(newMonth.getMonth())}
                    selected={date}
                    onSelect={(e) => {
                        if (e instanceof Date && !isNaN(e.getTime())) {
                            setDate(e)
                            setIsCalendarOpen(false)
                        } else {
                            console.error('Invalid date selected')
                        }
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

function updateDatePart(month, date) {
    const updatedDate = new Date(date)
    updatedDate.setMonth(month)
    updatedDate.setHours(0, 0, 0, 0)
    return updatedDate
}

export default function UpdateMaintenanceLog() {
    const { user, setUser } = useContext(UserContext)
    const [vehicles, setVehicles] = useState([])
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const navigate = useNavigate()
    const { maintenance_log_id } = useParams()
    const API_HOST = import.meta.env.VITE_API_HOST

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            service_date: new Date(),
            vehicle_id: '',
            maintenance_type: '',
            mileage: '',
            cost: '',
            description: '',
        },
    })

    useEffect(() => {
        if (!maintenance_log_id) {
            console.error(
                'Maintenance log ID is undefined. Cannot fetch maintenance log details.'
            )
            return
        }

        const fetchMaintenanceLog = async () => {
            try {
                const response = await axios.get(
                    `${API_HOST}/api/vehicle-maintenance/maintenance-log/detail/${maintenance_log_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${user?.token}`,
                        },
                    }
                )
                const maintenanceLog = response.data

                const serviceDate = parseISO(maintenanceLog.service_date)

                form.reset({
                    service_date: serviceDate,
                    vehicle_id: maintenanceLog.vehicle_id.toString(),
                    maintenance_type: maintenanceLog.maintenance_type,
                    mileage: maintenanceLog.mileage,
                    cost: maintenanceLog.cost,
                    description: maintenanceLog.description,
                })
            } catch (error) {
                console.error(
                    'There was an error fetching the maintenance log details!',
                    error
                )
                setError('Failed to load maintenance log details.')
            }
        }

        const fetchUserAndVehicles = async () => {
            const userData = await fetchUser()
            if (userData && userData.id) {
                await fetchVehicles(userData.id, userData.token)
            }
        }

        if (user?.token) {
            fetchUserAndVehicles().then(() => fetchMaintenanceLog())
        }
    }, [maintenance_log_id, user?.token])

    const fetchUser = async () => {
        const token = sessionStorage.getItem('token')
        if (!token) return null
        try {
            const response = await axios.get(
                `${API_HOST}/api/auth/authenticate`,
                {
                    headers: { Authorization: `Bearer ${token}` },
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

    const fetchVehicles = async (userId, token) => {
        try {
            const response = await axios.get(
                `${API_HOST}/vehicles/user/${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            setVehicles(response.data)
        } catch (error) {
            console.error('There was an error fetching the vehicles!', error)
        }
    }

    async function updateMaintenanceLog(e) {
        e.preventDefault()

        const formattedServiceDate = format(
            form.getValues('service_date'),
            'yyyy-MM-dd'
        )

        const processedFormData = {
            ...form.getValues(),
            service_date: formattedServiceDate,
        }

        setIsLoading(true)

        try {
            const response = await axios.put(
                `${API_HOST}/api/vehicle-maintenance/maintenance-log/update/${maintenance_log_id}`,
                processedFormData,
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                    params: {
                        maintenance_log_id: maintenance_log_id,
                    },
                }
            )

            if (response.status === 200) {
                toast({
                    title: `Successfully updated maintenance log.`,
                    description:
                        'The maintenance log details have been updated.',
                })
                navigate(
                    `/vehicles/garage/maintenance/maintenance-log/${maintenance_log_id}`
                )
            } else {
                setError('There was an issue updating the maintenance log.')
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                toast({
                    title: 'Access Denied',
                    description:
                        'You do not have permission to update this maintenance log.',
                })
                navigate('/')
            } else if (error.response && error.response.status === 404) {
                toast({
                    title: 'Maintenance Log Not Found',
                    description:
                        'The maintenance log you are trying to update does not exist.',
                })
                navigate('/')
            } else {
                console.error('Error updating the maintenance log:', error)
                setError(
                    'An error occurred while updating the maintenance log.'
                )
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-[850px]">
                <Card className="rounded-xl border bg-card text-card-foreground shadow">
                    <CardHeader>
                        <CardTitle className="font-semibold leading-none tracking-tight">
                            Update Maintenance Log
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Please update the details for your vehicle's
                            maintenance.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={updateMaintenanceLog}
                            className="space-y-4"
                        >
                            <Form {...form}>
                                <FormField
                                    control={form.control}
                                    name="service_date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>
                                                Maintenance Date
                                            </FormLabel>
                                            <DatePicker
                                                className=""
                                                date={field.value}
                                                setDate={field.onChange}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="vehicle_id"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>
                                                    Choose Vehicle
                                                </FormLabel>
                                                <Select
                                                    onValueChange={(value) =>
                                                        field.onChange(value)
                                                    }
                                                    value={field.value}
                                                    disabled={true}
                                                >
                                                    <SelectTrigger id="vehicleName">
                                                        <SelectValue placeholder="Select a vehicle" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {vehicles.map(
                                                            (vehicle) => (
                                                                <SelectItem
                                                                    key={
                                                                        vehicle.id
                                                                    }
                                                                    value={vehicle.id.toString()}
                                                                >
                                                                    {
                                                                        vehicle.vehicle_name
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="maintenance_type"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>
                                                    Maintenance Type
                                                </FormLabel>
                                                <Select
                                                    onValueChange={(value) =>
                                                        field.onChange(value)
                                                    }
                                                    value={field.value}
                                                    disabled={true}
                                                >
                                                    <SelectTrigger id="maintenanceType">
                                                        <SelectValue placeholder="Select maintenance type" />
                                                    </SelectTrigger>
                                                    <SelectContent className="max-h-64 overflow-y-auto">
                                                        <div className="p-2 font-bold">
                                                            General
                                                        </div>
                                                        <SelectItem value="inspection">
                                                            Inspection
                                                        </SelectItem>
                                                        <SelectItem value="registration">
                                                            Registration
                                                        </SelectItem>
                                                        <SelectItem value="fuel">
                                                            Fuel
                                                        </SelectItem>
                                                        <div className="p-2 font-bold">
                                                            Maintenance
                                                        </div>
                                                        <SelectItem value="air conditioning recharge">
                                                            Air Conditioning
                                                            Recharge
                                                        </SelectItem>
                                                        <SelectItem value="air filter">
                                                            Air Filter
                                                        </SelectItem>
                                                        <SelectItem value="battery">
                                                            Battery
                                                        </SelectItem>
                                                        <SelectItem value="brake fluid flush">
                                                            Brake Fluid Flush
                                                        </SelectItem>
                                                        <SelectItem value="brake pads">
                                                            Brake Pads
                                                        </SelectItem>
                                                        <SelectItem value="brake rotors">
                                                            Brake Rotors
                                                        </SelectItem>
                                                        <SelectItem value="cabin air filter">
                                                            Cabin Air Filter
                                                        </SelectItem>
                                                        <SelectItem value="car wash">
                                                            Car Wash
                                                        </SelectItem>
                                                        <SelectItem value="coolant flush">
                                                            Coolant Flush
                                                        </SelectItem>
                                                        <SelectItem value="distributor cap & rotor">
                                                            Distributor Cap &
                                                            Rotor
                                                        </SelectItem>
                                                        <SelectItem value="fuel filter">
                                                            Fuel Filter
                                                        </SelectItem>
                                                        <SelectItem value="headlight">
                                                            Headlight
                                                        </SelectItem>
                                                        <SelectItem value="oil change">
                                                            Oil Change
                                                        </SelectItem>
                                                        <SelectItem value="other">
                                                            Other
                                                        </SelectItem>
                                                        <SelectItem value="power steering flush">
                                                            Power Steering Flush
                                                        </SelectItem>
                                                        <SelectItem value="smog check">
                                                            Smog Check
                                                        </SelectItem>
                                                        <SelectItem value="spark plugs">
                                                            Spark Plugs
                                                        </SelectItem>
                                                        <SelectItem value="timing belt">
                                                            Timing Belt
                                                        </SelectItem>
                                                        <SelectItem value="tire - new">
                                                            Tire - New
                                                        </SelectItem>
                                                        <SelectItem value="tire balancing">
                                                            Tire Balancing
                                                        </SelectItem>
                                                        <SelectItem value="tire inflation">
                                                            Tire Inflation
                                                        </SelectItem>
                                                        <SelectItem value="tire rotation">
                                                            Tire Rotation
                                                        </SelectItem>
                                                        <SelectItem value="transmission fluid flush">
                                                            Transmission Fluid
                                                            Flush
                                                        </SelectItem>
                                                        <SelectItem value="wheel alignment">
                                                            Wheel Alignment
                                                        </SelectItem>
                                                        <SelectItem value="wiper blades">
                                                            Wiper Blades
                                                        </SelectItem>

                                                        <div className="p-2 font-bold">
                                                            Repairs
                                                        </div>
                                                        <SelectItem value="alternator">
                                                            Alternator
                                                        </SelectItem>
                                                        <SelectItem value="belt">
                                                            Belt
                                                        </SelectItem>
                                                        <SelectItem value="body work">
                                                            Body Work
                                                        </SelectItem>
                                                        <SelectItem value="brake caliper">
                                                            Brake Caliper
                                                        </SelectItem>
                                                        <SelectItem value="carburetor">
                                                            Carburetor
                                                        </SelectItem>
                                                        <SelectItem value="catalytic converter">
                                                            Catalytic Converter
                                                        </SelectItem>
                                                        <SelectItem value="clutch">
                                                            Clutch
                                                        </SelectItem>
                                                        <SelectItem value="control arm">
                                                            Control Arm
                                                        </SelectItem>
                                                        <SelectItem value="coolant temperature sensor">
                                                            Coolant Temperature
                                                            Sensor
                                                        </SelectItem>
                                                        <SelectItem value="exhaust">
                                                            Exhaust
                                                        </SelectItem>
                                                        <SelectItem value="fuel injector">
                                                            Fuel Injector
                                                        </SelectItem>
                                                        <SelectItem value="fuel tank">
                                                            Fuel Tank
                                                        </SelectItem>
                                                        <SelectItem value="head gasket">
                                                            Head Gasket
                                                        </SelectItem>
                                                        <SelectItem value="heater core">
                                                            Heater Core
                                                        </SelectItem>
                                                        <SelectItem value="hose">
                                                            Hose
                                                        </SelectItem>
                                                        <SelectItem value="line">
                                                            Line
                                                        </SelectItem>
                                                        <SelectItem value="mass air flow sensor">
                                                            Mass Air Flow Sensor
                                                        </SelectItem>
                                                        <SelectItem value="muffler">
                                                            Muffler
                                                        </SelectItem>
                                                        <SelectItem value="oxygen sensor">
                                                            Oxygen Sensor
                                                        </SelectItem>
                                                        <SelectItem value="radiator">
                                                            Radiator
                                                        </SelectItem>
                                                        <SelectItem value="sensor">
                                                            Sensor
                                                        </SelectItem>
                                                        <SelectItem value="shock/strut">
                                                            Shock/Strut
                                                        </SelectItem>
                                                        <SelectItem value="starter">
                                                            Starter
                                                        </SelectItem>
                                                        <SelectItem value="thermostat">
                                                            Thermostat
                                                        </SelectItem>
                                                        <SelectItem value="tie rod">
                                                            Tie Rod
                                                        </SelectItem>
                                                        <SelectItem value="transmission">
                                                            Transmission
                                                        </SelectItem>
                                                        <SelectItem value="water pump">
                                                            Water Pump
                                                        </SelectItem>
                                                        <SelectItem value="wheel bearings">
                                                            Wheel Bearings
                                                        </SelectItem>
                                                        <SelectItem value="window">
                                                            Window
                                                        </SelectItem>
                                                        <SelectItem value="windshield">
                                                            Windshield
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="mileage"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Mileage</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Mileage"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="cost"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Cost</FormLabel>
                                                <div className="relative">
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
                                                        $
                                                    </span>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Cost"
                                                            className="pl-7"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col sm:col-span-2">
                                                <FormLabel>
                                                    Description
                                                </FormLabel>
                                                <FormControl>
                                                    <textarea
                                                        placeholder="Description"
                                                        {...field}
                                                        className="min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {error && (
                                    <p className="text-red-500 flex justify-center">
                                        {error}
                                    </p>
                                )}
                                <div className="flex justify-between space-x-4 mt-4">
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                `/vehicles/garage/maintenance/maintenance-log/${maintenance_log_id}`
                                            )
                                        }
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                                    >
                                        {isLoading
                                            ? 'Updating Maintenance Log...'
                                            : 'Update Maintenance Log'}
                                    </Button>
                                </div>
                            </Form>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
