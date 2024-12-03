import { DataBaseManager } from "../../database/DataBaseManager";
import { User } from "../../user/User";

module.exports = async (req, res) => {
  const username = req.body.user;
  const password = req.body.password;

  if (typeof username !== "string" || typeof password !== "string") {
    res.json({ success: false, message: "Błąd przy tworzeniu konta" });
    return;
  }

  if (!username.match(/^[A-Za-z0-9_]{5,30}$/)) {
    res.json({
      success: false,
      message: "Zła nazwa użytkownika! (Tylko litery i cyfry, min. 5 znaków)",
    });
    return;
  }
  if (!password.match(/^(?=.*[0-9])(?=.*[a-zA-Z])(?!.* ).{8,128}$/)) {
    res.json({
      success: false,
      message:
        "Hasło nie spełnia wymagań! (przynajmniej 1 cyfra i 1 litera. min. 8 znaków)",
    });
    return;
  }

  if ((await User.fromUsername(username)) !== null) {
    res.json({
      success: false,
      message: "Konto z taką nazwą użytkownika już istnieje!",
    });
    return;
  }

  const user = await User.createNew(username);
  await user.setPassword(password);

  const token = await user.createNewToken();

  res.json({ success: true, token: token.toString() });
};
