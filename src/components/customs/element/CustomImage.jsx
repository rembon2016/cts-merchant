import PropTypes from "prop-types";
import { memo, useEffect, useMemo, useRef, useState } from "react";

const CustomImage = memo(function CustomImage(props) {
  const {
    imageSource,
    imageWidth,
    imageHeight,
    imageLoad = "lazy",
    altImage = "",
    className = "",
    srcSet,
    sizes,
    onLoad,
    onError,
    placeholderUrl,
    rootMargin = "50px",
    avifSource,
    webpSource,
  } = props;

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  const imageStyle = useMemo(
    () => ({
      maxWidth: "100%",
      objectFit: "cover",
      objectPosition: "center",
      opacity: isLoaded ? 1 : 0,
      transition: "opacity 0.3s ease-in-out",
    }),
    [isLoaded],
  );

  const imageFetchPriority = imageLoad === "eager" ? "high" : "auto";

  useEffect(() => {
    if (imageLoad === "eager" || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin },
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [imageLoad, rootMargin]);

  if (!imageSource) return null;

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    onError?.(e);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }} ref={imgRef}>
      {placeholderUrl && imageLoad === "lazy" && !isLoaded && !hasError && (
        <img
          src={placeholderUrl}
          className={`${className} blur-sm`}
          alt=""
          width={imageWidth || 32}
          height={imageHeight || 48}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
      <picture>
        {avifSource && <source srcSet={avifSource} type="image/avif" />}
        {webpSource && <source srcSet={webpSource} type="image/webp" />}
        <img
          src={imageSource}
          srcSet={srcSet}
          sizes={sizes}
          className={className}
          alt={altImage}
          width={imageWidth || 32}
          height={imageHeight || 48}
          loading={imageLoad}
          fetchPriority={imageFetchPriority}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          style={imageStyle}
        />
      </picture>
    </div>
  );
});

CustomImage.propTypes = {
  imageSource: PropTypes.string.isRequired,
  imageWidth: PropTypes.number,
  imageHeight: PropTypes.number,
  imageLoad: PropTypes.string,
  altImage: PropTypes.string,
  className: PropTypes.string,
  srcSet: PropTypes.string,
  sizes: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  placeholderUrl: PropTypes.string,
  rootMargin: PropTypes.string,
  avifSource: PropTypes.string,
  webpSource: PropTypes.string,
};

export default CustomImage;
