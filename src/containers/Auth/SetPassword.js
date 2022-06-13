import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useLocationWithQuery } from "react-router-query-hooks";
import { Link } from "react-router-dom";

import IntlMessages from "util/IntlMessages";
import { useIntl } from "util/IntlMessages";
import { passwordResetEmail } from "services/firebase";

import Side from "./Common/Side";

const FormItem = Form.Item;

const SetPassword = () => {
  const { query } = useLocationWithQuery();
  const intl = useIntl();

  const [showBackButton, setShowBackButton] = useState(false);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = async (values) => {
    const email = values.email;
    await passwordResetEmail(email);
    message.success(
      intl.formatMessage({
        id: "request.successful.check.your.inbox",
        defaultMessage: "Request successful. Check your inbox.",
      })
    );
    setShowBackButton(true);
  };

  const authType = "SIGN_IN";

  return (
    <div className="gx-app-login-wrap">
      <div className="gx-app-login-container">
        <div className="gx-app-login-main-content">
          <Side authType={authType}></Side>
          <div className="gx-app-login-content">
            <div className="gx-mb-4">
              <h2>
                <IntlMessages id="app.userAuth.setYourPassword" />
              </h2>
              <p>
                <IntlMessages id="app.userAuth.setYourPasswordExplanation" />
              </p>
            </div>

            <Form
              initialValues={{ remember: true, email: query?.email || "" }}
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="gx-signin-form gx-form-row0"
            >
              <FormItem
                name="email"
                rules={[
                  { required: true, message: "Please input your E-mail!" },
                ]}
              >
                <Input
                  className="gx-input-lineheight"
                  type="email"
                  placeholder="E-Mail Address"
                />
              </FormItem>
              <FormItem>
                <Button
                  type={showBackButton ? "secondary" : "primary"}
                  htmlType="submit"
                >
                  <IntlMessages id="app.userAuth.setYourPassword" />
                </Button>
              </FormItem>{" "}
              {showBackButton && (
                <FormItem>
                  <Link to="/signin">
                    <Button type="primary">
                      <IntlMessages id="app.userAuth.signIn" />
                    </Button>
                  </Link>
                </FormItem>
              )}
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
