import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Navigation,
  Search,
  CheckCircle2,
  Clock,
  RotateCcw,
  Store,
  Compass,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Phone,
  Info,
  Calendar,
  Layers,
  LocateFixed,
  X,
} from 'lucide-react';
import L from 'leaflet';
import { usePds } from '../../context/PdsContext';
import { FPSShop, PortabilityLocationHistoryItem } from '../../types/pds';
import { speakAloud } from '../../utils/audioSpeech';

interface PortabilityChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectShopConfirmed?: (shopId: string) => void;
}

// Haversine formula to compute great-circle distance between two points in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Preset locations in Karnataka (useful if geolocation is denied or test mode)
const KARNATAKA_PRESETS = [
  { name: 'Malleshwaram Central', lat: 13.0031, lng: 77.5701, area: 'Bengaluru Urban' },
  { name: 'Vyalikaval / Sadashivanagar', lat: 13.0018, lng: 77.5789, area: 'Bengaluru Urban' },
  { name: 'Rajajinagar Industrial Area', lat: 12.9981, lng: 77.5523, area: 'Bengaluru Urban' },
  { name: 'Yeshwanthpur Railway Hub', lat: 13.0245, lng: 77.5492, area: 'Bengaluru North' },
  { name: 'Shivajinagar Bus Terminus', lat: 12.9856, lng: 77.6057, area: 'Bengaluru Central' },
  { name: 'Indiranagar 100ft Road', lat: 12.9784, lng: 77.6408, area: 'Bengaluru East' },
];

