function faltaParaMeta(ganado, meta) {
  return Math.max(0, meta - ganado);
}

module.exports = { faltaParaMeta };
