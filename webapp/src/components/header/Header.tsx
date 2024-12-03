import "./Header.css";
import { HeaderBackground } from "./HeaderBackground";
import { HeaderContent } from "./HeaderContent";
import { HeaderUserPanel } from "./HeaderUserPanel";

export function Header(): JSX.Element {
  return (
    <>
      <header>
        <HeaderBackground />
        <HeaderContent />
      </header>
    </>
  );
}
