// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
  	apiKey: "AIzaSyCT5kZYZ5BFXcUxIfY5Oqkog7N63lWeL1o",
    authDomain: "sketchdeck-demo-chat.firebaseapp.com",
    databaseURL: "https://sketchdeck-demo-chat.firebaseio.com",
    projectId: "sketchdeck-demo-chat",
    storageBucket: "sketchdeck-demo-chat.appspot.com",
    messagingSenderId: "270356515076"
  }
};
