describe('Home', () => {
  it('shows CTA', () => {
    cy.visit('/')
    cy.contains('Załóż darmowy klub').should('be.visible')
  })
})
