import { useContext, useState } from "react";
import { UserContext } from "../../App";
import "./OpenCase.css";
import { ServerConnection } from "../../libs/ServerConnection";

function DropShowcase(props: { item: any }): JSX.Element {
  return (
    <>
      <div
        className="casedrop"
        style={{
          backgroundImage: `url(${JSON.stringify(props.item.icon)})`,
          outlineColor: props.item.color,
        }}
      >
        <p>{props.item.pfPercent}%</p>
      </div>
    </>
  );
}
function DropsShowcase(): JSX.Element {
  const context = useContext(UserContext);

  if (!context.viewedCaseData) return <></>;

  return (
    <div className="casedrops">
      {context.viewedCaseData.drops.items.map((item: any) => (
        <DropShowcase item={item} />
      ))}
    </div>
  );
}

function OpenCaseOpeningSection(): JSX.Element | JSX.Element[] {
  const context = useContext(UserContext);
  const [showDrop, setShowDrop] = useState<null | any>(null);

  if (context.viewedCaseData == null) {
    return <></>;
  }

  if (!context.isLoggedIn()) {
    return (
      <>
        <div className="opencasenotlogged">Musisz się Zalogować</div>
      </>
    );
  }

  const toRender: JSX.Element[] = [];

  if (showDrop != null) {
    toRender.push(
      <>
        <div
          className="opened"
          style={{ borderBottom: `5px solid ${showDrop.item.color}` }}
        >
          <div
            className="img"
            style={{
              filter: `blur(15px)`,
              backgroundImage: `url(${JSON.stringify(showDrop.item.icon)})`,
            }}
          ></div>
          <div
            className="img"
            style={{
              backgroundImage: `url(${JSON.stringify(showDrop.item.icon)})`,
            }}
          ></div>
          <h2>Wylosowałeś:</h2>
          <p>{showDrop.item.title}</p>
          <h3 style={{ color: showDrop.item.color }}>
            {showDrop.item.subtitle}
          </h3>
          <h4>Cena: {showDrop.price} PLN</h4>
        </div>
      </>
    );
  }

  toRender.push(
    <>
      <div
        className="opencasebtn"
        onClick={async () => {
          const drop = await ServerConnection.openCase({
            ID: (context.viewedCaseData as any).caseID,
            token: context.token as string,
          });
          setShowDrop((drop as any).drop);
          context.updateUserData();
        }}
      >
        Otwórz Skrzynkę
      </div>
    </>
  );

  return toRender;
}

export function OpenCase(): JSX.Element {
  const context = useContext(UserContext);
  if (!context.viewedCaseData)
    return (
      <>
        <p>No case data! Refresh page!</p>
      </>
    );

  return (
    <>
      <div id="opencase">
        <OpenCaseOpeningSection />
        <DropsShowcase />
        {/* <p>OpenCase Page</p>
        <p>Case ID: {context.viewedCaseData?.caseID}</p>
        <p>Drops ID: {context.viewedCaseData?.dropsID}</p>
        <p>Drops Data Type: {typeof context.viewedCaseData?.drops}</p>
        <pre>
          Drops Data:{" "}
          {JSON.stringify(context.viewedCaseData?.drops, undefined, 2)}
        </pre> */}
      </div>
    </>
  );
}
