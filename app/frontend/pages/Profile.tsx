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
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { writeContract } = useWriteContract()

  const { data, refetch, isLoading } = useReadContract({
    abi: ABI,
    address: CA,
    functionName: "getReceivedReview",
    args: [user?.fid ? BigInt(user.fid) : BigInt(0), BigInt(0)],
  })

  useEffect(() => {
    console.log(data)
  }, ["data", data])

  useEffect(() => {
    updateStore({})
  }, [])

  const handleSubmitReview = async () => {
    if (newReview.trim() && !isSubmitting) {
      setIsSubmitting(true)
      try {
        console.log("New review:", newReview)
        await writeContract({
          abi: ABI,
          address: CA,
          functionName: "createReview",
          args: [user?.fid ? BigInt(user.fid) : BigInt(0), newReview, true],
          value: parseEther("0.01"),
        })
        setNewReview("")
      } catch (error) {
        console.error("Error submitting review:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const formatTimestamp = (timestamp: bigint | string) => {
    if (!timestamp) return ""
    const date = new Date(Number(timestamp) * 1000)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <main className={clsx("fixed top-30 bottom-0 inset-x-1/12 overflow-y-auto")}>
      {/* Profile Header */}
      <div className={clsx("mb-8")}>
        <div className={clsx("flex items-center gap-4 mb-6")}>
          <div className={clsx("relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/20")}>
            <Image src={user?.pfpUrl || "/images/global/user.svg"} fill alt="Profile picture" className="object-cover" />
          </div>
          <div>
            <h1 className={clsx("text-2xl font-bold mb-1")}>{user?.displayName || user?.username || "Anonymous"}</h1>
            <p className={clsx("text-gray-400 text-sm")}>@{user?.username || "user"}</p>
          </div>
        </div>

        {/* Stats */}
        <div className={clsx("grid grid-cols-3 gap-4 mb-6")}>
          <div className={clsx("bg-white/5 rounded-lg p-4 text-center")}>
            <div className={clsx("text-2xl font-bold text-white")}>0</div>
            <div className={clsx("text-gray-400 text-sm")}>Reviews</div>
          </div>
          <div className={clsx("bg-white/5 rounded-lg p-4 text-center")}>
            <div className={clsx("text-2xl font-bold text-green-400")}>0</div>
            <div className={clsx("text-gray-400 text-sm")}>Positive</div>
          </div>
          <div className={clsx("bg-white/5 rounded-lg p-4 text-center")}>
            <div className={clsx("text-2xl font-bold text-red-400")}>0</div>
            <div className={clsx("text-gray-400 text-sm")}>Negative</div>
          </div>
        </div>
      </div>

      {/* Create Review Section */}
      <div className={clsx("mb-8")}>
        <h2 className={clsx("text-lg font-semibold mb-4")}>Write a Review</h2>
        <div className={clsx("bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4")}>
          <div className={clsx("flex gap-3")}>
            <input
              type="text"
              value={newReview}
              onChange={e => setNewReview(e.target.value)}
              placeholder="Share your thoughts..."
              className={clsx(
                "flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40",
                "text-white placeholder-gray-400",
                "transition-all duration-200",
              )}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmitReview()
                }
              }}
              disabled={isSubmitting}
            />
            <button
              onClick={handleSubmitReview}
              disabled={!newReview.trim() || isSubmitting}
              className={clsx(
                "px-6 py-3 rounded-lg font-medium transition-all duration-200",
                "bg-white text-black",
                "disabled:bg-white/20 disabled:text-gray-500 disabled:cursor-not-allowed",
                "hover:bg-white/90 active:scale-95",
                "flex items-center gap-2",
              )}
            >
              {isSubmitting ? (
                <>
                  <div className={clsx("w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin")} />
                  Posting...
                </>
              ) : (
                "Post"
              )}
            </button>
          </div>
          <div className={clsx("text-xs text-gray-400 mt-2")}>Press Enter to submit • 0.01 ETH required</div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className={clsx("mb-6")}>
        <h2 className={clsx("text-lg font-semibold mb-4")}>Recent Reviews</h2>

        {isLoading ? (
          <div className={clsx("space-y-4")}>
            {[1, 2, 3].map(i => (
              <div key={i} className={clsx("bg-white/5 border border-white/10 rounded-xl p-4 animate-pulse")}>
                <div className={clsx("flex items-center gap-3 mb-3")}>
                  <div className={clsx("w-8 h-8 bg-white/20 rounded-full")} />
                  <div className={clsx("flex-1")}>
                    <div className={clsx("h-4 bg-white/20 rounded w-1/3 mb-2")} />
                    <div className={clsx("h-3 bg-white/10 rounded w-1/4")} />
                  </div>
                </div>
                <div className={clsx("h-4 bg-white/20 rounded w-full mb-2")} />
                <div className={clsx("h-4 bg-white/20 rounded w-2/3")} />
              </div>
            ))}
          </div>
        ) : data ? (
          <div className={clsx("space-y-4")}>
            <div
              className={clsx(
                "bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden",
                "hover:bg-white/10 transition-all duration-200 cursor-pointer",
              )}
              onClick={() => refetch()}
            >
              <div className={clsx("p-4")}>
                <div className={clsx("flex items-start gap-3 mb-3")}>
                  <div className={clsx("flex-shrink-0")}>
                    <div
                      className={clsx(
                        "relative w-8 h-8 rounded-full overflow-hidden border border-white/20",
                        "hover:scale-105 transition-transform duration-200",
                      )}
                      onClick={e => {
                        if (store.getState().capabilities?.includes("haptics.impactOccurred")) sdk.haptics.impactOccurred("light")
                        e.stopPropagation()
                        if (user?.fid) sdk.actions.viewProfile({ fid: user.fid })
                      }}
                    >
                      <Image src={user?.pfpUrl || "/images/global/user.svg"} fill alt="Author avatar" className="object-cover" />
                    </div>
                  </div>
                  <div className={clsx("flex-1 min-w-0")}>
                    <div className={clsx("flex items-center gap-2 mb-1")}>
                      <span className={clsx("text-sm font-medium text-white")}>
                        {data?.author.slice(0, 6)}...{data?.author.slice(-4)}
                      </span>
                      <span
                        className={clsx(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          data?.isPositive
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30",
                        )}
                      >
                        {data?.isPositive ? "Positive" : "Negative"}
                      </span>
                    </div>
                    <p className={clsx("text-gray-300 text-sm leading-relaxed")}>{data?.text}</p>
                  </div>
                </div>
              </div>

              <div className={clsx("bg-white/5 border-t border-white/10 px-4 py-3")}>
                <div className={clsx("flex items-center justify-between text-xs text-gray-400")}>
                  <span>{formatTimestamp(data?.timestamp)}</span>
                  <span>Tap to refresh</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={clsx("text-center py-12")}>
            <div className={clsx("w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4")}>
              <svg className={clsx("w-8 h-8 text-gray-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className={clsx("text-lg font-medium text-white mb-2")}>No reviews yet</h3>
            <p className={clsx("text-gray-400 text-sm")}>Be the first to write a review about this user</p>
          </div>
        )}
      </div>
    </main>
  )
}
