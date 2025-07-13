import React from 'react'
import {
  SignedOut,
  SignedIn,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import {
  ArrowRightLeftIcon,
  CarFront,
  Heart,
  History,
  Layout,
  TrendingUp,
} from 'lucide-react'
import NamvMenu from './navMenu'

// import { checkUser } from '@/lib/checkUser'

export const Header = async ({ isAdminPage = false }) => {
  //   const user = await checkUser()

  //   const isAdmin = user?.role === 'ADMIN'
  const isAdmin = false

  return (
    <header className="fixed top-0 w-full bg-gradient-to-r from-black to-purple-900 bg-opacity-95 backdrop-blur-md z-50 border-b border-gray-800">
      <nav className="flex justify-between items-center mx-auto px-4 py-3">
        {/* Logo and title */}
        <Link
          href={isAdminPage ? '/admin' : '/'}
          className="flex items-center space-x-2"
        >
          <h1 className="text-3xl font-extrabold text-white">Predictor</h1>
          {isAdminPage && (
            <span className="text-sm font-semibold text-yellow-300">Admin</span>
          )}
        </Link>

        {/* Nav menu: hidden on small screens */}
        <NamvMenu />

        {/* Action buttons */}
        <div className="flex items-center space-x-4">
          {isAdminPage ? (
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowRightLeftIcon size={18} />
                <span>Back to App</span>
              </Button>
            </Link>
          ) : (
            <>
              <SignedIn>
                {!isAdmin && (
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-black hover:text-white transition"
                  >
                    <Button variant="outline">
                      <TrendingUp size={18} />
                      <span className="hidden md:inline">My Predictions</span>
                    </Button>
                  </Link>
                )}
                <Link href="/" className="flex items-center gap-2">
                  <Button>
                    <History size={18} />
                    <span className="hidden md:inline">History</span>
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="flex items-center gap-2">
                    <Button variant="outline">
                      <Layout size={18} />
                      <span className="hidden md:inline">Admin Portal</span>
                    </Button>
                  </Link>
                )}
              </SignedIn>

              <SignedOut>
                {!isAdminPage && (
                  <SignInButton forceRedirectUrl="/">
                    <Button variant="outline">Login</Button>
                  </SignInButton>
                )}
              </SignedOut>

              <SignedIn>
                <UserButton
                  appearance={{
                    elements: { avatarBox: 'w-10 h-10' },
                  }}
                />
              </SignedIn>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
