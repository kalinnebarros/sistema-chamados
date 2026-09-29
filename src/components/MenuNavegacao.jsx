import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/MenuNavegacao.css';

export default function MenuNavegacao() {
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  return (
    <>
      <button className="menu-btn-hamburguer" onClick={toggleMenu}>
        <div className={`tracinho ${menuAberto ? 'animar' : ''}`}></div>
        <div className={`tracinho ${menuAberto ? 'animar' : ''}`}></div>
        <div className={`tracinho ${menuAberto ? 'animar' : ''}`}></div>
      </button>

      <div 
        className={`menu-overlay ${menuAberto ? 'visivel' : ''}`} 
        onClick={toggleMenu}
      ></div>

      <nav className={`menu-lateral ${menuAberto ? 'aberto' : ''}`}>
        <div className="menu-cabecalho">
          <h2>Navegação</h2>
          <button className="menu-btn-fechar" onClick={toggleMenu}>X</button>
        </div>

        <ul className="menu-lista">
          <li>
            <Link to="/" onClick={toggleMenu}>🏠 Início</Link>
          </li>
          <li>
            <Link to="/emissao" onClick={toggleMenu}>🎫 Emissão de Senhas</Link>
          </li>
          <li>
            <Link to="/painel" onClick={toggleMenu}>📺 Painel (TV)</Link>
          </li>
          <li>
            <Link to="/guiche" onClick={toggleMenu}>👩‍💻 Guichê de Atendimento</Link>
          </li>
          <li>
            <Link to="/historico" onClick={toggleMenu}>📊 Histórico / Dashboard</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}