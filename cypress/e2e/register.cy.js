describe('Feature > Register', function () {
  beforeEach('Setup Page and Aliases', function () {
    cy.task('deleteUser', 'realuser')
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
      cy.wait('@registerRequest')
        .its('response.statusCode')
        .should('eq', 200)
    })
  })
})