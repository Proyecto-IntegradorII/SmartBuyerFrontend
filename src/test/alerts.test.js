import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Alert } from '../components/alerts/alerts';

describe('Alert component', () => {
    test('renders with success message', () => {
        const { getAllByText } = render(<Alert type="success" message="Login Successful" />);
        
        //expect(getByText('Login Successful')).toBeInTheDocument();
        const successMessages = getAllByText('Login Successful');
        expect(successMessages.length).toBeGreaterThan(0);
        expect(successMessages[0]).toBeInTheDocument();
    });

    test('renders with error message', () => {
        const { getByText } = render(<Alert type="error" message="Login Failed" />);
        
        expect(getByText('Login Failed')).toBeInTheDocument();
    });

    test('renders with info message', () => {
        const { getByText } = render(<Alert type="info" message="Information" />);
        
        expect(getByText('Information')).toBeInTheDocument();
    });

    test('renders with OK button', () => {
        const { getByText } = render(<Alert type="success" message="Login Successful" />);
        
        expect(getByText('OK')).toBeInTheDocument();
    });

    
});
