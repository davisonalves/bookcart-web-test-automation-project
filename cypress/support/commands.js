Cypress.Commands.add('performLogin', (username, password, { submit = true } = {}) => {
  if (username) cy.get('input[placeholder="Username"]').type(username)
  if (password) cy.get('input[placeholder="Password"]').type(password)

  cy.intercept('/api/login').as('loginRequest')
  if (submit) cy.get('form button').contains('Login').click()
})