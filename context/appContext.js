import React, { createContext, useContext, useReducer } from 'react';

const AppStateContext = createContext();
const AppDispatchContext = createContext();

const initialState = {
  started: false,
  debris: {},
  location: {
    beachName: '',
    city: '',
    state: '',
  },
  totalCollected: 0,
  totalDistance: 0,
  totalTime: 0,
  currentAction: 'startup',
  startGPS: {},
  positions: [],
  watchId: null,
};

const cleanupReducer = (state, action) => {
  switch (action.type) {
    case 'RESET':
      return {
        ...initialState,
      };
    case 'ADD_DEBRIS':
      const { item } = action.payload.debris;
      const count = Number(action.payload.debris.count);
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
        startGPS: { longitude: action.lng, latitude: action.lat },
      };
    case 'START':
      return {
        ...state,
        startGPS: action.startGPS,
        currentAction: action.action,
        watchId: action.watchId,
      };
    case 'PAUSE':
      return {
        ...state,
        currentAction: action.action,
        totalTime: action.totalTime,
      };

    case 'RESUME':
      return {
        ...state,
        currentAction: action.action,
      };

    case 'FINISHED':
      return {
        ...state,
        currentAction: action.action,
        totalTime: action.totalTime,
        totalDistance: action.distance,
        watchId: null,
      };
    case 'ADD_POSITION':
      return {
        ...state,
        positions: [...state.positions, action.position],
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
