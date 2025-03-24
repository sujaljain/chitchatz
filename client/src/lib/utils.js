import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import animationData from "@/assets/lottie-json";


// Without this following function --> Tailwind classes can clash
// ...inputs is a rest parameter that collects multiple class names into an array.
export function cn(...inputs) {
  // clsx() removes falsy values (null, undefined, false) and joins classes properly.
  return twMerge(clsx(inputs));
  // twMerge() removes conflicting Tailwind classes.
}

export const colors = [
  "bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff006faa]",
  // Muted Pink (#712c4a57, ~35% opacity)	Bright Pink (#ff006e)	Transparent Pink (#ff006faa, ~67% opacity)

  "bg-[#ffd60a2a] text-[#ddd60a] border-[1px] border-[#ffd60abb]",
  // Muted Yellow (#ffd60a2a, ~16% opacity)	Dark Yellow (#ddd60a)	Transparent Yellow (#ffd60abb, ~73% opacity)

  "bg-[#06d6a02a] text-[#06d6a0] border-[1px] border-[#06d6a0bb]",
  // Muted Cyan (#06d6a02a, ~16% opacity)	Bright Cyan (#06d6a0)	Transparent Cyan (#06d6a0bb, ~73% opacity)

  "bg-[#4cc9f02a] text-[#4cc9f0] border-[1px] border-[#4cc9f0bb]",
  // Muted Light Blue (#4cc9f02a, ~16% opacity)	Sky Blue (#4cc9f0)	Transparent Blue (#4cc9f0bb, ~73% opacity)
];

export const getColor = (color) => {
  if (color >= 0 && color < colors.length) {
    return colors[color];
  }
  return colors[0];
}

export const animationDefaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
};