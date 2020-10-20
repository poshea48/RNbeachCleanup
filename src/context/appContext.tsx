import React, { createContext, useContext, useReducer } from 'react';
import {
  ActionType,
  AppState,
  DebrisState,
  DispatchType,
} from '../customTypes/context';

const AppStateContext = createContext<AppState | null>(null);
const AppDispatchContext = createContext<DispatchType | null>(null);

const initialState: AppState = {
  started: false,
  finished: false,
  debris: null,
  location: {
    beachName: '',
    city: '',
    state: '',
  },
  stats: {
    date: '',
    startTime: 0,
    endTime: 0,
    totalCollected: 0,
    totalDistance: 0,
    totalTime: 0,
  },
  tracker: {
    inUse: false,
  },
};

const cleanupReducer = (state: AppState, action: ActionType): AppState => {
  const { type, payload } = action;
  switch (type) {
    case 'RESET':
      return {
        ...initialState,
      };
    case 'ADD_DEBRIS':
      if (payload?.debris) {
        const { item } = payload.debris;
        const count = Number(payload.debris.count);
        const debris: DebrisState = { ...state.debris };
        debris[item] ? (debris[item] += count) : (debris[item] = count);
        const oldTotal = state.stats.totalCollected
          ? state.stats.totalCollected
          : 0;
        return {
          ...state,
          debris,
          stats: {
            ...state.stats,
            totalCollected: oldTotal + count,
          },
        };
      } else {
        return { ...state };
      }
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
    case 'START_CLEANUP':
      return {
        ...state,
        started: true,
        stats: {
          ...state.stats,
          ...payload?.stats,
        },
      };
    case 'PAUSE':
      return {
        ...state,
      };
    case 'RESUME':
      return {
        ...state,
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
