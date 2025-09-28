import clientErrorHandling from "@/lib/clientErrorsReporting"
import Providers from "@/lib/providers"
import { updateStore } from "@/lib/store"
import sdk from "@farcaster/miniapp-sdk"
import { useEffect } from "react"
import { BrowserRouter, Route, Routes } from "react-router"
import CustomCursor from "./components/CustomCursor"
import Header from "./components/Header"
import Menu from "./components/Menu"
import Profile from "./pages/Profile"
import Reviews from "./pages/Reviews"

export default function App() {
  useEffect(() => {
    clientErrorHandling()
    ;(async function () {
      try {
        const { user, client } = await sdk.context

        const capabilities = await sdk.getCapabilities()

        updateStore({ user, client, capabilities })
      } catch (error) {}

      // const preloadImage = new Image()
      // preloadImage.src = "/images/global/bg.svg"
      // preloadImage.onload = async () => await sdk.actions.ready({ disableNativeGestures: true }).catch(() => { })
      // preloadImage.onerror = async () => await sdk.actions.ready({ disableNativeGestures: true }).catch(() => { })

      await sdk.actions.ready({ disableNativeGestures: true }).catch(() => {})

      try {
        const { token: session } = await sdk.quickAuth.getToken()
        updateStore({ session })
        // axios.post("/api/login", {}, { headers: { Authorization: `Bearer ${session}` } })
      } catch (error) {}
    })()
  }, [])

  return (
    <div onDragStart={e => e.preventDefault()}>
      <Providers>
        <BrowserRouter>
          <CustomCursor />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <Reviews />
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <>
                  <Header />
                  <Profile />
                </>
              }
            />
          </Routes>
          <Menu />
        </BrowserRouter>
        {/* <img
          src="/images/global/bg.svg"
          alt="bg"
          className={clsx("fixed top-0 left-0 w-screen h-screen object-fill -z-10")}
        /> */}
      </Providers>
    </div>
  )
}
