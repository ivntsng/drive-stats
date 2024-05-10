import { useContext, useState, useCallback, useEffect } from 'react'
import { UserContext } from '../../UserContext'

export default function Garage() {
    const [username, setUsername] = useState('')
    const { user, setUser } = useContext(UserContext)

    const retrieveUsernameFromSession = useCallback(() => {
        const storedUsername = sessionStorage.getItem('username')
        if (storedUsername) {
            setUsername(storedUsername)
        }
    }, [])

    useEffect(() => {
        retrieveUsernameFromSession()
    }, [])

    return <p>Welcome to your garage {username}!</p>
}
