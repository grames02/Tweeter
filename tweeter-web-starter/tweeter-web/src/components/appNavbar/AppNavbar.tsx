import "./AppNavbar.css";
import { useRef, useState } from "react";
import { useUserInfo } from "../userInfo/UserHooks";
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfoActions } from "../userInfo/UserHooks";
import {
  AppNavbarPresenter,
  AppNavbarView,
} from "../../presenter/AppNavbarPresenter";

const AppNavbar = () => {
  const location = useLocation();
  const { authToken, displayedUser } = useUserInfo();
  const { clearUserInfo } = useUserInfoActions();
  const navigate = useNavigate();

  const { displayInfoMessage, displayErrorMessage, deleteMessage } =
    useMessageActions();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const listener: AppNavbarView = {
    displayErrorMessage,
  };

  const presenterRef = useRef<AppNavbarPresenter | null>(null);

  if (!presenterRef.current) {
    presenterRef.current = new AppNavbarPresenter(listener);
  }

  const presenter = presenterRef.current;

  const logOut = async () => {
    if (!authToken || isLoggingOut) {
      return;
    }

    const loggingOutToastId = displayInfoMessage("Logging Out...", 0);

    setIsLoggingOut(true);

    try {
      const success = await presenter.logout(authToken);

      deleteMessage(loggingOutToastId);

      if (success) {
        clearUserInfo();
        navigate("/login");
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!displayedUser) {
    return null;
  }

  return (
    <Navbar
      collapseOnSelect
      className="mb-4"
      expand="md"
      bg="primary"
      variant="dark"
    >
      <Container>
        <Navbar.Brand>
          <div className="d-flex flex-row">
            <div className="p-2">
              <NavLink className="brand-link" to="/">
                <Image src={"/bird-white-32.png"} alt="" />
              </NavLink>
            </div>
            <div id="brand-title" className="p-3">
              <NavLink className="brand-link" to="/">
                <b>Tweeter</b>
              </NavLink>
            </div>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Item>
              <NavLink
                to={`/feed/${displayedUser.alias}`}
                className={() =>
                  location.pathname.startsWith("/feed/")
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Feed
              </NavLink>
            </Nav.Item>

            <Nav.Item>
              <NavLink
                to={`/story/${displayedUser.alias}`}
                className={() =>
                  location.pathname.startsWith("/story/")
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Story
              </NavLink>
            </Nav.Item>

            <Nav.Item>
              <NavLink
                to={`/followees/${displayedUser.alias}`}
                className={() =>
                  location.pathname.startsWith("/followees/")
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Followees
              </NavLink>
            </Nav.Item>

            <Nav.Item>
              <NavLink
                to={`/followers/${displayedUser.alias}`}
                className={() =>
                  location.pathname.startsWith("/followers/")
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Followers
              </NavLink>
            </Nav.Item>

            <Nav.Item>
              <NavLink
                id="logout"
                to={location.pathname}
                onClick={(event) => {
                  event.preventDefault();
                  void logOut();
                }}
                className="nav-link"
                aria-disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </NavLink>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
