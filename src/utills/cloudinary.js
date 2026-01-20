/**
 * Cloudinary Image CDN Configuration
 * Transforms and optimizes images for web delivery
 */

// Cloudinary configuration
const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_NAME || "demo",
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || "",
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "",
  baseUrl: "https://res.cloudinary.com",
};

/**
 * Transform image URL to use Cloudinary CDN
 * Applies optimization transformations automatically
 *
 * @param {string} imageUrl - Original image URL or public ID
 * @param {Object} options - Transformation options
 * @param {number} options.width - Image width in pixels
 * @param {number} options.height - Image height in pixels
 * @param {string} options.quality - Image quality: 'auto' | 'low' | 'eco' | 'good' | 'best' (default: 'auto')
 * @param {string} options.format - Output format: 'auto' | 'webp' | 'jpg' | 'png' (default: 'auto')
 * @param {string} options.crop - Crop mode: 'fill' | 'thumb' | 'fit' | 'pad' (default: 'fit')
 * @param {string} options.gravity - Focus point: 'auto' | 'face' | 'center' (default: 'auto')
 * @returns {string} Optimized Cloudinary URL
 */
export const transformImageUrl = (imageUrl, options = {}) => {
  if (!imageUrl) return "";

  // If URL is already a Cloudinary URL, return as is
  if (imageUrl.includes("res.cloudinary.com")) {
    return imageUrl;
  }

  // Extract public ID from various URL formats
  let publicId = imageUrl;

  // Remove protocol and domain
  if (imageUrl.includes("http")) {
    try {
      const url = new URL(imageUrl);
      publicId = url.pathname.replace(/^\/+/, "");
    } catch (e) {
      // If URL parsing fails, use as is
      publicId = imageUrl;
    }
  }

  const {
    width = 800,
    height = 600,
    quality = "auto",
    format = "auto",
    crop = "fit",
    gravity = "auto",
  } = options;

  // Build transformation string
  const transformations = [
    `w_${width}`,
    `h_${height}`,
    `q_${quality}`,
    `f_${format}`,
    `c_${crop}`,
    `g_${gravity}`,
    "dpr_auto", // Auto device pixel ratio
  ].join(",");

  const cloudinaryUrl = `${CLOUDINARY_CONFIG.baseUrl}/${CLOUDINARY_CONFIG.cloudName}/image/fetch/${transformations}/${imageUrl}`;

  return cloudinaryUrl;
};

/**
 * Get optimized image URL for specific use case
 *
 * @param {string} imageUrl - Original image URL
 * @param {string} preset - Use case preset
 * @returns {string} Optimized URL
 */
export const getOptimizedImageUrl = (imageUrl, preset = "default") => {
  const presets = {
    // Thumbnail: small and highly compressed
    thumbnail: {
      width: 150,
      height: 150,
      quality: "eco",
      format: "webp",
      crop: "thumb",
    },
    // Card image: medium size
    card: {
      width: 400,
      height: 300,
      quality: "good",
      format: "webp",
      crop: "fit",
    },
    // Hero/Banner: large image
    hero: {
      width: 1200,
      height: 400,
      quality: "auto",
      format: "webp",
      crop: "fill",
      gravity: "auto",
    },
    // Product image: square
    product: {
      width: 500,
      height: 500,
      quality: "good",
      format: "webp",
      crop: "fill",
      gravity: "face",
    },
    // Avatar: small circle
    avatar: {
      width: 100,
      height: 100,
      quality: "eco",
      format: "webp",
      crop: "thumb",
    },
    // Default: responsive size
    default: {
      width: 800,
      height: 600,
      quality: "auto",
      format: "auto",
      crop: "fit",
    },
  };

  const config = presets[preset] || presets.default;
  return transformImageUrl(imageUrl, config);
};

/**
 * Generate responsive srcset for images
 * Used with <img srcset> for responsive images
 *
 * @param {string} imageUrl - Original image URL
 * @param {string} preset - Use case preset
 * @returns {string} srcset string for responsive images
 */
export const getResponsiveSrcSet = (imageUrl, preset = "card") => {
  const baseConfig = {
    thumbnail: { sizes: [100, 150] },
    card: { sizes: [300, 400, 600] },
    hero: { sizes: [600, 1000, 1200] },
    product: { sizes: [300, 500, 700] },
    avatar: { sizes: [50, 100, 150] },
    default: { sizes: [400, 800, 1200] },
  };

  const config = baseConfig[preset] || baseConfig.default;
  const presetConfig = {
    thumbnail: "thumbnail",
    card: "card",
    hero: "hero",
    product: "product",
    avatar: "avatar",
    default: "default",
  };

  return config.sizes
    .map((size) => {
      const url = getOptimizedImageUrl(imageUrl, presetConfig[preset]);
      return `${url} ${size}w`;
    })
    .join(", ");
};

/**
 * Get Cloudinary upload widget config
 * For user uploads
 *
 * @returns {Object} Widget configuration
 */
export const getCloudinaryUploadConfig = () => {
  return {
    cloudName: CLOUDINARY_CONFIG.cloudName,
    uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
    folder: "cts-merchant",
    resourceType: "auto",
    clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
    maxFileSize: 10485760, // 10MB
    showAdvancedOptions: false,
    showPoweredBy: false,
  };
};

export default {
  transformImageUrl,
  getOptimizedImageUrl,
  getResponsiveSrcSet,
  getCloudinaryUploadConfig,
};
