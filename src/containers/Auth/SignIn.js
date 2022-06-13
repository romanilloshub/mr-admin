import React, { useContext, useEffect, useState, useCallback } from "react";
import { Button, Input, Form } from "antd";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { showAuthLoader, userSignIn, setInitUrl } from "redux/actions/Auth";
import IntlMessages from "util/IntlMessages";

import Side from "./Common/Side";
import State from "./Common/State";
import ThirdPartyAuth from "./Common/ThirdPartyAuth";
import { useLocationWithQuery } from "react-router-query-hooks";
import { SiteContext } from "../App";

const authType = "SIGN_IN";

const Login = (props) => {
  const { auth, demoMode } = useContext(SiteContext);
  const { query } = useLocationWithQuery();
  const [loggingInAutomatically, setLoggingInAutomatically] = useState(false);

  const redirectedFrom = props?.location?.state?.from?.pathname;
  const redirectedFromQuery = props?.location?.state?.fromQuery;

  const dispatch = useDispatch();

  const triggerAuthProcess = useCallback(
    (values) => {
      dispatch(showAuthLoader());

      dispatch(userSignIn(values));

      if (redirectedFrom) {
        dispatch(setInitUrl(redirectedFrom));
      }
    },
    [dispatch, showAuthLoader, userSignIn, setInitUrl, redirectedFrom]
  );

  useEffect(() => {
    const email = query?.email || redirectedFromQuery?.email;
    const pass = query?.pass || redirectedFromQuery?.pass;

    if (email && pass && !loggingInAutomatically) {
      setLoggingInAutomatically(true);
      triggerAuthProcess({
        email,
        password: pass,
      });
    }
  }, [query, loggingInAutomatically, redirectedFromQuery, triggerAuthProcess]);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = (values) => {
    triggerAuthProcess(values);
  };

  const urlEmail = query?.email && query?.email.replace(" ", "+");

  return (
    <div className="gx-app-login-wrap">
      <div className="gx-app-login-container">
        <div className="gx-app-login-main-content">
          <Side authType={authType}></Side>
          <div className="gx-app-login-content">
            <Form
              initialValues={{ remember: true, email: urlEmail || "" }}
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="gx-signin-form gx-form-row0"
            >
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "The input is not valid E-mail!",
                  },
                ]}
                name="email"
                type="email"
                normalize={(val) => (val ? val.trim() : "")}
              >
                <Input placeholder="Email" />
              </Form.Item>
              <Form.Item
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
                name="password"
                normalize={(val) => (val ? val.trim() : "")}
              >
                <Input type="password" placeholder="Password" />
              </Form.Item>
              <Form.Item name="remember" valuePropName="checked">
                <Link className="gx-login-form-forgot" to="/forgot-password">
                  <IntlMessages id="app.userAuth.forgotPassword" />
                </Link>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  className="gx-mb-0 gx-pl-4 gx-pr-4"
                  htmlType="submit"
                >
                  <IntlMessages id="app.userAuth.signIn" />
                </Button>
                {auth.registrationEnabled && (
                  <>
                    <span>
                      <IntlMessages id="app.userAuth.or" />
                    </span>{" "}
                    <Link to="/signup">
                      <IntlMessages id="app.userAuth.signUp" />
                    </Link>
                  </>
                )}
              </Form.Item>
            </Form>
            {auth.registrationEnabled && (
              <ThirdPartyAuth authType={authType}></ThirdPartyAuth>
            )}

            {demoMode && (
              <>
                <div className="gx-text-light gx-fs-sm">
                  {" "}
                  demo user: 'demo@example.com'
                </div>
                <div className="gx-text-light gx-fs-sm">
                  {" "}
                  demo password: 'demo#123'
                </div>
              </>
            )}
          </div>
          <State />
        </div>
      </div>
    </div>
  );
};

export default Login;
