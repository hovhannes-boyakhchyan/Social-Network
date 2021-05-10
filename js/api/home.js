export const search = async (data) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
        `http://localhost:3000/user/?search=${data}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: token
            }
        }
    );
    return response.json();
}

export const sentFriendRequest = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
        `http://localhost:3000/user/${id}/friend-request`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json',
                token: token
            }
        }
    );
    return response.json();
}