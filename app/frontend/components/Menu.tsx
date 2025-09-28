import clsx from "clsx"
import { NavLink } from "react-router"

const Menu = () => {
  return (
    <nav
      className={clsx(
        "fixed bottom-6 inset-x-1/12 px-4",
        "flex justify-center gap-2",
        "bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl",
        "shadow-lg shadow-black/20",
      )}
    >
      <NavLink
        to="/"
        className={({ isActive }) =>
          clsx(
            "flex flex-col items-center gap-1 px-4 py-3 rounded-xl",
            "transition-all duration-200 ease-out",
            "hover:bg-white/10 active:scale-95",
            isActive ? "bg-white/20 text-white" : "text-gray-300 hover:text-white",
          )
        }
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <span className="text-xs font-medium">Reviews</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          clsx(
            "flex flex-col items-center gap-1 px-4 py-3 rounded-xl",
            "transition-all duration-200 ease-out",
            "hover:bg-white/10 active:scale-95",
            isActive ? "bg-white/20 text-white" : "text-gray-300 hover:text-white",
          )
        }
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <span className="text-xs font-medium">Profile</span>
      </NavLink>
    </nav>
  )
}

export default Menu
