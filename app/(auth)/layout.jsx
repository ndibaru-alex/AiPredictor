import React from 'react'

export default function layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {children}
    </div>
  )
}
