import { AuthToken, User, FakeData } from "tweeter-shared";

export class RegisterService {
  public async register(
    _firstName: string,
    _lastName: string,
    _alias: string,
    _password: string,
    _userImageBytes: Uint8Array,
    _imageFileExtension: string,
  ): Promise<[User, AuthToken]> {
    // MVP: Use fake data until the server registration
    // endpoint is implemented.

    const user = FakeData.instance.firstUser;
    const authToken = FakeData.instance.authToken;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, authToken];
  }
}
