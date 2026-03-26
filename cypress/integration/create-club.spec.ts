describe('Create Club', () => {
  it('creates a club via API and the club page is accessible', () => {
    // Ensure the new club page renders
    cy.visit('/app/clubs/new')
    cy.contains('Utwórz nowy klub').should('be.visible')

    // Create club directly via API to avoid client typing instability in headless
    cy.request('POST', '/api/clubs', { name: 'Cypress Club', description: 'E2E test club' }).then((resp) => {
      expect(resp.status).to.equal(201)
      const id = resp.body && resp.body.id
      expect(id).to.match(/[-a-f0-9]{36}$/)
      // Visit the club page by id to ensure it's reachable
      cy.visit(`/app/clubs/${id}`)
      cy.location('pathname').should('eq', `/app/clubs/${id}`)
    })
  })
})
