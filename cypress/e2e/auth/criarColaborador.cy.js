// Adiciona o handler para ignorar erros de hidratação
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('Hydration failed')) {
    return false // Ignora erros de hidratação
  }
  return true // Mantém o comportamento padrão para outros erros
})

describe('Teste de Criação de Colaborador', () => {
  const timestamp = Date.now()
  const colaborador = {
    nome: `Ana Silva ${timestamp}`,
    email: `ana.silva.${timestamp}@exemplo.com`,
    telefone: '912345678',
    codigoPostal: '1234-567',
    endereco: 'Rua do Exemplo, 123'
  }

  before(() => {
    cy.login()
  })

  beforeEach(() => {
    cy.visit('/criar-colaborador')
    cy.get('form').should('be.visible')
  })

  it('Deve criar um colaborador com sucesso', () => {
    // Preenche e submete o formulário
    cy.get('input[name="Nome completo"]').type(colaborador.nome)
    cy.get('input[name="Email"]').type(colaborador.email)
    cy.get('input[name="Telefone"]').type(colaborador.telefone)
    cy.get('input[name="Código Postal"]').type(colaborador.codigoPostal)
    cy.get('input[name="Endereço"]').type(colaborador.endereco)

    cy.get('button[type="submit"]').click()

    // Garante que houve redirecionamento
    cy.url().should('eq', 'http://localhost:3000/colaboradores')
  })

  it('Deve exibir o colaborador recém-criado na lista', () => {
    // Faz login novamente antes deste teste
    cy.login()

    // Visita a página da lista de colaboradores
    cy.visit('/colaboradores')

    // Verifica se o colaborador recém-criado aparece na tabela
    cy.contains('td', colaborador.nome).should('exist')
    cy.contains('td', colaborador.email).should('exist')
  })
})