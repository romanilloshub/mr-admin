import React, { useCallback, useEffect, useState } from "react";

import IntlMessages from "util/IntlMessages";
import Crud from "components/custom/Crud";
import VideoService from "services/video";

import videoCrud from "./crudBuilder";
import { useHistory } from "react-router-dom";

const Videos = () => {
  const [crudModel, setCrudModel] = useState();
  const history = useHistory();

  const loadCrudBuilder = useCallback(async () => {
    try {
      // const videos = await VideoService.getVideos();

      videoCrud.buildFormFieldsCrud();
      setCrudModel(videoCrud);
    } catch (err) {
      throw err;
    }
  }, []);

  useEffect(() => {
    loadCrudBuilder();
  }, [loadCrudBuilder]);

  return (
    <div>
      <h2 className="title gx-mb-4">
        <IntlMessages id="sidebar.videos" />
      </h2>

      {crudModel && <Crud {...crudModel}></Crud>}
    </div>
  );
};

export default Videos;
