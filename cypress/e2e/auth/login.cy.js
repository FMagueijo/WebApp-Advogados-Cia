describe('Testes de Login', () => {
  beforeEach(() => {
    cy.visit('/auth/login')
  })

  it('Deve logar com sucesso', () => {
    // Credenciais válidas (use as mesmas que você testou manualmente)
    const email = 'davidvieira51756@gmail.com'
    const password = '123joao'

    // Preenche com credenciais válidas
    cy.get('input[placeholder="Email"]').type(email)
    cy.get('input[placeholder="Password"]').type(password)

    // Intercepta a chamada de login para verificar o payload
    cy.intercept('POST', '/api/auth/callback/credentials').as('loginRequest')

    cy.contains('button', 'Login').click()

    // Verifica a chamada da API
    cy.wait('@loginRequest').then((interception) => {
      const body = new URLSearchParams(interception.request.body)
      expect(body.get('email')).to.eq(email)
      expect(body.get('password')).to.eq(password)
    })

    // Verifica redirecionamento após login
    cy.url().should('eq', 'http://localhost:3000/')
  })

  it('Deve exibir erro com credenciais inválidas', () => {
    cy.get('input[placeholder="Email"]').type('email@email.com')
    cy.get('input[placeholder="Password"]').type('naoexiste')
    cy.contains('button', 'Login').click()

    // Verifica se a mensagem de erro aparece corretamente
    cy.contains('div', 'Email ou password inválidos. Tente novamente.').should('be.visible')
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