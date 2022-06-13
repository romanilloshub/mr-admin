import moment from "moment";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useIntl } from "util/IntlMessages";
import {
  Spin,
  Form,
  Input,
  InputNumber,
  Switch,
  Button,
  Radio,
  Select,
  DatePicker,
  TimePicker,
  Upload,
  message,
  Divider,
  Checkbox,
} from "antd"; // Popconfirm, Icon
import StarRate from "../StarRate";
import SelectWithAddDropDown from "../SelectWithAddDropDown";
import "./CrudForm.css";

const { TextArea } = Input;

const FileUpload = ({ accept, multiple, uploadUrl, onChange }) => {
  const intl = useIntl();

  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files[]", file);
    });

    // if (onChange && typeof onChange === "function") onChange(formData);
    if (uploadUrl) {
      try {
        await fetch(uploadUrl, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          // mode: 'cors', // no-cors, cors, *same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          // credentials: 'same-origin', // include, *same-origin, omit
          // headers: {
          // 'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
          // },
          // redirect: 'follow', // manual, *follow, error
          // referrer: 'no-referrer', // no-referrer, *client
          // body: JSON.stringify(data), // body data type must match "Content-Type" header
          body: formData,
        });
        // const myjson = await rv.json()
        // console.log(myjson)
        setFileList([]);
        setUploading(false);
        message.success("upload success.");
      } catch (e) {
        setUploading(false);
        message.error("upload failed.");
      } finally {
        setUploading(true);
      }
    }
  };

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    onChange: onChange,
    fileList,
    accept,
    maxCount: multiple ? 10 : 1,
    multiple,
  };

  return (
    <div>
      <Upload {...props}>
        <Button>
          {intl.formatMessage({
            id: "forms.select.file",
            defaultMessage: "Select file",
          })}
        </Button>
      </Upload>
      {uploadUrl && (
        <Button
          type="primary"
          onClick={handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? "Uploading" : "Start Upload"}
        </Button>
      )}
    </div>
  );
};

