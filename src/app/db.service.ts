import { Injectable } from "@angular/core";

import * as firebase from "firebase/app";
import "firebase/firestore";

import { environment } from "../environments/environment";

@Injectable()
export class DB {
  public firestore;

  constructor() {
    const config = {
      apiKey: environment.firebase.apiKey,
      authDomain: environment.firebase.authDomain,
      projectId: environment.firebase.projectId,
    };
    firebase.initializeApp(config);

    this.firestore = firebase.firestore();
  }
}
