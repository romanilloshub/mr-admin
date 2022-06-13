import { Button, Progress, Row, Col, Typography } from "antd";
import Text from "antd/lib/typography/Text";
import { CrudBuilder } from "components/custom/Crud/CrudBuilder";
import VideoService from "services/video";

const textKeys = {
  createRecordTextKey: "crud.video.create.new.record",
  updateRecordTextKey: "crud.video.update.record",
  deleteRecordTextKey: "crud.video.delete.record",
};
const idName = "id"; // the name of the ID for your DB (example, for MongoDB it is _id)
const pageSize = 50; // page size
const position = "both"; // paginator location

const find = async ({ page, limit }) => {
  return await VideoService.getVideos(page, limit);
};

const findOne = async ({ id }) => {
  const response = await VideoService.getVideoById(id);
  const data = response.data;
  return mapperApiToFront(data);
};

const insert = async ({ _data }) => {
  const handledData = mapperFrontToApi(_data);
  return await VideoService.createVideo(handledData);
};

const update = async ({ id, _data }) => {
  console.log(_data);
  const handledData = mapperFrontToApi(_data);
  return await VideoService.updateVideo(id, handledData);
};

const remove = async ({ id }) => {
  return await VideoService.deleteVideo(id);
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
    label: "forms.title",
    // validation: null, // validation function
    name: "title",
    type: "input",
    rules: [{ required: true, message: "Cannot be empty!" }],
    props: {
      type: "text",
      placeholder: "forms.title",
    },
  },
  {
    label: "forms.image",
    // validation: null, // validation function
    name: "image",
    type: "input",
    rules: [{ required: true, message: "Cannot be empty!" }],
    value: "",
    props: {
      type: "text",
      placeholder: "forms.image",
    },
  },
  {
    label: "forms.description",
    // validation: null, // validation function
    name: "description",
    type: "textarea",
    rules: [{ required: true, message: "Cannot be empty!" }],
    value: "",
    props: {
      type: "text",
      placeholder: "forms.description",
    },
  },
  {
    label: "forms.url",
    // validation: null, // validation function
    name: "url",
    type: "input",
    rules: [{ required: true, message: "Cannot be empty!" }],
    value: "",
    props: {
      type: "text",
      placeholder: "forms.url",
    },
  },
  {
    label: "forms.latitude",
    // validation: null, // validation function
    name: "latitude",
    type: "input",
    rules: [
      {
        required: true,
        message: "It must be a number with decimals",
        pattern: new RegExp(/^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/),
      },
    ],
    value: "",
    extra: "EX: 41.25923395111707",
    props: {
      type: "text",
      placeholder: "forms.latitude",
    },
  },
  {
    label: "forms.longitude",
    // validation: null, // validation function
    name: "longitude",
    type: "input",
    rules: [
      {
        required: true,
        message: "It must be a number with decimals",
        pattern: new RegExp(/^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/),
      },
    ],
    value: "",
    extra: "EX: -2.5961394648697786",
    props: {
      type: "text",
      placeholder: "forms.longitude",
    },
  },
  {
    label: "forms.downloadLink",
    // validation: null, // validation function
    name: "downloadLink",
    type: "input",
    rules: [{ required: true, message: "Cannot be empty!" }],
    value: "",
    props: {
      type: "text",
      placeholder: "forms.downloadLink",
    },
  },
  {
    label: "forms.qr",
    // validation: null, // validation function
    name: "qr",
    type: "input",
    rules: [{ required: true, message: "Cannot be empty!" }],
    value: "",
    props: {
      type: "text",
      placeholder: "forms.qr",
    },
  },
  {
    label: "forms.postURL",
    // validation: null, // validation function
    name: "postURL",
    type: "input",
    rules: [{ required: true, message: "Cannot be empty!" }],
    value: "",
    props: {
      type: "text",
      placeholder: "forms.postURL",
    },
  },
  {
    // validation: null, // validation function
    label: "forms.link",
    name: "link",
    type: "input",
    hidden: "all",
    props: {
      type: "text",
      placeholder: "forms.link",
    },
  },
];

const tableColumns = [
  // {
  //   title: "forms.id",
  //   dataIndex: "id",
  //   render: (id, record) => id,
  // },
  {
    title: "forms.title",
    dataIndex: "title",
    render: (title, record) => title,
  },
  {
    title: "forms.image",
    dataIndex: "image",
    render: (image, record) => (
      <Typography.Link
        href={image}
        target="_blank"
        style={{ maxWidth: 250 }}
        ellipsis={true}
      >
        {image}
      </Typography.Link>
    ),
  },
  // {
  //   title: "forms.description",
  //   dataIndex: "description",
  //   render: (description, record) => (
  //     <Typography.Paragraph style={{ maxWidth: 250 }} ellipsis={true}>
  //       {description}
  //     </Typography.Paragraph>
  //   ),
  // },
  {
    title: "forms.url",
    dataIndex: "url",
    render: (url, record) => (
      <Typography.Link
        href={url}
        target="_blank"
        style={{ maxWidth: 250 }}
        ellipsis={true}
      >
        {url}
      </Typography.Link>
    ),
  },
  // {
  //   title: "forms.geo",
  //   dataIndex: "meta",
  //   render: (meta, record) =>
  //     meta.geo ? `[${meta.geo.lat},${meta.geo.lng}]` : "-",
  // },
  {
    title: "forms.postURL",
    dataIndex: "postURL",
    render: (postURL, record) => (
      <Typography.Link
        href={postURL}
        target="_blank"
        style={{ maxWidth: 250 }}
        ellipsis={true}
      >
        {postURL}
      </Typography.Link>
    ),
  },
  {
    title: "forms.qr",
    dataIndex: "qr",
    render: (qr, record) => qr,
  },
];

const videoCrud = new CrudBuilder({
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
  showIdOnUpdate: false,
});
export default videoCrud;
