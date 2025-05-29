describe('Testes de Login', () => {
  beforeEach(() => {
    cy.visit('/login') // Tente também '/auth/login' se necessário
  })

  it('Deve exibir erro com credenciais inválidas', () => {
    cy.get('input[placeholder="Email"]').type('email@invalido.com')
    cy.get('input[placeholder="Password"]').type('senhaerrada')
    cy.contains('button', 'Login').click()
    cy.get('.error-box').should('be.visible')
  })
  // ... outros testes
})