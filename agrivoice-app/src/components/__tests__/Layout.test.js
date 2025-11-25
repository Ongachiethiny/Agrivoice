import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Layout from '../Layout'
import * as authService from '@/services/auth'

jest.mock('@/services/auth')

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Layout Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    authService.isAuthenticated = jest.fn(() => false)
    authService.getUserData = jest.fn(() => null)
  })

  test('should render navigation', () => {
    renderWithRouter(<Layout />)
    
    expect(screen.getByText('🌾 AgriVoice')).toBeInTheDocument()
  })

  test('should show auth links when not authenticated', () => {
    authService.isAuthenticated.mockReturnValue(false)
    
    renderWithRouter(<Layout />)
    
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Register')).toBeInTheDocument()
  })

  test('should show user menu when authenticated', () => {
    authService.isAuthenticated.mockReturnValue(true)
    authService.getUserData.mockReturnValue({
      username: 'testuser',
      email: 'test@example.com'
    })
    
    renderWithRouter(<Layout />)
    
    expect(screen.getByText('testuser')).toBeInTheDocument()
  })

  test('should have navigation links', () => {
    renderWithRouter(<Layout />)
    
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Diagnose')).toBeInTheDocument()
  })
})