export const PortabilityChoiceModal: React.FC<PortabilityChoiceModalProps> = ({
  isOpen,
  onClose,
  onSelectShopConfirmed,
}) => {
  const {
    citizen,
    shops,
    language,
    slotBookingState,
    setTemporaryPortabilityShop,
    revertToDefaultLocation,
    portabilityHistory,
  } = usePds();

  // Current detected / selected location
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: 13.0031,
    lng: 77.5701, // Default centered around Malleshwaram, Bangalore
  });
  const [locationLabel, setLocationLabel] = useState<string>(
    'Malleshwaram, Bengaluru (Card Ward 42)'
  );
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationSuccessNotice, setLocationSuccessNotice] = useState<string | null>(null);

  // Active view tab: 'map' (choose new location) vs 'history' (previously selected locations)
  const [activeTab, setActiveTab] = useState<'map' | 'history'>('map');

  // Search filter query
  const [searchQuery, setSearchQuery] = useState('');

  // Selected shop for temporary portability preview
  const [chosenShopId, setChosenShopId] = useState<string | null>(
    citizen.temporaryPortabilityShopId || null
  );

  // Leaflet map refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);
  const shopMarkersLayerRef = useRef<L.LayerGroup | null>(null);

  // Default permanent shop
  const defaultShop =
    shops.find((s) => s.id === (citizen.defaultFpsId || 'KA-BLR-FPS-104')) || shops[0];

  // Calculate distances for all shops and filter by <= 5.0 km
  const shopsWithDistance = shops
    .map((shop) => {
      const dist = calculateDistanceKm(
        currentCoords.lat,
        currentCoords.lng,
        shop.coordinates.lat,
        shop.coordinates.lng
      );
      return {
        ...shop,
        distanceKm: Number(dist.toFixed(2)),
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);

  // Strictly under 5 kilometers
  const shopsUnder5Km = shopsWithDistance.filter((s) => s.distanceKm <= 5.0);

  // Filtered by search if any
  const filteredUnder5Km = shopsUnder5Km.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.shopNumber.toLowerCase().includes(q) ||
      s.dealerName.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q) ||
      s.ward.toLowerCase().includes(q)
    );
  });

  // GPS Location Detection via browser API
  const handleDetectCurrentLocation = () => {
    setIsDetectingLocation(true);
    setLocationError(null);
    setLocationSuccessNotice(null);

    if (!('geolocation' in navigator)) {
      setLocationError(
        language === 'kn'
          ? 'ನಿಮ್ಮ ಬ್ರೌಸರ್ ಜಿಪಿಎಸ್ ಸ್ಥಳ ಗುರುತಿಸುವಿಕೆಯನ್ನು ಬೆಂಬಲಿಸುವುದಿಲ್ಲ. ದಯವಿಟ್ಟು ಕೆಳಗಿನ ಸ್ಥಳ ಆಯ್ಕೆಮಾಡಿ.'
          : 'Geolocation is not supported by your browser. Please select a preset location.'
      );
      setIsDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentCoords({ lat: latitude, lng: longitude });
        setLocationLabel(`Detected GPS Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        setIsDetectingLocation(false);
        setLocationSuccessNotice(
          language === 'kn'
            ? 'ನಿಮ್ಮ ನಿಖರ ಸ್ಥಳವನ್ನು ಗುರುತಿಸಲಾಗಿದೆ! 5 ಕಿಮೀ ವ್ಯಾಪ್ತಿಯ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿಗಳನ್ನು ನಕ್ಷೆಯಲ್ಲಿ ತೋರಿಸಲಾಗಿದೆ.'
            : 'Your location has been detected! Nearest FPS shops under 5 km are loaded on the map.'
        );
        speakAloud(
          language === 'kn'
            ? 'ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸ್ಥಳವನ್ನು ಗುರುತಿಸಲಾಗಿದೆ. ಹತ್ತಿರದ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿಗಳು ಲಭ್ಯವಿದೆ.'
            : 'Current location detected. Showing nearest Fair Price Shops under 5 kilometers.',
          language
        );
      },
      (error) => {
        setIsDetectingLocation(false);
        console.warn('Geolocation warning:', error.message);
        setLocationError(
          language === 'kn'
            ? 'ಜಿಪಿಎಸ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ ಅಥವಾ ಲಭ್ಯವಿಲ್ಲ. ನಿಮ್ಮ ಅನುಕೂಲಕ್ಕಾಗಿ ಬೆಂಗಳೂರು ಕೇಂದ್ರ ಸ್ಥಳವನ್ನು ಬಳಸಲಾಗುತ್ತಿದೆ.'
            : 'GPS permission denied or unavailable. Using Karnataka District Hub coordinates.'
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Set location from preset
  const handleSelectPreset = (preset: (typeof KARNATAKA_PRESETS)[0]) => {
    setCurrentCoords({ lat: preset.lat, lng: preset.lng });
    setLocationLabel(`${preset.name} (${preset.area})`);
    setLocationError(null);
    setLocationSuccessNotice(
      language === 'kn'
        ? `${preset.name} ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ. 5 ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿಯ ಅಂಗಡಿಗಳು ಅಪ್‌ಡೇಟ್ ಆಗಿವೆ.`
        : `Selected ${preset.name}. Showing nearest FPS shops within 5 km radius.`
    );
  };

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Small delay to ensure modal DOM is visible and sized
    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        // Create Leaflet map instance
        const map = L.map(mapContainerRef.current, {
          center: [currentCoords.lat, currentCoords.lng],
          zoom: 14,
          zoomControl: true,
          attributionControl: true,
        });

        // OpenStreetMap Tile Layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors | Karnataka PDS DemandSync',
        }).addTo(map);

        // Layer group for shop pins
        const shopLayer = L.layerGroup().addTo(map);
        shopMarkersLayerRef.current = shopLayer;

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;
      if (!map) return;

      // Update map center
      map.setView([currentCoords.lat, currentCoords.lng], 13.5);
      map.invalidateSize();

      // Custom icon for user location (pulsing blue dot)
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 28px; height: 28px; background: rgba(37, 99, 235, 0.35); border-radius: 50%; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 16px; height: 16px; background: #1d4ed8; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.4);"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      // Update user marker
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([currentCoords.lat, currentCoords.lng]);
      } else {
        userMarkerRef.current = L.marker([currentCoords.lat, currentCoords.lng], {
          icon: userIcon,
          title: 'Your Location',
        })
          .addTo(map)
          .bindPopup(
            `<div style="font-family: sans-serif; font-size: 12px; padding: 4px;">
              <strong style="color: #1d4ed8;">📍 You Are Here</strong>
              <div style="color: #64748b; font-size: 11px; margin-top: 2px;">${locationLabel}</div>
            </div>`
          );
      }

      // Update 5 Kilometers Radius Circle Overlay
      if (radiusCircleRef.current) {
        radiusCircleRef.current.setLatLng([currentCoords.lat, currentCoords.lng]);
      } else {
        radiusCircleRef.current = L.circle([currentCoords.lat, currentCoords.lng], {
          radius: 5000, // 5,000 meters = 5 km
          color: '#6B1870',
          fillColor: '#9333EA',
          fillOpacity: 0.1,
          weight: 2,
          dashArray: '6, 6',
        }).addTo(map);
      }

      // Populate Shop Markers within 5 km
      if (shopMarkersLayerRef.current) {
        shopMarkersLayerRef.current.clearLayers();

        shopsUnder5Km.forEach((shop) => {
          const isSelected = chosenShopId === shop.id;
          const isDefault = shop.id === defaultShop.id;

          const shopIcon = L.divIcon({
            className: 'custom-shop-marker',
            html: `
              <div style="
                background: ${isSelected ? '#15803d' : isDefault ? '#2C0E38' : '#6B1870'};
                color: #ffffff;
                border: 2px solid ${isSelected ? '#86efac' : '#FFD700'};
                border-radius: 8px;
                padding: 3px 6px;
                font-family: sans-serif;
                font-size: 10px;
                font-weight: bold;
                white-space: nowrap;
                box-shadow: 0 4px 10px rgba(0,0,0,0.35);
                display: flex;
                align-items: center;
                gap: 3px;
                cursor: pointer;
              ">
                <span>🏪 ${shop.shopNumber}</span>
                <span style="background: rgba(255,255,255,0.25); padding: 1px 4px; border-radius: 4px; font-size: 9px;">${shop.distanceKm}km</span>
              </div>
            `,
            iconSize: [80, 26],
            iconAnchor: [40, 26],
          });

          const marker = L.marker([shop.coordinates.lat, shop.coordinates.lng], {
            icon: shopIcon,
            title: `${shop.name} (${shop.distanceKm} km away)`,
          });

          marker.bindPopup(`
            <div style="font-family: sans-serif; font-size: 12px; min-width: 200px; padding: 2px;">
              <div style="font-weight: bold; color: #2C0E38; font-size: 13px;">${shop.name}</div>
              <div style="color: #6B1870; font-weight: 600; font-size: 11px; margin-top: 2px;">
                ${shop.shopNumber} · ${shop.distanceKm} km away
              </div>
              <div style="color: #475569; font-size: 11px; margin-top: 4px;">${shop.address}</div>
              <div style="color: #64748b; font-size: 10px; margin-top: 2px;">Dealer: <strong>${shop.dealerName}</strong></div>
              <div style="margin-top: 8px;">
                <span style="background: ${shop.distributionStarted ? '#dcfce7' : '#fef3c7'}; color: ${shop.distributionStarted ? '#166534' : '#92400e'}; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">
                  ${shop.distributionStarted ? '● Distribution Live' : '○ Pending Dealer Opening'}
                </span>
              </div>
            </div>
          `);

          marker.on('click', () => {
            setChosenShopId(shop.id);
          });

          shopMarkersLayerRef.current?.addLayer(marker);
        });
      }
    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen, currentCoords, shopsUnder5Km.length, chosenShopId]);

  // Clean up map on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        userMarkerRef.current = null;
        radiusCircleRef.current = null;
        shopMarkersLayerRef.current = null;
      }
    };
  }, []);

  if (!isOpen) return null;

  // Confirm temporary portability selection for this month
  const handleConfirmShopSelection = (shop: FPSShop & { distanceKm: number }) => {
    setTemporaryPortabilityShop(shop.id, shop.distanceKm);
    speakAloud(
      language === 'kn'
        ? `${shop.name} ಅನ್ನು ಪ್ರಸಕ್ತ ತಿಂಗಳಿಗೆ ತಾತ್ಕಾಲಿಕವಾಗಿ ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ. ಮುಂದಿನ ತಿಂಗಳು ನಿಮ್ಮ ಮೂಲ ಅಂಗಡಿಗೆ ಹಿಂತಿರುಗುತ್ತದೆ.`
        : `${shop.name} has been temporarily selected for this month. It will revert to your default location next month.`,
      language
    );

    if (onSelectShopConfirmed) {
      onSelectShopConfirmed(shop.id);
    }
    onClose();
  };

  // Re-select from past history
  const handleSelectFromHistory = (item: PortabilityLocationHistoryItem) => {
    setTemporaryPortabilityShop(item.fpsId, item.distanceKm);
    speakAloud(
      language === 'kn'
        ? `ಹಿಂದಿನ ಇತಿಹಾಸದಿಂದ ${item.shopName} ಅನ್ನು ಈ ತಿಂಗಳಿಗೆ ಮರು-ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ.`
        : `Re-selected ${item.shopName} from history for this month.`,
      language
    );

    if (onSelectShopConfirmed) {
      onSelectShopConfirmed(item.fpsId);
    }
    onClose();
  };

  // Revert back to permanent default
  const handleRevertToDefault = () => {
    revertToDefaultLocation();
    setChosenShopId(defaultShop.id);
    speakAloud(
      language === 'kn'
        ? 'ನಿಮ್ಮ ಮೂಲ ಖಾಯಂ ರೇಷನ್ ಅಂಗಡಿಗೆ ಹಿಂತಿರುಗಿಸಲಾಗಿದೆ.'
        : 'Reverted back to your default registered ration depot.',
      language
    );
    if (onSelectShopConfirmed) {
      onSelectShopConfirmed(defaultShop.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl border-2 border-purple-200 flex flex-col overflow-hidden font-sans">
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-[#2C0E38] via-[#481656] to-[#2C0E38] text-white p-4 sm:p-6 border-b border-[#D4AF37]/40 relative">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] sm:text-xs font-black bg-[#FFD700] text-[#2C0E38] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Karnataka PDS Portability Choice
                </span>
                <span className="text-[11px] text-purple-200 font-mono">
                  NFSA ONORC Inter-Depot Window
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-white">
                {language === 'kn'
                  ? 'ಈ ತಿಂಗಳಿಗಾಗಿ ರೇಷನ್ ಅಂಗಡಿ ಸ್ಥಳ ಬದಲಾವಣೆ (ಪೋರ್ಟಬಿಲಿಟಿ)'
                  : 'Change Ration Distribution Location for This Month'}
              </h2>
              <p className="text-xs text-purple-100 max-w-2xl leading-relaxed">
                {language === 'kn'
                  ? 'ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸ್ಥಳವನ್ನು ಆಧರಿಸಿ 5 ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿರುವ ಯಾವುದೇ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿಯನ್ನು ಈ ತಿಂಗಳಿಗೆ ಮಾತ್ರ ತಾತ್ಕಾಲಿಕವಾಗಿ ಆಯ್ಕೆಮಾಡಿ. ಮುಂದಿನ ತಿಂಗಳು ನಿಮ್ಮ ಮೂಲ ನಿಗದಿತ ಅಂಗಡಿಗೆ ತಾನಾಗಿಯೇ ಹಿಂತಿರುಗುತ್ತದೆ.'
                  : 'Select any active Fair Price Shop within 5 km of your current location. This choice applies temporarily for the current month only; your account automatically reverts to your permanent default location next month.'}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-purple-200 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* PERMANENT DEFAULT VS TEMPORARY BANNER */}
          <div className="mt-4 pt-3 border-t border-purple-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FFD700] shrink-0" />
              <span>
                <strong>Permanent Default Location:</strong>{' '}
                <span className="text-[#FFD700] underline font-medium">
                  {defaultShop.name} ({defaultShop.shopNumber})
                </span>
              </span>
            </div>

            {citizen.temporaryPortabilityShopId && (
              <button
                type="button"
                onClick={handleRevertToDefault}
                className="px-3 py-1 bg-amber-400/20 hover:bg-amber-400/30 text-[#FFD700] border border-amber-300/40 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Revert to Default Location Now</span>
              </button>
            )}
          </div>
        </div>

        {/* NAVIGATION TABS: MAP (NEW LOCATION) VS HISTORY (PREVIOUS SELECTIONS) */}
        <div className="flex items-center justify-between border-b border-purple-100 bg-purple-50/60 px-4 sm:px-6 py-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-[#6B1870] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-purple-100/60 border border-slate-200'
              }`}
            >
              <Compass className="w-4 h-4 text-[#FFD700]" />
              <span>{language === 'kn' ? 'ನಕ್ಷೆಯಲ್ಲಿ ಹೊಸ ಸ್ಥಳ ಆಯ್ಕೆ' : 'Find Nearest Shops on Map (5 km)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#6B1870] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-purple-100/60 border border-slate-200'
              }`}
            >
              <Clock className="w-4 h-4 text-purple-600" />
              <span>
                {language === 'kn' ? 'ಹಿಂದಿನ ಸ್ಥಳಗಳ ಇತಿಹಾಸ' : 'Previously Selected Locations'}
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-purple-200 text-purple-900">
                {portabilityHistory.length}
              </span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Info className="w-3.5 h-3.5 text-[#6B1870]" />
            <span>5.0 km radial geofence enforced</span>
          </div>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: MAP AND NEAREST SHOPS */}
          {activeTab === 'map' && (
            <div className="space-y-5">
              {/* CURRENT LOCATION DETECTION CARD */}
              <div className="bg-gradient-to-r from-purple-50 via-white to-purple-50 p-4 sm:p-5 rounded-2xl border border-purple-200 shadow-2xs space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B1870] flex items-center gap-1">
                      <LocateFixed className="w-3.5 h-3.5" />
                      <span>{language === 'kn' ? 'ಹಂತ 1: ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸ್ಥಳ' : 'Step 1: Your Current Location'}</span>
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {locationLabel}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Coordinates: {currentCoords.lat.toFixed(4)}°N, {currentCoords.lng.toFixed(4)}°E · Searching within 5.0 km
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDetectCurrentLocation}
                    disabled={isDetectingLocation}
                    className="px-4 py-2.5 bg-[#6B1870] hover:bg-[#57135C] active:scale-98 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 shrink-0"
                  >
                    <Navigation className={`w-4 h-4 text-[#FFD700] ${isDetectingLocation ? 'animate-spin' : ''}`} />
                    <span>
                      {isDetectingLocation
                        ? (language === 'kn' ? 'ಸ್ಥಳ ಗುರುತಿಸಲಾಗುತ್ತಿದೆ...' : 'Detecting GPS Location...')
                        : (language === 'kn' ? '📍 ನನ್ನ ಪ್ರಸ್ತುತ ಸ್ಥಳ ಪತ್ತೆಹಚ್ಚಿ' : '📍 Detect My Current Location')}
                    </span>
                  </button>
                </div>

                {/* Quick Karnataka Location Presets */}
                <div className="pt-2.5 border-t border-purple-100 flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-600 whitespace-nowrap">
                    {language === 'kn' ? 'ತ್ವರಿತ ಸ್ಥಳಗಳು:' : 'Quick Presets:'}
                  </span>
                  {KARNATAKA_PRESETS.map((p) => {
                    const isActive =
                      Math.abs(currentCoords.lat - p.lat) < 0.001 &&
                      Math.abs(currentCoords.lng - p.lng) < 0.001;
                    return (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => handleSelectPreset(p)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#2C0E38] text-[#FFD700] font-bold shadow-2xs'
                            : 'bg-white text-slate-700 hover:bg-purple-100/70 border border-slate-200'
                        }`}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </div>

                {/* Geolocation feedback alerts */}
                {locationSuccessNotice && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{locationSuccessNotice}</span>
                  </div>
                )}
                {locationError && (
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{locationError}</span>
                  </div>
                )}
              </div>

              {/* OPEN-SOURCE LEAFLET / OPENSTREETMAP CONTAINER */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#2C0E38] flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#6B1870]" />
                    <span>
                      {language === 'kn'
                        ? 'ಮುಕ್ತ-ಮೂಲ ನಕ್ಷೆ (OpenStreetMap): 5 ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿಯ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿಗಳು'
                        : 'Open-Source Map: Nearest FPS Shops Under 5 Kilometers'}
                    </span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-[#6B1870]">
                    {shopsUnder5Km.length} Shops Within 5.0 km Radius
                  </span>
                </div>

                <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl border-2 border-purple-200 shadow-inner overflow-hidden z-10">
                  <div ref={mapContainerRef} className="w-full h-full" />

                  {/* Translucent overlay legend on bottom-left of map */}
                  <div className="absolute bottom-2 left-2 z-[400] bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200 text-[11px] shadow-md space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-blue-300"></span>
                      <span>You Are Here (GPS Pin)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#6B1870] ring-2 ring-purple-300"></span>
                      <span>Authorized FPS Shops</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 border-t-2 border-dashed border-[#6B1870]"></span>
                      <span>5 km Radial Perimeter</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEARCH & FILTER BAR UNDER MAP */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search nearest shop by number, dealer name, road or ward..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-[#6B1870] focus:ring-1 focus:ring-[#6B1870]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="text-xs text-slate-500 font-medium whitespace-nowrap self-center">
                  Showing <strong>{filteredUnder5Km.length}</strong> of {shopsUnder5Km.length} shops within 5 km
                </div>
              </div>

              {/* LIST OF FPS SHOPS UNDER 5 KM */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-[#2C0E38] font-serif flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#6B1870]" />
                  <span>
                    {language === 'kn'
                      ? '5 ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿಯ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿಗಳ ಪಟ್ಟಿ (ಆಯ್ಕೆಮಾಡಿ):'
                      : 'Choice to Select Fair Price Shop (Temporary Portability for Current Month):'}
                  </span>
                </h4>

                {filteredUnder5Km.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <Store className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="font-bold text-slate-700 text-sm">No shops found matching your criteria</p>
                    <p className="text-xs text-slate-500">
                      Try resetting your search or choosing another location preset.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredUnder5Km.map((shop) => {
                      const isDefault = shop.id === defaultShop.id;
                      const isSelected = chosenShopId === shop.id;

                      return (
                        <div
                          key={shop.id}
                          className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-3 bg-white ${
                            isSelected
                              ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/20 shadow-sm'
                              : isDefault
                              ? 'border-purple-300 hover:border-[#6B1870]'
                              : 'border-slate-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-[#6B1870] bg-purple-100 px-2 py-0.5 rounded">
                                  {shop.shopNumber}
                                </span>
                                {isDefault && (
                                  <span className="text-[10px] font-bold bg-[#2C0E38] text-[#FFD700] px-2 py-0.5 rounded-full">
                                    Card Default
                                  </span>
                                )}
                              </div>

                              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <Navigation className="w-3 h-3" />
                                <span>{shop.distanceKm} km away</span>
                              </span>
                            </div>

                            <h5 className="font-bold text-sm text-slate-900 font-serif leading-snug">
                              {shop.name}
                            </h5>
                            <p className="text-xs text-slate-500 leading-relaxed">
                              {shop.address} · {shop.ward}
                            </p>

                            <div className="text-xs text-slate-600 pt-1 flex items-center justify-between border-t border-slate-100">
                              <span>
                                Dealer: <strong>{shop.dealerName}</strong>
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  shop.distributionStarted
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {shop.distributionStarted ? 'Distribution Live' : 'Window Pending'}
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                            <div className="text-[11px] text-slate-500">
                              {isDefault ? 'Your permanent depot' : 'Temporary for this month'}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleConfirmShopSelection(shop)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                                  : 'bg-[#6B1870] hover:bg-[#57135C] text-white shadow-xs'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#FFD700]" />
                              <span>
                                {isDefault
                                  ? 'Select Default Depot'
                                  : 'Select for This Month (Temporary)'}
                              </span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PREVIOUS LOCATIONS SELECTED AS HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200 flex items-start gap-3 text-xs text-slate-700">
                <Clock className="w-5 h-5 text-[#6B1870] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">
                    {language === 'kn'
                      ? 'ಹಿಂದಿನ ತಿಂಗಳುಗಳಲ್ಲಿ ಆಯ್ಕೆಮಾಡಲಾದ ಸ್ಥಳಗಳ ಇತಿಹಾಸ'
                      : 'Previously Selected Portability Locations History'}
                  </h4>
                  <p className="text-slate-600">
                    {language === 'kn'
                      ? 'ನೀವು ಈ ಹಿಂದೆ ಆಯ್ಕೆಮಾಡಿದ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿಗಳನ್ನು ಇಲ್ಲಿ ವೀಕ್ಷಿಸಿ ಮತ್ತು ಒಂದೇ ಕ್ಲಿಕ್‌ನಲ್ಲಿ ಈ ತಿಂಗಳಿಗೂ ಮರು-ಆಯ್ಕೆ ಮಾಡಬಹುದು, ಅಥವಾ ನಕ್ಷೆಯಲ್ಲಿ ಹೊಸ ಸ್ಥಳವನ್ನು ಆಯ್ಕೆ ಮಾಡಬಹುದು.'
                      : 'Review shops you previously picked under Karnataka ONORC portability. You can re-select any previous location directly with one tap, or return to the map to choose a new location.'}
                  </p>
                </div>
              </div>

              {portabilityHistory.length === 0 ? (
                <div className="p-10 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <Clock className="w-10 h-10 text-slate-400 mx-auto" />
                  <h5 className="font-bold text-slate-800 text-sm">No Previous Portability History Found</h5>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    You have consistently collected rations from your default registered shop. When you use portability to change your shop for a month, it will be saved here for quick re-selection.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('map')}
                    className="px-4 py-2 bg-[#6B1870] text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Find Shops on Map
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {portabilityHistory.map((item) => {
                    const isCurrentActive = citizen.assignedFpsId === item.fpsId;
                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isCurrentActive
                            ? 'bg-purple-50/50 border-[#6B1870] ring-1 ring-[#6B1870]'
                            : 'bg-white border-slate-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-[#6B1870] bg-purple-100 px-2 py-0.5 rounded">
                              {item.shopNumber}
                            </span>
                            <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[#6B1870]" />
                              <span>{item.month}</span>
                            </span>
                            {item.distanceKm && (
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                                {item.distanceKm} km
                              </span>
                            )}
                            {isCurrentActive && (
                              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                Currently Selected
                              </span>
                            )}
                          </div>

                          <h5 className="font-bold text-sm text-slate-900 font-serif">
                            {item.shopName}
                          </h5>
                          <p className="text-xs text-slate-500">
                            {item.address} · Dealer: <strong>{item.dealerName}</strong>
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Selected on: {item.selectedAt}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleSelectFromHistory(item)}
                            className="px-4 py-2 bg-[#6B1870] hover:bg-[#57135C] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#FFD700]" />
                            <span>
                              {isCurrentActive
                                ? 'Keep This Location'
                                : 'Re-select for This Month'}
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Action to switch back to map */}
              <div className="pt-3 border-t border-purple-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Want to explore new Fair Price Shops near you?
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('map')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-[#6B1870]" />
                  <span>Choose New Location on Map</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 border-t border-purple-100 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-slate-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Statutory NFSA Guarantee:</strong> Default location auto-restores next cycle with no data loss.
            </span>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
