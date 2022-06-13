import { Button, Progress, Row, Col, Typography } from "antd";
import { CrudBuilder } from "components/custom/Crud/CrudBuilder";
import LinkService from "services/link";

const textKeys = {
  createRecordTextKey: "crud.link.create.new.record",
  updateRecordTextKey: "crud.link.update.record",
  deleteRecordTextKey: "crud.link.delete.record",
};
const idName = "id"; // the name of the ID for your DB (example, for MongoDB it is _id)
const pageSize = 50; // page size
const position = "both"; // paginator location

const find = async ({ page, limit }) => {
  return await LinkService.getLinks(page, limit);
};

const findOne = async ({ id }) => {
  const response = await LinkService.getLinkById(id);
  const data = response.data;
  return mapperApiToFront(data);
};

const insert = async ({ _data }) => {
  const handledData = mapperFrontToApi(_data);
  return await LinkService.createLink(handledData);
};

const update = async ({ id, _data }) => {
  const handledData = mapperFrontToApi(_data);
  return await LinkService.updateLink(id, handledData);
};

const remove = async ({ id }) => {
  return await LinkService.deleteLink(id);
};

const mapperFrontToApi = (_data) => ({
  ..._data,
  // latlng: [+_data.latitude, +_data.longitude],
  meta: {
    geo: {
      lat: +_data.latitude,
      lng: +_data.longitude,
    },
    geoSnapshot: _data.geoSnapshot,
  },
});

const mapperApiToFront = (_data) => ({
  data: {
    ..._data,
    latitude:
      _data && _data.latlng && Array.isArray(_data.latlng) && _data.latlng[0],
    longitude:
      _data && _data.latlng && Array.isArray(_data.latlng) && _data.latlng[1],
  },
});

const formFieldsCrudBuilder = () => [
  {
    name: "id",
    label: "ID",
    type: "input",
    value: "",
    hidden: "add, edit", // add, edit, all
    readonly: "all", // add, edit, all
    validation: null, // validation function
    props: {
      type: "text",
      placeholder: "ID",
    },
  },
  {
    label: "forms.type",
    // validation: null, // validation function
    name: "type",
    type: "input",
    rules: [{ required: true, message: "Cannot be empty!" }],
    value: "",
    props: {
      type: "text",
      placeholder: "forms.type",
    },
  },
  {
    label: "forms.name",
    // validation: null, // validation function
    name: "name",
    type: "input",
    rules: [{ required: true, message: "Cannot be empty!" }],
    value: "",
    props: {
      type: "text",
      placeholder: "forms.name",
    },
  },
  {
    label: "forms.icon",
    // validation: null, // validation function
    name: "icon",
    type: "input",
    rules: [{ required: true, message: "Cannot be empty!" }],
    value: "",
    props: {
      type: "text",
      placeholder: "forms.icon",
    },
  },
  {
    label: "forms.href",
    // validation: null, // validation function
    name: "href",
    type: "input",
    rules: [{ required: true, message: "Cannot be empty!" }],
    value: "",
    props: {
      type: "text",
      placeholder: "forms.href",
    },
  },
  {
    label: "forms.description",
    // validation: null, // validation function
    name: "desciption",
    type: "textarea",
    rules: [{ required: true, message: "Cannot be empty!" }],
    value: "",
    props: {
      type: "text",
      placeholder: "forms.description",
    },
  },
];

const tableColumns = [
  {
    title: "forms.type",
    dataIndex: "type",
    render: (type, record) => type,
  },
  {
    title: "forms.name",
    dataIndex: "name",
    render: (name, record) => name,
  },
  {
    title: "forms.icon",
    dataIndex: "icon",
    render: (icon, record) => (
      <Typography.Link
        href={icon}
        target="_blank"
        style={{ maxWidth: 250 }}
        ellipsis={true}
      >
        {icon}
      </Typography.Link>
    ),
  },
  {
    title: "forms.href",
    dataIndex: "href",
    render: (href, record) => (
      <Typography.Link
        href={href}
        target="_blank"
        style={{ maxWidth: 250 }}
        ellipsis={true}
      >
        {href}
      </Typography.Link>
    ),
  },
];

const linkCrud = new CrudBuilder({
  textKeys,
  idName,
  pageSize,
  position,
  find,
  findOne,
  update,
  insert,
  remove,
  tableColumns,
  // formFieldsFilter,
  formFieldsCrudBuilder,
});
export default linkCrud;
