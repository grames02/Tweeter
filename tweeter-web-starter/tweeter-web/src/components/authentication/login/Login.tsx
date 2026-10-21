import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useUserInfoActions } from "../../userInfo/UserHooks";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { LoginView, LoginPresenter } from "../../../presenter/LoginPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();
  const listener: LoginView = {
    displayErrorMessage: (message: string) => displayErrorMessage(message),
  };

  const presenterRef = useRef<LoginPresenter | null>(null);

  if (!presenterRef.current) {
    presenterRef.current = new LoginPresenter(listener);
  }

  const loginPresenter = presenterRef.current;

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };

  const doLogin = async () => {
    setIsLoading(true);

    try {
      const result = await loginPresenter.login(alias, password);

      if (result === null) {
        return;
      }

      const [user, authToken] = result;

      updateUserInfo(user, user, authToken, rememberMe);

      navigate(props.originalUrl || `/feed/${user.alias}`);
    } finally {
      setIsLoading(false);
    }
  };
  const inputFieldFactory = () => {
    return (
      <AuthenticationFields
        onKeyDown={loginOnEnter}
        setAlias={setAlias}
        setPassword={setPassword}
      />
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
