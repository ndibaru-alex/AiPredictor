import { Geist, Geist_Mono, Orbitron } from 'next/font/google'
import './globals.css'

import { Header } from '@/components/header'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
  weight: ['400', '700'],
})

export const metadata = {
  title: 'Gammer | Fortnite, CS:GO, Apex ',
  description: 'Browse & Book Gaming Sessions',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistMono.variable} ${orbitron.variable} antialiased `}
        >
          <Header />
          {children}
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  )
}
