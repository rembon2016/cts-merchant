import { useState, useEffect, useRef } from "react";
import useFetchDataStore from "../../store/fetchDataStore";
import PromoDetailModal from "./PromoDetailModal";

const ROOT_API = import.meta.env.VITE_API_ROUTES;

const PromoSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedPromoId, setSelectedPromoId] = useState(null);
  const trackRef = useRef(null);
  const startXRef = useRef(0);
  const timerRef = useRef(null);

  const { data, fetchData } = useFetchDataStore();

  const handlePromoClick = (promoId) => {
    setSelectedPromoId(promoId);
  };

  const handleCloseModal = () => {
    setSelectedPromoId(null);
  };

  const fetchBanner = (page = 1) => {
    fetchData(`${ROOT_API}/v1/merchant/information-banner`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        // "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  };

  const INTERVAL = 4200;

  const goToSlide = (index) => {
    const newIndex = (index + data?.faqs?.length) % data?.faqs?.length;
    setCurrentIndex(newIndex);
    if (trackRef.current) {
      trackRef.current.style.transition =
        "transform 420ms cubic-bezier(0.2, 0.9, 0.2, 1)";
      trackRef.current.style.transform = `translateX(-${newIndex * 100}%)`;
    }
  };

  const nextSlide = () => {
    goToSlide(currentIndex + 1);
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(nextSlide, INTERVAL);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    startTimer();
  };

  useEffect(() => {
    fetchBanner();
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex]);

  // Touch/Mouse events for drag functionality
  const handlePointerDown = (e) => {
    setIsDragging(true);
    startXRef.current = e.type.startsWith("touch")
      ? e.touches[0].clientX
      : e.clientX;
    if (trackRef.current) {
      trackRef.current.style.transition = "none";
    }
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !trackRef.current) return;
    const clientX = e.type.startsWith("touch")
      ? e.touches[0].clientX
      : e.clientX;
    const delta = clientX - startXRef.current;
    const width = trackRef.current.parentElement.offsetWidth;
    trackRef.current.style.transform = `translateX(${
      -currentIndex * width + delta
    }px)`;
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const clientX =
      e.changedTouches && e.changedTouches[0]
        ? e.changedTouches[0].clientX
        : e.clientX;
    const delta = clientX - startXRef.current;
    const threshold = 50;

    if (delta < -threshold) {
      goToSlide(currentIndex + 1);
    } else if (delta > threshold) {
      goToSlide(currentIndex - 1);
    } else {
      goToSlide(currentIndex);
    }
    startTimer();
  };

  return (
    <section className="px-4 mt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold text-primary dark:text-slate-300">
          Promo Hari Ini
        </h3>
        {/* <a href="#" className="text-xs text-slate-500 dark:text-slate-400">
          Lihat semua
        </a> */}
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
          {data?.faqs?.map((slide) => (
            <button
              key={slide.id}
              className="slide text-left"
              onClick={() => handlePromoClick(slide.id)}
            >
              <img
                src={slide.thumbnail}
                alt={slide.title}
                className="w-full h-44 object-cover rounded-2xl shadow-soft"
                draggable={false}
              />
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-center">
          <div className="carousel-dots">
            {data?.faqs?.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => {
                  goToSlide(index);
                  resetTimer();
                }}
                className={`dot ${index === currentIndex ? "active" : ""}`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      {selectedPromoId && (
        <PromoDetailModal
          promoId={selectedPromoId}
          onClose={handleCloseModal}
          promoData={data?.faqs}
        />
      )}
    </section>
  );
};

export default PromoSlider;
