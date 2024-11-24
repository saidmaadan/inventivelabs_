"use client";

import { MapPin, Phone, Mail } from "lucide-react";
// import { GoogleMap } from "@/components/maps/google-map";
import type { OfficeLocation } from "@/types/contact";

interface OfficeLocationProps {
  office: OfficeLocation;
}

export function OfficeLocation({ office }: OfficeLocationProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{office.name}</h3>
        <p className="text-sm text-muted-foreground">
          {office.city}, {office.state}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p>{office.address}</p>
            <p>
              {office.city}, {office.state} {office.postalCode}
            </p>
            <p>{office.country}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary shrink-0" />
          <a
            href={`tel:${office.phone}`}
            className="hover:text-primary transition-colors"
          >
            {office.phone}
          </a>
        </div>

        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary shrink-0" />
          <a
            href={`mailto:${office.email}`}
            className="hover:text-primary transition-colors"
          >
            {office.email}
          </a>
        </div>
      </div>

      {/* <div className="aspect-[4/3] overflow-hidden rounded-lg">
        <GoogleMap
          center={{ lat: office.coordinates.lat, lng: office.coordinates.lng }}
          zoom={15}
          markers={[
            {
              position: {
                lat: office.coordinates.lat,
                lng: office.coordinates.lng,
              },
              title: office.name,
            },
          ]}
        />
      </div> */}
    </div>
  );
}
