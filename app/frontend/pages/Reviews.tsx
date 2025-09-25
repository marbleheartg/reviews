import { ABI, CA } from "@/lib/constants"
import sdk from "@farcaster/miniapp-sdk"
import clsx from "clsx"
import Image from "next/image"
import { useEffect } from "react"
import { useReadContract } from "wagmi"
import { store, updateStore } from "../../lib/store"

export default function Reviews() {
  const { user } = store()

  const { data, isLoading, error } = useReadContract({
    address: CA,
    abi: ABI,
    functionName: "getRandomNumber",
    args: [],
  })

  // check the last block number of the blockchain

  useEffect(() => {
    console.log("reviews", data, isLoading, error)
  }, [data, isLoading, error])

  useEffect(() => {
    updateStore({})
  }, [])

  return (
    <main className={clsx("fixed top-44 bottom-0 inset-x-1/12")}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className={clsx("bg-white text-black rounded-lg mb-3")}>
          <div className={clsx("flex justify-between items-center p-3")}>
            <div className={clsx("max-w-[80%] truncate")}>
              {data ? data?.toString() : isLoading ? "Loading..." : error ? error.message : "No data"}
            </div>

            <div
              className={clsx("relative z-10", "aspect-square w-[32px]", "bg-[var(--accent)]", "rounded-full", "outline-2 outline-[var(--accent)]")}
              onClick={e => {
                if (store.getState().capabilities?.includes("haptics.impactOccurred")) sdk.haptics.impactOccurred("light")
                e.stopPropagation()
                if (user?.fid) sdk.actions.viewProfile({ fid: user.fid })
              }}
            >
              <Image src={user?.pfpUrl || "/images/global/user.svg"} fill alt="user_pfp" className="rounded-full" />
            </div>
          </div>

          <div className={clsx("text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-b-lg", "flex justify-between gap-5")}>
            <div>10 followers</div>
            <div>12/31/2025</div>
          </div>
        </div>
      ))}
    </main>
  )
}
