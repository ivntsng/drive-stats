import { useState, useContext } from 'react'
import LoginForm from './components/login'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme-provider'
import { handleLogout } from './components/login'
import { useToast } from '@/components/ui/use-toast'
import { UserContext } from './UserContext'

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
            <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
                <a href="#" className="flex items-center">
                    <img
                        src="https://www.svgrepo.com/show/471147/car-01.svg"
                        className="h-6 mr-3 sm:h-9"
                        alt="DriveStats Logo"
                    />
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                        DriveStats
                    </span>
                </a>
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
                <div
                    className="items-center justify-between w-full lg:flex lg:w-auto lg:order-1"
                    id="mobile-menu-2"
                >
                    <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                        {/* <li>
              <a href="#"
                className="block py-2 pl-3 pr-4 text-white bg-purple-700 rounded lg:bg-transparent lg:text-purple-700 lg:p-0 dark:text-white"
                aria-current="page">Test</a>
            </li> */}
                        {/* Other menu items */}
                    </ul>
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
            </div>
        </nav>
    )
}

export default NavBar
