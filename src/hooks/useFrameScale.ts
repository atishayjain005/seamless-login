import { useEffect, useState } from "react";

const DESIGN_WIDTH = 1440;
const DESIGN_HEIGHT = 1024;
// Breathing room kept between the frame and the viewport edges.
const MARGIN = 40;

function computeScale(): number {
  return Math.min(
    (window.innerWidth - MARGIN * 2) / DESIGN_WIDTH,
    (window.innerHeight - MARGIN * 2) / DESIGN_HEIGHT,
    1,
  );
}

// Scales the fixed 1440x1024 design frame down to fit smaller viewports
// without distorting any pixel-level spacing. Resolved synchronously so the
// first paint is already correct, and never scales above 1.
export function useFrameScale(): number {
  const [scale, setScale] = useState(computeScale);

  useEffect(() => {
    const onResize = () => setScale(computeScale());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return scale;
}
