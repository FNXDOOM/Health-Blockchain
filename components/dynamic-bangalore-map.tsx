import dynamic from "next/dynamic"

// Dynamically import the BangaloreMap component with no SSR
// This is necessary because Leaflet requires the window object
const DynamicBangaloreMap = dynamic(() => import("./bangalore-map").then((mod) => mod.BangaloreMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-card/30 backdrop-blur-sm rounded-lg border border-border/50 flex items-center justify-center">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
})

export default DynamicBangaloreMap
