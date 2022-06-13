import dummy1 from "services/talents/fake/dummy1";
import { CrudBuilder } from "./CrudBuilder";

const title = "CRUD Sample";
const addActionText = "Add new talent";
const idName = "id"; // the name of the ID for your DB (example, for MongoDB it is _id)
const pageSize = 7; // page size
const position = "both"; // paginator location

let data = [];
for (let i = 1; i <= 50; i++) {
  data.push(dummy1);
}

const find = async ({ page, limit }) => {
  // data = { results: [], total: 0 }
  return Promise.resolve(() => {
    const offset = (page - 1) * limit;
    let results = [];
    for (let i = offset; i < offset + limit; i++) {
      if (i < data.length) results.push(data[i]);
      else break;
    }
    return { data: { results, total: data.length } };
  });
};

const findOne = async ({ id }) => {
  return Promise.resolve(() => {
    const rv = data.find((item) => item.id === id);
    if (!rv) return { data: {} };
    else return { data: { rv } };
  });
};

const update = ({ id, _data }) => {
  return Promise.resolve(() => {
    const idx = data.findIndex((item) => item.id === id);
    // console.log('yuu', id, idx, data[idx])
    if (idx !== -1) {
      data[idx] = { id, ..._data };
    }
    return;
  });
};

const remove = ({ id }) => {
  return Promise.resolve(() => {
    const idx = data.findIndex((item) => item.id === id);
    if (idx !== -1) {
      data.splice(idx, 1);
    }
  });
};

const insert = ({ _data }) => {
  return Promise.resolve(() => {
    let id = 1;
    if (data.length) {
      id = data[data.length - 1].id + 1;
    }
    data.push({
      ..._data,
      id,
    });
  });
};

const formFieldsFilter = [
  {
    name: "startDate",
    type: "input",
    value: "2020-01-01",
    props: {
      type: "text",
      placeholder: "Start Date",
    },
  },
  {
    name: "endDate",
    type: "input",
    value: "2020-12-31",
    props: {
      type: "text",
      placeholder: "End Date",
    },
  },
];

const formFieldsCrud = [
  {
    name: "id",
    type: "input",
    value: "",
    hidden: "add", // add, edit, all
    readonly: "all", // add, edit, all
    validation: null, // validation function
    props: {
      type: "text",
      placeholder: "ID",
    },
  },
  {
    label: "Name",
    colon: false,
    // validation: null, // validation function
    name: "first_name",
    type: "input",
    value: "",
    props: {
      type: "text",
      placeholder: "Name",
    },
  },
  {
    label: "About",
    name: "about",
    type: "textarea", // text subtype
    value: "",
    validation: null, // validation function
    props: {
      placeholder: "About",
    },
  },
  {
    label: "Height",
    colon: false,
    name: "height",
    type: "number", // text subtype
    value: 0,
    validation: null, // validation function
    props: {
      placeholder: "Height",
    },
  },
  {
    name: "dob",
    type: "date", // text subtype
    value: new Date(),
    validation: null, // validation function
    props: {
      placeholder: "Birthdate",
    },
  },
  {
    name: "meetingTime",
    type: "time", // text subtype
    value: new Date(),
    validation: null, // validation function
    props: {
      placeholder: "Meeting Time",
    },
  },
  {
    label: "Active",
    name: "active",
    type: "switch",
    value: false,
    validation: null,
    props: {
      placeholder: "Active",
    },
  },
  {
    label: "Sex",
    name: "sex",
    type: "select",
    value: "U", //  single
    validation: null,
    options: [
      { value: "M", label: "Male" },
      { value: "F", label: "Female" },
      { value: "U", label: "Not Specified" },
    ],
    props: {
      placeholder: "Sex",
      mode: "default",
    },
  },
  {
    label: "Friends",
    name: "friendsId",
    type: "select",
    value: [], // multiple
    validation: null,
    options: [
      { value: "1", label: "Friend 1" },
      { value: "2", label: "Friend 2" },
      { value: "3", label: "Friend 3" },
    ],
    props: {
      placeholder: "Friends",
      mode: "multiple",
    },
    // hidden: 'all',
    // readonly: 'all'
  },
  {
    label: "Avatar",
    colon: false,
    name: "avatar",
    type: "upload", // text subtype
    value: "",
    props: {
      placeholder: "Avatar",
    },
  },
  // drag and drop
  // autocomplete
  // comments fields
];

const tableColumns = [
  {
    title: "Name",
    dataIndex: "first_name",
    render: (text, record) => {
      return `${record.first_name} ${record.last_name}`;
    },
    sorter: true,
  },
  {
    title: "Birthdate",
    dataIndex: "dob",
    sorter: true,
    render: (text, record) => {
      return new Intl.DateTimeFormat("en-GB").format(text);
    },
  },
];

const sample = new CrudBuilder({
  textKeys: {
    createRecordTextKey: "crud.generic.create.new.record",
    updateRecordTextKey: "crud.generic.update.record",
    deleteRecordTextKey: "crud.generic.delete.record",
  },
  idName,
  pageSize,
  position,
  find,
  findOne,
  update,
  insert,
  remove,
  tableColumns,
  formFieldsFilter,
  formFieldsCrud,
});

export default sample;
