// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBW3An2RzVXXeNWAft1a1QJCSPOEYQ0D7w',
    authDomain: 'ngh-awesome-list.firebaseapp.com',
    databaseURL: 'https://ngh-awesome-list.firebaseio.com',
    projectId: 'ngh-awesome-list',
    storageBucket: 'ngh-awesome-list.appspot.com',
    messagingSenderId: '253843389710',
    appId: '1:253843389710:web:1bbea19b56332f7c9d6b5f',
    measurementId: 'G-1SGDE98VBC',
    auth: {
      baseURL: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty'
    },
    firestore: {
      baseURL :
        'https://firestore.googleapis.com/v1/projects/ngh-awesome-list/databases/(default)/documents'
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
