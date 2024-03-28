import { useState, useContext } from 'react'
import LoginForm from './components/login'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme-provider'
import { handleLogout } from './components/login'
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
import { Link } from 'react-router-dom'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Link } from 'react-router-dom'

function NavBar() {
    const { setTheme } = useTheme()
    const [isLoginFormOpen, setIsLoginFormOpen] = useState(false)
    const { toast } = useToast()
    const { user, setUser } = useContext(UserContext)

    function togglePop() {
        setIsLoginFormOpen(!isLoginFormOpen)
    }

    function logout() {
        handleLogout(setUser)
        toast({
            title: 'Logged Out',
            description: 'You have been logged out successfully.',
        })
    }

    return (
        <nav className="bg-white border-gray-200 py-2.5 dark:bg-gray-900">
            <div className="flex items-center justify-between max-w-screen-xl px-4 mx-auto">
                <div className="flex items-center">
                    <a href="/" className="flex items-center">
                        <img
                            src="https://www.svgrepo.com/show/471147/car-01.svg"
                            className="h-6 mr-3 sm:h-9"
                            alt="DriveStats Logo"
                        />
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                            DriveStats
                        </span>
                    </a>
                </div>
                <div className="flex items-center justify-center flex-grow">
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
                                                    href="/"
                                                >
                                                    {/* Include Icons here if needed */}
                                                    <div className="mb-2 mt-4 text-lg font-medium">
                                                        shadcn/ui
                                                    </div>
                                                    <p className="text-sm leading-tight text-muted-foreground">
                                                        Beautifully designed
                                                        components built with
                                                        Radix UI and Tailwind
                                                        CSS.
                                                    </p>
                                                </a>
                                            </NavigationMenuLink>
                                        </li>
                                        {/* Include other documentation links here */}
                                        <li>
                                            <a
                                                href="/addvehicle"
                                                className="text-blue-500"
                                            >
                                                Register Vehicle
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="/docs/installation"
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
                            {/* Include other navigation menu items here */}
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
                </div>
            <div className="flex items-center justify-between max-w-screen-xl px-4 mx-auto">
                <div className="flex items-center">
                    <a href="/" className="flex items-center">
                        <img
                            src="https://www.svgrepo.com/show/471147/car-01.svg"
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
                                                        href="/"
                                                    >
                                                        {/* Include Icons here if needed */}
                                                        <div className="mb-2 mt-4 text-lg font-medium">
                                                            shadcn/ui
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
                                            {/* Include other documentation links here */}
                                            <li>
                                                <a
                                                    href="/addvehicle"
                                                    className="text-blue-500"
                                                >
                                                    Register Vehicle
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="/docs/installation"
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
                                {/* Include other navigation menu items here */}
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
                    {/* Rest of your code for user actions */}
                    {user ? (
                        <Button
                            className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800"
                            onClick={logout} // Call logout function
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
            </div>
            {isLoginFormOpen && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-75">
                    <div className="bg p-8 rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <LoginForm toggle={togglePop} />
                    </div>
                </div>
            )}
            </div>
            {isLoginFormOpen && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-75">
                    <div className="bg p-8 rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <LoginForm
                            toggle={togglePop}
                            closeLoginForm={() => setIsLoginFormOpen(false)}
                        />
                    </div>
                </div>
            )}
        </nav>
    )
}

export default NavBar
