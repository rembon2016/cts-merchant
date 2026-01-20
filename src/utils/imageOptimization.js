/**
 * Image Optimization Utilities
 * Provides responsive images with modern format support
 */

/**
 * Generate responsive image with srcset
 * @param {string} src - Original image source
 * @param {Object} sizes - Responsive sizes {mobile, tablet, desktop}
 * @returns {Object} img attributes with srcset
 */
export const getResponsiveImageAttrs = (src, sizes = {}) => {
  const { mobile = "100vw", tablet = "75vw", desktop = "50vw" } = sizes;

  return {
    src,
    srcSet: `${src}?w=640 640w, ${src}?w=960 960w, ${src}?w=1280 1280w`,
    sizes: `(max-width: 640px) ${mobile}, (max-width: 1024px) ${tablet}, ${desktop}`,
    loading: "lazy",
    decoding: "async",
  };
};

/**
 * Get image dimensions for preventing CLS
 */
export const getImageDimensions = (aspectRatio = 16 / 9) => {
  return {
    width: 1200,
    height: Math.round(1200 / aspectRatio),
    style: {
      aspectRatio,
      width: "100%",
      height: "auto",
    },
  };
};

/**
 * WebP image fallback
 */
export const getSupportedImageFormat = (source) => {
  const webpSupport = () => {
    const canvas = document.createElement("canvas");
    return canvas.toDataURL("image/webp").indexOf("image/webp") === 5;
  };

  return {
    webp: webpSupport() ? source.replace(/\.(jpg|png)$/, ".webp") : null,
    original: source,
  };
};

/**
 * Preload critical images
 */
export const preloadImage = (src) => {
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = src;
  link.imagesrcset = `${src}?w=640 640w, ${src}?w=960 960w`;
  document.head.appendChild(link);
};

/**
 * Lazy load images with intersection observer
 */
export const lazyLoadImages = () => {
  if (!("IntersectionObserver" in window)) {
    // Fallback for older browsers
    document.querySelectorAll("img[data-src]").forEach((img) => {
      img.src = img.dataset.src;
    });
    return;
  }

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
};

export default {
  getResponsiveImageAttrs,
  getImageDimensions,
  getSupportedImageFormat,
  preloadImage,
  lazyLoadImages,
};
