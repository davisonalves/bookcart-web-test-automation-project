describe('Feature > Login', () => {
  beforeEach('Visit', () => {
    cy.visit('/login')
  })

  context('Happy Path', () => {
    it('Login performed successfully by entering valid credentials', () => {
      cy.performLogin('adminuser', 'qwerty')

      cy.get('@loginRequest')
        .its('response.statusCode')
        .should('eq', 200)

      cy.url().should('not.include', '/login')
      cy.get('mat-toolbar[class*=mat-toolbar]')
        .should('contain.text', 'adminuser')
        .and('contain.text', 'Admin Panel')
    })

    it('The password is displayed when you click the preview icon.', () => {
      cy.get('div[class="mat-mdc-form-field-icon-suffix"] mat-icon').should('contain.text', 'visibility_off')

      cy.performLogin('adminuser', 'qwerty', false)
      cy.get('div[class="mat-mdc-form-field-icon-suffix"] mat-icon').click()

      cy.get('div[class="mat-mdc-form-field-icon-suffix"] mat-icon').should('contain.text', 'visibility')
      cy.get('input[placeholder="Password"]').should('have.value', 'qwerty')
    })
  })

  context('Error handling', () => {
    it('Access is denied by informing invalid password for registered user', () => {
      cy.performLogin('adminuser', 'wrongpassword')

      cy.get('@loginRequest')
        .its('response.statusCode')
        .should('eq', 401)

      cy.get('mat-error')
        .should('contain.text', 'Login Failed. Username or Password is incorrect.')

      cy.get('input[placeholder="Username"]')
        .should('be.empty')
      cy.get('input[placeholder="Password"]')
        .should('be.empty')
    })

    const requiredFields = [
    { name: 'Username', selector: 'input[placeholder="Username"]'},
    { name: 'Password', selector: 'input[placeholder="Password"]'}]
    requiredFields.forEach(field => {
      it(`A message is displayed when a required field is not filled in (example: ${field.name})`, () => {
        cy.performLogin('adminuser', 'qwerty', false)
        
        cy.get(field.selector)
          .clear()

        cy.get('form button')
          .contains('Login')
          .click()

        cy.get('mat-error')
          .should('contain.text', `${field.name} is required`)
      })
    })
  })
})