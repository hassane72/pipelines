export const environment = {
  production: true,
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
      baseURL:
        'https://firestore.googleapis.com/v1/projects/ngh-awesome-list/databases/(default)/documents'
    }
  }
};
