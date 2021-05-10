export const registerFetch = async (data) => {
    const response = await fetch(
        'http://localhost:3000/auth/register',
        {
            method: 'POST',
            headers: { 'Content-Type': 'Application/json' },
            body: JSON.stringify(data)
        }
    );
    return response.json();
}

export const loginFatch = async (data) => {
    const response = await fetch(
        'http://localhost:3000/auth/login',
        {
            method: "POST",
            headers: { 'Content-Type': 'Application/json' },
            body: JSON.stringify(data)
        }
    )
    return response.json();
}

export const initSession = async (token) => {
    const response = await fetch(
        'http://localhost:3000/auth/init-session',
        {
            method: "POST",
            headers: {
                'Content-Type': 'Application/json',
                'token': token
            }
        }
    )
    return response.json();
}

export const activate = async (token) => {
    const response = await fetch(
        'http://localhost:3000/auth/activate',
        {
            method: "POST",
            headers: { 'Content-Type': 'Application/json' },
            body: JSON.stringify({ token })
        }
    )
    return response.json();
}

export const forgotPassfetch = async (email) => {
    const response = await fetch(
        'http://localhost:3000/auth/forgot-pass',
        {
            method: "POST",
            headers: { 'Content-Type': 'Application/json' },
            body: JSON.stringify({ email })
        }
    )
    return response.json();
}

export const newPass = async (data) => {
    const response = await fetch(
        'http://localhost:3000/auth/new-pass',
        {
            method: "POST",
            headers: { 'Content-Type': 'Application/json' },
            body: JSON.stringify(data)
        }
    )
    return response.json();
}
