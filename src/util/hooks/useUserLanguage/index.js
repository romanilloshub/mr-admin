import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { switchLanguage } from "redux/actions";
import languageData from "util/languageData";

const useUserLanguage = (communicationLanguage) => {
  const dispatch = useDispatch();
  const locale = useSelector(({ settings }) => settings.locale.locale);

  useEffect(() => {
    if (communicationLanguage) {
      const matchingSiteLanguage = languageData.find(
        (x) =>
          x.locale.toLocaleLowerCase() ===
            communicationLanguage.alpha3.toLocaleLowerCase() ||
          x.locale.toLocaleLowerCase() ===
            communicationLanguage.alpha2.toLocaleLowerCase()
      );
      if (matchingSiteLanguage && matchingSiteLanguage.locale !== locale) {
        dispatch(switchLanguage(matchingSiteLanguage));
      }
    }
  }, [communicationLanguage, dispatch, locale]);
};

export default useUserLanguage;
