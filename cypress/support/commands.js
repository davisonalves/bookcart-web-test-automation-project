Cypress.Commands.add('performLogin', (username, password, { submit = true } = {}) => {
  if (username) cy.get('input[placeholder="Username"]').type(username)
  if (password) cy.get('input[placeholder="Password"]').type(password)

  cy.intercept('/api/login').as('loginRequest')
  if (submit) cy.get('form button').contains('Login').click()
})

Cypress.Commands.add('performLoginByAPI', (username, password) => {
  cy.request('POST', '/api/login', {username, password})
    .its('body')
    .then(body => {
      cy.window().its('localStorage').invoke('setItem', 'authToken', body.token)
    })
})

Cypress.Commands.add('deleteBook', (bookID) => {
  cy.window().its('localStorage').invoke('getItem', 'authToken')
    .then(authToken => {
      cy.request({
        method: 'DELETE',
        url: `/api/book/${bookID}`,
        headers: { Authorization: `Bearer ${authToken}` }
      })
    })
})