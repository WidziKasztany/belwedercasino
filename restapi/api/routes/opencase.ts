import { CaseManager } from "../../case/CaseManager";
import { DataBaseManager } from "../../database/DataBaseManager";
import { Token } from "../../user/Token";
import { User } from "../../user/User";

const data = require("./../../case/data.json");

module.exports = async (req, res) => {
  const rawToken = req.body.token;
  const caseid = req.body.caseid as string;

  if (typeof rawToken !== "string") {
    res.json({ success: false });
    return;
  }

  const token = Token.getToken(rawToken);
  if (token === null) {
    res.json({ success: false });
    return;
  }

  const user = await token.getUser();
  if (user === null) {
    res.json({ success: false });
    return;
  }

  const valid = user.isTokenValid(token);
  if (!valid) {
    res.json({ success: false });
    return;
  }

  const caseprice = data[caseid].price;

  if ((await user.getBalance()) < caseprice) {
    res.json({
      success: false,
    });
    return;
  }

  const casedrops = data[caseid].drops;

  const random = Math.floor(Math.random() * 100_000) + 1;

  const drop = CaseManager.getCaseDropFromChances(casedrops, random);
  await user.addBalance(drop.price - caseprice);
  console.log(`price: ${caseprice}, gain: ${drop.price}`);

  res.json({
    success: true,
    drop: drop,
  });
};
