import clsx from "clsx"
import { store } from "../../lib/store"

const Header = () => {
  const { user } = store()

  return (
    <header
      className={clsx(
        "fixed top-6 inset-x-1/12 z-50",
        "flex justify-between items-center",
        "bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl",
        "shadow-lg shadow-black/20 px-4 py-3 pt-3.5",
      )}
    >
      <div>
        <h1 className={clsx("text-lg font-bold text-white leading-none")}>Reviews</h1>
        <p className={clsx("text-[10px] text-gray-400 ")}>On-chain reputation</p>
      </div>

      <appkit-button size="lg" balance="hide" namespace="eip155" />
    </header>
  )
}

export default Header
