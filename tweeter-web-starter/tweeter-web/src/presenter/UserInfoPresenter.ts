import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { View, Presenter } from "./Presenter";

export interface UserInfoView extends View {
  displayErrorMessage: (message: string) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private service: FollowService;

  public constructor(view: UserInfoView) {
    super(view);
    this.service = new FollowService();
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ) {
    this.doFailureReportingOperation(async () => {
      await this.service.getIsFollowerStatus(
        authToken,
        currentUser,
        displayedUser,
      );
    }, "determine follower status");
  }

  public async getFolloweeCount(authToken: AuthToken, user: User) {
    this.doFailureReportingOperation(async () => {
      await this.service.getFolloweeCount(authToken, user);
    }, "get followees count");
  }

  public async getFollowerCount(authToken: AuthToken, user: User) {
    this.doFailureReportingOperation(async () => {
      await this.service.getFollowerCount(authToken, user);
    }, "get followers count");
  }

  public async follow(authToken: AuthToken, user: User) {
    this.doFailureReportingOperation(async () => {
      this.service.follow(authToken, user);
    }, "follow user");
  }

  public async unfollow(authToken: AuthToken, user: User) {
    this.doFailureReportingOperation(async () => {
      this.service.unfollow(authToken, user);
    }, "unfollow user");
  }
}
