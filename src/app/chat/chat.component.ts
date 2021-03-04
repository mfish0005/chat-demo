import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";

import { IChat } from "../../model/chat";
import { DataService } from "../data.service";
import { DB } from "../db.service";
import * as algoliasearch from 'algoliasearch/lite';
import { IFrom } from '../../model/from';
import { User } from '../../model/user.model';

const searchClient = algoliasearch(
    'CR233H27JT',
    '49993399bd441fd744221fb04df275a7'
)

const index = searchClient.initIndex('dev_USERS');

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"],
})
export class ChatComponent implements AfterViewInit {
  public model: IChat;
  public chats;
  public user;
  public names: string[] = [];
  public selectedUser: User = {firstName: '', lastName: '', email: '', thumbnailUrl: '', username: ''};
  private fbChatSub;

  @ViewChild("chatStream") public container: ElementRef;

  resetModel() {
    this.model = {} as IChat;
  }

  constructor(private dataSvc: DataService, private firebase: DB) {
    this.dataSvc.getUser().subscribe((res: any) => {
      this.user = res.results[0];
    });

    this.resetModel();
  }

  getUserFromAlgolia(event): void {
    console.log(event)

    // Only proceed if an @ symbol was typed
    if (!event.query.includes('@')) {
      return;
    }

    let names: string[] = [];

    index.search(
      {
        query: event.query,
      }
    ).then(({ hits }) => {
      console.log(hits);
      hits.forEach(hit => {
        names.push('@' + hit.login.username);
      })
    }).then(() => {
      this.names = names;
    }
    );
  }

  onUserSelected(event) {
    index.search(
      {
        query: event.split('@')[1]
      }
    ).then(({ hits } ) => {
      this.selectedUser = {
        firstName: hits[0].name.first,
        lastName: hits[0].name.last,
        email: hits[0].email,
        username: hits[0].login.username,
        thumbnailUrl: hits[0].picture.thumbnail
      }
    });
  }

  sendMessage(): void {
    console.log(this.model);
  }

  /**
   * Scroll the chat control to the bottom per stand UX expectations
   */
  scrollToBottom(): void {
    if (this.container) {
      this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
    }
  }

  /**
   * Load chats, etc.
   */
  ngAfterViewInit() {
    this.firebase.firestore
      .collection("chat")
      .orderBy("dateCreatedUnix")
      //.limit(20)
      .onSnapshot(
        (snap) => {
          this.chats = [];
          snap.forEach((doc) => {
            this.chats.push(doc.data());
          });
          // timeout to give chats time to load
          setTimeout(() => {
            this.scrollToBottom();
          }, 300);
        },
        (error) => {
          console.log("Error loading chats", error);
        }
      );
  }

  /**
   * Handle user submitting chat
   */
  onSubmit() {
    if (this.model.text != "" && this.model.text != undefined) {
      this.model.dateCreatedUnix = Date.now();
      this.model.from = this.user;
      this.firebase.firestore.collection("chat").add(this.model);
      this.resetModel();
      this.scrollToBottom();
    }
  }

  /**
   * track by for chats
   * @param index
   * @param item
   */
  public tracker(index, item): any {
    return item.$id;
  }

  /**
   * Clean up
   */
  ngOnDestroy() {
    this.fbChatSub();
  }
}
