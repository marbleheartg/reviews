import reviewsAbi from "../../../artifacts/contracts/Reviews.sol/Reviews.json" assert { type: "json" }

const ABI = reviewsAbi.abi

const CA = "0x2A7EC1a948C356c3D5cf0b275B0FAa4Df10701D5"

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
