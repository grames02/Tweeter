import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useUserInfoActions } from "../../userInfo/UserHooks";
import { useMessageActions } from "../../toaster/MessageHooks";
import {
  RegisterPresenter,
  RegisterView,
} from "../../../presenter/RegisterPresenter";

interface Props {
  originalUrl?: string;
  presenterFactory: (listener: RegisterView) => RegisterPresenter;
}

const Register = (props: Props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [imageBytes, setImageBytes] = useState<Uint8Array>(new Uint8Array());
  const [imageUrl, setImageUrl] = useState("");
  const [imageFileExtension, setImageFileExtension] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();

  const listener: RegisterView = {
    displayErrorMessage,
    setImageUrl,
    setImageBytes,
    setImageFileExtension,
  };

  const presenterRef = useRef<RegisterPresenter | null>(null);

  if (!presenterRef.current) {
    presenterRef.current = props.presenterFactory(listener);
  }

  const presenter = presenterRef.current;

  const checkSubmitButtonStatus = (): boolean => {
    return (
      !firstName.trim() ||
      !lastName.trim() ||
      !alias.trim() ||
      !password ||
      imageBytes.length === 0 ||
      !imageFileExtension
    );
  };

  const doRegister = async () => {
    if (checkSubmitButtonStatus()) {
      return;
    }

    try {
      setIsLoading(true);

      const [user, authToken] = await presenter.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension,
      );

      updateUserInfo(user, user, authToken, rememberMe);
      navigate(`/feed/${user.alias}`);
    } catch {
      // The presenter displays registration errors.
    } finally {
      setIsLoading(false);
    }
  };

  const inputFieldFactory = () => (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="firstNameInput"
          placeholder="First Name"
          value={firstName}
          onKeyDown={(event) =>
            presenter.registerOnEnter(
              event,
              checkSubmitButtonStatus(),
              doRegister,
            )
          }
          onChange={(event) => setFirstName(event.target.value)}
        />
        <label htmlFor="firstNameInput">First Name</label>
      </div>

      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="lastNameInput"
          placeholder="Last Name"
          value={lastName}
          onKeyDown={(event) =>
            presenter.registerOnEnter(
              event,
              checkSubmitButtonStatus(),
              doRegister,
            )
          }
          onChange={(event) => setLastName(event.target.value)}
        />
        <label htmlFor="lastNameInput">Last Name</label>
      </div>

      <AuthenticationFields
        onKeyDown={(event) =>
          presenter.registerOnEnter(
            event,
            checkSubmitButtonStatus(),
            doRegister,
          )
        }
        setAlias={setAlias}
        setPassword={setPassword}
      />

      <div className="form-floating mb-3">
        <input
          type="file"
          accept="image/*"
          className="d-inline-block py-5 px-4 form-control bottom"
          id="imageFileInput"
          onChange={presenter.handleFileChange}
        />

        {imageUrl.length > 0 && (
          <>
            <label htmlFor="imageFileInput">User Image</label>
            <img
              src={imageUrl}
              className="img-thumbnail"
              alt="Registration profile preview"
            />
          </>
        )}
      </div>
    </>
  );

  const switchAuthenticationMethodFactory = () => (
    <div className="mb-3">
      Already registered? <Link to="/login">Sign in</Link>
    </div>
  );

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doRegister}
    />
  );
};

export default Register;
