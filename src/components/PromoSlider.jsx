import React, { useState, useEffect, useRef } from 'react'

const PromoSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const trackRef = useRef(null)
  const startXRef = useRef(0)
  const timerRef = useRef(null)

  const slides = [
    {
      id: 1,
      image: 'https://img.freepik.com/free-vector/mega-sales-background-with-abstract-shapes_52683-18062.jpg?t=st=1757496175~exp=1757499775~hmac=fc8547e8d76c943f4a002d155857217611a0185305d568d198a5ffe1e1f01383&w=740',
      alt: 'Promo Mega Sales'
    },
    {
      id: 2,
      image: 'https://img.freepik.com/free-vector/final-sale-yellow-with-offer-details_1017-30356.jpg?t=st=1757499041~exp=1757502641~hmac=9e17982df6428e4247d109773071fd2bf8aaada8575bf68e97d4ac2bc0e0827a&w=2000',
      alt: 'Promo Final Sale'
    }
  ]

  const INTERVAL = 4200

  const goToSlide = (index) => {
    const newIndex = (index + slides.length) % slides.length
    setCurrentIndex(newIndex)
    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 420ms cubic-bezier(0.2, 0.9, 0.2, 1)'
      trackRef.current.style.transform = `translateX(-${newIndex * 100}%)`
    }
  }

  const nextSlide = () => {
    goToSlide(currentIndex + 1)
  }

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(nextSlide, INTERVAL)
  }

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    startTimer()
  }

  // Auto-play functionality
  useEffect(() => {
    startTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [currentIndex])

  // Touch/Mouse events for drag functionality
  const handlePointerDown = (e) => {
    setIsDragging(true)
    startXRef.current = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX
    if (trackRef.current) {
      trackRef.current.style.transition = 'none'
    }
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const handlePointerMove = (e) => {
    if (!isDragging || !trackRef.current) return
    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX
    const delta = clientX - startXRef.current
    const width = trackRef.current.parentElement.offsetWidth
    trackRef.current.style.transform = `translateX(${-currentIndex * width + delta}px)`
  }

  const handlePointerUp = (e) => {
    if (!isDragging) return
    setIsDragging(false)
    const clientX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : e.clientX
    const delta = clientX - startXRef.current
    const threshold = 50
    
    if (delta < -threshold) {
      goToSlide(currentIndex + 1)
    } else if (delta > threshold) {
      goToSlide(currentIndex - 1)
    } else {
      goToSlide(currentIndex)
    }
    startTimer()
  }

  return (
    <section className="px-4 mt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold text-primary dark:text-slate-300">
          Promo Hari Ini
        </h3>
        <a href="#" className="text-xs text-slate-500 dark:text-slate-400">
          Lihat semua
        </a>
      </div>

      <div 
        className="carousel bg-transparent"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      >
        <div className="carousel-track" ref={trackRef}>
          {slides.map((slide) => (
            <div key={slide.id} className="slide">
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-44 object-cover rounded-2xl shadow-soft"
                draggable={false}
              />
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-center">
          <div className="carousel-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  goToSlide(index)
                  resetTimer()
                }}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PromoSlider