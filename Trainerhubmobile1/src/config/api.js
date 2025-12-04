// Trainerhubmobile1/src/config/api.js

// ⬇️ Coloque aqui o IP da sua máquina + porta do backend PHP
// Ex.: se o backend está com `php -S localhost:8000 -t public`
// e seu IP na rede é 192.168.0.100:
//
//     http://192.168.0.100:8000
//
export const API_URL = "http://192.168.0.100:8080";

// fallback para testes, caso não tenha ninguém logado ainda
const FALLBACK_ALUNO_ID = "2f492373-50f4-48a8-930a-e12f30197a25";

let loggedUser = null;
let alunoId = null;

// guarda o usuário logado (vem do /api/login ou /api/auth/register)
export function setLoggedUser(user) {
  loggedUser = user;
  // se vier id, já atualiza o alunoId também
  if (user && user.id) {
    alunoId = user.id;
  }
}

export function getLoggedUser() {
  return loggedUser;
}

// set explícito do alunoId (usado no App.js após login/cadastro)
export function setAlunoId(id) {
  alunoId = id;
}

// sempre que o app precisar do id do aluno, usa isso
export function getAlunoId() {
  // 1) se foi setado explicitamente
  if (alunoId) {
    return alunoId;
  }
  // 2) se tem usuário logado com id
  if (loggedUser && loggedUser.id) {
    return loggedUser.id;
  }
  // 3) fallback (aluno de teste fixo)
  return FALLBACK_ALUNO_ID;
}

// limpa usuário logado e alunoId (usado no logoff)
export function clearAuth() {
  loggedUser = null;
  alunoId = null;
}
