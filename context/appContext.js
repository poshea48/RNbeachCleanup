import React, { createContext, useContext, useReducer } from 'react';

const AppStateContext = createContext();
const AppDispatchContext = createContext();

const initialState = {
  started: false,
  finished: false,
  debris: {},
  location: {
    beachName: '',
    city: '',
    state: '',
  },
  stats: {
    date: '',
    startTime: null,
    endTime: null,
    totalCollected: 0,
    totalDistance: 0,
    totalTime: 0,
  },
  tracker: {
    inUse: false,
    startGPS: {},
    positions: [],
    watchId: null,
  },
};

const cleanupReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'RESET':
      return {
        ...initialState,
      };
    case 'ADD_DEBRIS':
      const { item } = payload.debris;
      const count = Number(payload.debris.count);
      let debris = { ...state.debris };
      debris[item] ? (debris[item] += count) : (debris[item] = count);
      return {
        ...state,
        debris,
        totalCollected: state.totalCollected + count,
      };
    case 'ADD_START_LOCATION':
      return {
        ...state,
        tracker: {
          ...state.tracker,
          ...payload.tracker,
        },
      };
    case 'START_CLEANUP':
      return {
        ...state,
        started: true,
        stats: {
          ...state.stats,
          ...payload.stats,
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

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cleanupReducer, initialState);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used with an AppProvider');
  }
  return context;
};

const useAppDispatch = () => {
  const context = useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used with an AppProvider');
  }
  return context;
};

export { AppProvider, useAppState, useAppDispatch };
