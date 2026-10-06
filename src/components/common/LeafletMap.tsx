import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { BusUnit, RouteItem, Stop } from '../../types';

interface LeafletMapProps {
  buses: BusUnit[];
  routes: RouteItem[];
  selectedBusId?: string | null;
  onSelectBus?: (busId: string) => void;
  activeRouteId?: string | null;
  height?: string;
  showStops?: boolean;
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  buses,
  routes,
  selectedBusId,
  onSelectBus,
  activeRouteId,
  height = '100%',
  showStops = true,
  center = [14.525, -90.585], // Center between Amatitlán and CENMA
  zoom = 12,
  interactive = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const polylineLayerRef = useRef<L.LayerGroup | null>(null);
  const stopsLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent double init

    const map = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: interactive,
      dragging: interactive,
      touchZoom: interactive,
      scrollWheelZoom: interactive,
      attributionControl: false
    });

    // High contrast clean OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c']
    }).addTo(map);

    polylineLayerRef.current = L.layerGroup().addTo(map);
    stopsLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    // Small delay to invalidate size after layout
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Route Polylines and Stops
  useEffect(() => {
    if (!mapInstanceRef.current || !polylineLayerRef.current || !stopsLayerRef.current) return;

    polylineLayerRef.current.clearLayers();
    stopsLayerRef.current.clearLayers();

    const displayRoutes = activeRouteId 
      ? routes.filter(r => r.id === activeRouteId)
      : routes;

    displayRoutes.forEach(route => {
      const latlngs: [number, number][] = route.stops.map(s => [s.lat, s.lng]);
      
      // Draw polyline route
      const polyline = L.polyline(latlngs, {
        color: route.color || '#1E3A8A',
        weight: activeRouteId === route.id ? 5 : 3.5,
        opacity: activeRouteId && activeRouteId !== route.id ? 0.35 : 0.85,
        dashArray: activeRouteId === route.id ? undefined : '6, 6'
      });
      polyline.bindTooltip(`<b>${route.code}</b>: ${route.name}`, { sticky: true });
      polyline.addTo(polylineLayerRef.current!);

      // Draw stops
      if (showStops) {
        route.stops.forEach((stop: Stop) => {
          const stopIcon = L.divIcon({
            className: 'custom-stop-marker',
            html: `
              <div style="
                width: 14px; 
                height: 14px; 
                background: white; 
                border: 3px solid ${route.color || '#1E3A8A'}; 
                border-radius: 50%;
                box-shadow: 0 1px 4px rgba(0,0,0,0.3);
              "></div>
            `,
            iconSize: [14, 14],
            iconAnchor: [7, 7]
          });

          const stopMarker = L.marker([stop.lat, stop.lng], { icon: stopIcon });
          stopMarker.bindPopup(`
            <div style="font-family: inherit; font-size: 12px; color: #0f172a; padding: 2px;">
              <strong style="color: ${route.color}">${stop.name}</strong><br/>
              <span style="color: #64748b; font-size: 11px;">${stop.municipality} · ${route.code}</span>
            </div>
          `);
          stopMarker.addTo(stopsLayerRef.current!);
        });
      }
    });
  }, [routes, activeRouteId, showStops]);

  // Update Bus Markers dynamically
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    buses.forEach(bus => {
      const isSelected = bus.id === selectedBusId;
      const busColor = bus.hasIncident ? '#EF4444' : bus.status === 'detenido' ? '#F59E0B' : '#10B981';

      const customIcon = L.divIcon({
        className: 'custom-bus-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="
              background: ${isSelected ? '#1E3A8A' : '#0F172A'}; 
              color: white; 
              font-size: 10px; 
              font-weight: 700; 
              padding: 2px 6px; 
              border-radius: 9999px;
              white-space: nowrap;
              box-shadow: 0 2px 6px rgba(0,0,0,0.35);
              border: 1.5px solid ${busColor};
              display: flex;
              align-items: center;
              gap: 4px;
            ">
              <span style="width: 6px; height: 6px; border-radius: 50%; background: ${busColor}; display: inline-block;"></span>
              ${bus.unitNumber}
            </div>
            <div style="
              width: 0; 
              height: 0; 
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-top: 6px solid ${isSelected ? '#1E3A8A' : '#0F172A'};
            "></div>
          </div>
        `,
        iconSize: [50, 30],
        iconAnchor: [25, 28]
      });

      if (markersRef.current[bus.id]) {
        // Smoothly update position
        markersRef.current[bus.id].setLatLng([bus.lat, bus.lng]);
        markersRef.current[bus.id].setIcon(customIcon);
      } else {
        const marker = L.marker([bus.lat, bus.lng], { icon: customIcon });
        marker.on('click', () => {
          if (onSelectBus) onSelectBus(bus.id);
        });

        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; color: #0f172a; min-width: 170px;">
            <div style="font-weight: 700; font-size: 13px; color: #1E3A8A; display: flex; justify-content: space-between;">
              <span>Unidad ${bus.unitNumber}</span>
              <span style="font-size: 11px; color: #64748b;">${bus.plate}</span>
            </div>
            <div style="color: #334155; margin-top: 4px;">
              Chofer: <b>${bus.driverName}</b><br/>
              Ocupación: <b>${bus.currentOccupancy}/${bus.capacity}</b> (${Math.round((bus.currentOccupancy/bus.capacity)*100)}%)<br/>
              Velocidad: <b>${bus.speedKmH} km/h</b><br/>
              Próxima: <b>${bus.nextStop}</b>
            </div>
          </div>
        `);

        marker.addTo(map);
        markersRef.current[bus.id] = marker;
      }
    });

    // Cleanup stale markers
    Object.keys(markersRef.current).forEach(id => {
      if (!buses.find(b => b.id === id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });
  }, [buses, selectedBusId, onSelectBus]);

  // Recenter if selected bus changes
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedBusId) return;
    const bus = buses.find(b => b.id === selectedBusId);
    if (bus) {
      mapInstanceRef.current.panTo([bus.lat, bus.lng], { animate: true });
    }
  }, [selectedBusId]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-slate-100" style={{ height }}>
      <div ref={mapContainerRef} className="h-full w-full" style={{ zIndex: 1 }} />
      
      {/* Map Legend Overlay */}
      <div className="absolute bottom-2 left-2 z-[400] flex items-center gap-3 rounded-lg bg-white/90 px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm backdrop-blur-xs">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          <span>En Ruta</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
          <span>Detenido</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
          <span>Incidencia</span>
        </div>
      </div>
    </div>
  );
};
