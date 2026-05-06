'use client';

import { Button, NotFoundComp, Spinner } from '@/components/atoms';
import styles from '@/shared/styles/components/maps.module.css';
import { cn } from '@/shared/utils';
import { LocateFixed } from 'lucide-react';
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
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { InputTextSearch } from '../input/search';
import { ILonLat, MapsProps } from './maps';

export const Maps = ({
  position = [-7.495054, 112.721398],
  zoom = 12,
  className,
  setChoosenLocation,
  choosenLocation,
}: MapsProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const [searchResults, setSearchResults] = useState<ILonLat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>();
  const [location, setLocation] = useState<ILonLat>();

  const mapInstanceRef = useRef<Map | null>(null);
  const vectorSourceRef = useRef<VectorSource | null>(null);

  const updateMarkerPosition = useCallback(
    (lat: number, lon: number) => {
      const mapInstance = mapInstanceRef.current;
      const vectorSource = vectorSourceRef.current;
      if (!mapInstance || !vectorSource) return;

      const coord = fromLonLat([lon, lat]);
      vectorSource.clear();

      const newMarker = new Feature({
        geometry: new Point(coord),
      });

      newMarker.setStyle(
        new Style({
          image: new Icon({
            src: '/assets/images/pin-red-sized.svg',
            height: 50,
            width: 50,
            anchor: [0.5, 1],
          }),
        }),
      );

      vectorSource.addFeature(newMarker);

      mapInstance.getView().animate({
        center: coord,
        duration: 700,
        zoom,
      });
    },
    [zoom],
  );

  useEffect(() => {
    if (!mapRef.current) return;

    const initialCoord = fromLonLat([
      Number((location || choosenLocation)?.lon ?? position[1]),
      Number((location || choosenLocation)?.lat ?? position[0]),
    ]);

    const vectorSource = new VectorSource();
    vectorSourceRef.current = vectorSource;

    const marker = new Feature({ geometry: new Point(initialCoord) });
    marker.setStyle(
      new Style({
        image: new Icon({
          src: '/assets/images/pin-red-sized.svg',
          height: 50,
          width: 50,
          anchor: [0.5, 1],
        }),
      }),
    );
    vectorSource.addFeature(marker);

    const vectorLayer = new VectorLayer({ source: vectorSource });

    const map = new Map({
      target: mapRef.current,
      layers: [new TileLayer({ source: new OSM() }), vectorLayer],
      view: new View({
        center: initialCoord,
        zoom,
      }),
    });

    mapInstanceRef.current = map;

    map.on('click', (e) => {
      const [lon, lat] = toLonLat(e.coordinate);
      const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;

      fetch(nominatimUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data?.display_name) {
            setLocation({
              lon: String(lon),
              lat: String(lat),
              display_name: data.display_name,
            });
            updateMarkerPosition(lat, lon);
          }
        })
        .catch(() => {
          toast.error('Failed to get location. Please ensure location permission is enabled.');
        });
    });

    return () => {
      map.setTarget(undefined);
      mapInstanceRef.current = null;
      vectorSourceRef.current = null;
    };
  }, [zoom, position, choosenLocation, location, updateMarkerPosition]);

  const searchLocation = useCallback(async (keyword?: string) => {
    if (!keyword || keyword.length < 3) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(keyword)}&format=json&limit=10`,
      );
      if (!response.ok) throw new Error('Gagal mengambil data dari Nominatim');

      const json: ILonLat[] = await response.json();
      setSearchResults(json);
    } catch {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    searchLocation(search);
  }, [search, searchLocation]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Mohon aktifkan lokasi pada perangkat Anda.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          );
          const data = await res.json();
          if (data?.display_name) {
            setLocation({
              lat: String(latitude),
              lon: String(longitude),
              display_name: data.display_name,
            });
            updateMarkerPosition(latitude, longitude);
          }
        } catch {
          toast.error('Gagal mendapatkan lokasi. Pastikan izin lokasi aktif.');
        }
      },
      () => {
        toast.error('Gagal mendapatkan lokasi. Pastikan izin lokasi aktif.');
      },
      { enableHighAccuracy: true },
    );
  };

  return (
    <div
      ref={mapRef}
      className={cn(className, 'w-full h-[400px] rounded-xl overflow-hidden shadow-md relative')}
    >
      {setChoosenLocation && (
        <>
          <div className={styles.container}>
            <InputTextSearch
              delayDebounce={1000}
              useSuggestion
              search={search || ''}
              setSearch={setSearch}
              placeholder="Search location"
            >
              <div className="space-y-0">
                <div className={styles['current-location']} onClick={handleUseCurrentLocation}>
                  <LocateFixed className="text-primary-default size-5" />
                  <p className="text-dark-default/95 font-semibold text-sm cursor-pointer">
                    Use Current Location
                  </p>
                </div>
                {loading ? (
                  <div className="h-80 w-full flex items-center justify-center">
                    <Spinner variant="primary" message="Memuat data lokasi" />
                  </div>
                ) : (
                  <>
                    {searchResults.length ? (
                      searchResults.map((e, i) => (
                        <div
                          key={`search-${i}`}
                          className={cn(
                            i !== searchResults.length - 1 && 'border-b border-b-gray-200',
                            styles['item-search'],
                          )}
                          onClick={() => {
                            const lat = parseFloat(e.lat);
                            const lon = parseFloat(e.lon);
                            setLocation({
                              display_name: e.display_name,
                              lat: String(lat),
                              lon: String(lon),
                            });
                            updateMarkerPosition(lat, lon);
                          }}
                        >
                          {e.display_name}
                        </div>
                      ))
                    ) : (
                      <NotFoundComp
                        label="Location"
                        message="Search for location by street name or place"
                        className="py-10"
                      />
                    )}
                  </>
                )}
              </div>
            </InputTextSearch>
          </div>
          {(location || choosenLocation) && (
            <div className={cn('box-shadow', styles.footer)}>
              <div>
                {(location || choosenLocation)?.name && (
                  <p className="font-bold text-sm">{(location || choosenLocation)?.name}</p>
                )}
                <p className="text-sm">{(location || choosenLocation)?.display_name}</p>
              </div>
              <Button
                onClick={() => {
                  setChoosenLocation(location || choosenLocation!);
                }}
              >
                Pilih Lokasi
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
