import { CaseManager } from "../../case/CaseManager";
import { DataBaseManager } from "../../database/DataBaseManager";
import { Token } from "../../user/Token";
import { User } from "../../user/User";

module.exports = async (req, res) => {
  const ID = req.body.ID;
  if(!ID) return;

    res.json(CaseManager.getCaseData(ID));
};
