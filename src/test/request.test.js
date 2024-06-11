import fetchMock from 'jest-fetch-mock';
import { postData, postLogin, postLoginGoogle } from '../conections/requests';

// Enable fetch mocks before each test
beforeEach(() => {
    fetchMock.resetMocks();
});

describe('API Requests', () => {
    test('postData submits data successfully', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ message: 'Success' }), { status: 200 });

        const response = await postData({ username: 'testuser', email: 'test@example.com' });

        expect(response).toBe('Data submitted successfully');
        expect(fetchMock).toHaveBeenCalledWith('https://smartbuyerbackendmain.onrender.com/register/user', expect.any(Object));
    });

    /*test('postData handles error response', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ error: 'Email or Username already taken' }), { status: 400 });

        const response = await postData({ username: 'testuser', email: 'test@example.com' });

        expect(response).toBe('Email or Username already taken');
    });

    test('postData handles network error', async () => {
        fetchMock.mockRejectOnce(new Error('Network Error'));

        const response = await postData({ username: 'testuser', email: 'test@example.com' });

        expect(response).toBe('Conection failed');
    });*/

    test('postLogin handles successful login', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({
            token: 'fake-token',
            usuarioData: {
                email: 'test@example.com',
                id_usuario: 1,
                nombre_usuario: 'testuser',
                // additional user data fields
            },
        }), { status: 200 });

        const response = await postLogin({ username: 'testuser', password: 'password' });

        expect(response).toBe('Inicio de sesión exitoso');
        expect(localStorage.getItem('token')).toBe('fake-token');
    });

    /*test('postLogin handles incorrect credentials', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ error: 'Credenciales incorrectas' }), { status: 401 });

        const response = await postLogin({ username: 'testuser', password: 'wrongpassword' });

        expect(response).toBe('Credenciales incorrectas');
    });

    test('postLogin handles network error', async () => {
        fetchMock.mockRejectOnce(new Error('Network Error'));

        const response = await postLogin({ username: 'testuser', password: 'password' });

        expect(response).toBe('Error de conexión');
    });*/

    test('postLoginGoogle handles successful login', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({
            token: 'fake-token',
            usuarioData: {
                email: 'test@example.com',
                id_usuario: 1,
                nombre_usuario: 'testuser',
                // additional user data fields
            },
        }), { status: 200 });

        const response = await postLoginGoogle({ token: 'google-token' });

        expect(response).toBe('Inicio de sesión exitoso');
        expect(localStorage.getItem('token')).toBe('fake-token');
    });

    /*test('postLoginGoogle handles incorrect credentials', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ error: 'Credenciales incorrectas' }), { status: 401 });

        const response = await postLoginGoogle({ token: 'google-token' });

        expect(response).toBe('Credenciales incorrectas');
    });

    test('postLoginGoogle handles network error', async () => {
        fetchMock.mockRejectOnce(new Error('Network Error'));

        const response = await postLoginGoogle({ token: 'google-token' });

        expect(response).toBe('Error de conexión');
    });*/
});
