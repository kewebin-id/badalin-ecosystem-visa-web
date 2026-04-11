export interface MapsProps {
  position?: [number, number];
  zoom?: number;
  popUpText?: string;
  className?: string;
  setChoosenLocation?: (data: ILonLat) => void;
  choosenLocation?: ILonLat;
}

export interface ILonLat {
  lon: string;
  lat: string;
  display_name: string;
  name?: string;
}

export interface IInteractiveMapProps {
  initialPosition?: [number, number];
  initialZoom?: number;
  className?: string;
}
