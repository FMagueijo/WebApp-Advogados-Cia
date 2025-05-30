describe('Testes de Login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('Deve fazer login com sucesso', () => {
    cy.get('input[placeholder="Email"]').type('davidvieira51756@gmail.com')
    cy.get('input[placeholder="Password"]').type('123joao')
    cy.contains('button', 'Login').click()

    // Verifica se o redirecionamento foi para a homepage
    cy.url().should('eq', 'http://localhost:3000/') // ou use `include` com `.should('include', '/')`
  })
})
