import React from "react";
import { Typography } from "antd";
import Rate from "rc-rate";
import "rc-rate/assets/index.css";

import { useIntl } from "util/IntlMessages";

const { Text } = Typography;

const StarRate = ({ mainLabel, subLabel, ...props }) => {
  const intl = useIntl();
  return (
    <div>
      {mainLabel && (
        <Text strong style={{ marginRight: "5px" }}>
          {intl.formatMessage({
            id: mainLabel,
            defaultMessage: mainLabel,
          })}
        </Text>
      )}
      {subLabel && (
        <Text style={{ marginRight: "5px" }}>
          {intl.formatMessage({
            id: subLabel,
            defaultMessage: subLabel,
          })}
        </Text>
      )}
      <Rate {...props} allowClear defaultValue={0} />
    </div>
  );
};

export default StarRate;
