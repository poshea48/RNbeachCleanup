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
  latitude: number;
  longitude: number;
}

export interface TrackerType {
  inUse: boolean;
  currentCoordinates: GeolocationType | null;
  prevCoordinates: GeolocationType | null;
  routeCoordinates: [GeolocationType] | null;
  watchId: number | null;
}

export interface AppState {
  started: boolean;
  finished: boolean;
  dataSubmitted: boolean;
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
