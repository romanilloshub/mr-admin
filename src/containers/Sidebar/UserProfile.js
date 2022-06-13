import React from "react";
import { useSelector } from "react-redux";
import { Avatar, Col, Popover, Row } from "antd";
import IntlMessages from "util/IntlMessages";
import { auth as firebaseAuth } from "services/firebase";

const UserProfile = () => {
  const { authUser } = useSelector(({ auth }) => auth);

  const signOut = async () => {
    await firebaseAuth.signOut();
  };

  const userMenuOptions = (
    <ul className="gx-user-popover">
      <li onClick={() => signOut()}>
        <IntlMessages id="app.userAuth.logout"></IntlMessages>
      </li>
    </ul>
  );

  return (
    <Row align="middle" className="gx-avatar-row">
      <Col>
        <Avatar
          src={
            authUser.photoURL ||
            `https://eu.ui-avatars.com/api/?name=${authUser.displayName}`
          }
          className="gx-pointer gx-mr-3"
          alt=""
          size="small"
        />
      </Col>

      <Col flex="auto">
        <div style={{ width: "100%" }}>
          <Popover
            // placement="bottomRight"
            content={userMenuOptions}
            trigger="click"
          >
            <div className="gx-avatar-name">
              {authUser.displayName || authUser.email}
              <i className="icon icon-chevron-down gx-fs-xxs gx-ml-2" />
            </div>
          </Popover>
        </div>
      </Col>
    </Row>
  );
};

export default UserProfile;
