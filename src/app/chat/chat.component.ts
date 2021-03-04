import { UserService } from './../user.service';
import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";

import { IChat } from "../../model/chat";
import { DB } from "../db.service";
import { User } from '../../model/user.model';

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"],
})
export class ChatComponent implements AfterViewInit {
  public model: IChat;
  public chats;
  public author;
  public names: string[] = [];
  public users: User[];
  public selectedUser: User = { firstName: '', lastName: '', email: '', thumbnailUrl: '', username: '' };
  private fbChatSub;
  private message: string;

  @ViewChild("chatStream") public container: ElementRef;

  resetModel() {
    this.model = {} as IChat;
    this.selectedUser = {} as User;
    this.message = '';
  }

  constructor(private userService: UserService, private firebase: DB) {
    this.userService.getRandomUser().subscribe((res: any) => {
      this.author = res.results[0];
    });

    this.resetModel();
  }

  searchUsers(event): void {
    if (!event.query.includes('@')) {
      return;
    } else if (this.selectedUser.username === event.query) {
      this.message = event.query;
    }

    this.userService.queryUsers(event.query).then(users => {
      this.users = users;
    });
  }

  onUserSelected(event) {
    this.selectedUser = event;
    this.selectedUser.username = '@' + this.selectedUser.username;
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
    if (this.message != undefined && this.message != '') {
      this.model.dateCreatedUnix = Date.now();
      this.model.from = this.author;
      this.model.text = this.message;
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
