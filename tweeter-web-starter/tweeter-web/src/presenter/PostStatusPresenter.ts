import { AuthToken, Status } from "tweeter-shared";
import { PostStatusService } from "../model.service/PostStatusService";
import { Presenter, View } from "./Presenter";

export interface PostStatusView extends View {
  displayErrorMessage: (message: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private service: PostStatusService;

  public constructor(view: PostStatusView) {
    super(view);
    this.service = new PostStatusService();
  }

  public async submitPost(authToken: AuthToken, status: Status) {
    this.doFailureReportingOperation(async () => {
      await this.service.postStatus(authToken, status);
    }, "post status");
  }
}
