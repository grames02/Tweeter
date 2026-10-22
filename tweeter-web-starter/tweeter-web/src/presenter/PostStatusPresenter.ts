import { AuthToken, Status } from "tweeter-shared";
import { PostStatusService } from "../model.service/PostStatusService";

export interface PostStatusView {
  displayErrorMessage: (message: string) => void;
}

export class PostStatusPresenter {
  private service: PostStatusService;
  private view: PostStatusView;

  public constructor(view: PostStatusView) {
    this.view = view;
    this.service = new PostStatusService();
  }

  public async submitPost(
    authToken: AuthToken,
    status: Status,
  ): Promise<boolean> {
    try {
      await this.service.postStatus(authToken, status);
      return true;
    } catch (error) {
      this.view.displayErrorMessage(`Failed to post status: ${error}`);
      return false;
    }
  }
}
