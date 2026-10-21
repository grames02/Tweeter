import { useUserInfo, useUserInfoActions } from "../userInfo/UserHooks";
import { Status } from "tweeter-shared";
import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMessageActions } from "../toaster/MessageHooks";
import { useParams } from "react-router-dom";
import StatusItem from "../statusItem/statusItem";
import {
  StatusItemPresenter,
  StatusItemView,
} from "../../presenter/StatusItemPresenter";

export const PAGE_SIZE = 10;

interface Props {
  source: "feed" | "story";
  presenterFactory: (view: StatusItemView) => StatusItemPresenter;
}

const StatusItemScroller = (props: Props) => {
  const { displayErrorMessage } = useMessageActions();
  const [items, setItems] = useState<Status[]>([]);

  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  const listener: StatusItemView = {
    addItems: (newItems: Status[]) =>
      setItems((previousItems) => [...previousItems, ...newItems]),
    displayErrorMessage: (message: string) => displayErrorMessage(message),
  };

  const presenterRef = useRef<StatusItemPresenter | null>(null);

  if (!presenterRef.current) {
    presenterRef.current = props.presenterFactory(listener);
  }

  const presenter = presenterRef.current;

  // Resolve the user specified in the URL.
  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam !== displayedUser?.alias
    ) {
      presenter
        .getUser(authToken, displayedUserAliasParam)
        .then((toUser) => {
          if (toUser) {
            setDisplayedUser(toUser);
          }
        })
        .catch((error) => {
          displayErrorMessage(`Failed to find user: ${error}`);
        });
    }
  }, [authToken, displayedUserAliasParam, displayedUser?.alias]);

  // Load the initial page whenever the displayed user changes.
  useEffect(() => {
    if (authToken && displayedUser) {
      setItems([]);
      presenter.reset();

      void presenter.loadMoreItems(authToken, displayedUser.alias);
    }
  }, [authToken, displayedUser, presenter]);

  const loadMoreItems = () => {
    if (authToken && displayedUser && presenter.hasMoreItems) {
      void presenter.loadMoreItems(authToken, displayedUser.alias);
    }
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenter.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <StatusItem status={item} source={props.source} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default StatusItemScroller;
