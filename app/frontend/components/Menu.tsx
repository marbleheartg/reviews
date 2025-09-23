import clsx from "clsx"
import { NavLink } from "react-router"

const Menu = () => {
  return (
    <nav className={clsx("fixed bottom-8 inset-x-1/12 px-1", "flex justify-around")}>
      <NavLink to="/">Reviews</NavLink>
      <NavLink to="/profile">Profile</NavLink>
    </nav>
  )
}

export default Menu
