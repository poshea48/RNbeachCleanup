import React, { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import {
  ActionType,
  AppState,
  DebrisCollectedType,
  DispatchType,
  GeolocationType,
} from '../customTypes/context';

const AppStateContext = createContext<AppState | null>(null);
const AppDispatchContext = createContext<DispatchType | null>(null);

const DebrisList = [
  'Batteries',
  'Beverage containers-Metal',
  'Beverage containers-Glass',
  'Bottle caps',
  'Cigarette butts',
  'Clothes/Fabrics',
  'Fishing gear - Line/nets/rope',
  'Fishing gear - Floats/buoys',
  'Flip-flops',
  'Food wrappers',
  'Items/pieces - Glass',
  'Items/pieces - Metal',
  'Items/pieces - Plastic',
  'Paper/cardboard',
  'Plastic bags',
  'Six-pack rings',
  'Styrofoam',
  'Other',
];

const initialState: AppState = {
  started: false,
  finished: false,
  dataSubmitted: false,
  debrisCollected: null,
  debrisList: DebrisList,
  location: {
    beachName: '',
    city: '',
    state: '',
  },
  stats: {
    date: '',
    initialStartTime: 0,
    currentStartTime: 0,
    endTime: 0,
    totalTime: 0,
    totalCollected: 0,
    totalDistance: 0,
  },
  tracker: {
    inUse: false,
    initialCoordinates: null,
    currentCoordinates: null,
    prevCoordinates: null,
    routeCoordinates: null,
    watchId: null,
  },
};

async function removeFromLocal() {
  try {
    await AsyncStorage.removeItem('@debrisState');
  } catch (e) {
    // remove error
  }

  console.log('Done.');
}

function stopWatchPostion(watchId: number | null) {
  if (watchId == null) return;
  Geolocation.clearWatch(watchId);
}

const cleanupReducer = (state: AppState, action: ActionType): AppState => {
  const { type, payload } = action;
  switch (type) {
    case 'START_CLEANUP':
      return {
        ...state,
        started: true,
        stats: {
          ...state.stats,
          ...payload?.stats,
        },
        tracker: {
          ...state.tracker,
          ...payload?.tracker,
        },
      };
    case 'END_CLEANUP':
      return {
        ...state,
        finished: true,
        stats: {
          ...state.stats,
          ...payload?.stats,
          currentStartTime: 0,
          totalTime: payload?.stats
            ? Math.floor(
                (payload.stats.endTime - state.stats.currentStartTime) / 1000,
              ) + state.stats.totalTime
            : state.stats.totalTime,
        },
      };
    case 'RESUME_CLEANUP':
      return {
        ...state,
        finished: false,
        stats: {
          ...state.stats,
          ...payload?.stats,
          endTime: 0,
        },
      };

    case 'RESET':
      removeFromLocal();
      stopWatchPostion(state.tracker.watchId);
      return {
        ...initialState,
        tracker: {
          ...initialState.tracker,
          inUse: state.tracker.inUse,
        },
      };
    case 'ADD_ASYNC_STORAGE':
      return {
        ...state,
        ...payload,
      };
    case 'ADD_DEBRIS':
      if (payload?.debris) {
        const { item } = payload.debris;
        const count = Number(payload.debris.count);
        const debrisCollected: DebrisCollectedType = {
          ...state.debrisCollected,
        };
        debrisCollected[item]
          ? (debrisCollected[item] += count)
          : (debrisCollected[item] = count);
        const oldTotal = state.stats.totalCollected
          ? state.stats.totalCollected
          : 0;
        return {
          ...state,
          debrisCollected,
          stats: {
            ...state.stats,
            totalCollected: oldTotal + count,
          },
        };
      } else {
        return { ...state };
      }
    case 'ADD_OTHER_DEBRIS':
      if (payload?.debris) {
        let { item } = payload.debris;
        item = item[0].toUpperCase() + item.slice(1);
        const count = Number(payload.debris.count);
        const debrisCollected: DebrisCollectedType = {
          ...state.debrisCollected,
        };
        const oldTotal = state.stats.totalCollected
          ? state.stats.totalCollected
          : 0;

        // make a copy of debrisList but leave "Other" out in order to keep at the end of list after sorting (will push back in after sorting)
        const debrisList = [...state.debrisList.slice(0, -1)];

        // Add new item to Debris list and sort alphabetically
        debrisList.push(item);
        debrisList.sort();
        debrisList.push('Other');

        // Add item to collected list
        debrisCollected[item] = count;

        return {
          ...state,
          debrisCollected,
          debrisList,
          stats: {
            ...state.stats,
            totalCollected: oldTotal + count,
          },
        };
      } else {
        return { ...state };
      }

    /*********************** GPS reducers **************************/

    case 'ADD_LOCATION':
      return {
        ...state,
        location: {
          ...state.location,
          ...payload?.location,
        },
      };
    case 'ADD_START_LOCATION':
      return {
        ...state,
        tracker: {
          ...state.tracker,
          ...payload?.tracker,
        },
      };
    case 'TOGGLE_GPS':
      return {
        ...state,
        tracker: {
          ...state.tracker,
          inUse: !state.tracker.inUse,
        },
      };
    case 'ADD_INITIAL_GPS':
      const initialCoordinates: GeolocationType = {
        ...payload?.coords,
      } as GeolocationType;
      return {
        ...state,
        tracker: {
          ...state.tracker,
          initialCoordinates,
        },
      };
    case 'UPDATE_COORDS':
      console.log('updating Coords reducer');
      const currentCoords = {
        ...state.tracker.currentCoordinates,
      } as GeolocationType;
      const newCoords = { ...payload?.coords } as GeolocationType;
      const routeCoordinates = state.tracker.routeCoordinates
        ? [...state.tracker.routeCoordinates]
        : [];

      return {
        ...state,
        tracker: {
          ...state.tracker,
          currentCoordinates: newCoords,
          prevCoordinates: currentCoords,
          routeCoordinates: [...routeCoordinates, newCoords] as [
            GeolocationType,
          ],
        },
      };
    case 'ADD_WATCH_ID':
      // == implicitly converts null and undefined to same value
      if (payload?.watchId == null) {
        return {
          ...state,
        };
      }
      console.log('payload.watchId, ', payload.watchId);
      return {
        ...state,
        tracker: {
          ...state.tracker,
          watchId: payload.watchId,
        },
      };
    case 'REMOVE_WATCH_ID':
      return {
        ...state,
        tracker: {
          ...state.tracker,
          watchId: null,
        },
      };

    /*********************** Timer reducers **************************/
    case 'PAUSE_TIMER':
      return {
        ...state,
        stats: { ...state.stats, ...payload?.stats },
        tracker: {
          ...state.tracker,
          watchId: null,
        },
      };
    case 'RESUME_TIMER':
      return {
        ...state,
        stats: { ...state.stats, ...payload?.stats },
      };
    case 'FINISHED':
      return {
        ...state,
      };
    default:
      return state;
  }
};

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cleanupReducer, initialState);

  // get state from local storage, if any
  useEffect(() => {
    AsyncStorage.getItem('@debrisState').then((value) => {
      return (
        value &&
        dispatch({
          type: 'ADD_ASYNC_STORAGE',
          payload: JSON.parse(value),
        })
      );
    });
  }, []);

  // store state to local storage when updated and after initial render
  useEffect(() => {
    AsyncStorage.setItem('@debrisState', JSON.stringify(state));
  }, [state]);
  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

const useAppState = (): AppState => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used with an AppProvider');
  }
  return context;
};

const useAppDispatch = (): DispatchType => {
  const context = useContext(AppDispatchContext);
  if (!context) {
    throw new Error('useAppDispatch must be used with an AppProvider');
  }
  return context;
};

export { AppProvider, useAppState, useAppDispatch };
