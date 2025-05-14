
import Link from "next/link"
import { Bell, Home, User } from "lucide-react"

import DarkButton from "./DarkButton"
import { SignInButton, UserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import NavMobile from "./NavMobile"
import { Button } from "./ui/button"

async function Navbar() {
    const user = await currentUser()

    return (
        <nav className="flex items-center justify-between px-4 lg:px-32 py-4 border-b">
            {/* Logo */}
            <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                        <line x1="9" y1="9" x2="9.01" y2="9" />
                        <line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                    <span className="font-bold text-xl">Brand</span>
                </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-4">
                <DarkButton />
                {user ?
                    <div className="hidden md:flex items-center space-x-12">
                        <Link href="/pricing" className="text-sm flex items-center gap-1 font-medium hover:text-primary">
                            <Home size={20} /> Home
                        </Link>
                        <Link href="/about" className="text-sm flex items-center gap-1 font-medium hover:text-primary">
                            <Bell size={20} /> Notifications
                        </Link>
                        <Link href="/blog" className="text-sm flex items-center gap-1 font-medium hover:text-primary">
                            <User size={20} /> Profile
                        </Link>
                        <UserButton />
                    </div> : <Button>Sign In</Button>
                }
            </div>

            <NavMobile />
        </nav>
    )
}

export default Navbar
