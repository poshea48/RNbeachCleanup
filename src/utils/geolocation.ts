import Geolocation from 'react-native-geolocation-service';
import { DispatchType } from '../customTypes/context';

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

export function watchPosition(
  dispatch: DispatchType,
  watchId: number | null,
): undefined {
  if (watchId) {
    Geolocation.clearWatch(watchId);
    dispatch({
      type: 'REMOVE_WATCH_ID',
    });
  } else {
    watchId = Geolocation.watchPosition(
      (position) => {
        dispatch({
          type: 'UPDATE_COORDS',
          payload: {
            coords: position.coords,
          },
        });
      },
      (error) => console.log(error),
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
      },
    );
    dispatch({
      type: 'ADD_WATCH_ID',
      payload: {
        watchId,
      },
    });
  }

  return;
}
