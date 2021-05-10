import { forgotPassfetch } from "../api/authFetch.js";

document.querySelector('.sendEmailBtn').addEventListener('click', async () => {
    const email = document.querySelector('input[type=email]').value;

    const response = await forgotPassfetch(email);
    if (response.success) {
        document.querySelector('input[type=email]').value = '';
        document.querySelector('.sendMailInfo').innerHTML = 'Within a few minutes you will receive a link in your mail';
    } else {
        document.querySelector('.sendMailInfo').innerHTML = response.message;
    }
});