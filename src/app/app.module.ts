import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { environment } from "../environments/environment";
import { ChatComponent } from "./chat/chat.component";
import { DB } from "./db.service";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { NgAisModule } from 'angular-instantsearch';

@NgModule({
  imports: [BrowserModule, HttpClientModule, FormsModule, BrowserAnimationsModule, AutoCompleteModule, NgAisModule.forRoot()],
  providers: [DB],
  declarations: [AppComponent, ChatComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
