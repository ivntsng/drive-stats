import { useContext, useState, useCallback, useEffect } from 'react'
import { UserContext } from '../../UserContext'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

export default function Garage() {
    const { user, setUser } = useContext(UserContext)

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-4xl p-6 rounded-lg shadow-md mb-[170px]">
                <p className="mb-4 text-xl font-semibold text-center mb-[50px]">
                    Welcome to your garage, {user?.username}!
                </p>
                <div className="overflow-x-auto rounded-lg border border-gray-300 p-4">
                    <Table className="min-w-full">
                        <TableCaption className="text-center">
                            You currently have X amount of vehicles.
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px] text-center">
                                    Name
                                </TableHead>
                                <TableHead className="text-center">
                                    Make
                                </TableHead>
                                <TableHead className="text-center">
                                    Model
                                </TableHead>
                                <TableHead className="text-center">
                                    VIN
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium text-center">
                                    Luna
                                </TableCell>
                                <TableCell className="text-center">
                                    Scion
                                </TableCell>
                                <TableCell className="text-center">
                                    FR-S
                                </TableCell>
                                <TableCell className="text-center">
                                    JF1ZNAA17G9706707
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
