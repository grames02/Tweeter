import { LoginService } from "../model.service/LoginService";
import type { KeyboardEvent } from "react";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View {
  displayErrorMessage(message: string): void;
}

export class LoginPresenter extends Presenter<LoginView> {
  private loginService: LoginService;

  public constructor(view: LoginView) {
    super(view);
    this.loginService = new LoginService();
  }

  public async login(alias: string, password: string) {
    this.doFailureReportingOperation(async () => {
      await this.loginService.login(alias, password);
    }, "log user in");
  }

  public loginOnEnter = (
    event: KeyboardEvent<HTMLElement>,
    submitDisabled: boolean,
    submit: () => void | Promise<void>,
  ): void => {
    if (event.key === "Enter" && !submitDisabled) {
      event.preventDefault();
      void submit();
    }
  };
}
