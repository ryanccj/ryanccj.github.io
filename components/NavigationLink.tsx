'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from './Link'

interface Props {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
}

export default function NavigationLink({ href, children, className = '', onClick }: Props) {
  const pathname = usePathname()
  const active = pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))

  return (
    <Link
      href={href}
      aria-current={active ? (pathname === href ? 'page' : 'location') : undefined}
      className={`${className} ${
        active
          ? 'font-semibold text-gray-900 dark:text-gray-100'
          : 'font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}
