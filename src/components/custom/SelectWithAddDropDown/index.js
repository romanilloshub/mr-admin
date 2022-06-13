import React, { useState, useEffect } from "react";
import { Input, Select, Divider, Button } from "antd";
import { useIntl } from "util/IntlMessages";

const SelectWithAddDropDown = ({ options, ...props }) => {
  const intl = useIntl();

  const [items, setItems] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    if (options) {
      setItems(options);
    }
  }, [options]);

  const onNameChange = (event) => {
    setName(event.target.value);
  };
  const addItem = (e) => {
    if (!name) return;
    setItems((prevState) => [...prevState, { value: name, code: name }]);
    setName("");
  };

  return (
    <Select
      {...props}
      options={items}
      dropdownRender={(menu) => (
        <div>
          {menu}
        </div>
      )}
    />
  );
};

export default SelectWithAddDropDown;
