describe('Feature > Register', function () {
  beforeEach('Setup Page and Aliases', function () {
    cy.task('deleteUser', { username: 'realuser' })
    cy.task('deleteUser', { username: 'existinguser' })

    cy.visit('/register')

    cy.get('[placeholder="First name"]').as('firstNameInput')
    cy.get('[placeholder="Last Name"]').as('lastNameInput')
    cy.get('[placeholder="User name"]').as('userNameInput')
    cy.get('[placeholder="Password"]').as('passwordInput')
    cy.get('[placeholder="Confirm Password"]').as('confirmPasswordInput')
    cy.get('input[value="Male"]').as('maleGenderRadio')
  })

  context('Happy Path', function () {
    it('Registration performed successfully by entering valid details', function () {
      cy.get('@firstNameInput').type('Real')
      cy.get('@lastNameInput').type('User')

      cy.intercept('/api/user/validateUserName/*').as('validateUserNameRequest')
      cy.get('@userNameInput').type('realuser')
      cy.wait('@validateUserNameRequest')
        .its('response.statusCode')
        .should('eq', 200)

      cy.get('@passwordInput').type('StrongPassword123!')
      cy.get('@confirmPasswordInput').type('StrongPassword123!')

      cy.get('@maleGenderRadio').check()

      cy.intercept('/api/user').as('registerRequest')
      cy.contains('form button', 'Register').click()

      cy.contains(' Registration successful ').should('be.visible')
      cy.wait('@registerRequest')
        .its('response.statusCode')
        .should('eq', 200)

    })
  })

  context('Error handling', function () {
    it('Access is denied by informing an already registered username', function () {
      cy.task('createUser', {
        firstName: 'Existing',
        lastName: 'User',
        username: 'existinguser',
        password: 'Password123!',
        gender: 'Male',
        userTypeId: 2
      })

      cy.get('@firstNameInput').type('Existing')
      cy.get('@lastNameInput').type('User')

      cy.intercept('/api/user/validateUserName/*').as('validateUserNameRequest')
      cy.get('@userNameInput').type('existinguser').blur()

      cy.wait('@validateUserNameRequest')
        .its('response.body')
        .should('eq', false)
      cy.contains('mat-error', 'User Name is not available')
        .should('be.visible')
    })

    it('A message is displayed when a required field is not filled in ', function () {      
      cy.get('@firstNameInput').focus()
      cy.press(Cypress.Keyboard.Keys.TAB)

      cy.get('@lastNameInput').focus()
      cy.press(Cypress.Keyboard.Keys.TAB)

      cy.get('@userNameInput').focus()
      cy.press(Cypress.Keyboard.Keys.TAB)

      cy.get('@passwordInput').focus()
      cy.press(Cypress.Keyboard.Keys.TAB)

      cy.get('@confirmPasswordInput').focus()
      cy.press(Cypress.Keyboard.Keys.TAB)

      cy.get('@maleGenderRadio').focus()
      cy.press(Cypress.Keyboard.Keys.TAB)

      cy.contains('mat-error', 'First Name is required')
        .should('be.visible')

      cy.contains('mat-error', 'Last Name is required')
        .should('be.visible')
    
      cy.contains('mat-error', 'User Name is required')
        .should('be.visible')

      cy.contains('mat-error', 'Password is required')
        .should('be.visible')

      cy.contains('mat-error', 'Gender is required')
        .should('be.visible')
    })


    /* TODO
    
    A message is displayed when the password confirmation does not match the password
    The password strength is evaluated when the user types a password
    The password is displayed when you click the preview icon
    */
  })
})