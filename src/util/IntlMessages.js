import React from "react";
import { FormattedMessage, injectIntl, useIntl } from "react-intl";

const InjectMassage = (props) => <FormattedMessage {...props} />;
export default injectIntl(InjectMassage, {
  withRef: false,
});

export { useIntl };
