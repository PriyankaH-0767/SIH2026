import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Compass,
  Navigation,
  CheckCircle2,
  RotateCcw,
  Store,
  Clock,
  Search,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Phone,
  Sparkles,
  ArrowRight,
  LocateFixed,
  Calendar,
  Layers,
  Check,
  Info,
  X,
  Loader2,
} from 'lucide-react';
import L from 'leaflet';
import { usePds } from '../../context/PdsContext';
import { FPSShop } from '../../types/pds';
import { speakAloud } from '../../utils/audioSpeech';
import { VoiceHoverGuide } from '../common/VoiceHoverGuide';

interface ChangeShopLocationMapProps {
  onNavigateToSlotBooking?: () => void;
}

// Haversine formula to compute great-circle distance between two geographic coordinates in kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's mean radius in km
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

// Built-in Karnataka & Bengaluru Address & Landmark Gazetteer for instant real-time geocoding fallback
const BENGALURU_LANDMARK_GAZETTEER = [
  { keywords: ['malleshwaram', 'sampige', '15th cross'], name: '15th Cross, Sampige Road, Malleshwaram, Bengaluru 560003', lat: 13.0031, lng: 77.5701, ward: 'Ward 42' },
  { keywords: ['18th cross', 'margosa', 'bus stand'], name: '18th Cross, Margosa Road, Malleshwaram, Bengaluru 560055', lat: 13.0112, lng: 77.5694, ward: 'Ward 42' },
  { keywords: ['pipeline', 'gayatri', 'malleshwaram 8th'], name: '8th Main, Pipeline Road, Malleshwaram, Bengaluru 560003', lat: 13.0084, lng: 77.5672, ward: 'Ward 42' },
  { keywords: ['vyalikaval', '11th cross'], name: '11th Cross, Vyalikaval, Bengaluru 560003', lat: 13.0018, lng: 77.5789, ward: 'Ward 42' },
  { keywords: ['sadashivanagar', 'bashyam', 'circle'], name: '5th Main, Bashyam Circle, Sadashivanagar, Bengaluru 560080', lat: 13.0078, lng: 77.5812, ward: 'Ward 35' },
  { keywords: ['seshadripuram', '1st main', 'kumara park'], name: '1st Main Road, Seshadripuram, Bengaluru 560020', lat: 12.9892, lng: 77.5732, ward: 'Ward 39' },
  { keywords: ['rajajinagar', '2nd block', 'dr rajkumar'], name: 'Dr. Rajkumar Road, 2nd Block, Rajajinagar, Bengaluru 560010', lat: 12.9981, lng: 77.5523, ward: 'Ward 45' },
  { keywords: ['yeshwanthpur', 'railway', 'apmc'], name: 'Near APMC Market, Yeshwanthpur, Bengaluru 560022', lat: 13.0245, lng: 77.5492, ward: 'Ward 37' },
  { keywords: ['mathikere', 'gokula', 'ramaiah'], name: 'Mathikere Main Road, Near MS Ramaiah, Bengaluru 560054', lat: 13.0315, lng: 77.5582, ward: 'Ward 36' },
  { keywords: ['hebbal', 'bellary road', 'flyover'], name: 'Near Hebbal Flyover Underpass, Bellary Road, Bengaluru 560024', lat: 13.0381, lng: 77.5921, ward: 'Ward 21' },
  { keywords: ['vijayanagar', 'chord road', 'mc layout'], name: 'Chord Road, MC Layout, Vijayanagar, Bengaluru 560040', lat: 12.9712, lng: 77.5342, ward: 'Ward 123' },
  { keywords: ['basavanagudi', 'gandhi bazaar', 'dvg road'], name: 'Gandhi Bazaar Main Road, Basavanagudi, Bengaluru 560004', lat: 12.9421, lng: 77.5742, ward: 'Ward 154' },
  { keywords: ['jayanagar', '4th block', 'complex'], name: '4th Block Complex, Jayanagar, Bengaluru 560011', lat: 12.9299, lng: 77.5834, ward: 'Ward 168' },
  { keywords: ['indiranagar', '100 feet', 'cmh road'], name: '100 Feet Road, Indiranagar, Bengaluru 560038', lat: 12.9784, lng: 77.6408, ward: 'Ward 80' },
  { keywords: ['koramangala', '5th block', 'sony world'], name: '80 Feet Road, 5th Block, Koramangala, Bengaluru 560095', lat: 12.9352, lng: 77.6245, ward: 'Ward 151' },
  { keywords: ['shivajinagar', 'bus terminus', 'commercial street'], name: 'Broadway Road, Near Bus Terminus, Shivajinagar, Bengaluru 560051', lat: 12.9856, lng: 77.6057, ward: 'Ward 92' },
  { keywords: ['peenya', 'industrial area'], name: 'Peenya 1st Stage, Industrial Area, Bengaluru 560058', lat: 13.0285, lng: 77.5185, ward: 'Ward 41' },
  { keywords: ['rt nagar', 'dinnur main road'], name: 'Dinnur Main Road, RT Nagar, Bengaluru 560032', lat: 13.0182, lng: 77.5975, ward: 'Ward 33' },
];

