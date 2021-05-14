export const getCurrentUser = async () => {
    const response = await fetch(
        'http://localhost:3000/auth/init-session',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'Aplication/json',
                token: localStorage.getItem('token')
            }
        }
    )
    return response.json();
}