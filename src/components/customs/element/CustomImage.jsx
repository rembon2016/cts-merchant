import PropTypes from "prop-types";
import { memo } from "react";

const CustomImage = memo(function CustomImage(props) {
  const {
    imageSource,
    imageWidth,
    imageHeight,
    imageLoad = "lazy",
    imageFetchPriority = "auto",
    altImage = "",
    className = "",
    srcSet,
    sizes,
    onLoad,
    onError,
    placeholderUrl,
  } = props;

  if (!imageSource) return null;

  // Determine fetch priority - "high" for above-the-fold, "auto" for below
  const priority = imageFetchPriority === "high" ? "high" : "auto";

  return (
    <>
      {placeholderUrl && imageLoad === "lazy" && (
        <img
          src={placeholderUrl}
          className={`${className} blur-sm`}
          alt={altImage}
          width={imageWidth || 32}
          height={imageHeight || 48}
          aria-hidden="true"
          style={{ position: "absolute", pointerEvents: "none" }}
        />
      )}
      <img
        src={imageSource}
        srcSet={srcSet}
        sizes={sizes}
        className={className}
        alt={altImage}
        width={imageWidth || 32}
        height={imageHeight || 48}
        loading={imageLoad}
        fetchPriority={priority}
        decoding="async"
        onLoad={onLoad}
        onError={onError}
        style={{
          maxWidth: "100%",
          height: "auto",
          willChange: imageFetchPriority === "high" ? "opacity" : "auto",
        }}
      />
    </>
  );
});

CustomImage.propTypes = {
  imageSource: PropTypes.string.isRequired,
  imageWidth: PropTypes.number,
  imageHeight: PropTypes.number,
  imageLoad: PropTypes.oneOf(["lazy", "eager"]),
  imageFetchPriority: PropTypes.oneOf(["high", "auto", "low"]),
  altImage: PropTypes.string,
  className: PropTypes.string,
  srcSet: PropTypes.string,
  sizes: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  placeholderUrl: PropTypes.string,
};

CustomImage.displayName = "CustomImage";

export default CustomImage;
