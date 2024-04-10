import React, { useContext, useState } from 'react'
import { UserContext } from '../../UserContext'

function createVehicleForm() {
    const { user } = useContext(UserContext)

    return console.log(user)
}

export default createVehicleForm
