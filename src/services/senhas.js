import dados from '../data/dados.json';

export function CarregarSenha(){
    const senhasSalvas = localStorage.getItem("senhas");

    
    if (senhasSalvas !== null){
        return JSON.parse(senhasSalvas)

    }
    else{
        localStorage.setItem("senhas", JSON.stringify(dados))
        return dados 

    }


}


export default function gerarSenha(tipo){
    const listaSenhas = CarregarSenha()
    const senhasDoTipo = listaSenhas.filter(senhas => senhas.tipo === tipo)
    const numeros = senhasDoTipo.map(senhas => Number(senhas.numero.slice(2)));

    const maiorNumero = Math.max(...numeros);

    let SenhaAdicionada = maiorNumero +1;

    let NumeroString = String(SenhaAdicionada).padStart(3,'0');
    let senhaCompleta = tipo + NumeroString;

    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth() + 1;
    const dia = hoje.getDate();

    const anoMenor = String(ano).slice(2);
    const mesCerto = String(mes).padStart(2,'0');
    const diaCerto = String(dia).padStart(2,'0');

    const dataCompleta = anoMenor +mesCerto + diaCerto;

    const IdSenha = (`${dataCompleta}-${senhaCompleta}`);

    let NovaSenha = {
    "id":IdSenha,
    "numero":senhaCompleta,
    "tipo":tipo,
    "estado":"EMITIDA",
    "guiche":null,
    "dataCriacao":hoje.toISOString(),
    "dataChamada":null,
    "dataFinalizacao":null,
    "tentativasChamada":0 
    }

    listaSenhas.push(NovaSenha);
    localStorage.setItem("senhas",JSON.stringify(listaSenhas));
    
    return NovaSenha;


}





