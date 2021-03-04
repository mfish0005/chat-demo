import { User } from './../model/user.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
  'CR233H27JT',
  '49993399bd441fd744221fb04df275a7'
)

const index = searchClient.initIndex('users');

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getRandomUser() {
    return this.http.get("https://randomuser.me/api/", {
      responseType: "json",
    });
  }

  queryUsers(query: string): Promise<User[]> {
    let users: User[] = [];

    return index.search(
      {
        query: query
      }
    ).then(({ hits }) => {
      hits.forEach(hit => {
        const user: User = {
          firstName: hit.user.name.first,
          lastName: hit.user.name.last,
          email: hit.user.email,
          thumbnailUrl: hit.user.picture.thumbnail,
          username: hit.user.login.username
        }
        users.push(user);
      })
    }).then(() => {
      return users;
    }
    );
  }
}
