// src/app/page.tsx
import React from "react";
import Weather from "./components/weather/Weather";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Remove the container and padding - the new design handles this */}
      <Weather />
    </main>
  );
}