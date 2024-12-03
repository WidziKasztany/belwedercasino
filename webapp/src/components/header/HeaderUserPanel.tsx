import { useContext } from "react";
import { CurrentPage, UserContext } from "../../App";
import "./HeaderUserPanel.css";

export function HeaderUserPanel(): JSX.Element {
  const context = useContext(UserContext);
  if (context.token == null || context.userData == null) return <></>;

  return (
    <div className="user-panel">
      <div className="bal">
        <h1>Stan konta</h1>
        <h2>{Math.floor(context.userData.balance * 100) / 100} PLN</h2>
      </div>
      <div className="bottom">
        <div
          className="addbalance btn"
          onClick={() => context.setPage(CurrentPage.DEPOSIT)}
        >
          Doładuj Konto
        </div>
        <div className="logout btn" onClick={() => context.logout()}>
          Wyloguj
        </div>
      </div>
    </div>
  );
}
