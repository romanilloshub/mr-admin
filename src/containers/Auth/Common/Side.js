import IntlMessages from "util/IntlMessages";

const Side = ({ authType }) => {
  const titleMsgKey = `app.userAuth.${
    authType === "SIGN_UP" ? "signUp" : "signIn"
  }`;

  const claimMsgKey = `app.userAuth.claim.${
    authType === "SIGN_UP" ? "signUp" : "signIn"
  }`;

  return (
    <div className="gx-app-logo-content">
      <div className="gx-app-logo-content-bg">
        <img src={"/assets/images/authbg.png"} alt="Neature" />
      </div>
      <div className="gx-app-logo-wid">
        <h1>
          <IntlMessages id={titleMsgKey} />
        </h1>
        <p>
          <IntlMessages id={claimMsgKey} />
        </p>
      </div>
      <div className="gx-app-logo">
        <img alt="example" src="/assets/images/w-logo.png" />
      </div>
    </div>
  );
};

export default Side;
