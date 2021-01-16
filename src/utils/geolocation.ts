import Geolocation from 'react-native-geolocation-service';
import { DispatchType, GeolocationType } from '../customTypes/context';

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

// TODO: becasue of closure currentCoords will always be the currentCoords when watchPostion is called(usually {0, 0}), gotta figure something out (call context in callback???)
export function watchPosition(
  dispatch: DispatchType,
  watchId: number | null,
  currentCoords: GeolocationType,
): undefined {
  if (watchId) {
    Geolocation.clearWatch(watchId);
    dispatch({
      type: 'REMOVE_WATCH_ID',
    });
  } else {
    watchId = Geolocation.watchPosition(
      (position) => {
        console.log('currentCoords, ', currentCoords);
        if (
          currentCoords.latitude == position.coords.latitude &&
          currentCoords.longitude == position.coords.longitude
        ) {
          console.log('inside watch cb, ', currentCoords.latitude);
          return;
        }
        console.log('watching position');
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
        distanceFilter: 100,
      },
    );
    console.log('this is the watchId, ', watchId);
    dispatch({
      type: 'ADD_WATCH_ID',
      payload: {
        watchId,
      },
    });
  }

  return;
}
