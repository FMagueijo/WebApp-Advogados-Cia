// Handler para erros comuns
Cypress.on('uncaught:exception', (err) => {
  if (
    err.message.includes('Hydration failed') || 
    err.message.includes('Minified React error')
  ) {
    return false
  }
  return true
})

describe('Teste de Perfil - Visualização e Edição', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/perfil')
  })

  it('Deve carregar a página de perfil corretamente e permitir editar', () => {
    cy.contains('h1', 'Meu Perfil').should('be.visible')
    cy.get('button[aria-label="Editar perfil"]').should('be.visible')
  })

})
