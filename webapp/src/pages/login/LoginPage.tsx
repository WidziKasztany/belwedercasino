import { useContext, useState } from "react";
import "./LoginPage.css";
import { CurrentPage, UserContext } from "../../App";
import { Form } from "../../components/form/Form";
import { LoadingAnimation } from "../../components/loading/LoadingAnimation";
import { ServerConnection } from "../../libs/ServerConnection";

export function LoginPage(): JSX.Element {
  const context = useContext(UserContext);

  if(context.isLoggedIn()) {
    return (<h1>Jestes juz zalogowany!</h1>)
  }

  const [error, setError] = useState<string | undefined>(undefined);
  const [info, setInfo] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <div id="loginpage">
        <Form>
          {loading ? (
            <>
              <h1>Ladowanie...</h1>
              <LoadingAnimation />
            </>
          ) : (
            <>
              <h1>Logowanie do Konta</h1>

              {error != undefined ? <p className="error">{error}</p> : <></>}
              {info != undefined ? <p className="info">{info}</p> : <></>}

              <p>Nazwa Użytkownika:</p>
              <input type="text" id="logform-username" />
              <p>Hasło:</p>
              <input type="password" id="logform-passwd" />
              <div
                className="btn"
                onClick={async () => {
                  const username = (
                    document.querySelector(
                      "#logform-username"
                    ) as HTMLInputElement
                  ).value;
                  const passwd = (
                    document.querySelector(
                      "#logform-passwd"
                    ) as HTMLInputElement
                  ).value;

                  setInfo(undefined);
                  setError(undefined);

                  setLoading(true);
                  const res = await ServerConnection.loginRequest({
                    username: username,
                    password: passwd,
                  });
                  setLoading(false);

                  if (!res.success) {
                    setError(res.message);
                  } else {
                    setError(undefined);
                    setInfo("Zalogowano!");
                    if (typeof res.token !== "undefined") {
                      console.log(res.token);
                      context?.setToken(res.token);
                    }
                    context?.setPage(CurrentPage.MAIN);
                  }
                }}
              >
                Zaloguj sie
              </div>
              <a onClick={() => context?.setPage(CurrentPage.REGISTER)}>
                Rejestracja
              </a>
            </>
          )}
        </Form>
      </div>
    </>
  );
}
