'use client'
import React, { useState } from 'react'
import DarkButton from './DarkButton'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'
import { Bell, Home, LogOut, Menu, User } from 'lucide-react'
import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, SignOutButton } from '@clerk/nextjs'

const NavMobile = () => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className=" flex md:hidden gap-4">
            <DarkButton />
            <SignedIn>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <SheetHeader>
                            <SheetTitle>Menu</SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col space-y-6 mt-8 ml-4">
                            <Link href="/features" className="text-sm flex gap-4 items-center font-medium hover:text-primary" onClick={() => setIsOpen(false)}>
                                <Home size={17} /> Home
                            </Link>
                            <Link href="/pricing" className="text-sm flex gap-4 items-center font-medium hover:text-primary" onClick={() => setIsOpen(false)}>
                                <Bell size={20} /> Notifications
                            </Link>
                            <Link href="/about" className="text-sm flex gap-4 items-center font-medium hover:text-primary" onClick={() => setIsOpen(false)}>
                                <User size={20} /> Profile
                            </Link>
                            <SignOutButton>
                                <Link href="/blog" className="text-sm flex gap-4 items-center font-medium hover:text-primary" onClick={() => setIsOpen(false)}>
                                    <LogOut size={20} /> Log Out
                                </Link>
                            </SignOutButton>
                        </div>
                    </SheetContent>
                </Sheet>
            </SignedIn>
            <SignedOut>
                <SignInButton>
                    <Button>Sign In</Button>
                </SignInButton>
            </SignedOut>
        </div>
    )
}

export default NavMobile