export const ChangeShopLocationMap: React.FC<ChangeShopLocationMapProps> = ({
  onNavigateToSlotBooking,
}) => {
  const {
    citizen,
    shops,
    language,
    slotBookingState,
    setTemporaryPortabilityShop,
    changeCitizenLocation,
    revertToDefaultLocation,
    updateSelectedShop,
  } = usePds();

  // Resolved default permanent shop & current active shop
  const defaultShop =
    shops.find((s) => s.id === (citizen.defaultFpsId || 'KA-BLR-FPS-104')) || shops[0];
  const activeShop =
    shops.find((s) => s.id === (citizen.assignedFpsId || slotBookingState.selectedShop.fpsId)) ||
    defaultShop;
  const isTemporaryPortabilityActive = Boolean(citizen.temporaryPortabilityShopId);
  const activePortabilityShop = isTemporaryPortabilityActive
    ? shops.find((s) => s.id === citizen.temporaryPortabilityShopId)
    : null;

  // Real-Time Address Intake State
  const [inputAddress, setInputAddress] = useState<string>(
    '15th Cross, Sampige Road, Malleshwaram, Bengaluru'
  );
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const [geocodingMessage, setGeocodingMessage] = useState<string | null>(null);

  // Selected Location Coordinates & Display Label
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number }>({
    lat: 13.0031,
    lng: 77.5701,
  });
  const [selectedLocationLabel, setSelectedLocationLabel] = useState<string>(
    '15th Cross, Sampige Road, Malleshwaram, Bengaluru'
  );

  // Tab: 'map' (interactive map & real-time address analysis) vs 'history'
  const [activeTab, setActiveTab] = useState<'map' | 'history'>('map');

  // Search filter inside the 5km results
  const [shopFilterQuery, setShopFilterQuery] = useState('');

  // GPS detection state
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Success Notification
  const [successBanner, setSuccessBanner] = useState<{
    shopName: string;
    shopNumber: string;
    distanceKm?: number;
  } | null>(null);

  // Leaflet map refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);
  const shopsLayerRef = useRef<L.LayerGroup | null>(null);

  // Calculate distances for all shops from the citizen's real-time address coordinates
  const allShopsWithDistance = shops
    .map((shop) => {
      const dist = calculateDistanceKm(
        selectedCoords.lat,
        selectedCoords.lng,
        shop.coordinates.lat,
        shop.coordinates.lng
      );
      return {
        ...shop,
        distanceKm: Number(dist.toFixed(2)),
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);

  // Filter nearest shops strictly <= 5.0 km
  const nearest5KmShops = allShopsWithDistance.filter((s) => s.distanceKm <= 5.0);

  // Apply optional sub-filter by name/number/address
  const displayed5KmShops = nearest5KmShops.filter((s) => {
    if (!shopFilterQuery.trim()) return true;
    const q = shopFilterQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.shopNumber.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q) ||
      s.dealerName.toLowerCase().includes(q) ||
      s.ward.toLowerCase().includes(q)
    );
  });

  // Nearest shop overall (for fallback when outside 5km)
  const nearestOverall = allShopsWithDistance[0];

  // Geocode any user-entered real-time address string to coordinates
  const handleGeocodeAddress = async (addressToGeocode: string) => {
    const trimmed = addressToGeocode.trim();
    if (!trimmed) return;

    setIsGeocoding(true);
    setGeocodingMessage(null);
    setGpsError(null);

    try {
      // 1. First, attempt to call the local proxy /api/geocode endpoint
      let resolvedCoords: { lat: number; lng: number } | null = null;
      let resolvedName = trimmed;

      try {
        const res = await fetch('/api/geocode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: trimmed }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.lat && data.lng) {
            resolvedCoords = { lat: data.lat, lng: data.lng };
            resolvedName = data.displayName || trimmed;
          }
        }
      } catch (e) {
        console.warn('Backend geocoding call failed, trying direct lookup:', e);
      }

      // 2. If backend did not resolve, try direct OpenStreetMap Nominatim with 2.5s abort timeout
      if (!resolvedCoords) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2500);

          const query = trimmed.toLowerCase().includes('bengaluru') || trimmed.toLowerCase().includes('bangalore')
            ? trimmed
            : `${trimmed}, Bengaluru, India`;

          const nomRes = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=1`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);

          if (nomRes.ok) {
            const nomData = await nomRes.json();
            if (Array.isArray(nomData) && nomData.length > 0) {
              resolvedCoords = {
                lat: parseFloat(nomData[0].lat),
                lng: parseFloat(nomData[0].lon),
              };
              resolvedName = nomData[0].display_name;
            }
          }
        } catch (e) {
          console.warn('Direct Nominatim lookup skipped/timed out:', e);
        }
      }

      // 3. Fallback to extensive local Bangalore/Karnataka Gazetteer if online services missed
      if (!resolvedCoords) {
        const lowerInput = trimmed.toLowerCase();
        const matched = BENGALURU_LANDMARK_GAZETTEER.find((item) =>
          item.keywords.some((k) => lowerInput.includes(k))
        );

        if (matched) {
          resolvedCoords = { lat: matched.lat, lng: matched.lng };
          resolvedName = matched.name;
          setGeocodingMessage(
            language === 'kn'
              ? `ವಿಳಾಸವನ್ನು ಪರಿಶೀಲಿಸಲಾಗಿದೆ: ${matched.name}`
              : `Address matched to registered locality: ${matched.name}`
          );
        } else {
          // If no keyword matched, use Malleshwaram Central as safe default center
          resolvedCoords = { lat: 13.0031, lng: 77.5701 };
          resolvedName = `${trimmed} (Central Zone, Bengaluru)`;
          setGeocodingMessage(
            language === 'kn'
              ? 'ವಿಳಾಸದ ನಿಖರ ಪಿನ್ ಸಿಗಲಿಲ್ಲ, ಕೇಂದ್ರೀಯ ವಲಯಕ್ಕೆ ಮ್ಯಾಪ್ ಮಾಡಲಾಗಿದೆ.'
              : 'Exact street number pin approximated to nearest central zone.'
          );
        }
      }

      // 4. Update coordinates and label
      if (resolvedCoords) {
        setSelectedCoords(resolvedCoords);
        setSelectedLocationLabel(resolvedName);
        setInputAddress(resolvedName);

        // Fly map smoothly to the located address
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([resolvedCoords.lat, resolvedCoords.lng], 14, {
            duration: 1.0,
          });
        }
      }
    } catch (err: any) {
      console.error('Geocoding error:', err);
      setGpsError(err?.message || 'Could not locate address');
    } finally {
      setIsGeocoding(false);
    }
  };

  // Real-time GPS Detection with reverse geocoding
  const handleDetectGps = () => {
    setIsDetectingGps(true);
    setGpsError(null);
    setGeocodingMessage(null);

    if (!('geolocation' in navigator)) {
      setGpsError(
        language === 'kn'
          ? 'ನಿಮ್ಮ ಸಾಧನವು ಜಿಪಿಎಸ್ ಬೆಂಬಲಿಸುವುದಿಲ್ಲ. ದಯವಿಟ್ಟು ವಿಳಾಸವನ್ನು ಮೇಲೆ ನಮೂದಿಸಿ.'
          : 'Browser geolocation is not available. Please type your address in the box above.'
      );
      setIsDetectingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setSelectedCoords({ lat: latitude, lng: longitude });

        let addrLabel = `GPS Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;

        // Reverse geocode coordinates to street address
        try {
          const revRes = await fetch('/api/reverse-geocode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat: latitude, lng: longitude }),
          });
          if (revRes.ok) {
            const revData = await revRes.json();
            if (revData.success && revData.displayName) {
              addrLabel = revData.displayName;
            }
          }
        } catch {
          // Keep coordinate label
        }

        setSelectedLocationLabel(addrLabel);
        setInputAddress(addrLabel);
        setIsDetectingGps(false);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 14, { duration: 1.0 });
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setSelectedCoords({ lat: 13.0031, lng: 77.5701 });
        const fallbackLabel = '15th Cross, Sampige Road, Malleshwaram, Bengaluru';
        setSelectedLocationLabel(fallbackLabel);
        setInputAddress(fallbackLabel);
        setGpsError(
          language === 'kn'
            ? 'ಜಿಪಿಎಸ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಮಲ್ಲೇಶ್ವರಂ 15ನೇ ಕ್ರಾಸ್ ವಿಳಾಸವನ್ನು ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ.'
            : 'GPS permission denied. Loaded default Malleshwaram 15th Cross address.'
        );
        setIsDetectingGps(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create new Leaflet Map
      const map = L.map(mapContainerRef.current, {
        center: [selectedCoords.lat, selectedCoords.lng],
        zoom: 14,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | Karnataka Public Distribution System GIS',
        maxZoom: 19,
      }).addTo(map);

      // Map Click: user can click anywhere on the map to locate that real-time point
      map.on('click', async (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        setSelectedCoords({ lat, lng });

        let clickedLabel = `Pinned Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        // Reverse geocode to address
        try {
          const revRes = await fetch('/api/reverse-geocode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lng }),
          });
          if (revRes.ok) {
            const revData = await revRes.json();
            if (revData.success && revData.displayName) {
              clickedLabel = revData.displayName;
            }
          }
        } catch {
          // Keep label
        }

        setSelectedLocationLabel(clickedLabel);
        setInputAddress(clickedLabel);
        setGpsError(null);
      });

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Remove existing user marker, radius circle, and shops layer
    if (userMarkerRef.current) userMarkerRef.current.remove();
    if (radiusCircleRef.current) radiusCircleRef.current.remove();
    if (shopsLayerRef.current) shopsLayerRef.current.remove();

    // 1. Draw 5 km radius circle around citizen's real-time address coordinates
    const radiusCircle = L.circle([selectedCoords.lat, selectedCoords.lng], {
      radius: 5000, // 5000 meters = 5.0 km
      color: '#059669',
      fillColor: '#10B981',
      fillOpacity: 0.08,
      weight: 2,
      dashArray: '5, 5',
    }).addTo(map);
    radiusCircleRef.current = radiusCircle;

    // 2. Real-Time User Address Pin on Map with pulsating ring
    const userIcon = L.divIcon({
      className: 'custom-user-address-marker',
      html: `
        <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 32px; height: 32px; background: rgba(107, 24, 112, 0.25); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 22px; height: 22px; background: #6B1870; border: 2.5px solid #FFD700; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
            <div style="width: 7px; height: 7px; background: #FFD700; border-radius: 50%;"></div>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const userMarker = L.marker([selectedCoords.lat, selectedCoords.lng], {
      icon: userIcon,
    }).addTo(map);

    userMarker.bindPopup(`
      <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4; max-width: 240px;">
        <span style="background: #2C0E38; color: #FFD700; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px; text-transform: uppercase;">📍 Real-Time User Address</span>
        <strong style="color: #1E293B; font-size: 12px; display: block; margin-top: 4px;">${selectedLocationLabel}</strong>
        <span style="color: #059669; font-weight: bold; font-size: 11px;">5 km coverage circle active · ${nearest5KmShops.length} FPS depots in range</span>
      </div>
    `);
    userMarkerRef.current = userMarker;

    // 3. Render FPS Shop Markers
    const shopsLayer = L.layerGroup().addTo(map);
    shopsLayerRef.current = shopsLayer;

    allShopsWithDistance.forEach((shop) => {
      const isWithin5Km = shop.distanceKm <= 5.0;
      const isCurrentlyActive = shop.id === activeShop.id;

      const shopIcon = L.divIcon({
        className: 'custom-shop-marker',
        html: `
          <div style="
            background: ${isCurrentlyActive ? '#D97706' : isWithin5Km ? '#059669' : '#64748B'};
            color: white;
            border: 2px solid white;
            border-radius: 8px;
            padding: 2px 6px;
            font-size: 11px;
            font-weight: bold;
            font-family: monospace;
            box-shadow: 0 2px 5px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
            cursor: pointer;
          ">
            <span>${shop.shopNumber}</span>
            <span style="font-size: 9px; opacity: 0.9;">(${shop.distanceKm}km)</span>
          </div>
        `,
        iconSize: [80, 24],
        iconAnchor: [40, 12],
      });

      const marker = L.marker([shop.coordinates.lat, shop.coordinates.lng], {
        icon: shopIcon,
      }).addTo(shopsLayer);

      const statusBadge = isCurrentlyActive
        ? '<span style="background: #FEF3C7; color: #92400E; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px;">★ Currently Active Depot</span>'
        : isWithin5Km
        ? `<span style="background: #D1FAE5; color: #065F46; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px;">✓ Within 5 km (${shop.distanceKm} km from address)</span>`
        : `<span style="background: #F1F5F9; color: #475569; padding: 2px 6px; border-radius: 4px; font-size: 10px;">Outside 5 km (${shop.distanceKm} km)</span>`;

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4; min-width: 190px;">
          <div style="margin-bottom: 4px;">${statusBadge}</div>
          <strong style="color: #1E293B; font-size: 13px; display: block;">${shop.name}</strong>
          <span style="color: #64748B; font-size: 11px;">${shop.address}</span><br/>
          <span style="color: #475569; font-size: 11px;">Dealer: <strong>${shop.dealerName}</strong> (${shop.phoneNumber})</span><br/>
          <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #059669; font-weight: bold;">${shop.distanceKm} km from your address</span>
            <span style="font-size: 10px; color: #6B1870; font-weight: bold;">${shop.readinessStatus}</span>
          </div>
        </div>
      `);
    });
  }, [selectedCoords, shops, activeShop.id]);

  // Handle Shop Switching / Confirmation
  const handleConfirmShopSwitch = (shop: FPSShop & { distanceKm?: number }) => {
    setTemporaryPortabilityShop(shop.id, shop.distanceKm);
    changeCitizenLocation(shop.id, `ONORC Portability within 5km of ${selectedLocationLabel}`);
    updateSelectedShop(shop.id, true);

    setSuccessBanner({
      shopName: shop.name,
      shopNumber: shop.shopNumber,
      distanceKm: shop.distanceKm,
    });

    speakAloud(
      language === 'kn'
        ? `ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ${shop.name} ಆಯ್ಕೆ ಖಚಿತಪಟ್ಟಿದೆ. ನಿಮ್ಮ ಧಾನ್ಯ ಕೋಟಾ ಈ ಅಂಗಡಿಗೆ ಲಭ್ಯವಿದೆ.`
        : `Fair Price Shop ${shop.name} confirmed under ONORC portability. Allocation synchronized.`,
      language
    );

    setTimeout(() => {
      setSuccessBanner(null);
    }, 6000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-purple-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-[#6B1870] text-[#FFD700] flex items-center justify-center font-bold text-xs shadow-xs">
              <Compass className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-[#2C0E38] font-serif">
              {language === 'kn'
                ? 'ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ಸ್ಥಳ ಬದಲಾವಣೆ (ONORC ಪೋರ್ಟಬಿಲಿಟಿ)'
                : 'Change Distribution Shop (ONORC Location Portability)'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'kn'
              ? 'ನಿಮ್ಮ ಪ್ರಸ್ತುತ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ: ಆ ವಿಳಾಸವನ್ನು ನಕ್ಷೆಯಲ್ಲಿ ಗುರುತಿಸಿ 5 ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿರುವ ಸಮೀಪದ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿಗಳನ್ನು ಪಡೆಯಿರಿ.'
              : 'Enter your real-time address to locate it on the map and discover the nearest Fair Price Shops within 5 km.'}
          </p>
        </div>

        {/* Tab switch: Map vs History */}
        <div className="flex items-center gap-1.5 p-1 bg-purple-50 border border-purple-200 rounded-xl self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'map'
                ? 'bg-[#6B1870] text-white shadow-xs'
                : 'text-purple-900 hover:bg-purple-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{language === 'kn' ? 'ನೈಜ ವಿಳಾಸ & 5 ಕಿ.ಮೀ ನಕ್ಷೆ' : 'Real-Time Address & 5 km Map'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-[#6B1870] text-white shadow-xs'
                : 'text-purple-900 hover:bg-purple-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{language === 'kn' ? 'ಹಿಂದಿನ ಆಯ್ಕೆಗಳು' : 'History'}</span>
          </button>
        </div>
      </div>

      {/* SUCCESS CONFIRMATION BANNER */}
      {successBanner && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-950 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">
                  {language === 'kn'
                    ? 'ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಯಿಸಲಾಗಿದೆ!'
                    : 'Fair Price Shop Portability Confirmed!'}
                </span>
                <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-900">
                  {successBanner.shopNumber}
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                Active Depot: <strong>{successBanner.shopName}</strong>
                {successBanner.distanceKm !== undefined && ` (${successBanner.distanceKm} km from your real-time address)`}. Your monthly quota has been synchronized.
              </p>
            </div>
          </div>

          {onNavigateToSlotBooking && (
            <button
              type="button"
              onClick={onNavigateToSlotBooking}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all shrink-0"
            >
              <span>{language === 'kn' ? 'ಸ್ಲಾಟ್ ಬುಕಿಂಗ್‌ಗೆ ತೆರಳಿ' : 'Proceed to Slot Booking'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* PART 1: DEFAULT REGISTERED DEPOT CARD */}
      <div className="p-4 sm:p-5 rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50/50 via-white to-purple-50/30 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2C0E38] text-[#FFD700] flex items-center justify-center shrink-0 shadow-inner">
              <Store className="w-4 h-4 text-[#FFD700]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-[#6B1870] bg-purple-100 px-2 py-0.5 rounded">
                  {defaultShop.shopNumber}
                </span>
                <span className="text-[10px] font-bold bg-[#2C0E38] text-[#FFD700] px-2 py-0.5 rounded-full">
                  Your Permanent Default Registered Location
                </span>
              </div>
              <h4 className="font-bold text-sm sm:text-base text-slate-900 font-serif mt-0.5">
                {defaultShop.name}
              </h4>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="self-start sm:self-center">
            {!isTemporaryPortabilityActive ? (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Selected & Active for This Month</span>
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
                Registered Default (Will auto-restore next month)
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
          <div>
            <span className="text-slate-400 block text-[11px]">Address:</span>
            <span className="font-medium text-slate-800">{defaultShop.address}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Ward & Taluk:</span>
            <span className="font-medium text-slate-800">{defaultShop.ward} · {defaultShop.district}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Authorized Dealer:</span>
            <span className="font-medium text-slate-800">{defaultShop.dealerName} ({defaultShop.phoneNumber})</span>
          </div>
        </div>

        {/* If temporary portability is currently active, show it clearly */}
        {isTemporaryPortabilityActive && activePortabilityShop && (
          <div className="mt-3 p-3.5 bg-amber-50/90 border border-amber-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <Compass className="w-5 h-5 text-[#6B1870] shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-[#2C0E38]">
                    Active Temporary Portability Selection ({citizen.temporaryPortabilityMonth || 'October 2026'}):
                  </span>
                  <span className="font-mono text-[11px] font-bold text-[#6B1870] bg-white px-2 py-0.5 rounded border border-amber-200">
                    {activePortabilityShop.shopNumber}
                  </span>
                </div>
                <p className="text-slate-700 text-xs mt-0.5">
                  <strong>{activePortabilityShop.name}</strong> · {activePortabilityShop.address} (Dealer: {activePortabilityShop.dealerName})
                </p>
                <p className="text-[11px] text-amber-900 font-medium mt-0.5">
                  * Valid for this month only under ONORC rules. Next month your allocation automatically reverts to {defaultShop.name}.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                revertToDefaultLocation();
                updateSelectedShop(defaultShop.id, false);
                setSuccessBanner({
                  shopName: defaultShop.name,
                  shopNumber: defaultShop.shopNumber,
                });
                speakAloud(
                  language === 'kn'
                    ? 'ಮೂಲ ಖಾಯಂ ಅಂಗಡಿಗೆ ಹಿಂತಿರುಗಿಸಲಾಗಿದೆ!'
                    : 'Reverted back to default registered ration location!',
                  language
                );
              }}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-2xs transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#6B1870]" />
              <span>Revert to Default Location</span>
            </button>
          </div>
        )}

        {/* Keep Default Button */}
        {isTemporaryPortabilityActive && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                revertToDefaultLocation();
                updateSelectedShop(defaultShop.id, false);
                setSuccessBanner({
                  shopName: defaultShop.name,
                  shopNumber: defaultShop.shopNumber,
                });
              }}
              className="w-full py-2.5 bg-purple-50 hover:bg-purple-100 text-[#6B1870] border border-purple-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-[#6B1870]" />
              <span>Keep Default Registered Location: {defaultShop.name} ({defaultShop.shopNumber})</span>
            </button>
          </div>
        )}
      </div>

      {/* PART 2: REAL-TIME USER ADDRESS INTAKE & 5 KM MAP ANALYSIS */}
      {activeTab === 'map' && (
        <div className="space-y-5">
          {/* REAL-TIME ADDRESS INTAKE CARD */}
          <div className="bg-white border-2 border-purple-300 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-[#2C0E38] font-serif text-base flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-[#6B1870]" />
                  <span>
                    {language === 'kn'
                      ? 'ನಿಮ್ಮ ನೈಜ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ (5 ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿಯ ಅಂಗಡಿಗಳು)'
                      : 'Enter Your Real-Time Address to Find Nearest 5 km Shops'}
                  </span>
                </h4>
                <p className="text-xs text-slate-500">
                  {language === 'kn'
                    ? 'ನಿಮ್ಮ ವಾಸದ ಮನೆ/ಪ್ರಸ್ತುತ ರಸ್ತೆ ಅಥವಾ ಬಡಾವಣೆಯ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ. ಆ ವಿಳಾಸವನ್ನು ನಕ್ಷೆಯಲ್ಲಿ ಗುರುತಿಸಿ ಹತ್ತಿರದ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿಗಳನ್ನು ಶಿಫಾರಸು ಮಾಡಲಾಗುತ್ತದೆ.'
                    : 'Provide your real-time residential address, street, or landmark. We locate it on the map and calculate all Fair Price Shops within 5 km.'}
                </p>
              </div>

              {/* GPS Live Detect Button */}
              <button
                type="button"
                onClick={handleDetectGps}
                disabled={isDetectingGps}
                className="px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-[#6B1870] border border-purple-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 disabled:opacity-60 shadow-2xs"
              >
                <LocateFixed className={`w-4 h-4 text-[#6B1870] ${isDetectingGps ? 'animate-spin' : ''}`} />
                <span>{isDetectingGps ? 'Detecting Live Address...' : 'Detect My Live Address (GPS)'}</span>
              </button>
            </div>

            {/* REAL-TIME ADDRESS INPUT FORM */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGeocodeAddress(inputAddress);
              }}
              className="space-y-3"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <MapPin className="w-5 h-5 text-[#6B1870] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={inputAddress}
                    onChange={(e) => setInputAddress(e.target.value)}
                    placeholder="Enter street, cross, landmark, locality in Bengaluru (e.g., 15th Cross Malleshwaram, Sadashivanagar Circle, Rajajinagar)..."
                    className="w-full pl-11 pr-10 py-3 bg-purple-50/40 border-2 border-purple-200 focus:border-[#6B1870] rounded-xl text-xs sm:text-sm font-sans font-medium focus:outline-none focus:bg-white transition-all shadow-inner"
                  />
                  {inputAddress && (
                    <button
                      type="button"
                      onClick={() => setInputAddress('')}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isGeocoding || !inputAddress.trim()}
                  className="px-5 py-3 bg-[#6B1870] hover:bg-[#57135C] active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all shrink-0 disabled:opacity-50"
                >
                  {isGeocoding ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#FFD700]" />
                      <span>Locating Address...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 text-[#FFD700]" />
                      <span>Locate on Map & Find 5 km Shops</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status and feedback messages */}
              {geocodingMessage && (
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{geocodingMessage}</span>
                </div>
              )}

              {gpsError && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{gpsError}</span>
                </div>
              )}

              {/* Quick Landmark Address Chips */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {language === 'kn' ? 'ತ್ವರಿತ ಸ್ಥಳೀಯ ವಿಳಾಸಗಳು:' : 'Quick Select Real-Time Localities:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {BENGALURU_LANDMARK_GAZETTEER.slice(0, 8).map((loc) => (
                    <button
                      key={loc.name}
                      type="button"
                      onClick={() => {
                        setInputAddress(loc.name);
                        handleGeocodeAddress(loc.name);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-purple-200 bg-white hover:bg-purple-50 text-slate-700 hover:border-purple-300 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3 text-[#6B1870]" />
                      <span>{loc.name.split(',')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </form>

            {/* Current Located Address Confirmation Card */}
            <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-[#6B1870] border-2 border-[#FFD700] shrink-0 animate-pulse" />
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">
                    📍 Located Address on Map:
                  </span>
                  <strong className="text-slate-900 font-serif text-xs sm:text-sm">
                    {selectedLocationLabel}
                  </strong>
                </div>
              </div>
              <span className="text-[11px] font-mono text-purple-900 bg-white px-2.5 py-1 rounded-md border border-purple-200 self-start sm:self-center">
                Coordinates: {selectedCoords.lat.toFixed(4)}, {selectedCoords.lng.toFixed(4)}
              </span>
            </div>

            {/* THE INTERACTIVE LEAFLET MAP WITH LOCATED ADDRESS PIN & 5 KM RADIUS */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-purple-200 shadow-sm">
              <div
                ref={mapContainerRef}
                style={{ height: '390px', width: '100%', zIndex: 1 }}
              />

              {/* Map Floating Legend */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-md text-[11px] z-10 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#6B1870] border-2 border-[#FFD700]" />
                  <span className="font-bold text-slate-900">Your Located Real-Time Address</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-600" />
                  <span className="font-semibold text-slate-800">
                    Within 5 km Coverage Radius ({nearest5KmShops.length} FPS depots)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-400" />
                  <span className="text-slate-500">Beyond 5 km Boundary</span>
                </div>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                  * Tip: Click anywhere on the map to pin that location and recalculate nearest 5 km shops
                </div>
              </div>
            </div>
          </div>

          {/* REAL-TIME 5 KM NEAREST FAIR PRICE SHOPS RECOMMENDATIONS */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-purple-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#6B1870]" />
                <h4 className="font-bold text-[#2C0E38] font-serif text-base">
                  {language === 'kn'
                    ? `ನಿಮ್ಮ ವಿಳಾಸದಿಂದ 5 ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿಯ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿಗಳು (${nearest5KmShops.length})`
                    : `Nearest Fair Price Shops Within 5 km of Your Address (${nearest5KmShops.length})`}
                </h4>
              </div>

              {/* Sub-search inside 5km results */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={shopFilterQuery}
                  onChange={(e) => setShopFilterQuery(e.target.value)}
                  placeholder="Filter by shop name, dealer..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#6B1870]"
                />
              </div>
            </div>

            {/* List of Recommended Shops within 5 km */}
            {displayed5KmShops.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayed5KmShops.map((shop) => {
                  const isCurrentlyActive = shop.id === activeShop.id;
                  const estWalkingMins = Math.max(2, Math.round(shop.distanceKm * 12));
                  const estTransitMins = Math.max(1, Math.round(shop.distanceKm * 4));

                  return (
                    <div
                      key={shop.id}
                      className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                        isCurrentlyActive
                          ? 'border-[#6B1870] bg-purple-50/60 shadow-md ring-1 ring-[#6B1870]'
                          : 'border-purple-100 bg-white hover:border-purple-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="space-y-2">
                        {/* Distance Badge & Status */}
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
                            <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                            <span>{shop.distanceKm} km from your address</span>
                            <span className="text-[10px] text-emerald-800 font-normal">
                              (~{estWalkingMins}m walk / ~{estTransitMins}m drive)
                            </span>
                          </span>

                          {isCurrentlyActive ? (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#6B1870] text-[#FFD700] uppercase">
                              ★ Currently Active
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[#6B1870]">
                              ONORC Eligible (≤5km)
                            </span>
                          )}
                        </div>

                        {/* Shop Header */}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {shop.shopNumber}
                            </span>
                            <span className="text-[11px] font-bold text-emerald-700">
                              ✓ {shop.readinessStatus} Stock Ready
                            </span>
                          </div>
                          <h5 className="font-bold text-slate-900 font-serif text-sm sm:text-base mt-1">
                            {shop.name}
                          </h5>
                          <p className="text-xs text-slate-600 mt-0.5">{shop.address}</p>
                        </div>

                        {/* Details */}
                        <div className="pt-2 border-t border-purple-50 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Dealer:</span>
                            <span className="font-medium text-slate-800">{shop.dealerName}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Contact:</span>
                            <a
                              href={`tel:${shop.phoneNumber}`}
                              className="font-mono font-medium text-[#6B1870] hover:underline"
                            >
                              {shop.phoneNumber}
                            </a>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Ward & Taluk:</span>
                            <span className="font-medium text-slate-800">{shop.ward}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Distribution Window:</span>
                            <span className="font-medium text-slate-800">
                              {shop.distributionStarted ? 'Open for Tokens' : 'Days 11–25'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-4 pt-3 border-t border-purple-100 flex items-center justify-between gap-3">
                        <span className="text-[11px] text-slate-500 font-medium">
                          Anna Bhagya Portability
                        </span>

                        {isCurrentlyActive ? (
                          <div className="px-3.5 py-1.5 rounded-xl bg-purple-100 text-[#6B1870] text-xs font-bold flex items-center gap-1.5">
                            <Check className="w-4 h-4 text-[#6B1870]" />
                            <span>Active Distribution Depot</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleConfirmShopSwitch(shop)}
                            className="px-4 py-2 bg-[#6B1870] hover:bg-[#57135C] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all hover:scale-102"
                          >
                            <span>Switch to this FPS Depot</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#FFD700]" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* No shops found strictly within 5 km of entered address */
              <div className="p-6 bg-amber-50/80 border-2 border-amber-300 rounded-2xl text-center space-y-3 font-sans">
                <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
                <h5 className="font-bold text-amber-950 font-serif text-base">
                  No Fair Price Shops Found Within 5 km of this Address
                </h5>
                <p className="text-xs text-amber-800 max-w-md mx-auto">
                  The address "{selectedLocationLabel}" has no registered Fair Price Shops within 5 km radius.
                  {nearestOverall && (
                    <> The nearest available depot is <strong>{nearestOverall.name}</strong> ({nearestOverall.distanceKm} km away).</>
                  )}
                </p>
                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const defaultAddr = '15th Cross, Sampige Road, Malleshwaram, Bengaluru';
                      setInputAddress(defaultAddr);
                      handleGeocodeAddress(defaultAddr);
                    }}
                    className="px-4 py-2 bg-[#6B1870] hover:bg-[#57135C] text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Reset to Malleshwaram Address
                  </button>
                  {nearestOverall && (
                    <button
                      type="button"
                      onClick={() => handleConfirmShopSwitch(nearestOverall)}
                      className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Select Nearest Depot ({nearestOverall.distanceKm} km)
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PART 3: PORTABILITY HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="bg-white border border-purple-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h4 className="font-bold text-[#2C0E38] font-serif text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#6B1870]" />
              <span>Previous Portability Locations & Selections</span>
            </h4>
            <p className="text-xs text-slate-500">
              Audit log of previous ration shops chosen under ONORC location portability.
            </p>
          </div>

          {citizen.portabilityHistory && citizen.portabilityHistory.length > 0 ? (
            <div className="space-y-3">
              {citizen.portabilityHistory.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-4 rounded-xl border border-purple-100 bg-purple-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#6B1870] bg-white px-2 py-0.5 rounded border border-purple-200">
                        {item.shopNumber}
                      </span>
                      <strong className="text-slate-900">{item.shopName}</strong>
                      <span className="text-[10px] text-slate-500">({item.month})</span>
                    </div>
                    <p className="text-slate-600 mt-1">{item.address} · Ward {item.ward}</p>
                    <span className="text-[10px] text-slate-400">Selected at: {item.selectedAt}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const found = shops.find((s) => s.id === item.fpsId);
                      if (found) {
                        handleConfirmShopSwitch(found);
                      }
                    }}
                    className="px-3.5 py-1.5 bg-[#6B1870] hover:bg-[#57135C] text-white rounded-lg text-xs font-bold cursor-pointer shrink-0"
                  >
                    Select Again
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 bg-purple-50/30 rounded-xl border border-purple-100">
              <Compass className="w-8 h-8 text-[#6B1870] mx-auto opacity-40 mb-2" />
              <span>No past portability history recorded yet. Enter your real-time address to find nearest depots.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
