export interface DebrisCollectedType {
  [key: string]: number;
}

export interface LocationState {
  beachName: string;
  city: string;
  state: string;
}

export interface StatsState {
  date: string;
  initialStartTime: number;
  currentStartTime: number;
  endTime: number;
  totalTime: number;
  totalCollected: number;
  totalDistance: number;
}

export interface GeolocationType {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

export interface TrackerType {
  inUse: boolean;
  startGPS: GeolocationType | null;
  positions: [GeolocationType] | null;
  // watchId: null,
}

export interface AppState {
  started: boolean;
  finished: boolean;
  debrisCollected: null | DebrisCollectedType;
  debrisList: string[];
  location: LocationState;
  stats: StatsState;
  tracker: TrackerType;
}

export interface PayloadType {
  started?: boolean;
  finished?: boolean;
  debris?: { item: string; count: number };
  location?: LocationState;
  stats?: StatsState;
  tracker?: TrackerType;
}

export interface ActionType {
  type: string;
  payload?: PayloadType;
}

export type DispatchType = (action: ActionType) => void;
