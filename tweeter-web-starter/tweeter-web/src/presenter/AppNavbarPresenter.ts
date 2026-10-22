import { AuthToken } from "tweeter-shared";
import { LogoutService } from "../model.service/AppNavbarService";

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

  public async logout(authToken: AuthToken): Promise<boolean> {
    try {
      await this.logoutService.logout(authToken);
      return true;
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`,
      );
      return false;
    }
  }
}
