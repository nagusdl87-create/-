"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { KIND_INFO, type GnSchool } from "@/data/gn";

type Props = {
  schools: GnSchool[];
  selected: string | null;
  origin: { lat: number; lng: number; label: string } | null;
  onSelect: (id: string) => void;
};

export default function SchoolMap({ schools, selected, origin, onSelect }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const markers = useRef<Map<string, L.CircleMarker>>(new Map());

  useEffect(() => {
    if (!el.current || map.current) return;
    map.current = L.map(el.current, { scrollWheelZoom: false, attributionControl: true }).setView([35.25, 128.35], 9);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map.current);
    layer.current = L.layerGroup().addTo(map.current);
    const m = map.current;
    const ro = new ResizeObserver(() => m.invalidateSize());
    ro.observe(el.current);
    return () => {
      ro.disconnect();
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    const m = map.current;
    const g = layer.current;
    if (!m || !g) return;
    g.clearLayers();
    markers.current.clear();
    const pts: L.LatLngExpression[] = [];
    for (const s of schools) {
      if (s.lat == null || s.lng == null) continue;
      const c = L.circleMarker([s.lat, s.lng], {
        radius: 7,
        color: "#fff",
        weight: 2,
        fillColor: KIND_INFO[s.kind].color,
        fillOpacity: 0.9,
      })
        .bindTooltip(`${s.name} · ${KIND_INFO[s.kind].name}`)
        .on("click", () => onSelect(s.id));
      c.addTo(g);
      markers.current.set(s.id, c);
      pts.push([s.lat, s.lng]);
    }
    if (origin) {
      L.circleMarker([origin.lat, origin.lng], { radius: 9, color: "#111827", weight: 3, fillColor: "#facc15", fillOpacity: 1 })
        .bindTooltip(`출발: ${origin.label}`, { permanent: false })
        .addTo(g);
      pts.push([origin.lat, origin.lng]);
    }
    if (pts.length) m.fitBounds(L.latLngBounds(pts), { padding: [30, 30], maxZoom: 13 });
  }, [schools, origin, onSelect]);

  useEffect(() => {
    if (!selected) return;
    const mk = markers.current.get(selected);
    if (mk && map.current) {
      map.current.setView(mk.getLatLng(), Math.max(map.current.getZoom(), 13), { animate: true });
      mk.openTooltip();
      mk.setStyle({ radius: 11, weight: 3, color: "#111827" });
      return () => {
        mk.setStyle({ radius: 7, weight: 2, color: "#fff" });
      };
    }
  }, [selected]);

  return <div ref={el} className="h-full min-h-[320px] w-full rounded-2xl" role="application" aria-label="경남 고등학교 지도" />;
}
