import { AuthToken } from "tweeter-shared";
import { AppNavbarService as AppNavbarService } from "../model.service/AppNavbarService";

export interface AppNavbarView {
  displayErrorMessage(message: string): void;
}

export class AppNavbarPresenter {
  private view: AppNavbarView;
  private logoutService: AppNavbarService;

  public constructor(view: AppNavbarView) {
    this.view = view;
    this.logoutService = new AppNavbarService();
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
