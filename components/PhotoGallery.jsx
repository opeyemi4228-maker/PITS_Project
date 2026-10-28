import React from "react";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

/**
 * A run of photographs at their own proportions.
 *
 *  * landscapes. Forcing them into a uniform grid crops a waving arm or a pair of
 * shoes off every other frame, so this lays them out in CSS columns instead:
 * each photograph keeps its shape and the columns absorb the difference.
 *
 * `photos` is a list of `{ src, alt }`, where `src` is a static import. The
 * import carries the intrinsic size, which is what lets each frame reserve its
 * height before it loads and keeps the columns from reflowing as they arrive.
 */
export default function PhotoGallery({ photos }) {
  return (
    <ul className="mt-14 columns-2 gap-3 sm:gap-4 lg:columns-3">
      {photos.map((photo, index) => (
        <Reveal
          as="li"
          key={photo.src.src}
          delay={Math.min(index, 5) * 60}
          className="mb-3 break-inside-avoid sm:mb-4"
        >
          <div className="overflow-hidden rounded-[var(--radius-card)] bg-ink-100">
            <Image
              src={photo.src}
              alt={photo.alt}
              placeholder="blur"
              sizes="(min-width: 1024px) 24rem, 50vw"
              className="h-auto w-full transition-transform duration-700 hover:scale-[1.03]"
            />
          </div>
        </Reveal>
      ))}
    </ul>
  );
}