function ReactAndCrudForm(props) {
  // props:
  // mode, setMode, formFields, formData, loading, handleFormSubmit, formType, updateFieldValue, idName, emptyOnSuccess, reactOnFormDataChanges, formDisabled
  const intl = useIntl();
  const [formItem, setFormItem] = useState();
  const [emptyForm, setEmptyForm] = useState(false);
  const [updateFieldNames, setUpdatedFieldNames] = useState([]);
  const [initialValues, setInitialValues] = useState();

  const formRef = useRef();

  const showIdOnUpdate = !!props.showIdOnUpdate;

  useEffect(() => {
    const { formFields, formData } = props;
    const _formFields = formFields.map((item) => ({
      ...item,
      value: formData ? formData[item.name] : item.value,
      hidden:
        (item.hidden && item.hidden === "add" && !formData) ||
        (item.hidden && item.hidden === "edit" && formData) ||
        (item.hidden && item.hidden === "all"),
      readonly:
        (item.readonly && item.readonly === "add" && !formData) ||
        (item.readonly && item.readonly === "edit" && formData) ||
        (item.readonly && item.readonly === "all"),
    }));
    setFormItem(_formFields);
  }, [props, props.mode, props.formData]); // props.mode, use props.mode instead of props (too senitive), we pay attention only when mode changes

  useEffect(() => {
    if (!formItem) return;
    if (initialValues) return;

    let initialValuesA = {};

    // if a select field is provided just 1 option, make it an initial value
    const selectFields = props.formFields.filter((y) =>
      ["select", "tagInput", "selectWithAddDropDown"].includes(y.type)
    );
    selectFields.forEach((field) => {
      if (field.options && field.options.length === 1) {
        initialValuesA[field.name] = field.options[0].value;
      }
    });

    // if initial data was provided on construction, use it
    if (props.formData) {
      const matchingKeys = Object.keys(props.formData).filter((x) =>
        props.formFields.find(
          (y) => y.name === x && !["date", "time"].includes(y.type)
        )
      );
      matchingKeys.forEach((key) => {
        const field = formItem.find((x) => x.name === key);
        let value = props.formData[key];
        if (
          (field.type === "select" ||
            field.type === "tagInput" ||
            field.type === "selectWithAddDropDown") &&
          field.idName
        ) {
          if (Array.isArray(value)) {
            value = value.map((x) => x[field.idName]);
          } else if (value && typeof value === "object") {
            value = value[field.idName];
          }
        }
        if (field.type === "tagInput" && !value) {
          value = [];
        }
        initialValuesA[key] = value;
      });
    }
    setInitialValues(initialValuesA);
  }, [formItem, initialValues, props.formData, props.formFields]);

  useEffect(() => {
    if (!formItem) return;

    let initialValuesA = {};
    if (props.formData) {
      const matchingKeys = Object.keys(props.formData).filter((x) =>
        props.formFields.find(
          (y) => y.name === x && !["date", "time"].includes(y.type)
        )
      );
      matchingKeys.forEach((key) => {
        const field = formItem.find((x) => x.name === key);
        let value = props.formData[key];
        if (
          (field.type === "select" ||
            field.type === "tagInput" ||
            field.type === "selectWithAddDropDown") &&
          field.idName
        ) {
          if (Array.isArray(value)) {
            value = value.map((x) => x[field.idName]);
          } else if (value && typeof value === "object") {
            value = value[field.idName];
          }
        }
        initialValuesA[key] = value;
      });
    }
    setInitialValues(initialValuesA);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // formItem,
    // props.formFields,
    props.formData,
  ]);

  const disabledFormButton = props.patchMode && updateFieldNames.length === 0;

  const changeValueRef = (name, value) => {
    formRef.current.setFieldsValue({
      [name]: value,
    });
  };

  const changeValue = (name, value) => {
    setFormItem(
      formItem.map((o) => {
        if (o.name === name) return { ...o, value };
        return o;
      })
    );
    setUpdatedFieldNames((prev) => [...new Set([...prev, name])]);
    props.updateFieldValue(name, value);
  };
  const handleSubmit = async (value) => {
    let finalData = {
      ...value,
    };

    //dates, switches and checkboxes aren't related to the form, we look for their values in the form.item instead
    //dates are built with momentjs, and that was a problem
    //switch and checkbox don't have a value by themselves, so we need to check the actual input value
    formItem
      .filter((x) => ["date", "time", "switch", "checkbox"].includes(x.type))
      .forEach((x) => {
        finalData[x.name] = x.value;
      });

    if (props.mode === "update" && props.patchMode) {
      if (updateFieldNames.length === 0) return;

      let onlyUpdatedData = {};
      updateFieldNames.forEach((name) => {
        onlyUpdatedData[name] = finalData[name];
      });
      finalData = onlyUpdatedData;
    }

    if (props.defaultFormData) {
      Object.entries(props.defaultFormData).forEach(([fieldName, value]) => {
        if (typeof finalData[fieldName] === "undefined") {
          finalData[fieldName] = value;
        }
      });
    }

    setUpdatedFieldNames([]);
    try {
      await props.handleFormSubmit({
        id: value[props.idName] || value.id,
        data: finalData,
      });
      if (props.emptyOnSuccess) {
        setEmptyForm(true);
      }
      if (props.onSuccess && typeof props.onSuccess === "function") {
        props.onSuccess();
      }
    } catch (e) {
      message.error(e?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (emptyForm) setEmptyForm(false);
  }, [emptyForm]);

  useEffect(() => {
    if (props.reactOnFormDataChanges) {
      setEmptyForm(true);
    }
  }, [initialValues, props.reactOnFormDataChanges]);

  const onCancel = useCallback(() => {
    if (props.onCancel && typeof props.onCancel === "function")
      props.onCancel();
    props.setMode("view");
  }, [props]);

  return (
    <Spin spinning={props.loading}>
      {initialValues && !emptyForm && (
        <Form
          ref={formRef}
          layout="vertical"
          name="basic"
          onFinish={handleSubmit}
          initialValues={initialValues}
          scrollToFirstError
          style={{ padding: 16 }}
        >
          {!formItem.length
            ? ""
            : formItem.map((item) => {
                if (item.hidden) {
                  return (
                    <Form.Item
                      key={item.name}
                      name={item.name}
                      rules={item.rules}
                      hidden={true}
                    >
                      <Input {...item.props} value={item.value} />
                    </Form.Item>
                  );
                } else if (item.type === "input")
                  return (
                    <Form.Item
                      key={item.name}
                      name={item.name}
                      label={intl.formatMessage({
                        id: item.label || "",
                        defaultMessage: item.label,
                      })}
                      colon={item.colon}
                      rules={item.rules}
                      hidden={!showIdOnUpdate && item.name === props.idName}
                      extra={
                        item.extra &&
                        intl.formatMessage({
                          id: item.extra || "",
                          defaultMessage: item.extra,
                        })
                      }
                      disabled
                    >
                      <Input
                        {...item.props}
                        placeholder={intl.formatMessage({
                          id: item.props.placeholder,
                          defaultMessage: item.props.placeholder,
                        })}
                        disabled={props.formDisabled || item.readonly}
                        value={item.value}
                        onChange={(e) => changeValue(item.name, e.target.value)}
                      />
                    </Form.Item>
                  );
                else if (item.type === "textarea")
                  return (
                    <Form.Item
                      key={item.name}
                      name={item.name}
                      label={intl.formatMessage({
                        id: item.props && item.props.placeholder,
                        defaultMessage: item.props && item.props.placeholder,
                      })}
                      colon={item.colon}
                      rules={item.rules}
                      hidden={item.hidden}
                      extra={
                        item.extra &&
                        intl.formatMessage({
                          id: item.extra || "",
                          defaultMessage: item.extra,
                        })
                      }
                    >
                      <TextArea
                        {...item.props}
                        placeholder={intl.formatMessage({
                          id: item.props && item.props.placeholder,
                          defaultMessage: item.props && item.props.placeholder,
                        })}
                        disabled={props.formDisabled || item.readonly}
                        value={item.value}
                        onChange={(e) => changeValue(item.name, e.target.value)}
                      />
                    </Form.Item>
                  );
                else if (item.type === "number")
                  return (
                    <Form.Item
                      key={item.name}
                      name={item.name}
                      label={intl.formatMessage({
                        id: item.label || "",
                        defaultMessage: item.label,
                      })}
                      colon={item.colon}
                      rules={item.rules}
                      hidden={item.hidden}
                      extra={
                        item.extra &&
                        intl.formatMessage({
                          id: item.extra || "",
                          defaultMessage: item.extra,
                        })
                      }
                    >
                      <InputNumber
                        {...item.props}
                        placeholder={intl.formatMessage({
                          id: item.props && item.props.placeholder,
                          defaultMessage: item.props && item.props.placeholder,
                        })}
                        disabled={props.formDisabled || item.readonly}
                        value={item.value}
                        onChange={(v) => changeValue(item.name, v)}
                      />
                    </Form.Item>
                  );
                else if (item.type === "switch")
                  return (
                    <Form.Item
                      key={item.name}
                      name={item.name}
                      colon={item.colon}
                      rules={item.rules}
                      hidden={item.hidden}
                      extra={
                        item.extra &&
                        intl.formatMessage({
                          id: item.extra || "",
                          defaultMessage: item.extra,
                        })
                      }
                    >
                      <Switch
                        {...item.props}
                        placeholder={intl.formatMessage({
                          id: item.props && item.props.placeholder,
                          defaultMessage: item.props && item.props.placeholder,
                        })}
                        disabled={props.formDisabled || item.readonly}
                        checked={item.value}
                        onChange={(v) => changeValue(item.name, v)}
                      />
                      <label className="voic-ml-2">
                        {intl.formatMessage({
                          id: item.label || "",
                          defaultMessage: item.label,
                        })}
                      </label>
                    </Form.Item>
                  );
                else if (item.type === "checkbox")
                  return (
                    <Form.Item
                      key={item.name}
                      name={item.name}
                      colon={item.colon}
                      rules={item.rules}
                      hidden={item.hidden}
                      extra={
                        item.extra &&
                        intl.formatMessage({
                          id: item.extra || "",
                          defaultMessage: item.extra,
                        })
                      }
                    >
                      <Checkbox
                        {...item.props}
                        disabled={props.formDisabled || item.readonly}
                        checked={item.value}
                        onChange={(v) => changeValue(item.name, v)}
                      >
                        {intl.formatMessage({
                          id: item.label || "",
                          defaultMessage: item.label,
                        })}
                      </Checkbox>
                    </Form.Item>
                  );
                else if (item.type === "date")
                  return (
                    <Form.Item
                      key={item.name}
                      name={item.name}
                      label={intl.formatMessage({
                        id: item.label || "",
                        defaultMessage: item.label,
                      })}
                      colon={item.colon}
                      rules={item.rules}
                      hidden={item.hidden}
                      initialValue={item.value ? moment(item.value) : undefined}
                      extra={
                        item.extra &&
                        intl.formatMessage({
                          id: item.extra || "",
                          defaultMessage: item.extra,
                        })
                      }
                    >
                      <DatePicker
                        {...item.props}
                        format={item.props.format}
                        placeholder={intl.formatMessage({
                          id: item.props && item.props.placeholder,
                          defaultMessage: item.props && item.props.placeholder,
                        })}
                        disabled={props.formDisabled || item.readonly}
                        value={moment(item.value)}
                        onChange={(date, dateString) => {
                          changeValue(item.name, dateString);
                        }}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  );
                else if (item.type === "time")
                  return (
                    <Form.Item
                      key={item.name}
                      name={item.name}
                      label={intl.formatMessage({
                        id: item.label || "",
                        defaultMessage: item.label,
                      })}
                      colon={item.colon}
                      rules={item.rules}
                      hidden={item.hidden}
                      extra={
                        item.extra &&
                        intl.formatMessage({
                          id: item.extra || "",
                          defaultMessage: item.extra,
                        })
                      }
                    >
                      <TimePicker
                        {...item.props}
                        placeholder={intl.formatMessage({
                          id: item.props && item.props.placeholder,
                          defaultMessage: item.props && item.props.placeholder,
                        })}
                        disabled={props.formDisabled || item.readonly}
                        value={item.value}
                        onChange={(timeString) =>
                          changeValue(item.name, timeString)
                        }
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  );
                else if (item.type === "select")
                  return (
                    <Form.Item
                      key={item.name}
                      name={item.name}
                      label={intl.formatMessage({
                        id: item.label || "",
                        defaultMessage: item.label,
                      })}
                      colon={item.colon}
                      rules={item.rules}
                      hidden={item.hidden}
                      extra={
                        item.extra &&
                        intl.formatMessage({
                          id: item.extra || "",
                          defaultMessage: item.extra,
                        })
                      }
                    >
                      <Select
                        {...item.props}
                        value={item.value}
                        onChange={(a, b) => changeValue(item.name, a)}
                        placeholder={intl.formatMessage({
                          id: item.props && item.props.placeholder,
                          defaultMessage: item.props && item.props.placeholder,
                        })}
                        showSearch
                        options={item.options}
                        filterOption={(input, option) =>
                          option.props.label
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        disabled={props.formDisabled || item.readonly}
                      >
                        {/* {item.options.map((option, i) => (
                          <Option key={`${option.value}_${i}`} value={option.value}>
                            {option.label}
                          </Option>
                        ))} */}
                      </Select>
                    </Form.Item>
                  );
                else if (item.type === "tagInput")
                  return (
                    <Form.Item
                      key={item.name}
                      name={item.name}
                      label={intl.formatMessage({
                        id: item.label || "",
                        defaultMessage: item.label,
                      })}
                      colon={item.colon}
                      rules={item.rules}
                      hidden={item.hidden}
                      extra={
                        item.extra &&
                        intl.formatMessage({
                          id: item.extra || "",
                          defaultMessage: item.extra,
                        })
                      }
                    >
                      <Select
                        {...item.props}
                        onChange={(a) => changeValue(item.name, a)}
                        placeholder={intl.formatMessage({
                          id: item.props && item.props.placeholder,
                          defaultMessage: item.props && item.props.placeholder,
                        })}
                        disabled={props.formDisabled}
                        mode="tags"
                        style={{ width: "100%" }}
                        tokenSeparators={[","]}
                        dropdownClassName="tag-input-hide-dropdown"
                      ></Select>
                    </Form.Item>
                  );
                else if (item.type === "radio")
                  return (
                    <Form.Item
                      key={item.name}
                      name={item.name}
                      label={intl.formatMessage({
                        id: item.label || "",
                        defaultMessage: item.label,
                      })}
                      colon={item.colon}
                      rules={item.rules}
                      hidden={item.hidden}
                      extra={
                        item.extra &&
                        intl.formatMessage({
                          id: item.extra || "",
                          defaultMessage: item.extra,
                        })
                      }
                    >
                      <Radio.Group
                        {...item.props}
                        onChange={(a, b) => changeValue(item.name, a)}
                        value={item.value}
                      >
                        {item.options.map((option) => (
                          <Radio
                            key={option.value}
                            value={option.value}
                            disabled={props.formDisabled}
                          >
                            {option.label}
                          </Radio>
                        ))}
                      </Radio.Group>
                    </Form.Item>
                  );
                else if (item.type === "upload" && props.formType !== "filter")
                  return (
                    <Form.Item
                      key={item.name}
                      name={item.name}
                      label={intl.formatMessage({
                        id: item.label || "",
                        defaultMessage: item.label,
                      })}
                      colon={item.colon}
                      rules={item.rules}
                      hidden={item.hidden}
                      extra={
                        item.extra &&
                        intl.formatMessage({
                          id: item.extra || "",
                          defaultMessage: item.extra,
                        })
                      }
                    >
                      <FileUpload
                        {...item.props}
                        onChange={
                          item.injectFileNameTo
                            ? (e) =>
                                changeValueRef(
                                  item.injectFileNameTo,
                                  e.file ? e.file.name : ""
                                )
                            : () => {}
                        }
                        placeholder={intl.formatMessage({
                          id: item.props && item.props.placeholder,
                          defaultMessage: item.props && item.props.placeholder,
                        })}
                      />
                    </Form.Item>
                  );
                else if (item.type === "starRate")
                  return (
                    <Form.Item
                      key={item.name}
                      name={item.name}
                      rules={item.rules}
                    >
                      <StarRate
                        {...item.props}
                        onChange={(rate) => changeValue(item.name, rate)}
                        value={item.value}
                      />
                    </Form.Item>
                  );
                else if (item.type === "selectWithAddDropDown")
                  return (
                    <Form.Item
                      key={item.name}
                      name={item.name}
                      label={intl.formatMessage({
                        id: item.label || "",
                        defaultMessage: item.label,
                      })}
                      colon={item.colon}
                      rules={item.rules}
                      hidden={item.hidden}
                      extra={
                        item.extra &&
                        intl.formatMessage({
                          id: item.extra || "",
                          defaultMessage: item.extra,
                        })
                      }
                    >
                      <SelectWithAddDropDown
                        {...item.props}
                        value={item.value}
                        onChange={(a, b) => changeValue(item.name, a)}
                        placeholder={intl.formatMessage({
                          id: item.props && item.props.placeholder,
                          defaultMessage: item.props && item.props.placeholder,
                        })}
                        showSearch
                        options={item.options}
                        disabled={props.formDisabled}
                      />
                    </Form.Item>
                  );
                else if (item.type === "separator")
                  return (
                    <Divider orientation="left">
                      {intl.formatMessage({
                        id: item.label || "",
                        defaultMessage: item.label,
                      })}
                      {item.extra && item.extra}
                    </Divider>
                  );
                else if (item.type === "simpleSeparator") return <Divider />;
                else if (item.type === "customContent")
                  return <>{{ ...item.content }}</>;
                else return "";
              })}
          {props.formType !== "filter" && !props.formDisabled && (
            <Form.Item>
              <Button
                style={{ marginRight: 8 }}
                type="primary"
                htmlType="submit"
                disabled={disabledFormButton}
              >
                {props.mode === "add"
                  ? intl.formatMessage({
                      id: "crud.create.button.label",
                      defaultMessage: "Add",
                    })
                  : intl.formatMessage({
                      id: "crud.update.button.label",
                      defaultMessage: "Update",
                    })}
              </Button>
              <Button type="default" htmlType="button" onClick={onCancel}>
                {intl.formatMessage({
                  id: "crud.cancel.button.label",
                  defaultMessage: "Cancel",
                })}
              </Button>
            </Form.Item>
          )}
        </Form>
      )}
    </Spin>
  );
}
export default ReactAndCrudForm;
