import "./CategoryText.css"

export function CategoryText(props: {children:string, color:string}): JSX.Element {
    return (
        <div className="categorytext">
            <p>{props.children}</p>
            <p className="color" style={{backgroundColor: props.color}}>{props.children}</p>
            <div className="underline"></div>
        </div>
    )
}