import { useContext } from "react";
import "./Content.css";
import { CurrentPage as Page, UserContext } from "../../App";
import { HeaderUserPanel } from "./HeaderUserPanel";

function HeaderLogo(): JSX.Element {
  const context = useContext(UserContext);
  return (
    <h1 className="name" onClick={() => context?.setPage(Page.MAIN)}>
      Belweder Casino
    </h1>
  );
}
function HeaderUserComponent(): JSX.Element {
  const context = useContext(UserContext);
  if (!context.isLoggedIn()) {
    return (
      <div className="button" onClick={() => context?.setPage(Page.LOGIN)}>
        Zaloguj
      </div>
    );
  }
  return (
    <>
      <div className="userinfo">
        <div className="usernamediv">
          <p>{context.userData?.username}</p>
          <p>
            {Math.floor((context.userData?.balance as number) * 100) / 100} PLN
          </p>
        </div>
        <img src="./user.svg" alt="" className="userimg" />
      </div>

      {/* <div className="button" onClick={() => context.logout()}>
        Wyloguj
      </div> */}
    </>
  );
}
export function HeaderContent(): JSX.Element {
  return (
    <>
      <div className="content">
        <HeaderLogo />
        <div className="usersection">
          <HeaderUserComponent />
          <HeaderUserPanel />
        </div>
      </div>
    </>
  );
}
