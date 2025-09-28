import { ABI, CA } from "@/lib/constants"
import sdk from "@farcaster/miniapp-sdk"
import clsx from "clsx"
import Image from "next/image"
import { useEffect, useState } from "react"
import { parseEther } from "viem"
import { useReadContract, useWriteContract } from "wagmi"
import { store, updateStore } from "../../lib/store"

export default function Profile() {
  const { user } = store()
  const [newReview, setNewReview] = useState("")

  const { writeContract } = useWriteContract()

  const { data, refetch, isLoading } = useReadContract({
    abi: ABI,
    address: CA,
    functionName: "getReceivedReview",
    args: [user?.fid, 0],
  })

  useEffect(() => {
    console.log(data)
  }, ["data", data])

  useEffect(() => {
    updateStore({})
  }, [])

  const handleSubmitReview = () => {
    if (newReview.trim()) {
      console.log("New review:", newReview)
      writeContract({
        abi: ABI,
        address: CA,
        functionName: "createReview",
        args: [user?.fid, newReview, true],
        value: parseEther("0.01"),
      })
      setNewReview("")
    }
  }

  return (
    <main className={clsx("fixed top-30 bottom-0 inset-x-1/12")}>
      <div className={clsx("text-xl font-bold mb-6")}>My Reviews</div>

      <div className={clsx("bg-white text-black rounded-lg mb-3 p-3")}>
        <div className={clsx("flex gap-2")}>
          <input
            type="text"
            value={newReview}
            onChange={e => setNewReview(e.target.value)}
            placeholder="Write your review..."
            className={clsx(
              "flex-1 px-3 py-2 border border-gray-300 rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent",
              "text-sm",
            )}
            onKeyDown={e => {
              if (e.key === "Enter") {
                handleSubmitReview()
              }
            }}
          />
          <button
            onClick={handleSubmitReview}
            disabled={!newReview.trim()}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-medium",
              "bg-[var(--accent)] text-white",
              "disabled:bg-gray-300 disabled:cursor-not-allowed",
              "hover:opacity-90 transition-opacity",
            )}
          >
            Post
          </button>
        </div>
      </div>

      {Array.from({ length: 1 }).map((_, i) => (
        <div key={i} className={clsx("bg-white text-black rounded-lg mb-3")} onClick={() => refetch()}>
          <div className={clsx("flex justify-between items-center p-3")}>
            <div className={clsx("max-w-[80%] truncate")}>
              {isLoading
                ? "Loading..."
                : data
                ? JSON.stringify(data, (key, value) => (typeof value === "bigint" ? value.toString() : value))
                : "No review data"}
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
            <div>{}</div>
          </div>
        </div>
      ))}
    </main>
  )
}
