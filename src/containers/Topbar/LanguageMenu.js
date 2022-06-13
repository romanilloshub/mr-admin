import React from "react";
import { useDispatch } from "react-redux";

import { switchLanguage } from "redux/actions";
import languageData from "util/languageData";
import CustomScrollbars from "util/CustomScrollbars";

export default function LanguageMenu() {
  const dispatch = useDispatch();

  return (
    <CustomScrollbars
      className="gx-popover-lang-scroll"
      style={{ "--scroll-entry-number": languageData.length }}
    >
      <ul className="gx-sub-popover">
        {languageData.map((language) => (
          <li
            className="gx-media gx-pointer"
            key={JSON.stringify(language)}
            onClick={() => dispatch(switchLanguage(language))}
          >
            <i className={`flag flag-24 gx-mr-2 flag-${language.icon}`} />
            <span className="gx-language-text">{language.name}</span>
          </li>
        ))}
      </ul>
    </CustomScrollbars>
  );
}
