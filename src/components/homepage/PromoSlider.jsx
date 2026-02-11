import { useState, useEffect, useRef, useCallback, memo } from "react";
import useFetchDataStore from "../../store/fetchDataStore";
import PromoDetailModal from "./PromoDetailModal";
import CustomImage from "../customs/element/CustomImage";

const ROOT_API = import.meta.env.VITE_API_ROUTES;
const INTERVAL = 4200;

const PromoSlider = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedPromoId, setSelectedPromoId] = useState(null);
  const trackRef = useRef(null);
  const startXRef = useRef(0);
  const timerRef = useRef(null);

  const { data, fetchData } = useFetchDataStore();

  const handlePromoClick = useCallback((promoId) => {
    setSelectedPromoId(promoId);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPromoId(null);
  }, []);

  const fetchBanner = useCallback(() => {
    fetchData(`${ROOT_API}/v1/merchant/information-banner`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        Accept: "application/json",
      },
    });
  }, [fetchData]);

  const goToSlide = useCallback(
    (index) => {
      if (!data?.faqs?.length) return;
      const newIndex = (index + data.faqs.length) % data.faqs.length;
      setCurrentIndex(newIndex);
      if (trackRef.current) {
        trackRef.current.style.transition =
          "transform 420ms cubic-bezier(0.2, 0.9, 0.2, 1)";
        trackRef.current.style.transform = `translateX(-${newIndex * 100}%)`;
      }
    },
    [data?.faqs?.length],
  );

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      if (!data?.faqs?.length) return prev;
      const newIndex = (prev + 1) % data.faqs.length;
      if (trackRef.current) {
        trackRef.current.style.transition =
          "transform 420ms cubic-bezier(0.2, 0.9, 0.2, 1)";
        trackRef.current.style.transform = `translateX(-${newIndex * 100}%)`;
      }
      return newIndex;
    });
  }, [data?.faqs?.length]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(nextSlide, INTERVAL);
  }, [nextSlide]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    startTimer();
  }, [startTimer]);

  // Fetch banner and start timer only once on mount
  useEffect(() => {
    fetchBanner();
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchBanner, startTimer]);

  useEffect(() => {
    const preloadImage = (src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    };

    const mappingImage = data?.faqs?.map((item) => item.thumbnail) || [];
    mappingImage.forEach((src) => preloadImage(src));
  }, [data?.faqs]);

  // Touch/Mouse events for drag functionality
  const handlePointerDown = useCallback((e) => {
    setIsDragging(true);
    startXRef.current = e.type.startsWith("touch")
      ? e.touches[0].clientX
      : e.clientX;
    if (trackRef.current) {
      trackRef.current.style.transition = "none";
    }
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging || !trackRef.current) return;
      const clientX = e.type.startsWith("touch")
        ? e.touches[0].clientX
        : e.clientX;
      const delta = clientX - startXRef.current;
      const width = trackRef.current.parentElement.offsetWidth;
      trackRef.current.style.transform = `translateX(${
        -currentIndex * width + delta
      }px)`;
    },
    [isDragging, currentIndex],
  );

  const handlePointerUp = useCallback(
    (e) => {
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
    },
    [isDragging, currentIndex, goToSlide, startTimer],
  );

  if (data?.faqs?.length === 0) {
    return (
      <section className="px-4 mt-6">
        <div className="flex items-center justify-center py-10">
          <p className="text-lg max-w-[300px] text-center text-slate-500 dark:text-slate-400">
            Tidak ada promo yang tersedia saat ini.
          </p>
        </div>
      </section>
    );
  }

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

      <div className="flex flex-col gap-3">
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
          <div className="carousel-track aspect-video" ref={trackRef}>
            {data?.faqs?.map((slide) => (
              <button
                key={slide?.id}
                className="slide text-left"
                onClick={() => handlePromoClick(slide?.id)}
              >
                <CustomImage
                  imageSource={slide?.thumbnail}
                  imageWidth={340}
                  imageHeight={176}
                  altImage={slide?.title}
                  imageLoad="eager"
                  imageFetchPriority="high"
                  className="w-full h-full object-cover rounded-2xl shadow-soft"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="carousel-dots">
            {data?.faqs?.map((slide, index) => (
              <button
                key={slide?.id}
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
});

export default memo(PromoSlider);
