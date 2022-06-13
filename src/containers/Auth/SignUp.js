import React from "react";
import { Button, Checkbox, Divider, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { showAuthLoader, userSignUp } from "redux/actions/Auth";
import IntlMessages from "util/IntlMessages";

import Side from "./Common/Side";
import ThirdPartyAuth from "./Common/ThirdPartyAuth";
import State from "./Common/State";

const FormItem = Form.Item;

const SignUp = (props) => {
  const dispatch = useDispatch();

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = (values) => {
    dispatch(showAuthLoader());
    dispatch(userSignUp(values));
  };

  const authType = "SIGN_UP";

  return (
    <div className="gx-app-login-wrap">
      <div className="gx-app-login-container">
        <div className="gx-app-login-main-content">
          <Side authType={authType}></Side>
          <div className="gx-app-login-content">
            <Form
              initialValues={{ remember: true }}
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="gx-signin-form gx-form-row0"
            >
              <FormItem
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input placeholder="Username" />
              </FormItem>

              <FormItem
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                ]}
              >
                <Input placeholder="Email" />
              </FormItem>
              <FormItem
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
              >
                <Input type="password" placeholder="Password" />
              </FormItem>
              <Form.Item
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(new Error("Should accept agreement")),
                  },
                ]}
                name="agreement"
                valuePropName="checked"
              >
                <Checkbox>
                  <IntlMessages id="appModule.iAccept" />{" "}
                  <span className="gx-signup-form-forgot gx-link">
                    <IntlMessages id="appModule.termAndCondition" />
                  </span>
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <Button type="primary" className="gx-mb-0" htmlType="submit">
                  <IntlMessages id="app.userAuth.signUp" />
                </Button>
                <span>
                  <IntlMessages id="app.userAuth.or" />
                </span>{" "}
                <Link to="/signin">
                  <IntlMessages id="app.userAuth.signIn" />
                </Link>
              </Form.Item>
              <Divider orientation="left"></Divider>
              <ThirdPartyAuth authType={authType}></ThirdPartyAuth>
            </Form>
          </div>
          <State />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
