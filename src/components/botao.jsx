export default function Botao(props){
    return(
        <button className={props.className} onClick={props.onClick}>
            {props.texto}
        </button>
    )
}