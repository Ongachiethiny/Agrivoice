import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Home from '../Home'

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Home Page', () => {
  test('should render home page content', () => {
    renderWithRouter(<Home />)
    
    expect(screen.getByText('Welcome to AgriVoice')).toBeInTheDocument()
    expect(screen.getByText('AI-Powered Crop Diagnosis')).toBeInTheDocument()
  })

  test('should have call-to-action buttons', () => {
    renderWithRouter(<Home />)
    
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  test('should display feature descriptions', () => {
    renderWithRouter(<Home />)
    
    // Check for feature sections
    const pageText = screen.getByText(/diagnosis|history|export/i)
    expect(pageText).toBeInTheDocument()
  })
})
