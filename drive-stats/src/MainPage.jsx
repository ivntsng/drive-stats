import React, { useContext, useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import LoginForm from './components/login'
import { Toaster } from '@/components/ui/toaster'
import { UserContext } from './UserContext'
import SignupForm from './components/SignUp'
import Footer from './Footer'

function MainPage() {
    const [isLoginFormOpen, setIsLoginFormOpen] = useState(false)
    const [isSignupFormOpen, setIsSignupFormOpen] = useState(false)
    const [username, setUsername] = useState('')
    const { user } = useContext(UserContext)

    const togglePop = () => setIsLoginFormOpen(!isLoginFormOpen)
    const toggleSignupForm = () => setIsSignupFormOpen(!isSignupFormOpen)

    const retrieveUsernameFromSession = useCallback(() => {
        const storedUsername = sessionStorage.getItem('username')
        console.log('Stored username:', storedUsername)
        if (storedUsername) {
            setUsername(storedUsername)
        }
    }, [])

    useEffect(() => {
        retrieveUsernameFromSession()
    }, [])

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <Toaster className="flex" />
            <div className="flex-grow">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center py-32">
                        <div className="mb-8 md:mb-0">
                            <h1 className="block font-bold sm:text-4xl lg:text-6xl lg:leading-tight">
                                Navigate your vehicle maintenance journey
                                effortlessly.
                            </h1>
                            <div className="flex mt-12">
                                {!user && (
                                    <>
                                        <Button
                                            className="inline-flex justify-center items-center gap-x-3 text-center hover:bg-green-500 border-2 text-sm lg:text-base font-medium rounded-md transition py-3 px-4"
                                            onClick={toggleSignupForm}
                                        >
                                            Sign Up
                                        </Button>
                                        <Button
                                            className="bg-sky-600 py-3 px-5 inline-flex justify-center ml-8 items-center gap-2 rounded-md border font-medium text-white shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm"
                                            onClick={togglePop}
                                        >
                                            Login
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="mt-32 justify-center">
                            {' '}
                            {/* Adjusted mt-10 for larger margin-top */}
                            <img
                                className="w-full rounded-md"
                                src="/assets/R8GT.jpg"
                                alt="Home page image"
                            />
                        </div>
                    </div>
                </div>
            </div>
            {isLoginFormOpen && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-75">
                    <div className="bg p-8 rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <LoginForm
                            isSignupFormOpen={isSignupFormOpen}
                            toggleSignUp={toggleSignupForm}
                            isLoginFormOpen={isLoginFormOpen}
                            toggleLogin={togglePop}
                            closeLoginForm={() => setIsLoginFormOpen(false)}
                        />
                    </div>
                </div>
            )}
            {isSignupFormOpen && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-75">
                    <div className="bg p-8 rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <SignupForm
                            isSignupFormOpen={isSignupFormOpen}
                            toggleSignUp={toggleSignupForm}
                            isLoginFormOpen={isLoginFormOpen}
                            toggleLogin={togglePop}
                            closeSignupForm={() => setIsSignupFormOpen(false)}
                        />
                    </div>
                </div>
            )}
            <Footer />
        </div>
    )
}

export default MainPage
