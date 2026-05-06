'use client';

import { Locate, Search } from 'lucide-react';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import 'ol/ol.css';
import { fromLonLat, toLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { IInteractiveMapProps, ILonLat } from './maps';

const classNames = (...classes: (string | boolean | undefined | null)[]) => {
  return classes.filter(Boolean).join(' ');
};

const DEFAULT_COORD: [number, number] = [-6.1752804, 106.8252699];
const DEFAULT_ZOOM: number = 15;
const ICON_SRC = 'https://placehold.co/32x32/FF0000/ffffff?text=%2B';

export const InteractiveMap: React.FC<IInteractiveMapProps> = ({
  initialPosition = DEFAULT_COORD,
  initialZoom = DEFAULT_ZOOM,
  className,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [mapInstance, setMapInstance] = useState<Map | null>(null);
  const [vectorSourceInstance, setVectorSourceInstance] = useState<VectorSource | null>(null);
  const [markerFeature, setMarkerFeature] = useState<Feature | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ILonLat[]>([]);
  const [loading, setLoading] = useState(false);

  const createMarkerStyle = useCallback(() => {
    return new Style({
      image: new Icon({
        src: ICON_SRC,
        anchor: [0.5, 1],
        scale: 1.5,
      }),
    });
  }, []);

  const updateMarkerPosition = useCallback(
    (lat: number, lon: number) => {
      if (!mapInstance || !markerFeature || !vectorSourceInstance) return;

      const olCoord = fromLonLat([lon, lat]);

      mapInstance.getView().animate({
        center: olCoord,
        zoom: DEFAULT_ZOOM,
        duration: 500,
      });
    },
    [mapInstance, markerFeature, vectorSourceInstance],
  );

  const searchLocation = useCallback(async (keyword: string) => {
    if (!keyword) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(keyword)}&format=json&limit=10`,
      );

      if (!response.ok) {
        throw new Error('Gagal mengambil data dari Nominatim');
      }

      const json: ILonLat[] = await response.json();
      setSearchResults(json);
    } catch {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchTerm(value);

    if (typingTimer.current) clearTimeout(typingTimer.current);

    typingTimer.current = setTimeout(() => {
      searchLocation(value);
    }, 500);
  };

  const handleSetLocation = (lat: string, lon: string) => {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);

    if (!isNaN(latNum) && !isNaN(lonNum)) {
      updateMarkerPosition(latNum, lonNum);
    }

    setSearchResults([]);

    setSearchTerm('');
  };

  useEffect(() => {
    if (!mapRef.current) return;

    const initialLonLat = [initialPosition[1], initialPosition[0]];
    const initialOlCoord = fromLonLat(initialLonLat);

    const newMarker = new Feature({
      geometry: new Point(initialOlCoord),
    });
    newMarker.setStyle(createMarkerStyle());
    setMarkerFeature(newMarker);

    const vectorSource = new VectorSource({
      features: [newMarker],
    });
    setVectorSourceInstance(vectorSource);

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: vectorSource,
        }),
      ],
      view: new View({
        center: initialOlCoord,
        zoom: initialZoom,
      }),
    });

    setMapInstance(map);

    map.on('click', (e) => {
      const lonLat = toLonLat(e.coordinate);
      const lat = lonLat[1];
      const lon = lonLat[0];

      updateMarkerPosition(lat, lon);
    });

    return () => {
      map.setTarget(undefined);
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, [initialPosition, initialZoom, createMarkerStyle, updateMarkerPosition]);

  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 min-h-screen">
      <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-2xl space-y-4 relative">
        {/* Bagian Pencarian */}
        <div className="relative z-10">
          <div className="flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 bg-white">
            <Search
              className="size-5 text-gray-400 ml-3"
              onClick={() =>
                toast.info(
                  `Coming soon. We're working hard to bring you something amazing. Stay tuned!`,
                )
              }
            />
            <input
              ref={searchInputRef}
              id="search-map"
              type="text"
              placeholder="Cari lokasi di sini..."
              value={searchTerm}
              onChange={handleTyping}
              className="w-full p-3 border-none focus:ring-0 rounded-r-lg text-gray-800 outline-none"
            />
          </div>

          {/* Hasil Pencarian Autocomplete */}
          {loading && (
            <div className="absolute top-full mt-1 w-full p-2 bg-indigo-50 text-indigo-700 rounded-lg shadow-lg">
              Mencari lokasi...
            </div>
          )}
          {searchResults.length > 0 && !loading && (
            <ul className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
              {searchResults.map((result, index) => (
                <li key={index} className="border-b border-gray-100 last:border-b-0">
                  <button
                    onClick={() => handleSetLocation(result.lat, result.lon)}
                    className="w-full text-left p-3 text-gray-700 hover:bg-indigo-50 transition duration-150 flex items-center"
                  >
                    <Locate className="size-4 mr-2 text-indigo-500" />
                    <span className="truncate text-sm">{result.display_name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Komponen Peta (render-map) */}
        <div
          ref={mapRef}
          id="render-map"
          className={classNames(
            'w-full h-[400px] bg-gray-200 rounded-lg shadow-inner border border-gray-200',
            className,
          )}
          aria-label="OpenLayers Map"
        >
          {/* Placeholder teks saat peta belum dimuat */}
          {!mapInstance && (
            <div className="flex items-center justify-center h-full text-gray-500">
              Memuat Peta...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
