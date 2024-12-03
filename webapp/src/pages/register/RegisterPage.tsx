import { useContext, useState } from "react";
import "./RegisterPage.css";
import { CurrentPage, UserContext } from "../../App";
import { Form } from "../../components/form/Form";
import { ServerConnection } from "../../libs/ServerConnection";
import { LoadingAnimation } from "../../components/loading/LoadingAnimation";

export function RegisterPage(): JSX.Element {
  const context = useContext(UserContext);

  if(context.isLoggedIn()) {
    return (<h1>Jestes juz zalogowany!</h1>)
  }

  const [error, setError] = useState<string | undefined>(undefined);
  const [info, setInfo] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <div id="registerpage">
        <Form>
          {loading ? (
            <>
              <h1>Ladowanie...</h1>
              <LoadingAnimation />
            </>
          ) : (
            <>
              <h1>Tworzenie Konta</h1>

              {error != undefined ? <p className="error">{error}</p> : <></>}
              {info != undefined ? <p className="info">{info}</p> : <></>}

              <p>Nazwa Użytkownika:</p>
              <input type="text" id="regform-username1" />
              <p>Hasło:</p>
              <input type="password" id="regform-passwd1" />
              <p>Powtórz Hasło:</p>
              <input type="password" id="regform-passwd2" />
              <div
                className="btn"
                onClick={async () => {
                  const username = (
                    document.querySelector(
                      "#regform-username1"
                    ) as HTMLInputElement
                  ).value;
                  const passwd1 = (
                    document.querySelector(
                      "#regform-passwd1"
                    ) as HTMLInputElement
                  ).value;
                  const passwd2 = (
                    document.querySelector(
                      "#regform-passwd2"
                    ) as HTMLInputElement
                  ).value;

                  setInfo(undefined);
                  if (passwd1 != passwd2) {
                    setError("Hasła się nie zgadzają!");
                  } else {
                    setError(undefined);

                    setLoading(true);
                    const res = await ServerConnection.registerRequest({
                      username: username,
                      password: passwd1,
                    });
                    setLoading(false);

                    if (!res.success) {
                      setError(res.message);
                    } else {
                      setError(undefined);
                      setInfo("Konto zostało założone!");
                      if (typeof res.token !== "undefined") {
                        console.log(res.token);
                        context?.setToken(res.token);
                      }
                      context?.setPage(CurrentPage.MAIN);
                    }
                  }
                }}
              >
                Stwórz Konto
              </div>
              <a onClick={() => context?.setPage(CurrentPage.LOGIN)}>
                Zaloguj sie
              </a>
            </>
          )}
        </Form>
      </div>
    </>
  );
}
