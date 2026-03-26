describe('Home', () => {
  it('shows CTA', () => {
    cy.visit('http://localhost:3000')
    cy.contains('Załóż darmowy klub').should('be.visible')
  })
})
