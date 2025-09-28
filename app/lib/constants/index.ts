import { reviewsAbi } from "../../../artifacts/contracts/Reviews.sol/generated"

const ABI = reviewsAbi

const CA = "0x2a7ec1a948c356c3d5cf0b275b0faa4df10701d5"

const MINIAPP_TITLE = "reviews"

const MINIAPP_DESCRIPTION = "reviews mini app"

const MINIAPP = {
  version: "next",
  imageUrl: `https://${process.env.NEXT_PUBLIC_HOST}/images/og/cast/image.jpg`,
  aspectRatio: "3:2",
  button: {
    title: "check out",
    action: {
      type: "launch_miniapp",
      url: `https://${process.env.NEXT_PUBLIC_HOST}`,
      name: MINIAPP_TITLE,
      splashImageUrl: `https://${process.env.NEXT_PUBLIC_HOST}/images/og/splash.png`,
      splashBackgroundColor: "#ffffff",
    },
  },
}

export { ABI, CA, MINIAPP, MINIAPP_DESCRIPTION, MINIAPP_TITLE }
