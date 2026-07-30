// ==============================================================================
// AUTENTICAÇÃO SEGURA DE ADMINISTRADOR (SHA-256 HASHING)
// Em vez de salvar a senha em texto puro no bundle público, armazenamos apenas
// os hashes criptográficos SHA-256. Qualquer verificação é realizada via Web Crypto API.
// ==============================================================================

const EXPECTED_USER_HASH = "325d8eea60b3081478a9195a828d9c4c6744756ff4c64180f28d327e7e38e2e0";
const EXPECTED_PASS_HASH = "25f2d9ef137caf765f6c51a8e62fcf1cbe73090b9a3d5045bb35a6a005d9a7fd";

async function sha256(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Valida o nome de usuário e a senha comparando hashes SHA-256.
 * Impede que a senha seja exposta em texto claro nas ferramentas do navegador.
 */
export async function verifyAdminCredentials(username, password) {
  if (!username || !password) return false;
  const userHash = await sha256(username.trim());
  const passHash = await sha256(password);
  return userHash === EXPECTED_USER_HASH && passHash === EXPECTED_PASS_HASH;
}
