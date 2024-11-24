"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface GoogleMapProps extends google.maps.MapOptions {
  className?: string;
  markers?: Array<{
    position: google.maps.LatLngLiteral;
    title?: string;
  }>;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
}

export function GoogleMap({
  className,
  markers,
  onClick,
  onIdle,
  ...options
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Initialize the map
  useEffect(() => {
    if (!mapRef.current) return;

    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      version: "weekly",
    });

    loader
      .load()
      .then((google) => {
        const map = new google.maps.Map(mapRef.current!, {
          center: options.center,
          zoom: options.zoom || 14,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
          ...options,
        });

        setMap(map);

        if (onClick) {
          map.addListener("click", onClick);
        }

        if (onIdle) {
          map.addListener("idle", () => onIdle(map));
        }
      })
      .catch((error) => {
        console.error("Error loading Google Maps:", error);
      });

    return () => {
      if (map) {
        google.maps.event.clearInstanceListeners(map);
      }
    };
  }, [onClick, onIdle, options]);

  // Update markers when they change
  useEffect(() => {
    if (!map || !markers) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerOptions) => {
      const marker = new google.maps.Marker({
        map,
        position: markerOptions.position,
        title: markerOptions.title,
        animation: google.maps.Animation.DROP,
      });

      // Add info window if title is provided
      if (markerOptions.title) {
        const infoWindow = new google.maps.InfoWindow({
          content: markerOptions.title,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      }

      markersRef.current.push(marker);
    });

    // Center map on markers if there are any
    if (markers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markers.forEach((marker) => bounds.extend(marker.position));
      map.fitBounds(bounds, { padding: 50 });
    }

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [map, markers]);

  return (
    <div
      ref={mapRef}
      className={className}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
