Cypress.Commands.add('performLogin', (username, password) => {
  if (username) cy.get('input[placeholder="Username"]').type(username)
  if (password) cy.get('input[placeholder="Password"]').type(password)

  cy.intercept('/api/login').as('loginRequest')
  cy.get('form button').contains('Login').click()
})