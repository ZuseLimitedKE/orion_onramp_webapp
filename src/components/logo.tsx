import { Link } from '@tanstack/react-router'
export function Logo() {
  return (
    <Link to="/">
      <span className="sr-only">Orion</span>
      <img alt="logo" src="/orion-logo.png" className="h-5 w-auto" />
    </Link>
  )
}
