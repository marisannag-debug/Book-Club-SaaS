describe('Create Club', () => {
  it('creates a club and redirects', () => {
    cy.intercept('POST', '/api/clubs').as('createClub')
    cy.visit('/app/clubs/new')
    cy.get('[data-cy=create-club-name]').type('Cypress Club')
    cy.get('[data-cy=create-club-description]').type('E2E test club')
    cy.get('[data-cy=create-club-submit]').click()
    cy.wait('@createClub', { timeout: 10000 }).then((inter) => {
      expect(inter.response && inter.response.statusCode).to.equal(201)
    })
    // Wait for redirect to /app/clubs/:id
    cy.location('pathname', { timeout: 10000 }).should((pathname) => {
      expect(pathname).to.match(/\/app\/clubs\/[-a-f0-9]{36}$/)
    })
  })
})
