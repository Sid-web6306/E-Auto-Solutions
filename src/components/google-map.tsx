"use client";

import { useEffect, useRef, useState } from "react";

type MarkerData = {
  lat: number;
  lng: number;
  title: string;
  address?: string;
  phone?: string;
};

type GoogleMapProps = {
  markers: MarkerData[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  className?: string;
};

export function GoogleMap({
  markers,
  center,
  zoom = 12,
  height = "400px",
  className = "",
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  // Derive error message from state
  const error = !apiKey 
    ? "Google Maps API key is not configured" 
    : loadError 
    ? "Failed to load Google Maps" 
    : null;

  useEffect(() => {
    if (!apiKey || mapLoaded) return;

    // Check if Google Maps is already loaded
    if (typeof window !== "undefined" && window.google?.maps) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => setMapLoaded(true), 0);
      return;
    }

    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => setMapLoaded(true));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    script.onerror = () => setLoadError(true);
    document.head.appendChild(script);

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [apiKey, mapLoaded]);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.google?.maps) return;

    const mapCenter = center || (markers.length > 0 ? { lat: markers[0].lat, lng: markers[0].lng } : { lat: 29.2883, lng: 78.5119 });

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: mapCenter,
        zoom,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
      });
    }

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const bounds = new window.google.maps.LatLngBounds();

    markers.forEach((markerData) => {
      const marker = new window.google.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map: mapInstanceRef.current,
        title: markerData.title,
        animation: window.google.maps.Animation.DROP,
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
        },
      });

      bounds.extend(marker.getPosition()!);

      const infoContent = `
        <div style="padding: 8px; max-width: 220px;">
          <h3 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 600; color: #047857;">${markerData.title}</h3>
          ${markerData.address ? `<p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${markerData.address}</p>` : ""}
          ${markerData.phone ? `<p style="margin: 0; font-size: 12px;"><a href="tel:${markerData.phone}" style="color: #047857; text-decoration: none;">${markerData.phone}</a></p>` : ""}
        </div>
      `;

      const infoWindow = new window.google.maps.InfoWindow({
        content: infoContent,
      });

      marker.addListener("click", () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
    });

    if (markers.length > 1) {
      mapInstanceRef.current.fitBounds(bounds, 50);
    } else if (markers.length === 1) {
      mapInstanceRef.current.setCenter({ lat: markers[0].lat, lng: markers[0].lng });
      mapInstanceRef.current.setZoom(zoom);
    }
  }, [mapLoaded, markers, center, zoom]);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 ${className}`}
        style={{ height }}
      >
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{ height }}
    >
      {!mapLoaded && (
        <div className="flex h-full items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Loading map...
          </div>
        </div>
      )}
    </div>
  );
}
