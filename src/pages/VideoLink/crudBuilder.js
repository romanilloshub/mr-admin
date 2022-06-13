import { UsbFilled } from "@ant-design/icons";
import { Button, Progress, Row, Col, Typography } from "antd";
import Text from "antd/lib/typography/Text";
import { CrudBuilder } from "components/custom/Crud/CrudBuilder";
import VideoService from "services/video";

const textKeys = {
  createRecordTextKey: "crud.videoLink.create.new.record",
  updateRecordTextKey: "crud.videoLink.update.record",
  deleteRecordTextKey: "crud.videoLink.delete.record",
};
const idName = "id"; // the name of the ID for your DB (example, for MongoDB it is _id)
const pageSize = 50; // page size
const position = "both"; // paginator location

const find = async ({ page, limit }) => {
  const videos = await VideoService.getVideos(page, limit);

  return {
    data: videos.data
      .map((video) =>
        (video.link || []).map((link) => ({
          ...link,
          id: `${video.id}-${link.href}`,
          videoId: video.id,
          videoTitle: video.title,
        }))
      )
      .flat(),
  };
};

const findOne = async ({ id }) => {
  const info = idSplitter(id);

  const response = await VideoService.getVideoById(info.videoId);
  const data = response.data;

  const videoLink = data.link.find((link) => link.href === info.href);
  return {
    data: {
      id: id,
      video: info.videoId,
      ...videoLink,
    },
  };
};

const insert = async ({ _data }) => {
  const videoToEditResponse = await VideoService.getVideoById(_data.video);
  const videoToEdit = videoToEditResponse.data;

  const cleanData = { ..._data };
  delete cleanData.video;

  videoToEdit.link = [...(videoToEdit.link || []), cleanData];

  return await VideoService.updateVideo(videoToEdit.id, videoToEdit);
};

const update = async ({ id, _data }) => {
  console.log(id, _data);
  const info = idSplitter(id);

  const videoToEditResponse = await VideoService.getVideoById(info.videoId);
  const videoToEdit = videoToEditResponse.data;
  const indexOfEditedLink = videoToEdit.link.findIndex(
    (link) => link.href === info.href
  );

  const cleanData = { ..._data };
  delete cleanData.id;

  videoToEdit.link[indexOfEditedLink] = cleanData;

  return await VideoService.updateVideo(videoToEdit.id, videoToEdit);
};

const remove = async ({ id }) => {
  const info = idSplitter(id);

  const videoToEditResponse = await VideoService.getVideoById(info.videoId);
  const videoToEdit = videoToEditResponse.data;

  videoToEdit.link = videoToEdit.link.filter((link) => link.href !== info.href);

  return await VideoService.updateVideo(videoToEdit.id, videoToEdit);

  console.log(id);
  // return await VideoService.deleteVideo(id);
};

const idSplitter = (id) => {
  const split = id.split("-");
  return {
    videoId: split[0],
    href: split[1],
  };
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

const formFieldsCrudBuilder = (videosCatalog) => [
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
    label: "forms.video",
    name: "video",
    type: "select",
    readonly: "edit",
    value: "", //  single
    rules: [{ required: true, message: "Cannot be empty!" }],
    options: videosCatalog.map((x) => ({
      value: x.id,
      label: x.title,
    })),
    idName: "id",
    props: {
      placeholder: "forms.video",
      mode: "default",
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

// Type        string `json:"type" bson:"type"`
// Name        string `json:"name" bson:"name"`
// Icon        string `json:"icon" bson:"icon"`
// Href        string `json:"href" bson:"href"`
// Description string `json:"desciption" bson:"desciption"`

const tableColumns = [
  // {
  //   title: "forms.id",
  //   dataIndex: "id",
  //   render: (id, record) => id,
  // },
  {
    title: "forms.video",
    dataIndex: "videoTitle",
    render: (videoTitle, record) => videoTitle,
  },
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
