import React, {
    useContext,
    useState,
    useRef,
    useCallback,
    useEffect,
} from 'react'
import { UserContext } from '../../UserContext'
import axios from 'axios'

export default function VehicleStat() {
    const { user, setUser } = useContext(UserContext)
    const [vehicles, setVehicles] = useState([])

    const formRef = useRef(null)
    // const [formData, setFormData] = useState({
    //     vehicle_name: '',
    //     year: '',
    //     make: '',
    //     model: '',
    //     vin: '',
    //     mileage: '',
    //     about: '',
    // })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
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

    
}
