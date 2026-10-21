import { AuthToken, Status, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { StatusService } from "../model.service/StatusService";

export interface StatusItemView {
  addItems(items: Status[]): void;
  displayErrorMessage(message: string): void;
}

export abstract class StatusItemPresenter {
  private _view: StatusItemView;
  protected service: StatusService;
  private _hasMoreItems = true;
  private _lastItem: Status | null = null;
  private _userService: UserService;

  protected constructor(view: StatusItemView) {
    this._view = view;
    this.service = new StatusService();
    this._userService = new UserService();
  }

  protected get view(): StatusItemView {
    return this._view;
  }

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  protected get lastItem(): Status | null {
    return this._lastItem;
  }

  protected set lastItem(value: Status | null) {
    this._lastItem = value;
  }

  public reset(): void {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  public getUser = async (authToken: AuthToken, alias: string) => {
    return this._userService.getUser(authToken, alias);
  };

  public abstract loadMoreItems(
    authToken: AuthToken,
    userAlias: string,
  ): Promise<void>;
}
