import { AuthToken, User } from "tweeter-shared";
import { LogoutService } from "../model.service/LogoutService";

export interface LogoutView {
  displayErrorMessage(message: string): void;
}

export class LogoutPresenter {
  private view: LogoutView;
  private logoutService: LogoutService;

  public constructor(view: LogoutView) {
    this.view = view;
    this.logoutService = new LogoutService();
  }

  public async logout(
    alias: string,
    password: string,
  ): Promise<[User, AuthToken] | null> {
    try {
      return await this.logoutService.logOut(alias, password);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`,
      );
      return null;
    }
  }
}
