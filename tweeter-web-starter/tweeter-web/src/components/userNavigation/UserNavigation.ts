import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserInfoActionsContext,
  UserInfoContext,
} from "../userInfo/UserInfoContexts";
import { User } from "tweeter-shared/dist/model/domain/User";
import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { UserItemPresenter } from "../../presenter/UserItemPresenter";
// import { UserService } from "../../model.service/UserService";

interface NavigateToUserParams {
  source: string;
}

export const useUserNavigation = () => {
  const { displayedUser, authToken } = useContext(UserInfoContext);
  const { setDisplayedUser } = useContext(UserInfoActionsContext);
  const navigate = useNavigate();

  const navigateToUser = async (
    event: React.MouseEvent,
    source: string,
  ): Promise<void> => {
    try {
      const alias = extractAlias(event.target.toString());

      const toUser = await getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          setDisplayedUser(toUser);
          navigate(`/${source.replace("/", "")}/${toUser.alias}`);
        }
      }
    } catch (error) {
      console.error(`Failed to get user because of exception: ${error}`);
    }
  };

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return new UserService().getUser(authToken, alias);
  };

  return { navigateToUser };
};
