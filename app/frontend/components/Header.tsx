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
        "shadow-lg shadow-black/20 px-6 py-4",
      )}
    >
      <div className={clsx("flex items-center gap-3")}>
        <div>
          <h1 className={clsx("text-xl font-bold text-white")}>Reviews</h1>
          <p className={clsx("text-xs text-gray-400")}>On-chain reputation</p>
        </div>
      </div>

      {/* User Info and Wallet */}
      <div className={clsx("flex items-center gap-3")}>
        {user ? (
          <div className={clsx("flex items-center gap-3")}>
            {/* Wallet Connection */}
            <div className={clsx("relative")}>
              <appkit-button />
            </div>
          </div>
        ) : (
          <div className={clsx("flex items-center gap-3")}>
            {/* Loading State */}
            <div className={clsx("flex items-center gap-2")}>
              <div className={clsx("w-8 h-8 bg-white/20 rounded-full animate-pulse")} />
              <div className={clsx("hidden sm:block space-y-1")}>
                <div className={clsx("h-3 w-20 bg-white/20 rounded animate-pulse")} />
                <div className={clsx("h-2 w-16 bg-white/10 rounded animate-pulse")} />
              </div>
            </div>

            {/* Wallet Connection */}
            <div className={clsx("relative")}>
              <appkit-button />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
