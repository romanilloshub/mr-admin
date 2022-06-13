import React, { useState, useEffect, useCallback, useContext } from "react";
import { useSelector } from "react-redux";
import { Menu } from "antd";
import { useHistory } from "react-router-dom";
import * as all from "@ant-design/icons";
import Icon from "@ant-design/icons";

import {
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  THEME_TYPE_LITE,
} from "constants/ThemeSetting";
import IntlMessages from "util/IntlMessages";
import { useUserRole } from "util/hooks";
import SidebarLogo from "./SidebarLogo";
import UserProfile from "./UserProfile";
import { SiteContext } from "../App";

const SidebarContent = ({ sidebarCollapsed, setSidebarCollapsed }) => {
  const { sidebar } = useContext(SiteContext);

  const menuGroups = sidebar.groups;

  const [role] = useUserRole();
  const history = useHistory();

  let { navStyle, themeType } = useSelector(({ settings }) => settings);
  let { pathname } = useSelector(({ common }) => common);
  let { sidebarItems } = useSelector(({ auth }) => auth.siteConfig);

  const [independentItems, setIndependentItems] = useState([]);
  const [groupedSidebarItems, setGroupedSidebarItems] = useState([]);
  const [menuReady, setMenuReady] = useState(false);

  useEffect(() => {
    let items = sidebarItems.filter(
      (x) => !menuGroups.some((group) => x.path.includes(group.path))
    );
    setIndependentItems(items);
  }, [role, sidebarItems, menuGroups]);

  useEffect(() => {
    const groupedItems = menuGroups.map((group) => {
      const items = sidebarItems.filter((x) => x.path.includes(group.path));
      return items.length > 0
        ? {
            title: group.title,
            icon: group.icon,
            key: group.key,
            path: group.path,
            items: items,
            openByDefault: pathname.includes(group.path),
          }
        : null;
    });

    setGroupedSidebarItems(groupedItems.filter((x) => !!x));
    setMenuReady(true);
  }, [sidebarItems, menuGroups]);

  const defaultOpenKeys = groupedSidebarItems
    .filter((x) => x.openByDefault)
    .map((x) => x.key);

  const defaultSelectedKey = sidebarItems
    .filter((x) => pathname.includes(x.path))
    .map((x) => x.path);

  const getNoHeaderClass = (navStyle) => {
    if (
      navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR ||
      navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR
    ) {
      return "gx-no-header-notifications";
    }
    return "";
  };

  const getNavStyleSubMenuClass = (navStyle) => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
      return "gx-no-header-submenu-popup";
    }
    return "";
  };

  const handleMenuClick = useCallback(
    (e) => {
      const key = e.key;
      if (key.includes("/")) {
        history.push(key);
      }
    },
    [history]
  );

  return (
    <>
      <SidebarLogo
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />
      {menuReady && defaultOpenKeys && (
        <div className="gx-sidebar-content">
          <Menu
            onClick={handleMenuClick}
            defaultOpenKeys={[defaultOpenKeys]}
            defaultSelectedKeys={defaultSelectedKey}
            theme={themeType === THEME_TYPE_LITE ? "lite" : "dark"}
            mode="inline"
          >
            {independentItems.map((x) => (
              <Menu.Item
                key={x.path}
                icon={x.icon && all[x.icon] && React.createElement(all[x.icon])}
              >
                <IntlMessages id={x.code} defaultMessage={x.code} />
              </Menu.Item>
            ))}
            {groupedSidebarItems.length > 0 &&
              groupedSidebarItems.map((group) => (
                <Menu.ItemGroup
                  key={group.key}
                  icon={group.icon}
                  title={group.title}
                  className={getNavStyleSubMenuClass(navStyle)}
                >
                  {group.items.map((x) => (
                    <Menu.Item
                      key={x.path}
                      icon={
                        x.icon && all[x.icon] ? (
                          React.createElement(all[x.icon])
                        ) : (
                          <Icon
                            component={() => (
                              <svg
                                viewBox="0 0 120 120"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="white"
                              >
                                <circle cx="60" cy="60" r="15" />
                              </svg>
                            )}
                          />
                        )
                      }
                    >
                      {/* <Link to={x.path}> */}
                      <IntlMessages id={x.code} defaultMessage={x.code} />
                      {/* </Link> */}
                    </Menu.Item>
                  ))}
                </Menu.ItemGroup>
              ))}
          </Menu>
          <div
            className={`gx-sidebar-notifications ${getNoHeaderClass(navStyle)}`}
          >
            <UserProfile />
          </div>
        </div>
      )}
    </>
  );
};

SidebarContent.propTypes = {};
export default SidebarContent;
