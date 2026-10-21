import { AuthToken, User } from "tweeter-shared";
import { LoginService } from "../model.service/LoginService";

export interface LoginView {
  displayErrorMessage(message: string): void;
}

export class LoginPresenter {
  private view: LoginView;
  private loginService: LoginService;

  public constructor(view: LoginView) {
    this.view = view;
    this.loginService = new LoginService();
  }

  public async login(
    alias: string,
    password: string,
  ): Promise<[User, AuthToken] | null> {
    try {
      return await this.loginService.login(alias, password);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`,
      );
      return null;
    }
  }
}
