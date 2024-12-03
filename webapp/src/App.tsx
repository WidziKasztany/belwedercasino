import { Context, createContext, useState } from "react";
import { Header } from "./components/header/Header";
import { AppBackground } from "./components/appbg/AppBackground";
import { MainPage } from "./pages/main/MainPage";
import { LoginPage } from "./pages/login/LoginPage";
import { RegisterPage } from "./pages/register/RegisterPage";
import { ServerConnection } from "./libs/ServerConnection";
import { UserData } from "./libs/UserData";
import { DepositPage } from "./pages/deposit/DepositPage";
import { OpenCase } from "./pages/opencase/OpenCase";

export enum CurrentPage {
  MAIN = "MAIN",
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  DEPOSIT = "DEPOSIT",
  OPENCASE = "OPENCASE",
}
export interface UserContextParams {
  token: string | null;
  setToken: Function;

  previousPage: CurrentPage;
  page: CurrentPage;
  setPage: Function;

  openCasePage: Function;
  viewedCaseData: null | { caseID: string; caseData: string; dropsID: string; drops: any };
  casesData: { data: any; layout: any[] } | null;

  userData: UserData | null;
  logout: Function;
  isLoggedIn: Function;

  updateUserData: Function;
}

export const UserContext = createContext<UserContextParams | null>(
  null
) as Context<UserContextParams>;

let previousPage: CurrentPage = CurrentPage.LOGIN;
let loadedCasesData = false;

export function App() {
  const [token, setTokenState] = useState<string | null>(null);
  const [page, setPage] = useState<CurrentPage>(CurrentPage.MAIN);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [casesData, setCasesData] = useState<{
    data: any;
    layout: any[];
  } | null>(null);
  const [viewedCaseData, setViewedCaseData] = useState<null | {
    caseID: string;
    caseData: string;
    dropsID: string;
    drops: any;
  }>(null);

  if (casesData == null && !loadedCasesData) {
    (async () => {
      const data = await ServerConnection.getCases();
      loadedCasesData = true;
      setCasesData(data);
    })();
  }

  async function updateUserDate(_token?: string) {
    const tokenToUse = _token !== undefined ? _token : token;

    if (tokenToUse != null) {
      const data: UserData | undefined = (
        await ServerConnection.getData({ token: tokenToUse })
      ).data;
      if (data !== undefined) {
        setUserData(data);
      }
    }
  }
  async function setToken(token: string) {
    setTokenState(token);
    await updateUserDate(token);
  }
  async function logout() {
    setUserData(null);
    setTokenState(null);
    setPage(CurrentPage.MAIN);
  }
  function isLoggedIn() {
    return token != null && userData != null;
  }
  async function openCasePage(caseID: string) {
    const caseData = casesData?.data[caseID];
    const dropsID = caseData.drops;

    const data = await ServerConnection.getDropsData({ID: dropsID});
    if(data != null) {
      setViewedCaseData({ caseID: caseID, caseData: caseData, dropsID: dropsID, drops: data });
      setPage(CurrentPage.OPENCASE);
    }
  }

  function render(): JSX.Element {
    return (
      <>
        <AppBackground />
        <UserContext.Provider
          value={{
            token: token,
            setToken: setToken,

            previousPage: previousPage,
            page: page,
            setPage: setPage,

            userData: userData,
            logout: logout,
            isLoggedIn: isLoggedIn,
            updateUserData: updateUserDate,

            casesData: casesData,
            openCasePage: openCasePage,
            viewedCaseData: viewedCaseData,
          }}
        >
          <Header />
          {page == CurrentPage.MAIN ? <MainPage /> : <></>}
          {page == CurrentPage.LOGIN ? <LoginPage /> : <></>}
          {page == CurrentPage.REGISTER ? <RegisterPage /> : <></>}
          {page == CurrentPage.DEPOSIT ? <DepositPage /> : <></>}
          {page == CurrentPage.OPENCASE ? <OpenCase /> : <></>}
        </UserContext.Provider>
      </>
    );
  }
  const rendered = render();
  previousPage = page;

  return rendered;
}
