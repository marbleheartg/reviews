const MINIAPP_TITLE = "MINIAPP_TITLE"

const MINIAPP_DESCRIPTION = "MINIAPP_DESCRIPTION"

const MINIAPP = {
  version: "next",
  imageUrl: `https://${process.env.NEXT_PUBLIC_HOST}/images/og/cast/image.jpg`,
  aspectRatio: "3:2",
  button: {
    title: "TITLE",
    action: {
      type: "launch_miniapp",
      url: `https://${process.env.NEXT_PUBLIC_HOST}`,
      name: MINIAPP_TITLE,
      splashImageUrl: `https://${process.env.NEXT_PUBLIC_HOST}/images/og/splash.png`,
      splashBackgroundColor: "#ffffff",
    },
  },
}

export { MINIAPP, MINIAPP_DESCRIPTION, MINIAPP_TITLE }
