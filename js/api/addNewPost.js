export const addNewPost = async (data) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
        'http://localhost:3000/post/',
        {
            method: 'POST',
            headers: { "token": token },
            body: data
        }
    );
    return response.json();
}