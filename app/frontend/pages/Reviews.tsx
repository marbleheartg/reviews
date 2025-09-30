import clsx from "clsx"
import Image from "next/image"
import { useState } from "react"
import { useReadReviewsGetReview } from "../../../artifacts/contracts/Reviews.sol/generated"
import { store } from "../../lib/store"

export default function Reviews() {
  const { user } = store()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSentiment, setFilterSentiment] = useState<"all" | "positive" | "negative">("all")

  // Fetch all reviews (this would need to be implemented in the contract)
  // For now, we'll use a mock approach with the existing contract functions

  const { data: review, isLoading } = useReadReviewsGetReview({
    args: [BigInt(0)],
    query: {
      enabled: true,
    },
  })

  const formatTimestamp = (timestamp: bigint | string) => {
    if (!timestamp) return ""
    const date = new Date(Number(timestamp) * 1000)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Mock data for demonstration - replace with real data when available
  const mockReviews = [
    {
      id: 1,
      author: "0x1234...5678",
      targetFID: BigInt(12345),
      text: "Great experience working with this user. Very professional and responsive!",
      isPositive: true,
      timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400), // 1 day ago
    },
    {
      id: 2,
      author: "0x9876...5432",
      targetFID: BigInt(12345),
      text: "Had some issues with communication, but overall okay experience.",
      isPositive: false,
      timestamp: BigInt(Math.floor(Date.now() / 1000) - 172800), // 2 days ago
    },
    {
      id: 3,
      author: "0x5555...7777",
      targetFID: BigInt(12345),
      text: "Excellent work! Would definitely recommend to others.",
      isPositive: true,
      timestamp: BigInt(Math.floor(Date.now() / 1000) - 259200), // 3 days ago
    },
  ]

  const filteredReviews = mockReviews.filter(review => {
    const matchesSearch = review.text.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSentiment =
      filterSentiment === "all" || (filterSentiment === "positive" && review.isPositive) || (filterSentiment === "negative" && !review.isPositive)
    return matchesSearch && matchesSentiment
  })

  return (
    <main className={clsx("fixed top-32 bottom-0 inset-x-1/12 overflow-y-auto pb-30")}>
      {/* Header Section */}
      <div className={clsx("mb-6")}>
        <h1 className={clsx("text-2xl font-bold text-white mb-2")}>All Reviews</h1>
        <p className={clsx("text-gray-400 text-sm")}>Discover what the community is saying</p>
      </div>

      {/* Search and Filter Section */}
      <div className={clsx("mb-6 space-y-4")}>
        {/* Search Bar */}
        <div className={clsx("relative")}>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search reviews..."
            className={clsx(
              "w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-xl",
              "focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40",
              "text-white text-sm placeholder-gray-400",
              "transition-all duration-200",
            )}
          />
          <svg
            className={clsx("absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400")}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Sentiment Filter */}
        <div className={clsx("flex gap-2")}>
          <button
            onClick={() => setFilterSentiment("all")}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              filterSentiment === "all" ? "bg-white/20 text-white" : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white",
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilterSentiment("positive")}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              "flex items-center gap-2",
              filterSentiment === "positive"
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white",
            )}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Positive
          </button>
          <button
            onClick={() => setFilterSentiment("negative")}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              "flex items-center gap-2",
              filterSentiment === "negative"
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white",
            )}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h.01M15 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Negative
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className={clsx("space-y-4")}>
        {isLoading ? (
          // Loading State
          <div className={clsx("space-y-4")}>
            {[1, 2, 3].map(i => (
              <div key={i} className={clsx("bg-white/5 border border-white/10 rounded-xl p-4 animate-pulse")}>
                <div className={clsx("flex items-start gap-3 mb-3")}>
                  <div className={clsx("w-10 h-10 bg-white/20 rounded-full")} />
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
        ) : filteredReviews.length > 0 ? (
          // Reviews List
          filteredReviews.map(review => (
            <div
              key={review.id}
              className={clsx(
                "bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden",
                "hover:bg-white/10 transition-all duration-200 cursor-pointer",
              )}
            >
              <div className={clsx("p-4")}>
                <div className={clsx("flex items-start gap-3 mb-3")}>
                  <div className={clsx("flex-shrink-0")}>
                    <div className={clsx("relative w-10 h-10 rounded-full overflow-hidden border border-white/20")}>
                      <Image src={user?.pfpUrl || "/images/global/user.svg"} fill alt="Author avatar" className="object-cover" />
                    </div>
                  </div>
                  <div className={clsx("flex-1 min-w-0")}>
                    <div className={clsx("flex items-center gap-2 mb-1")}>
                      <span className={clsx("text-sm font-medium text-white")}>
                        {review.author.slice(0, 6)}...{review.author.slice(-4)}
                      </span>
                      <span
                        className={clsx(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          review.isPositive
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30",
                        )}
                      >
                        {review.isPositive ? "Positive" : "Negative"}
                      </span>
                    </div>
                    <p className={clsx("text-gray-300 text-sm leading-relaxed")}>{review.text}</p>
                  </div>
                </div>
              </div>

              <div className={clsx("bg-white/5 border-t border-white/10 px-4 py-3")}>
                <div className={clsx("flex items-center justify-between text-xs text-gray-400")}>
                  <span>{formatTimestamp(review.timestamp)}</span>
                  <span>FID: {review.targetFID.toString()}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Empty State
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
            <h3 className={clsx("text-lg font-medium text-white mb-2")}>
              {searchTerm || filterSentiment !== "all" ? "No matching reviews" : "No reviews yet"}
            </h3>
            <p className={clsx("text-gray-400 text-sm")}>
              {searchTerm || filterSentiment !== "all" ? "Try adjusting your search or filter criteria" : "Be the first to write a review"}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
