import { useEffect } from "react";
import FlightMap from "components/flightMap";
import TravelPosterSection from "components/travelPosterSection";

// Loaded client-side only (see pages/map.js), so this is the first moment the
// section headings exist; scroll to a linked one now that it's in the DOM
export default function TravelSections() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const el = id && document.getElementById(id);
    if (el) requestAnimationFrame(() => el.scrollIntoView());
  }, []);

  return (
    <>
      <FlightMap />
      <TravelPosterSection />
    </>
  );
}
