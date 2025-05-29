// cypress/e2e/auth/login.cy.js
describe('Testes de Login', () => {
  beforeEach(() => {
    cy.visit('/auth/login')
  })

  it('Deve exibir erro com credenciais inválidas', () => {
    // Preenche campos pelo placeholder
    cy.get('input[placeholder="Email"]').type('maria.santos@email.com')
    cy.get('input[placeholder="Password"]').type('123maria')

    // Clica no botão de submit pelo texto
    cy.contains('button', 'Login').click()
    
    // Verifica se a mensagem de erro aparece
    cy.contains('div', 'Credenciais inválidas').should('be.visible')
      .and('contain', 'Credenciais inválidas') // Ajuste conforme sua mensagem de erro
  })

  it('Deve logar com sucesso', () => {
    // Preenche com credenciais válidas
    cy.get('input[placeholder="Email"]').type('admin@advogados.com')
    cy.get('input[placeholder="Password"]').type('SenhaSegura123')

    // Intercepta a chamada de login para verificar o payload
    cy.intercept('POST', '/api/auth/callback/credentials').as('loginRequest')

    cy.contains('button', 'Login').click()

    // Verifica a chamada da API
    cy.wait('@loginRequest').then((interception) => {
  const body = new URLSearchParams(interception.request.body)
  expect(body.get('email')).to.eq('admin@advogados.com')
  expect(body.get('password')).to.eq('SenhaSegura123')
})

    // Verifica redirecionamento após login
    cy.url().should('eq', 'http://localhost:3000/')
  })

  it('Deve mostrar loading no botão durante autenticação', () => {
    // Mock de resposta lenta
    cy.intercept('POST', '/api/auth/callback/credentials', {
      delay: 2000,
      statusCode: 200,
      body: { ok: true }
    }).as('slowLogin')

    cy.get('input[placeholder="Email"]').type('admin@advogados.com')
    cy.get('input[placeholder="Password"]').type('SenhaSegura123')
    cy.contains('button', 'Login').click()

    // Verifica texto de loading
    cy.contains('button', 'Autenticando...').should('be.visible')
    cy.wait('@slowLogin')
  })

  it('Deve exibir link de recuperação de password', () => {
    cy.contains('a', 'Esqueceu-se da Password?')
      .should('have.attr', 'href')
  })
})