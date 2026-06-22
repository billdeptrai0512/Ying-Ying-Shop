import { useMemo } from "react";
import Imgix from "react-imgix";

// Flatten an outfit into stackable demo-image layers. Previously copy-pasted
// into outfit/, favorite/, cart/ and checkout/ Demo components.
// eslint-disable-next-line react-refresh/only-export-components
export function getDemoImages(outFit) {
  const images = [];
  if (!outFit) return images;

  for (const [key, value] of Object.entries(outFit)) {
    if (key === "total") continue;

    if (value?.item?.demo_image) {
      const demoImage = value.item.demo_image;
      const baseZIndex = value.item.z_index || 0;

      if (Array.isArray(demoImage)) {
        demoImage.forEach((img, idx) => {
          const zIndex = idx === 1 ? 6 : baseZIndex;
          images.push({ key: `${key}-${idx}`, image: img, zIndex });
        });
      } else {
        images.push({ key, image: demoImage, zIndex: baseZIndex });
      }
    }

    if (key === "extra") {
      Object.entries(value).forEach(([subKey, subValue]) => {
        if (subValue?.item?.demo_image) {
          images.push({
            key: subKey,
            image: subValue.item.demo_image[0],
            zIndex: subValue.item.z_index || 0,
          });
        }
      });
    }
  }

  return images;
}

// Render the layered outfit images (Imgix). Parents wrap this with their own
// board/watermark/controls and supply the outfit from their own data source.
export default function OutfitLayers({ outFit }) {
  return useMemo(() => {
    if (!outFit) return null;

    return getDemoImages(outFit)
      .sort((a, b) => a.zIndex - b.zIndex)
      .map(({ key, image, zIndex }, index) => (
        <div
          key={`${key}-${index}`}
          style={{
            position: "absolute",
            zIndex,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Imgix
            src={image}
            sizes="340px"
            alt={key}
            imgixParams={{ auto: "format,compress" }}
            htmlAttributes={{ alt: "layer image" }}
          />
        </div>
      ));
  }, [outFit]);
}
