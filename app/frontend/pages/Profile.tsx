import { ABI, CA } from "@/lib/constants"
import sdk from "@farcaster/miniapp-sdk"
import clsx from "clsx"
import Image from "next/image"
import { useState } from "react"
import { parseEther } from "viem"
import { useAccount, useReadContract, useWriteContract } from "wagmi"
import { store } from "../../lib/store"

export default function Profile() {
  const { user } = store()
  const { address } = useAccount()
  const [newReview, setNewReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received")
  const [reviewSentiment, setReviewSentiment] = useState<"positive" | "negative">("positive")

  const { writeContract } = useWriteContract()

  const {
    data: receivedData,
    refetch: refetchReceived,
    isLoading: isLoadingReceived,
  } = useReadContract({
    abi: ABI,
    address: CA,
    functionName: "getReceivedReview",
    args: [user?.fid ? BigInt(user.fid) : BigInt(0), BigInt(0)],
    query: {
      enabled: !!user?.fid,
    },
  })

  const {
    data: sentData,
    refetch: refetchSent,
    isLoading: isLoadingSent,
  } = useReadContract({
    abi: ABI,
    address: CA,
    functionName: "getAddedReview",
    args: [address || "0x0000000000000000000000000000000000000000", BigInt(0)],
    query: {
      enabled: !!address,
    },
  })

  const handleSubmitReview = async () => {
    if (newReview.trim() && !isSubmitting) {
      setIsSubmitting(true)
      try {
        await writeContract({
          abi: ABI,
          address: CA,
          functionName: "createReview",
          args: [user?.fid ? BigInt(user.fid) : BigInt(0), newReview, reviewSentiment === "positive"],
          value: parseEther("0.01"),
        })
        setNewReview("")
        setReviewSentiment("positive")
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
    <main className={clsx("fixed top-30 bottom-0 inset-x-1/12 overflow-y-auto pb-30")}>
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
          {/* Sentiment Selection */}
          <div className={clsx("mb-4")}>
            <label className={clsx("text-sm font-medium text-gray-300 mb-3 block")}>Review Type</label>
            <div className={clsx("flex gap-2")}>
              <button
                onClick={() => setReviewSentiment("positive")}
                className={clsx(
                  "flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200",
                  "flex items-center justify-center gap-2",
                  reviewSentiment === "positive"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-white/10 text-gray-400 border border-white/20 hover:bg-white/20 hover:text-white",
                )}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setReviewSentiment("negative")}
                className={clsx(
                  "flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200",
                  "flex items-center justify-center gap-2",
                  reviewSentiment === "negative"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-white/10 text-gray-400 border border-white/20 hover:bg-white/20 hover:text-white",
                )}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h.01M15 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className={clsx("flex gap-3")}>
            <input
              type="text"
              value={newReview}
              onChange={e => setNewReview(e.target.value)}
              placeholder="Share your thoughts..."
              className={clsx(
                "flex-1 px-4 py-3 pl-3.5 bg-white/10 border border-white/20 rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40",
                "text-white text-sm placeholder-gray-400",
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
          <div className={clsx("text-xs text-gray-400 mt-3")}>Press Enter to submit • 0.01 ETH required</div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className={clsx("mb-6")}>
        <h2 className={clsx("text-lg font-semibold mb-4")}>Recent Reviews</h2>

        {/* Tab Navigation */}
        <div className={clsx("flex bg-white/5 rounded-xl p-1 mb-4 gap-3")}>
          <button
            onClick={() => setActiveTab("received")}
            className={clsx(
              "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200",
              activeTab === "received" ? "text-black hover:text-white hover:bg-white/10" : "bg-white/20 text-white",
            )}
          >
            Received
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={clsx(
              "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200",
              activeTab === "sent" ? "text-black hover:text-white hover:bg-white/10" : "bg-white/20 text-white",
            )}
          >
            Sent
          </button>
        </div>

        {activeTab === "received" ? (
          isLoadingReceived ? (
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
          ) : receivedData ? (
            <div className={clsx("space-y-4")}>
              <div
                className={clsx(
                  "bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden",
                  "hover:bg-white/10 transition-all duration-200 cursor-pointer",
                )}
                onClick={() => refetchReceived()}
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
                          {receivedData?.author.slice(0, 6)}...{receivedData?.author.slice(-4)}
                        </span>
                        <span
                          className={clsx(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            receivedData?.isPositive
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30",
                          )}
                        >
                          {receivedData?.isPositive ? "Positive" : "Negative"}
                        </span>
                      </div>
                      <p className={clsx("text-gray-300 text-sm leading-relaxed")}>{receivedData?.text}</p>
                    </div>
                  </div>
                </div>

                <div className={clsx("bg-white/5 border-t border-white/10 px-4 py-3")}>
                  <div className={clsx("flex items-center justify-between text-xs text-gray-400")}>
                    <span>{formatTimestamp(receivedData?.timestamp)}</span>
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
              <h3 className={clsx("text-lg font-medium text-white mb-2")}>No reviews received yet</h3>
              <p className={clsx("text-gray-400 text-sm")}>Reviews about you will appear here</p>
            </div>
          )
        ) : // Sent Reviews Tab
        isLoadingSent ? (
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
        ) : sentData ? (
          <div className={clsx("space-y-4")}>
            <div
              className={clsx(
                "bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden",
                "hover:bg-white/10 transition-all duration-200 cursor-pointer",
              )}
              onClick={() => refetchSent()}
            >
              <div className={clsx("p-4")}>
                <div className={clsx("flex items-start gap-3 mb-3")}>
                  <div className={clsx("flex-shrink-0")}>
                    <div className={clsx("relative w-8 h-8 rounded-full overflow-hidden border border-white/20")}>
                      <Image src={user?.pfpUrl || "/images/global/user.svg"} fill alt="Your avatar" className="object-cover" />
                    </div>
                  </div>
                  <div className={clsx("flex-1 min-w-0")}>
                    <div className={clsx("flex items-center gap-2 mb-1")}>
                      <span className={clsx("text-sm font-medium text-white")}>You</span>
                      <span
                        className={clsx(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          sentData?.isPositive
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30",
                        )}
                      >
                        {sentData?.isPositive ? "Positive" : "Negative"}
                      </span>
                    </div>
                    <p className={clsx("text-gray-300 text-sm leading-relaxed")}>{sentData?.text}</p>
                  </div>
                </div>
              </div>

              <div className={clsx("bg-white/5 border-t border-white/10 px-4 py-3")}>
                <div className={clsx("flex items-center justify-between text-xs text-gray-400")}>
                  <span>{formatTimestamp(sentData?.timestamp)}</span>
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <h3 className={clsx("text-lg font-medium text-white mb-2")}>No reviews sent yet</h3>
            <p className={clsx("text-gray-400 text-sm")}>Reviews you write will appear here</p>
          </div>
        )}
      </div>
    </main>
  )
}
