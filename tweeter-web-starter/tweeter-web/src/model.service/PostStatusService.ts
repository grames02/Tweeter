import { AuthToken, Status } from "tweeter-shared";

export class PostStatusService {
  public async postStatus(authToken: AuthToken, status: Status): Promise<void> {
    // TODO: Replace with the actual server API call.
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}
