import { useContext, useState } from "react";
import "./MainPage.css";
import { CategoryText } from "./categorytext/CategoryText";
import { Row } from "./row/Row";
import { ServerConnection } from "../../libs/ServerConnection";
import { UserContext } from "../../App";

function GameBanner(props: {
  width: number;
  index: number;
  img: string;
  bg?: string;
  price: string;
  name: string;
  saturatebg?: boolean;
  caseid: string;
}): JSX.Element {
  const context = useContext(UserContext);

  return (
    <>
      <div
        onClick={() => context.openCasePage(props.caseid)}
        className="gamebanner"
        style={{
          left: `calc(${20 * props.index}% + ${4 * props.index}px)`,
          width: `calc((100% / 5 - 20px * 4 / 5) * ${props.width} + ${
            (props.width - 1) * 20
          }px)`,
        }}
      >
        <div
          className={"background" + (props.saturatebg ? " saturate" : "")}
          style={{ backgroundImage: `url(${props.bg ? props.bg : "bg.jpg"})` }}
        ></div>
        <div
          className="imgCase"
          style={{ backgroundImage: `url(${JSON.stringify(props.img)})` }}
        ></div>
        <div className="text">{props.name}</div>
        <div className="price">{props.price} PLN</div>
        <div className="open">Otwórz Skrzynię</div>
      </div>
    </>
  );
}

export function MainPage(): JSX.Element {
  const context = useContext(UserContext);

  const casesData = context.casesData;

  if (casesData == null)
    return (
      <>
        <div id="mainpage">
          <h1>Ładowanie strony...</h1>
        </div>
      </>
    );

  try {
    return (
      <>
        <div id="mainpage">
          {casesData.layout.map((el) => {
            if (el.type == "category") {
              return <CategoryText color={el.color}>{el.name}</CategoryText>;
            }
            if (el.type == "row") {
              let i = 0;
              return (
                <Row>
                  {el.elements.map((layoutCase: any) => {
                    i++;

                    const caseID = layoutCase.caseid as string;
                    const caseData = casesData.data[caseID] as any;

                    if (!caseData)
                      return (
                        <>
                          <p>Couldn't load case '{caseID}'</p>
                        </>
                      );

                    if (caseData.firebg) {
                      return (
                        <GameBanner
                          width={1}
                          index={i - 1}
                          img={caseData.image}
                          name={caseData.name}
                          price={`${caseData.price}`}
                          bg="bgfire.jpg"
                          caseid={caseID}
                        />
                      );
                    }
                    return (
                      <GameBanner
                        width={1}
                        index={i - 1}
                        img={caseData.image}
                        saturatebg={true}
                        name={caseData.name}
                        price={`${caseData.price}`}
                        caseid={caseID}
                      />
                    );
                  })}
                </Row>
              );
            }
            return (
              <>
                <p>Unknown Element Type: {el.type}</p>
              </>
            );
          })}
        </div>
      </>
    );
  } catch (e) {
    return (
      <>
        <div id="mainpage">
          <p>Error while parsing data:</p>
          <p>{`${e}`}</p>
        </div>
      </>
    );
  }
}
