describe('Feature > Login', () => {
  beforeEach('Visit', () => {
    cy.visit('/login')
  })

  context('Happy Path', () => {
    it('Login performed successfully by entering valid credentials', () => {
      cy.get('input[placeholder="Username"]')
        .type('adminuser')
      cy.get('input[placeholder="Password"]')
        .type('qwerty')

      cy.intercept('/api/login').as('login')
      cy.get('form button')
        .contains('Login')
        .click()
      
      cy.get('@login')
        .its('response.statusCode')
        .should('eq', 200)

      cy.url().should('not.include', '/login')
      cy.get('mat-toolbar[class*=mat-toolbar]')
        .should('contain.text', 'adminuser')
        .and('contain.text', 'Admin Panel')
    })
  })

  context('Error handling', () => {
    it('Access is denied by informing invalid password for registered user', () => {

      cy.get('input[placeholder="Username"]')
        .type('adminuser')
      cy.get('input[placeholder="Password"]')
        .type('wrongpassword')

      cy.intercept('/api/login').as('login')
      cy.get('form button')
        .contains('Login')
        .click()

      cy.get('@login')
        .its('response.statusCode')
        .should('eq', 401)
      
      cy.get('mat-error')
        .should('contain.text', 'Login Failed. Username or Password is incorrect.')

      cy.get('input[placeholder="Username"]')
        .should('be.empty')
      cy.get('input[placeholder="Password"]')
        .should('be.empty')
    })
  })
})