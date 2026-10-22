import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";

export interface UserInfoView {
  displayErrorMessage: (message: string) => void;
}

export class UserInfoPresenter {
  private service: FollowService;
  private view: UserInfoView;

  public constructor(view: UserInfoView) {
    this.view = view;
    this.service = new FollowService();
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ): Promise<boolean> {
    try {
      return await this.service.getIsFollowerStatus(
        authToken,
        currentUser,
        displayedUser,
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status: ${error}`,
      );
      throw error;
    }
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    try {
      return await this.service.getFolloweeCount(authToken, user);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to get followees count: ${error}`);
      throw error;
    }
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    try {
      return await this.service.getFollowerCount(authToken, user);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to get followers count: ${error}`);
      throw error;
    }
  }

  public async follow(authToken: AuthToken, user: User): Promise<void> {
    try {
      await this.service.follow(authToken, user);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to follow user: ${error}`);
      throw error;
    }
  }

  public async unfollow(authToken: AuthToken, user: User): Promise<void> {
    try {
      await this.service.unfollow(authToken, user);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to unfollow user: ${error}`);
      throw error;
    }
  }
}
