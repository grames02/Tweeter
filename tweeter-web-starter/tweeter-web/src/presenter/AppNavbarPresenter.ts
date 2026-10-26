import { AuthToken } from "tweeter-shared";
import { AppNavbarService as AppNavbarService } from "../model.service/AppNavbarService";
import { Presenter, View } from "./Presenter";

export interface AppNavbarView extends View {
  displayErrorMessage(message: string): void;
}

export abstract class AppNavbarPresenter extends Presenter<AppNavbarView> {
  private logoutService: AppNavbarService;

  protected constructor(view: AppNavbarView) {
    super(view);
    this.logoutService = new AppNavbarService();
  }

  public async logout(authToken: AuthToken) {
    this.doFailureReportingOperation(async () => {
      await this.logoutService.logout(authToken);
    }, "logout users");
  }
}
