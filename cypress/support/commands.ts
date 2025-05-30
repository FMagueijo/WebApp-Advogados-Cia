Cypress.Commands.add('login', () => {
  cy.visit('/auth/login');

  const email = 'davidvieira51756@gmail.com';
  const password = '123joao';

  cy.get('input[placeholder="Email"]').type(email);
  cy.get('input[placeholder="Password"]').type(password);
  cy.contains('button', 'Login').click();

  cy.url().should('eq', 'http://localhost:3000/'); // Ajusta se tiveres outro domínio
});
