import { getUser } from "../api/profileFetch.js";

const user = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const userId = searchParams.get('user');

    const response = await getUser(userId);
    console.log(response);
    if (response.success) {
        // document.querySelector('h3').append(response.data.name)
    }
}

user()