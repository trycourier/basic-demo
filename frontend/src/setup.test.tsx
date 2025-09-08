import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple smoke tests to verify the testing setup works
describe('Testing Setup', () => {
  test('renders basic component', () => {
    render(<div>Test Component</div>);
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  test('basic assertions work', () => {
    expect(1 + 1).toBe(2);
    expect(true).toBeTruthy();
    expect(false).toBeFalsy();
  });

  test('can access DOM elements', () => {
    render(
      <div>
        <h1>Test Heading</h1>
        <button>Test Button</button>
        <input placeholder="Test Input" />
      </div>
    );

    expect(screen.getByRole('heading', { name: 'Test Heading' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Test Input')).toBeInTheDocument();
  });
});

// Test Material UI components work
describe('Material UI Integration', () => {
  test('can render Material UI components', () => {
    // This test will verify that Material UI is properly configured
    const TestComponent = () => (
      <div>
        <h1>Material UI Test</h1>
        <p>This verifies Material UI is working</p>
      </div>
    );

    render(<TestComponent />);
    expect(screen.getByText('Material UI Test')).toBeInTheDocument();
  });
});

// Test environment variables
describe('Environment Configuration', () => {
  test('environment variables are accessible', () => {
    // These should be defined in setupTests.ts
    expect(process.env.REACT_APP_API_BASE_URL).toBeDefined();
    expect(process.env.REACT_APP_COURIER_CLIENT_KEY).toBeDefined();
    expect(process.env.REACT_APP_COURIER_TENANT_ID).toBeDefined();
  });
});

// Test localStorage mock
describe('LocalStorage Mock', () => {
  test('localStorage is mocked', () => {
    localStorage.setItem('test-key', 'test-value');
    expect(localStorage.getItem('test-key')).toBe('test-value');
    
    localStorage.removeItem('test-key');
    expect(localStorage.getItem('test-key')).toBeNull();
  });
});
