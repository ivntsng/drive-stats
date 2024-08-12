import React, { useContext, useState, useRef } from 'react'
import { useToast } from '@/components/ui/use-toast'
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../UserContext'

export default function CreateVehicleMaintenanceForm() {
    const { toast } = useToast()
    const { user } = useContext(UserContext)
    const formRef = useRef(null)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const API_HOST = import.meta.env.VITE_API_HOST
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        maintenance_type: '',
        mileage: '',
        cost: '',
        description: '',
        service_date: '',
    })
    const handleCancel = () => {
        navigate('/') // Navigates back to the home page
    }
    const [selectedVehicleName, setSelectedVehicleName] = useState('')

    const fetchUser = async () => {
        const token = sessionStorage.getItem('token')
        if (!token) return null
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
    const fetchVehicles = async (userId, token) => {
        try {
            const response = await axios.get(
                `${API_HOST}/vehicles/user/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
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
                await fetchVehicles(userData.id, userData.token)
            }
        }

        getUserAndVehicles()
    }, [])

    async function createVehicleMaintenanceLog(e) {
        e.preventDefault()
        setError('')
        setIsLoading(true)
        try {
          const response = await fetch(`${API_HOST}/api/vehicle-maintenance/create/${vehicle_id}`)
        }
    }
}
