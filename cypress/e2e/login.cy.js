describe('Feature > Login', function () {
  beforeEach('Setup Page and Aliases', function () {
    cy.visit('/login')

    cy.get('mat-toolbar[class*=mat-toolbar]').as('headerToolbar')
    cy.get('div[class="mat-mdc-form-field-icon-suffix"] mat-icon').as('passwordVisibilityIcon')
    cy.get('input[placeholder="Password"]').as('passwordInput')
    cy.get('input[placeholder="Username"]').as('usernameInput')
  })

  context('Happy Path', function () {
    it('Login performed successfully by entering valid credentials', function () {
      cy.performLogin('adminuser', 'qwerty')

      cy.get('@loginRequest')
        .its('response.statusCode')
        .should('eq', 200)

      cy.url().should('not.include', '/login')
      cy.get('@headerToolbar')
        .should('contain.text', 'adminuser')
        .and('contain.text', 'Admin Panel')
    })

    it('The password is displayed when you click the preview icon.', function () {
      cy.get('@passwordVisibilityIcon').should('contain.text', 'visibility_off')

      cy.performLogin('adminuser', 'qwerty', { submit: false })
      cy.get('@passwordVisibilityIcon').click()

      cy.get('@passwordVisibilityIcon').should('contain.text', 'visibility')
      cy.get('@passwordInput').should('have.value', 'qwerty')
    })
  })

  context('Error handling', function () {
    it('Access is denied by informing invalid password for registered user', function () {
      cy.performLogin('adminuser', 'wrongpassword')

      cy.get('@loginRequest')
        .its('response.statusCode')
        .should('eq', 401)

      cy.get('mat-error')
        .should('contain.text', 'Login Failed. Username or Password is incorrect.')

      cy.get('@usernameInput')
        .should('be.empty')
      cy.get('@passwordInput')
        .should('be.empty')
    })

    const requiredFields = ['Username', 'Password']
    requiredFields.forEach(fieldName => {
      it(`A message is displayed when a required field is not filled in (example: ${fieldName})`, function () {
        cy.performLogin('adminuser', 'qwerty', { submit: false })
        
        cy.get(`input[placeholder="${fieldName}"]`).clear()

        cy.contains('form button', 'Login').click()

        cy.contains('mat-error', `${fieldName} is required`)
          .should('be.visible')
      })
    })
  })
})