import { AuthToken } from "tweeter-shared";

export class LogoutService {
  public async logout(_authToken: AuthToken): Promise<void> {
    // MVP: Simulate a logout request.
    // Replace this with the server logout call later.
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
