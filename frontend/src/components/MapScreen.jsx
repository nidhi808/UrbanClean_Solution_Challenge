import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Info, AlertTriangle, CheckCircle, Crosshair, Map as MapIcon, ShieldAlert, X, Loader2 } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { subscribeToReports, getLocalBackupReports } from '../syncService';

const DEPOT_LOCATION = [19.0850, 72.8800]; // Simulated Municipal Depot

const MapScreen = ({ autoExecute = false }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [planExecuted, setPlanExecuted] = useState(false);
  const mapRef = useRef(null);
  const polylinesRef = useRef([]);

  useEffect(() => {
    // Dynamically inject Leaflet CSS & JS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (mapRef.current) return;
      
      const L = window.L;
      const map = L.map('real-leaflet-map', { zoomControl: false, attributionControl: false }).setView([19.0760, 72.8777], 13);
      mapRef.current = map;

      // Dark Mode Tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Bottom Right Zoom Control
      L.control.zoom({ position: 'bottomright' }).addTo(map);
      
      renderMarkers(markers, map);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Run once on mount

  // Fetch real markers from Firestore + Local Sync
  useEffect(() => {
    // 1. Initial local backup
    setMarkers(getLocalBackupReports());

    // 2. Listen to Firestore
    const q = query(collection(db, "issues"), orderBy("timestamp", "desc"));
    const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
      const dbIssues = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMarkers(prev => {
        const combined = [...dbIssues, ...prev];
        return combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
      });
    }, (err) => {
      console.warn("Map Firestore issue (Using Local Sync):", err.message);
    });

    // 3. Live Broadcasts
    const unsubscribeSync = subscribeToReports((newReport) => {
      setMarkers(prev => {
        if (prev.find(r => r.id === newReport.id)) return prev;
        return [newReport, ...prev];
      });
    });

    return () => {
      unsubscribeFirestore();
      unsubscribeSync();
    };
  }, []);

  // Function to render markers based on state
  const renderMarkers = (currentMarkers, mapInstance) => {
    if (!mapInstance || !window.L) return;
    
    // Clear existing markers (excluding tile layers and controls)
    mapInstance.eachLayer((layer) => {
      if (layer instanceof window.L.Marker) {
        mapInstance.removeLayer(layer);
      }
    });

    // Add Depot Marker
    const depotIcon = window.L.divIcon({
      className: 'custom-leaflet-icon',
      html: `<div class="w-6 h-6 rounded border-2 border-white bg-blue-600 shadow-[0_0_15px_#2563eb] flex items-center justify-center text-white text-[10px] font-bold">HQ</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    window.L.marker(DEPOT_LOCATION, { icon: depotIcon }).addTo(mapInstance).bindPopup("Municipal HQ");

    // Add Issue Markers
    currentMarkers.forEach(marker => {
      let color = marker.severity === 'critical' ? '#ef4444' : 
                  marker.severity === 'high' ? '#facc15' : '#10b981';
                  
      // If executed, change color of critical ones to indicate dispatch
      if (marker.status === 'Team Dispatched') {
        color = '#3b82f6'; // Blue
      }
      
      let glow = (marker.severity === 'critical' && marker.status !== 'Team Dispatched') 
                 ? 'animate-pulse shadow-[0_0_20px_#ef4444]' 
                 : `shadow-[0_0_10px_${color}]`;
                  
      const customIcon = window.L.divIcon({
        className: 'custom-leaflet-icon',
        html: `<div class="w-5 h-5 rounded-full border-[3px] border-dark-900 ${glow} transition-colors duration-500" style="background-color: ${color};"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const Lmarker = window.L.marker([marker.lat, marker.lng], { icon: customIcon }).addTo(mapInstance);
      
      Lmarker.on('click', () => {
        setSelectedMarker(marker);
        mapInstance.flyTo([marker.lat, marker.lng], 16, { animate: true, duration: 1 });
      });
    });
  };

  // Re-render markers if state changes
  useEffect(() => {
    if (mapRef.current) {
      renderMarkers(markers, mapRef.current);
    }
  }, [markers]);

  // Auto-execute when navigated from AI Insights "Execute Plan"
  useEffect(() => {
    if (autoExecute && mapRef.current && !planExecuted && !isExecuting) {
      // Small delay to let the map render first
      const timer = setTimeout(() => handleExecuteAI(), 800);
      return () => clearTimeout(timer);
    }
  }, [autoExecute, mapRef.current]);

  const handleExecuteAI = () => {
    setIsExecuting(true);
    
    // Simulate API call and calculation delay
    setTimeout(() => {
      setIsExecuting(false);
      setPlanExecuted(true);
      
      // Update critical markers status
      const updatedMarkers = markers.map(m => 
        m.severity === 'critical' ? { ...m, status: 'Team Dispatched', priority: 'En Route' } : m
      );
      setMarkers(updatedMarkers);
      
      // Draw routing lines from Depot to Critical Issues
      if (mapRef.current && window.L) {
        const criticalIssues = updatedMarkers.filter(m => m.severity === 'critical');
        
        criticalIssues.forEach(issue => {
          // Draw a dashed blue line
          const polyline = window.L.polyline([DEPOT_LOCATION, [issue.lat, issue.lng]], {
            color: '#3b82f6',
            weight: 3,
            dashArray: '10, 10',
            opacity: 0.8,
            className: 'animate-dash' // Custom CSS animation for flowing line
          }).addTo(mapRef.current);
          
          polylinesRef.current.push(polyline);
        });
        
        // Auto zoom to fit HQ and the dispatched issues
        const group = new window.L.featureGroup([
            window.L.marker(DEPOT_LOCATION), 
            ...criticalIssues.map(m => window.L.marker([m.lat, m.lng]))
        ]);
        mapRef.current.fitBounds(group.getBounds().pad(0.2), { animate: true });
      }
    }, 2000);
  };

  const getPinColor = (severity, status) => {
    if (status === 'Team Dispatched') return 'text-brand-blue';
    switch(severity) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-yellow-400';
      case 'low': return 'text-brand-green';
      default: return 'text-brand-blue';
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] overflow-hidden rounded-tl-2xl border-t border-l border-white/5 bg-[#0a0f18]">
      
      <div id="real-leaflet-map" className="absolute inset-0 z-0"></div>

      <div className="absolute top-6 right-6 w-80 flex flex-col gap-4 z-[400] pointer-events-none">
        <div className="glass-panel p-5 pointer-events-auto bg-dark-900/80 backdrop-blur-md">
          <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-4">
            <ShieldAlert size={16} className="text-red-400" /> 
            Top Priority Issues
          </h3>
          <div className="space-y-3">
            {markers.filter(m => m.severity === 'critical').map(m => (
              <div 
                key={m.id} 
                className={`bg-white/5 border ${m.status === 'Team Dispatched' ? 'border-brand-blue/50' : 'border-white/5'} rounded-lg p-3 hover:bg-white/10 transition-colors cursor-pointer`}
                onClick={() => {
                  setSelectedMarker(m);
                  if (mapRef.current) mapRef.current.flyTo([m.lat, m.lng], 16, { animate: true });
                }}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-semibold text-white">{m.type}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${m.status === 'Team Dispatched' ? 'bg-brand-blue/20 text-brand-blue' : 'bg-red-500/20 text-red-400'}`}>
                    {m.status === 'Team Dispatched' ? 'Dispatched' : 'Critical'}
                  </span>
                </div>
                <div className="text-xs text-gray-400">{m.location}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-5 pointer-events-auto bg-gradient-to-br from-dark-900 to-brand-green/10 border-brand-green/20 backdrop-blur-md">
          <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-3">
            <Crosshair size={16} className="text-brand-green" />
            AI Suggested Actions
          </h3>
          <div className="text-sm text-gray-300 space-y-2">
            <p className="flex items-start gap-2">
              <span className="text-brand-green mt-0.5">•</span>
              {planExecuted ? "Team Alpha dispatched to Main St & 5th Ave." : "Dispatch Repair Team Alpha to Main St & 5th Ave."}
            </p>
            <p className="flex items-start gap-2">
              <span className="text-brand-green mt-0.5">•</span>
              {planExecuted ? "Team Beta routed to Highway 9." : "Route Team Beta to Highway 9 after current job."}
            </p>
          </div>
          
          <button 
            onClick={handleExecuteAI}
            disabled={isExecuting || planExecuted}
            className={`w-full mt-4 font-bold py-2.5 rounded-lg transition-all text-sm flex items-center justify-center gap-2 ${
              planExecuted 
                ? 'bg-dark-800 text-brand-blue border border-brand-blue/30 cursor-default' 
                : 'bg-brand-green text-black hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]'
            }`}
          >
            {isExecuting ? (
              <><Loader2 size={16} className="animate-spin" /> Dispatching Teams...</>
            ) : planExecuted ? (
              <><CheckCircle size={16} /> Plan Executed</>
            ) : (
              'Execute AI Plan'
            )}
          </button>
        </div>
      </div>

      {selectedMarker && (
        <div 
          className="absolute z-[500] bg-dark-800 border border-white/10 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] p-4 w-72 backdrop-blur-xl animate-in zoom-in-95 duration-200"
          style={{ top: '6rem', left: '2rem' }}
        >
          <button 
            className="absolute top-3 right-3 text-gray-500 hover:text-white bg-white/5 rounded-full p-1"
            onClick={() => setSelectedMarker(null)}
          >
            <X size={14} />
          </button>
          <div className="flex items-center gap-2 mb-3 pr-6">
            <MapPin size={20} className={getPinColor(selectedMarker.severity, selectedMarker.status)} />
            <h4 className="font-bold text-white text-base leading-tight">{selectedMarker.type}</h4>
          </div>
          <p className="text-sm text-gray-400 mb-4 bg-dark-900 p-2 rounded-lg">{selectedMarker.location}</p>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm items-center">
              <span className="text-gray-500">Severity</span>
              <span className={`font-bold uppercase text-xs px-2 py-1 rounded bg-white/5 ${getPinColor(selectedMarker.severity, 'None')}`}>
                {selectedMarker.severity}
              </span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-gray-500">Status</span>
              <span className={`font-medium ${selectedMarker.status === 'Team Dispatched' ? 'text-brand-blue' : 'text-white'}`}>
                {selectedMarker.status}
              </span>
            </div>
          </div>
          
          <div className={`rounded-lg p-3 border ${selectedMarker.status === 'Team Dispatched' ? 'bg-brand-blue/10 border-brand-blue/20' : 'bg-brand-green/10 border-brand-green/20'}`}>
            <p className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${selectedMarker.status === 'Team Dispatched' ? 'text-brand-blue' : 'text-brand-green'}`}>
              {selectedMarker.status === 'Team Dispatched' ? 'Live Routing' : 'AI Priority Assessment'}
            </p>
            <p className="text-sm font-medium text-white">{selectedMarker.priority}</p>
          </div>
        </div>
      )}

      {/* Global CSS overrides for Leaflet & Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-container { background: #0a0f18 !important; font-family: inherit; }
        .leaflet-control-zoom a { background-color: rgba(20, 25, 35, 0.9) !important; color: white !important; border-color: rgba(255,255,255,0.1) !important; backdrop-filter: blur(4px); }
        .leaflet-control-zoom a:hover { background-color: rgba(16, 185, 129, 0.2) !important; color: #10b981 !important; }
        
        /* Animated Dash for Polylines */
        .animate-dash {
          stroke-dasharray: 10, 10;
          animation: dash-animation 20s linear infinite;
        }
        @keyframes dash-animation {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: 0; }
        }
      `}} />
    </div>
  );
};

export default MapScreen;
