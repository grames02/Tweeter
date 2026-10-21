import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface RegisterView {
  displayErrorMessage(message: string): void;
}

export class RegisterPresenter {
  private view: RegisterView;
  private userService: UserService;

  public constructor(view: RegisterView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string,
  ): Promise<[User, AuthToken]> {
    try {
      return await this.userService.register(
        firstName,
        lastName,
        alias,
        password,
        userImageBytes,
        imageFileExtension,
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`,
      );
      throw error;
    }
  }
}
