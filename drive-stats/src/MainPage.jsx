import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import LoginForm from './components/login'
import { Toaster } from '@/components/ui/toaster'

function MainPage() {
    const [isLoginFormOpen, setIsLoginFormOpen] = useState(false)

    function togglePop() {
        setIsLoginFormOpen(!isLoginFormOpen)
    }

    return (
        <div>
            <Toaster />
            <div className="flex flex-col min-h-screen">
                <div className="flex-grow mt-32 mb-20">
                    <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
                            <div className="mb-8 md:mb-0">
                                <h1 className="block font-bold sm:text-4xl lg:text-6xl lg:leading-tight">
                                    Navigate your vehicle maintenance journey
                                    effortlessly.
                                </h1>
                                <div className="flex mt-12">
                                    <Button className="inline-flex justify-center items-center gap-x-3 text-center hover:bg-green-500 border-2 text-sm lg:text-base font-medium rounded-md transition py-3 px-4">
                                        Sign Up
                                    </Button>
                                    <Button
                                        className="bg-sky-600 py-3 px-5 inline-flex justify-center ml-8 items-center gap-2 rounded-md border font-medium text-white shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm"
                                        onClick={togglePop}
                                    >
                                        Login
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-32 justify-center">
                                {' '}
                                {/* Adjusted mt-10 for larger margin-top */}
                                <img
                                    className="w-full rounded-md"
                                    src="/assets/homepage.jpg"
                                    alt="Home page image"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <footer className="bg-gray-900">
                    <div className="max-w-[85rem] py-2 px-4 sm:px-6 lg:px-8 lg:pt-20 mx-auto">
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
                                <h4 className="font-bold text-gray-100">
                                    Product
                                </h4>
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
                                <h4 className="font-bold text-gray-100">
                                    Company
                                </h4>
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
                                    Stay in the loop! - Subscribe to our
                                    Newsletter
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
            </div>
            {isLoginFormOpen && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-75">
                    <div className="bg p-8 rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <LoginForm toggle={togglePop} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default MainPage
