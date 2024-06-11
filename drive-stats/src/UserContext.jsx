import React, { createContext, useState } from 'react'

export const UserContext = createContext({
    user: null,
    setUser: () => {},
})
