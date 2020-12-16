export interface DebrisCollectedType {
  [key: string]: number;
}

export interface LocationState {
  beachName: string;
  city: string;
  state: string;
}

export interface StatsState {
  date?: string;
  startTime?: number;
  endTime?: number;
  totalCollected?: number;
  totalDistance?: number;
  totalTime?: number;
}

export interface TrackerType {
  inUse: boolean;
  // startGPS: {},
  // positions: [],
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
