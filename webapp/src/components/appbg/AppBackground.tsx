import "./AppBackground.css";

let cachedBG: null | JSX.Element = null;
export function AppBackground(): JSX.Element {
  if (cachedBG == null) {
    cachedBG = (
      <div id="appbg">
        <div className="appbgimg"></div>
        <div className="triangles">
          <div className="triangle1 triangle"></div>
          <div className="triangle2 triangle"></div>
          <div className="triangle3 triangle"></div>
        </div>
        <div className="finishinggradient"></div>
        <div className="finishingnoise"></div>
      </div>
    );
  }
  return cachedBG;
}
