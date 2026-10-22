import { AuthToken, User, FakeData } from "tweeter-shared";

export class UserService {
  getUser = async (
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };
}
