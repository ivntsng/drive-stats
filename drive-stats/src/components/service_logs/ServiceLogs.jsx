import React from 'react'

const ServiceLogPage = () => {
    return (
        <div className="flex h-screen items-center justify-center p-4 sm:p-6">
            <div className="flex flex-col h-full w-full max-w-4xl space-y-8 sm:space-y-10">
                <div className="space-y-4 sm:space-y-6 w-full">
                    <div className="flex flex-col space-y-2 sm:space-y-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight md:text-2xl">
                                Welcome back!
                            </h2>
                            <p className="text-muted-foreground text-sm md:text-base">
                                Here&apos;s a record of all your vehicle
                                services.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm table-fixed">
                                <thead className="[&>tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground w-[5%]" />
                                        <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground w-[15%]">
                                            Date of service
                                        </th>
                                        <th className="h-10 px-2 text-center align-middle font-medium text-muted-foreground w-[40%]">
                                            Service Type
                                        </th>
                                        <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground w-[20%]">
                                            Mileage
                                        </th>
                                        <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground w-[15%]">
                                            Cost
                                        </th>
                                        <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground w-[5%]" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Example row */}
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-2 align-middle"></td>
                                        <td className="p-2 align-middle">
                                            Aug 13, 2024
                                        </td>
                                        <td className="p-2 align-middle text-center">
                                            <div className="inline-flex items-center text-xs font-semibold">
                                                Window Replacement
                                            </div>
                                        </td>
                                        <td className="p-2 align-middle">
                                            32000
                                        </td>
                                        <td className="p-2 align-middle">
                                            $85
                                        </td>
                                        <td className="p-2 align-middle">
                                            <button
                                                type="button"
                                                className="items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-8 w-8 p-0"
                                            >
                                                <svg
                                                    width="15"
                                                    height="15"
                                                    viewBox="0 0 15 15"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                >
                                                    {/* SVG path */}
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                    {/* Add more rows as needed */}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServiceLogPage
