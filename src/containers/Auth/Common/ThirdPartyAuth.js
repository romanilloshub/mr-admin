import React from "react";

import { useDispatch } from "react-redux";
import {
  showAuthLoader,
  userGoogleSignIn,
  userFacebookSignIn,
  userGithubSignIn,
  userTwitterSignIn,
} from "redux/actions/Auth";

import IntlMessages from "util/IntlMessages";
import GoogleOutlined from "@ant-design/icons/lib/icons/GoogleOutlined";
import {
  FacebookOutlined,
  GithubOutlined,
  TwitterOutlined,
} from "@ant-design/icons";

const ThirdPartyAuth = ({ authType }) => {
  const dispatch = useDispatch();

  const titleMsgKey = `app.userAuth.${
    authType === "SIGN_UP" ? "orSignUpWith" : "orSignInWith"
  }`;

  return (
    <div className="gx-flex-row gx-justify-content-between">
      <IntlMessages id={titleMsgKey} />
      <ul className="gx-social-link">
        <li>
          <GoogleOutlined
            onClick={() => {
              dispatch(showAuthLoader());
              dispatch(userGoogleSignIn());
            }}
          />
        </li>
        <li>
          <FacebookOutlined
            onClick={() => {
              dispatch(showAuthLoader());
              dispatch(userFacebookSignIn());
            }}
          />
        </li>
        <li>
          <GithubOutlined
            onClick={() => {
              dispatch(showAuthLoader());
              dispatch(userGithubSignIn());
            }}
          />
        </li>
        <li>
          <TwitterOutlined
            onClick={() => {
              dispatch(showAuthLoader());
              dispatch(userTwitterSignIn());
            }}
          />
        </li>
      </ul>
    </div>

    // <div className="gx-flex-column gx-justify-content-between">
    //   <IntlMessages id={titleMsgKey} />
    //   <Button
    //     icon={<GoogleOutlined />}
    //     onClick={() => {
    //       dispatch(showAuthLoader());
    //       dispatch(userGoogleSignIn());
    //     }}
    //   >
    //     Google
    //   </Button>
    // </div>
  );
};

export default ThirdPartyAuth;
