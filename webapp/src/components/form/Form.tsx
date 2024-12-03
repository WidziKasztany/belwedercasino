import "./Form.css";

export function Form(props: { children: any }): JSX.Element {
  return (
    <>
      <div className="_form">{props.children}</div>
    </>
  );
}
