import { User, AuthToken, FakeData } from "tweeter-shared";

export class LoginService {
  public async login(
    _alias: string,
    _password: string,
  ): Promise<[User, AuthToken]> {
    // MVP: Replace with a server authentication request later.
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, FakeData.instance.authToken];
  }
}
