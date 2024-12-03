import "./Row.css"

export function Row(props: { children : any }): JSX.Element {
    return (
        <div className="row">
            <div className="wrapper">
                {props.children}
            </div>
        </div>
    )
}