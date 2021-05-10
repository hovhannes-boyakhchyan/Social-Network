export const getUser = async (id) => {
    const response = await fetch(
        `http://localhost:3000/profile/${id}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        }
    )
    return response.json();
}