const sizes = {
  sm: 'h-10 sm:h-11',
  md: 'h-14 sm:h-16',
  lg: 'h-20 sm:h-24',
  xl: 'h-28 sm:h-32',
  header: 'h-12 sm:h-14 md:h-16',
}

export function Logo({ className = '', size = 'md' }) {
  return (
    <img
      src="/logo.png"
      alt="Barbearia Maestria"
      className={`${sizes[size] ?? sizes.md} w-auto max-w-[min(280px,70vw)] object-contain ${className}`}
    />
  )
}
