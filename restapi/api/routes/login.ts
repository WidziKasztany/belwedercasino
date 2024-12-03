import { DataBaseManager } from "../../database/DataBaseManager";
import { User } from "../../user/User";

module.exports = async (req, res) => {
  const username = req.body.user;
  const password = req.body.password;

  if (typeof username !== "string" || typeof password !== "string") {
    res.json({ success: false, message: "Błąd przy logowaniu" });
    return;
  }

  const user = await User.fromUsername(username);
  if (user === null) {
    res.json({
      success: false,
      message: "Konto nie istnieje!",
    });
    return;
  }

  const correctPassword = await user.isPassword(password);
  if (!correctPassword) {
    res.json({
      success: false,
      message: "Zle haslo!",
    });
    return;
  }

  const token = await user.createNewToken();

  res.json({ success: true, token: token.toString() });
};
