import React, { useCallback, useEffect, useState } from "react";

import IntlMessages from "util/IntlMessages";
import Crud from "components/custom/Crud";
import LinkService from "services/link";

import linkCrud from "./crudBuilder";
import { useHistory } from "react-router-dom";

const Links = () => {
  const [crudModel, setCrudModel] = useState();
  const history = useHistory();

  const loadCrudBuilder = useCallback(async () => {
    try {
      const links = await LinkService.getLinks();

      linkCrud.buildFormFieldsCrud(links.data);
      setCrudModel(linkCrud);
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
        <IntlMessages id="sidebar.links" />
      </h2>

      {crudModel && <Crud {...crudModel}></Crud>}
    </div>
  );
};

export default Links;
