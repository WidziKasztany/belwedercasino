import { DataBaseManager } from "../../database/DataBaseManager";
import { Token } from "../../user/Token";
import { User } from "../../user/User";

module.exports = async (req, res) => {
  const rawToken = req.body.token;

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

  res.json({
    success: true,
    data: {
      username: user.getUsername(),
      balance: await user.getBalance(),
    },
  });
};
