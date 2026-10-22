import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserHooks";
import { useMessageActions } from "../toaster/MessageHooks";
import {
  UserItemPresenter,
  UserItemView,
} from "../../presenter/UserItemPresenter";

interface Props {
  presenterFactory: (view: UserItemView) => UserItemPresenter;
}

export const useUserNavigation = ({ presenterFactory }: Props) => {
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();
  const navigate = useNavigate();

  const listener: UserItemView = {
    addItems: () => {},
    displayErrorMessage,
  };

  const presenterRef = useRef<UserItemPresenter | null>(null);

  if (!presenterRef.current) {
    presenterRef.current = presenterFactory(listener);
  }

  const navigateToUser = async (
    event: React.MouseEvent<HTMLElement>,
    source: string,
  ): Promise<void> => {
    try {
      if (!authToken) {
        displayErrorMessage("You must be authenticated to view this user.");
        return;
      }

      const target = event.currentTarget;
      const text = target.textContent ?? "";
      const match = text.match(/@[^\s]+/);
      const alias = match?.[0];

      if (!alias) {
        displayErrorMessage("Could not determine the user's alias.");
        return;
      }

      const toUser = await presenterRef.current!.getUser(authToken, alias);

      if (toUser && (!displayedUser || !toUser.equals(displayedUser))) {
        setDisplayedUser(toUser);
        navigate(`/${source.replace("/", "")}/${toUser.alias}`);
      }
    } catch (error) {
      displayErrorMessage(`Failed to get user: ${String(error)}`);
    }
  };

  return { navigateToUser };
};
