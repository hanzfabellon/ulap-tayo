// @ts-ignore
import L from 'leaflet';
import React, { useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

const MapSelector = ({
  onLocationChange,
  initialLatitude = 0,
  initialLongitude = 0,
}: {
  onLocationChange: (lat: number, lng: number) => void;
  initialLatitude?: number;
  initialLongitude?: number;
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchError, setSearchError] = React.useState<string | null>(null);
  const mapRef = useRef<any>(null);

  // Recenter map when parent coordinates change
  React.useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([initialLatitude, initialLongitude]);
    }
  }, [initialLatitude, initialLongitude]);

  // Custom marker icon (fixes missing marker icon in leaflet)
  const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  // Handle map click to move marker
  function MapClickHandler() {
    useMapEvents({
      click(e: { latlng: { lat: number; lng: number } }) {
        onLocationChange(e.latlng.lat, e.latlng.lng);
        if (mapRef.current) {
          mapRef.current.setView(e.latlng);
        }
      },
    });
    return null;
  }

  // Handle search submit
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    if (!searchTerm.trim()) return;
    try {
      const url = `https://us1.locationiq.com/v1/search?key=pk.e8426b7ba9b15cd27dee70334e445793&q=${encodeURIComponent(searchTerm)}&format=json`;
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const { lat, lon } = data[0];
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        onLocationChange(latNum, lonNum);
        if (mapRef.current) {
          mapRef.current.setView([latNum, lonNum], mapRef.current.getZoom());
        }
      } else {
        setSearchError('Location not found.');
      }
    } catch (err) {
      setSearchError('Error searching for location.');
    }
  };

  // Handle marker drag
  const handleMarkerDragEnd = (e: { target: any }) => {
    const marker = e.target;
    const latLng = marker.getLatLng();
    onLocationChange(latLng.lat, latLng.lng);
    if (mapRef.current) {
      mapRef.current.setView([latLng.lat, latLng.lng]);
    }
  };

  return (
    <div className="h-[50vh] w-screen relative">
      {/* Search bar overlay */}
      <div className="absolute top-4 left-12 right-12 z-[1000]">
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-4 py-3 border border-gray-200"
        >
          <input
            type="text"
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black bg-white"
            placeholder="Search for a location... and then click enter!"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="px-5 py-2 bg-[#fdc700] text-black font-bold hover:bg-[#e6b400] transition-colors"
          >
            Search
          </button>
        </form>
        {searchError && (
          <div className="text-red-500 font-bold mt-2 text-center bg-white/95 backdrop-blur-sm rounded-lg py-2 px-4 shadow-lg border border-red-200">
            {searchError}
          </div>
        )}
      </div>
      
      {/* Full screen map */}
      <div className="h-full w-full">
        {/* @ts-ignore: center prop is valid at runtime */}
        <MapContainer
          center={[initialLatitude, initialLongitude] as [number, number]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          whenCreated={(mapInstance: any) => {
            mapRef.current = mapInstance;
          }}
        >
          {/* @ts-ignore: attribution prop is valid at runtime */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* @ts-ignore: icon prop is valid at runtime */}
          <Marker
            position={[initialLatitude, initialLongitude] as [number, number]}
            icon={markerIcon}
            draggable={true}
            eventHandlers={{ dragend: handleMarkerDragEnd }}
          />
          <MapClickHandler />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapSelector;