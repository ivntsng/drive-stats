// src/contexts/TimerContext.js
import React, { createContext, useContext, useRef } from 'react'
import { handleLogout } from '../components/auth' // Ensure the correct import path
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
        console.log('Starting logout timer...')
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current)
        }
        logoutTimerRef.current = setTimeout(async () => {
            console.log('Timeout reached, logging out...')
            await handleLogout(setUser, toast, navigate, logoutTimerRef)
        }, 3600000)
    }

    const clearLogoutTimer = () => {
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current)
            logoutTimerRef.current = null
            console.log('Logout timer cleared')
        }
    }

    return (
        <TimerContext.Provider value={{ startLogoutTimer, clearLogoutTimer }}>
            {children}
        </TimerContext.Provider>
    )
}

export const useTimer = () => useContext(TimerContext)
