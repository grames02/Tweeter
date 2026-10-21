import { AuthToken } from "tweeter-shared";
import { PAGE_SIZE } from "./FolloweePresenter";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";

export class FeedPresenter extends StatusItemPresenter {
  public constructor(view: StatusItemView) {
    super(view);
  }

  public async loadMoreItems(
    authToken: AuthToken,
    userAlias: string,
  ): Promise<void> {
    try {
      const [newItems, hasMore] = await this.service.loadMoreFeedItems(
        authToken,
        userAlias,
        PAGE_SIZE,
        this.lastItem,
      );

      this.hasMoreItems = hasMore;
      this.lastItem =
        newItems.length > 0 ? newItems[newItems.length - 1] : null;

      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to load feed items: ${error}`);
    }
  }
}
