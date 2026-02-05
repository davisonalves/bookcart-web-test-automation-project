describe('Feature > Admin Panel > Add Book', function () {
    beforeEach('Setup Page and Aliases', function () {
        cy.performLoginByAPI('adminuser', 'qwerty')

        cy.visit('/admin/books')
        cy.contains('button', 'Add Book').click()

        cy.get('[placeholder="Title"]').as('titleInput')
        cy.get('[placeholder="Author"]').as('authorInput')
        cy.get('[placeholder="Category"]').as('categoryInput')
        cy.get('[placeholder="Price"]').as('priceInput')

        cy.contains('button', 'Save').as('saveButton').as('saveButton')
        cy.contains('button', 'Cancel').as('cancelButton')

        cy.contains('[for="file-upload"]', 'Upload poster').as('uploadPosterButton')
    })

    context('Happy Path', function () {
        it('A new book is created by entering valid data', function () {
            cy.get('@titleInput').type('Harry Potter and The prisoner of Azkaban')
            cy.get('@authorInput').type('J.K. Rowling')

            cy.get('@categoryInput').click()
            cy.contains('[role="option"]', 'Fantasy').click()
            
            cy.get('@priceInput').type('15.99')

            cy.get('@uploadPosterButton').selectFile('cypress/fixtures/hp.prisoner.of.azkaban.jpeg')

            cy.intercept('GET', '/api/book').as('getBookRequest')
            cy.intercept('POST', '/api/book').as('postBookRequest')
            cy.get('@saveButton').click()

            cy.wait('@postBookRequest').its('response.statusCode').should('eq', 200)
            cy.wait('@getBookRequest').its('response.statusCode').should('eq', 200)

            cy.contains('Harry Potter and The prisoner of Azkaban').should('be.visible')
            cy.contains('J.K. Rowling').should('be.visible')
            cy.contains('Fantasy').should('be.visible')
            cy.contains('₹15.99').should('be.visible')

            // Cleanup - Deleting the last created book
            cy.get('@getBookRequest').then(({response}) => {
                const lastCreatedBook = response.body.length - 1
                cy.deleteBook(response.body[lastCreatedBook].bookId)
            })
        })
    })
})