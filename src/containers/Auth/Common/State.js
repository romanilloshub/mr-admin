import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import CircularProgress from "components/wieldy/CircularProgress/index";

import { useIntl } from "util/IntlMessages";
import { hideMessage } from "redux/actions/Common";

const State = () => {
  const { loader, alertMessage, showMessage } = useSelector(({ auth }) => auth);

  const dispatch = useDispatch();
  const intl = useIntl();

  useEffect(() => {
    if (showMessage) {
      setTimeout(() => {
        dispatch(hideMessage());
      }, 100);
    }
    // if (authUser !== null) {
    //   history.push("/");
    // }
  });

  return (
    <>
      {loader ? (
        <div className="gx-loader-view">
          <CircularProgress />
        </div>
      ) : null}

      {showMessage
        ? message.error(
            intl.formatMessage({
              id: `firebase.${alertMessage ? alertMessage.toString() : ""}`,
              defaultMessage: alertMessage
                ? alertMessage.toString()
                : "Unexpected error :(",
            })
          )
        : null}
    </>
  );
};

export default State;
