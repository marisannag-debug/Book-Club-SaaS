import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '../../app/page'

describe('Home page', () => {
  it('renders CTA', () => {
    render(<Home />)
    expect(screen.getByText(/Załóż darmowy klub/i)).toBeInTheDocument()
  })
})
