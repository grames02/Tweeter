import { UserItemPresenter } from "./UserItemPresenter";
import { AuthToken } from "tweeter-shared";

export class UserNavigationPresenter extends UserItemPresenter {
  public loadMoreItems(authToken: AuthToken, userAlias: string): void {}
}
