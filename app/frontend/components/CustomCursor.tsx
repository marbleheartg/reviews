import { useEffect, useRef } from "react"

export default function CustomCursor() {
  const cursorRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const cursorEl = cursorRef.current
    if (!cursorEl) return

    let currentX = -9999
    let currentY = -9999
    let targetX = currentX
    let targetY = currentY
    let rafId = 0
    let lastTs = 0

    const speed = 0.25 // easing

    function onMove(e: MouseEvent) {
      targetX = e.clientX
      targetY = e.clientY
    }

    function animate(ts: number) {
      const dt = Math.min(32, ts - lastTs)
      lastTs = ts

      const dx = targetX - currentX
      const dy = targetY - currentY
      currentX += dx * speed
      currentY += dy * speed

      const angle = Math.atan2(dy, dx) * (180 / Math.PI)

      cursorEl.style.transform = `translate3d(${currentX - 14}px, ${currentY - 14}px, 0) rotate(${
        isFinite(angle) ? angle : 0
      }deg)`

      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return <img ref={cursorRef} src="/images/cursor.svg" alt="cursor" className="custom-cursor" />
}
