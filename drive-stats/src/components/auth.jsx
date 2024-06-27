import axios from 'axios'

export async function handleLogout(setUser, toast, navigate, logoutTimerRef) {
    const API_HOST = import.meta.env.VITE_API_HOST

    if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current)
        logoutTimerRef.current = null
    }

    try {
        const response = await axios.delete(`${API_HOST}/api/auth/signout`, {
            withCredentials: true,
        })

        if (response.status === 200) {
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('username')
            setUser(null)
            toast({
                title: 'Logged Out',
                description: 'You have been logged out successfully.',
            })
            navigate('/')
        } else {
            throw new Error('Failed to log out')
        }
    } catch (error) {
        console.error('There was an error logging out!', error)
        toast({
            title: 'Error',
            description:
                'There was an error logging out. Please try again later.',
            status: 'error',
        })
    }
}
