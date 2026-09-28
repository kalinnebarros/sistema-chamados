import { STORAGE_KEY } from "../config/storage";
import { CarregarSenha } from "./senhas";

export function lerAtendimentos() {
  return CarregarSenha();
}

export function observarAtendimentos(callback) {
  const atualizar = () => callback(lerAtendimentos());

  const onStorage = (event) => {
    if (event.key === STORAGE_KEY) atualizar();
  };

  const onAtualizacaoInterna = () => atualizar();
  const onFocus = () => atualizar();
  const onVisibility = () => {
    if (!document.hidden) atualizar();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener("senhas-atualizadas", onAtualizacaoInterna);
  window.addEventListener("focus", onFocus);
  document.addEventListener("visibilitychange", onVisibility);

  const interval = window.setInterval(atualizar, 1000);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("senhas-atualizadas", onAtualizacaoInterna);
    window.removeEventListener("focus", onFocus);
    document.removeEventListener("visibilitychange", onVisibility);
    window.clearInterval(interval);
  };
}
