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
  presenterFactory: (listener: LoginView) => LoginPresenter;
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
    displayErrorMessage,
  };

  const presenterRef = useRef<LoginPresenter | null>(null);

  if (!presenterRef.current) {
    presenterRef.current = props.presenterFactory(listener);
  }

  const presenter = presenterRef.current;

  const checkSubmitButtonStatus = (): boolean => {
    return !alias.trim() || !password;
  };

  const doLogin = async (): Promise<void> => {
    if (checkSubmitButtonStatus()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await presenter.login(alias, password);

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

  const inputFieldFactory = () => (
    <AuthenticationFields
      onKeyDown={(event) =>
        presenter.loginOnEnter(event, checkSubmitButtonStatus(), doLogin)
      }
      setAlias={setAlias}
      setPassword={setPassword}
    />
  );

  const switchAuthenticationMethodFactory = () => (
    <div className="mb-3">
      Not registered? <Link to="/register">Register</Link>
    </div>
  );

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
