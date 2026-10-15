import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  variant?: 'shell' | 'content'
}

export default function SectionContainer({ children, variant = 'content' }: Props) {
  return (
    <section
      className={
        variant === 'shell'
          ? 'site-shell box-border w-full min-w-0 px-[clamp(16px,4vw,64px)]'
          : 'w-full min-w-0'
      }
    >
      {children}
    </section>
  )
}
