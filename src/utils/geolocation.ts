import Geolocation from 'react-native-geolocation-service';
import {
  DispatchType,
  GeolocationApiType,
  GeolocationType,
} from '../customTypes/context';

export function getInitialPosition(dispatch: DispatchType): undefined {
  // get initial location data:
  Geolocation.getCurrentPosition(
    (position) => {
      if (!position.coords) return console.log('no coordinates were passed');
      dispatch({
        type: 'ADD_INITIAL_GPS',
        payload: {
          coords: position.coords,
        },
      });
    },
    (error) => {
      // See error code charts below.
      console.log(error.code, error.message);
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
  );
  return;
}

export const WATCH_OPTIONS = {
  enableHighAccuracy: true,
  distanceFilter: 1,
  useSignificantChanges: true,
};

// TODO: somehow updating routelocations stopped happening
export function handleSuccessfulWatch(
  position: GeolocationApiType,
  currentCoords: GeolocationType | null,
  dispatch: DispatchType,
): undefined {
  if (
    currentCoords?.latitude == position.coords.latitude &&
    currentCoords?.longitude == position.coords.longitude
  ) {
    console.log('inside watch cb, ', currentCoords);
    return;
  }
  dispatch({
    type: 'UPDATE_COORDS',
    payload: {
      coords: position.coords,
    },
  });
}
