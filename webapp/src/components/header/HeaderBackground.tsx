import "./Background.css";

function HeaderBackgroundSquare(props: { index: number }): JSX.Element {
  const delay = props.index / 40 + Math.random() / 3;
  return (
    <div className="square">
      <div
        className="middle"
        style={{
          animationDelay: delay + "s",
          backgroundColor: `rgba(255, ${200 + 55 * Math.random()}, ${
            100 * Math.random()
          }, ${0.1 + Math.random() * 0.1})`,
        }}
      ></div>
    </div>
  );
}
function HeaderBackgroundRow(): JSX.Element {
  return (
    <>
      <div className="row">
        <div className="squares">
          {(() => {
            const elements: JSX.Element[] = [];
            let index = 0;
            for (let i = 0; i < 1280; i += 50 / 3) {
              elements.push(<HeaderBackgroundSquare index={index} />);
              index++;
            }
            return elements;
          })()}
        </div>
      </div>
    </>
  );
}

let cachedBG: null | JSX.Element = null;
export function HeaderBackground(): JSX.Element {
  if (cachedBG == null) {
    cachedBG = (
      <>
        <div className="background">
          <div className="container">
            <div className="rows">
              <HeaderBackgroundRow />
              <HeaderBackgroundRow />
              <HeaderBackgroundRow />
            </div>
            <div className="overlay"></div>
          </div>
        </div>
      </>
    );
  }
  return cachedBG;
}
