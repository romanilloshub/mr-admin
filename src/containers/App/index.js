import React, { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import URLSearchParams from "url-search-params";
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import { ConfigProvider } from "antd";
import { IntlProvider } from "react-intl";

import AppLocale from "lngProvider";
import MainApp from "./MainApp";
import SignIn from "../Auth/SignIn";
import SignUp from "../Auth/SignUp";

import {
  onLayoutTypeChange,
  onNavStyleChange,
  setThemeType,
} from "redux/actions/Setting";

import {
  LAYOUT_TYPE_BOXED,
  LAYOUT_TYPE_FRAMED,
  LAYOUT_TYPE_FULL,
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DARK_HORIZONTAL,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL,
  THEME_TYPE_DARK,
} from "constants/ThemeSetting";
import RestrictedRoute from "routes/RestrictedRoute";
import { auth as firebaseAuth } from "services/firebase";
import { userSignInSuccess, userSignOut } from "redux/actions";
import CircularProgress from "components/wieldy/CircularProgress";
import ForgotPassword from "../Auth/ForgotPassword";
import SetPassword from "../Auth/SetPassword";
import customConfig from "custom/siteConfig";

export const SiteContext = React.createContext(customConfig);

const App = () => {
  const dispatch = useDispatch();
  const { locale, navStyle, layoutType, themeType } = useSelector(
    ({ settings }) => settings
  );
  const { initURL, authUser, checkingAuth } = useSelector(({ auth }) => auth);

  useEffect(() => {
    handleDarkTheme(themeType);
  }, [themeType]);

  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();

  useEffect(() => {
    // if (initURL === "") {
    //   dispatch(setInitUrl(location.pathname));
    // }
    const params = new URLSearchParams(location.search);

    if (params.has("theme")) {
      dispatch(setThemeType(params.get("theme")));
    }
    if (params.has("nav-style")) {
      dispatch(onNavStyleChange(params.get("nav-style")));
    }
    if (params.has("layout-type")) {
      dispatch(onLayoutTypeChange(params.get("layout-type")));
    }
    setLayoutType(layoutType);
    setNavStyle(navStyle);
  });

  const setLayoutType = (layoutType) => {
    if (layoutType === LAYOUT_TYPE_FULL) {
      document.body.classList.remove("boxed-layout");
      document.body.classList.remove("framed-layout");
      document.body.classList.add("full-layout");
    } else if (layoutType === LAYOUT_TYPE_BOXED) {
      document.body.classList.remove("full-layout");
      document.body.classList.remove("framed-layout");
      document.body.classList.add("boxed-layout");
    } else if (layoutType === LAYOUT_TYPE_FRAMED) {
      document.body.classList.remove("boxed-layout");
      document.body.classList.remove("full-layout");
      document.body.classList.add("framed-layout");
    }
  };

  const setNavStyle = (navStyle) => {
    if (
      navStyle === NAV_STYLE_DEFAULT_HORIZONTAL ||
      navStyle === NAV_STYLE_DARK_HORIZONTAL ||
      navStyle === NAV_STYLE_INSIDE_HEADER_HORIZONTAL ||
      navStyle === NAV_STYLE_ABOVE_HEADER ||
      navStyle === NAV_STYLE_BELOW_HEADER
    ) {
      document.body.classList.add("full-scroll");
      document.body.classList.add("horizontal-layout");
    } else {
      document.body.classList.remove("full-scroll");
      document.body.classList.remove("horizontal-layout");
    }
  };

  useEffect(() => {
    if (checkingAuth) return;

    if (
      location.pathname === "/" ||
      location.pathname === "/signin" ||
      location.pathname === "/signup"
    ) {
      if (authUser === null) {
        history.push("/signin");
      } else {
        console.log(initURL);
        history.push(initURL);
      }
    }
  }, [authUser, checkingAuth]);

  useEffect(() => {
    const authState = firebaseAuth.onAuthStateChanged(async function (user) {
      if (user) {
        const { claims } = await user.getIdTokenResult();
        dispatch(userSignInSuccess({ ...user, claims }));
      } else {
        dispatch(userSignOut());
      }
    });

    return authState;
  }, []);

  const currentAppLocale = AppLocale[locale.locale];

  return (
    <SiteContext.Provider value={customConfig}>
      <ConfigProvider locale={currentAppLocale.antd}>
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
          onError={() => {}}
        >
          {!checkingAuth && (
            <Switch>
              <Route exact path="/signin" component={SignIn} />
              {customConfig.auth.registrationEnabled && (
                <Route exact path="/signup" component={SignUp} />
              )}
              <Route exact path="/forgot-password" component={ForgotPassword} />
              <Route exact path="/set-password" component={SetPassword} />
              <RestrictedRoute
                path={`${match.url}`}
                location={location}
                component={MainApp}
              />
            </Switch>
          )}
          {checkingAuth && <CircularProgress></CircularProgress>}
        </IntlProvider>
      </ConfigProvider>
    </SiteContext.Provider>
  );
};

const handleDarkTheme = (themeType) => {
  if (themeType === THEME_TYPE_DARK) {
    document.body.classList.add("dark-theme");
    let link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = "/css/dark_theme.css";
    link.className = "style_dark_theme";
    document.body.appendChild(link);
  } else if (document.body.classList.contains("dark-theme")) {
    document.body.classList.remove("dark-theme");
    const children = document.getElementsByClassName("style_dark_theme");
    if (children.length > 1) {
      for (let index = 0; index < children.length; index++) {
        if (index < children.length) {
          const child = children[index];
          child.parentNode.removeChild(child);
        }
      }
    }
  }
};

export default memo(App);
