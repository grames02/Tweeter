import { useLocation, useNavigate } from "react-router-dom";
import { AuthToken } from "tweeter-shared";
import { useMessageActions } from "../components/toaster/MessageHooks";
import {
  useUserInfo,
  useUserInfoActions,
} from "../components/userInfo/UserHooks";

export class LogoutService {
  AppNavbar = () => {
    const location = useLocation();
    const { authToken, displayedUser } = useUserInfo();
    const { clearUserInfo } = useUserInfoActions();
    const navigate = useNavigate();
    const { displayInfoMessage, displayErrorMessage, deleteMessage } =
      useMessageActions();

    const logOut = async () => {
      const loggingOutToastId = displayInfoMessage("Logging Out...", 0);

      try {
        await logout(authToken!);

        deleteMessage(loggingOutToastId);
        clearUserInfo();
        navigate("/login");
      } catch (error) {
        displayErrorMessage(
          `Failed to log user out because of exception: ${error}`,
        );
      }
    };

    const logout = async (authToken: AuthToken): Promise<void> => {
      // Pause so we can see the logging out message. Delete when the call to the server is implemented.
      await new Promise((res) => setTimeout(res, 1000));
    };
  };
}
