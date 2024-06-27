import React, { createContext, useContext, useRef } from 'react'
import { handleLogout } from '../components/auth'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { UserContext } from '../UserContext'

const TimerContext = createContext()

export const TimerProvider = ({ children }) => {
    const logoutTimerRef = useRef(null)
    const { setUser } = useContext(UserContext)
    const { toast } = useToast()
    const navigate = useNavigate()

    const startLogoutTimer = () => {
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current)
        }
        logoutTimerRef.current = setTimeout(async () => {
            await handleLogout(setUser, toast, navigate, logoutTimerRef)
        }, 3600000)
    }

    const clearLogoutTimer = () => {
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current)
            logoutTimerRef.current = null
        }
    }

    return (
        <TimerContext.Provider value={{ startLogoutTimer, clearLogoutTimer }}>
            {children}
        </TimerContext.Provider>
    )
}

export const useTimer = () => useContext(TimerContext)
