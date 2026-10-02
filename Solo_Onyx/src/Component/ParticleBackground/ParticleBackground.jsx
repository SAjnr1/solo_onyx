import React, { useEffect, useRef } from 'react'

// converts '#00ffea' -> '0, 255, 234' (6-digit hex only)
const hexToRgb = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16)
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
}

const ParticleBackground = ({
  id = 'particles',
  count = 200,
  speed = 0.6,
  size = 2,
  color = '#ffffff',
  opacity = 0.5,
  grabDistance = 180,
  bg = '#0d1117',
}) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rgb = hexToRgb(color)
    const mouse = { x: null, y: null }
    let w, h, raf, particles

    const init = () => {
      const dpr = window.devicePixelRatio || 1
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      particles = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
        }
      })
    }

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    const onLeave = () => { mouse.x = mouse.y = null }

    const draw = () => {
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb}, ${opacity})`
        ctx.fill()

        if (mouse.x !== null) {
          const d = Math.hypot(p.x - mouse.x, p.y - mouse.y)
          if (d < grabDistance) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.strokeStyle = `rgba(125,211,252,${1 - d / grabDistance})`
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }

    init()
    draw()

    const ro = new ResizeObserver(init)
    ro.observe(canvas)
    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [count, speed, size, color, opacity, grabDistance, bg])

  return (
    <canvas
      ref={canvasRef}
      id={id}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        display: 'block',
        width: '100%',
        height: '100%',
      }}
    />
  )
}

export default ParticleBackground