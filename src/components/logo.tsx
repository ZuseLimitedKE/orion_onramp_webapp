import { Link } from '@tanstack/react-router'
export function Logo() {
  return (
    <Link to="/" className=" p-1.5">
      <span className="sr-only">Orion</span>
      <img alt="logo" src="/orion-logo.png" className="h-6 w-auto" />
    </Link>
  )
}
