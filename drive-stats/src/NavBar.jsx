import { useContext, useState, useCallback, useEffect, useRef } from 'react'
import LoginForm from './components/login'
import { Button } from '@/components/ui/button'
import { handleLogout } from './components/auth' // Updated import path
import { useToast } from '@/components/ui/use-toast'
import { UserContext } from './UserContext'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Link, useNavigate } from 'react-router-dom' // Ensure useNavigate is imported
import SignupForm from './components/SignUp'
import RegisterVehicleForm from './components/vehicles/CreateVehicle'

function NavBar() {
    const { toast } = useToast()
    const { user, setUser } = useContext(UserContext)
    const [isLoginFormOpen, setIsLoginFormOpen] = useState(false)
    const [isSignupFormOpen, setIsSignupFormOpen] = useState(false)
    const [isVehicleRegistrationOpen, setIsVehicleRegistrationOpen] =
        useState(false)
    const logoutTimerRef = useRef(null)
    const navigate = useNavigate() // Ensure navigate is defined here

    function togglePop() {
        setIsLoginFormOpen(!isLoginFormOpen)
    }

    function toggleSignupForm() {
        setIsSignupFormOpen(!isSignupFormOpen)
    }

    async function logout() {
        await handleLogout(setUser, toast, navigate, logoutTimerRef)
    }

    const toggleVehicleRegistration = () => {
        setIsVehicleRegistrationOpen(!isVehicleRegistrationOpen)
    }

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900 w-full">
            <div className="max-w-[85rem] mx-auto px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center">
                    <a href="/" className="flex items-center">
                        <img
                            src="/assets/drivestats_logo.svg"
                            className="h-6 mr-3 sm:h-9"
                            alt="DriveStats Logo"
                        />
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                            DriveStats
                        </span>
                    </a>
                </div>
                <div className="flex items-center justify-center flex-grow">
                    {user && (
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>
                                        My Garage
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                            <li className="row-span-3">
                                                <NavigationMenuLink asChild>
                                                    <a
                                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                        href="/vehicles/garage"
                                                    >
                                                        <div className="mb-2 mt-4 text-lg font-medium">
                                                            {user?.username
                                                                ? `Hello, ${user.username}`
                                                                : 'Loading...'}
                                                        </div>
                                                        <p className="text-sm leading-tight text-muted-foreground">
                                                            Beautifully designed
                                                            components built
                                                            with Radix UI and
                                                            Tailwind CSS.
                                                        </p>
                                                    </a>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <button
                                                    className="text-blue-500"
                                                    onClick={
                                                        toggleVehicleRegistration
                                                    }
                                                >
                                                    Register Vehicle
                                                </button>
                                            </li>
                                            <li>
                                                <a
                                                    href="/vehicles/garage/maintenance-log/"
                                                    className="text-blue-500"
                                                >
                                                    Add Maintenance Log
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="/docs/primitives/typography"
                                                    className="text-blue-500"
                                                >
                                                    Typography
                                                </a>
                                            </li>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuContent>
                                        <NavigationMenuList>
                                            <NavigationMenuItem>
                                                <Link></Link>
                                            </NavigationMenuItem>
                                        </NavigationMenuList>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    )}
                </div>
                <div className="flex items-center lg:order-2">
                    {user ? (
                        <Button
                            className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800"
                            onClick={logout}
                        >
                            Logout
                        </Button>
                    ) : (
                        <Button
                            className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800"
                            onClick={togglePop}
                        >
                            Login
                        </Button>
                    )}
                </div>
                <div
                    className="flex items-center justify-between w-full lg:flex lg:w-auto lg:order-1"
                    id="mobile-menu-2"
                >
                    <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                        {/* Other menu items */}
                    </ul>
                </div>
                {isLoginFormOpen && (
                    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-75">
                        <div className="bg p-8 rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <LoginForm
                                toggle={togglePop}
                                closeLoginForm={() => setIsLoginFormOpen(false)}
                                toggleSignUp={toggleSignupForm}
                                toggleLogin={togglePop}
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
                                closeSignupForm={() =>
                                    setIsSignupFormOpen(false)
                                }
                            />
                        </div>
                    </div>
                )}
                {isVehicleRegistrationOpen && (
                    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-75">
                        <div className="bg p-8 rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <RegisterVehicleForm
                                isVehicleRegistrationOpen={
                                    isVehicleRegistrationOpen
                                }
                                closeRegisterNewVehicleForm={() =>
                                    setIsVehicleRegistrationOpen(false)
                                }
                            />
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default NavBar
