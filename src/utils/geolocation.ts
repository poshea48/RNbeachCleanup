import Geolocation from 'react-native-geolocation-service';
import { DispatchType, GeolocationApiType } from '../customTypes/context';

export function getInitialPosition(dispatch: DispatchType): undefined {
  // get initial location data:
  Geolocation.getCurrentPosition(
    (position) => {
      if (!position.coords) return console.log('no coordinates were passed');
      dispatch({
        type: 'ADD_INITIAL_GPS',
        payload: {
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
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
  distanceFilter: 10,
  // useSignificantChanges: true, //***********  This was the problem with routeCoordinates not updating ****************/
};

export function handleSuccessfulWatch(
  position: GeolocationApiType,
  dispatch: DispatchType,
): undefined {
  dispatch({
    type: 'UPDATE_COORDS',
    payload: {
      coords: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    },
  });
  return;
}
