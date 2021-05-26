export const uploadAvatar = async (data) => {
    const response = await fetch(
        `http://localhost:3000/upload/avatar`,
        {
            method: 'PATCH',
            headers: {
                token: localStorage.getItem('token')
            },
            body: data
        }
    )
    return response.json();
}
