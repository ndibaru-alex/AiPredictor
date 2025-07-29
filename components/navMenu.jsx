'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function NamvMenu() {
  const pathname = usePathname()
  const navLinks = [
    { label: 'Home', href: '/', color: 'text-blue-300 hover:text-blue-100' },
    {
      label: 'Games',
      href: '/',
      color: 'text-green-300 hover:text-green-100',
    },
    {
      label: 'Blogs',
      href: '/',
      color: 'text-pink-300 hover:text-pink-100',
    },
  ]
  return (
    <ul className="hidden md:flex space-x-6">
      {navLinks.map(({ label, href }) => {
        const isActive = pathname === href
        const classes = isActive
          ? 'text-yellow-300 animate-pulse'
          : 'text-pink-300'
        return (
          <li key={label}>
            <Link href={href} className={`${classes} transition `}>
              {label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
