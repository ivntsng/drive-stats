// Footer.jsx
import React from 'react'
import { Button } from '@/components/ui/button'

function Footer() {
    return (
        <footer className="bg-gray-900">
            <div className="py-2 px-4 sm:px-6 lg:px-8 lg:pt-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    <div className="col-span-full lg:col-span-1">
                        <a
                            className="flex-none text-xl font-bold text-white"
                            href="https://drivestats.com"
                            aria-label="Brand"
                        >
                            DriveStats
                        </a>
                    </div>
                    <div className="col-span-1">
                        <h4 className="font-bold text-gray-100">Product</h4>
                        <div className="mt-3 grid space-y-3">
                            <p>
                                <a
                                    className="inline-flex gap-x-2 text-gray-400 hover:text-gray-200"
                                    href="https://tracethread.com/pricing"
                                >
                                    Support
                                </a>
                            </p>
                            <p>
                                <a
                                    className="inline-flex gap-x-2 text-gray-400 hover:text-gray-200"
                                    href="https://tracethread.com/pricing"
                                >
                                    Documentation
                                </a>
                            </p>
                            <p>
                                <a
                                    className="inline-flex gap-x-2 text-gray-400 hover:text-gray-200"
                                    href="https://tracethread.com/pricing"
                                >
                                    Bug Report
                                </a>
                            </p>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <h4 className="font-bold text-gray-100">Company</h4>
                        <div className="mt-3 grid space-y-3">
                            <p>
                                <a
                                    className="inline-flex gap-x-2 text-gray-400 hover:text-gray-200"
                                    href="https://tracethread.com/pricing"
                                >
                                    About Us
                                </a>
                            </p>
                            <p>
                                <a
                                    className="inline-flex gap-x-2 text-gray-400 hover:text-gray-200"
                                    href="https://tracethread.com/pricing"
                                >
                                    Careers
                                </a>
                            </p>
                            <p>
                                <a
                                    className="inline-flex gap-x-2 text-gray-400 hover:text-gray-200"
                                    href="https://tracethread.com/pricing"
                                >
                                    Contact Us
                                </a>
                            </p>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <h4 className="font-semibold text-gray-100">
                            Stay in the loop! - Subscribe to our Newsletter
                        </h4>
                        <form>
                            <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:gap-3 bg-white rounded-md p-2">
                                <div className="w-full">
                                    <label
                                        htmlFor="hero-input"
                                        className="sr-only"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        id="hero-input"
                                        name="hero-input"
                                        className="py-3 px-4 block w-full border-transparent shadow-sm rounded-md focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Enter your email"
                                        defaultValue=""
                                    ></input>
                                </div>
                                <Button className="w-full sm:w-auto whitespace-nowrap inline-flex justify-center items-center gap-x-3 text-center bg-sky-600 hover:bg-sky-700 border border-transparent text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white transition py-3 px-4">
                                    Subscribe
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="mt-5 sm:mt-12 grid gap-y-2 sm:gap-y-0 sm:flex sm:justify-between sm:items-center">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-400">
                        © 2024 Drivestats. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
