
let users = [];
let currentUser = null;

function check_password(password) {
    let countUpper = 0;
    let countDigits = 0;
    let countSpecial = 0;
    let countLower = 0;
    let sum = 0;
    let roman_numbers = 0;
    const roman_numbers_list = ["D", "M", "X", "V", "I", "C"];
    const age = document.getElementById("age").value;


    for (let char of password) {
        if (char >= 'A' && char <= 'Z') {
            countUpper++;
        } else if (char >= 'a' && char <= 'z') {
            countLower++;
        } else if (char >= '0' && char <= '9') {
            countDigits++;
            sum += parseInt(char, 10);
        } else if (roman_numbers_list.includes(char)) {
            roman_numbers++;
        } else {
            countSpecial++;
        }
    }

    if (countUpper < 2) {
        document.getElementById("password-wrong").innerText = "Password must contain 2 or more uppercase letters";
        return false;
    }

    if (countDigits < 3) {
        document.getElementById("password-wrong").innerText = "Password must contain 3 or more numbers";
        return false;
    }

    if (countSpecial < 3) { 
        document.getElementById("password-wrong").innerText = "Password must contain 3 or more special characters";
        return false;
    }

    if (countLower < 5) {
        document.getElementById("password-wrong").innerText = "Password must contain at least 5 lowercase letters";
        return false;
    }

    if (sum !== 30) {
        document.getElementById("password-wrong").innerText = "Numbers in password must add up to 30";
        return false;
    }
    if (roman_numbers < 5) {
        document.getElementById("password-wrong").innerText = "Password must contain at least 5 roman numbers";
    }

    document.getElementById("password-wrong").innerText = "";
    if (age < 18) {
        document.getElementById("age-message").innerText = "You must be 18 years or older";
        return false;
    }
    document.getElementById("captcha").style.display = "block";

}


const passwordInput = document.getElementById("reg-password");
const toggleBtn = document.getElementById("togglePassword");

toggleBtn.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text"; 
        toggleBtn.textContent = "hide password"; 
    } else {
        passwordInput.type = "password"; 
        toggleBtn.textContent = "show password";
    }
});

const input = document.getElementById("captcha-input");

input.addEventListener("input", function (e) {
    let val = e.target.value;
    let newVal = "";

    for (let i = 0; i < val.length; i++) {
        let char = val[i];

        let r = Math.random();

        if (r < 0.05) {

            continue;
        } else if (r < 0.04) {
            newVal += char + char;
        } else if (r < 0.03 && i > 0) {
            newVal = newVal.slice(0, -1) + char + newVal[newVal.length - 1];
        } else if (r < 0.04) {
            const neighbours = {
                "a": "s", "s": "a", "d": "f", "f": "d", "e": "r", "r": "e",
                "n": "m", "m": "n", "o": "p", "p": "o"
            };
            newVal += neighbours[char.toLowerCase()] || char;
        } else {
            newVal += char;
        }
    }

    e.target.value = newVal;
});

function submit_captcha() {
    const answer = document.getElementById("captcha-input").value;
    if (answer == "024BADGHJKMNPRSTUWXY") {
        document.getElementById("loading").style.display = "block";
        setTimeout(() => {
            console.log("making account");
        }, 10000);
        setTimeout(() => {
            window.location.href = "";
        }, 5000);
    }else{
        alert("verification failed")
    }

}

function register() {
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const balance = parseFloat(document.getElementById('reg-balance').value);


    if (!username || !email || !password || balance < 0) {
        alert('Please fill all fields correctly.');
        return;
    }

    let good = check_password(password)
    if (good == true) {
        if (users.find(u => u.username === username)) {
            alert('Username already exists.');
            return;
        }

        users.push({ username, email, password, balance, transactions: [] });
        alert('Account created successfully!');
        showLogin();


    }


}
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        alert('Invalid credentials.');
        return;
    }

    currentUser = user;
    showDashboard();
}

function showRegister() {
    document.getElementById('register-page').style.display = 'block';
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard-page').style.display = 'none';
}

function showLogin() {
    document.getElementById('register-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'block';
    document.getElementById('dashboard-page').style.display = 'none';
}

function showDashboard() {
    document.getElementById('register-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard-page').style.display = 'block';

    document.getElementById('user-name').textContent = currentUser.username;
    document.getElementById('user-balance').textContent = currentUser.balance.toFixed(2);

    const history = document.getElementById('transaction-history');
    history.innerHTML = '';
    currentUser.transactions.forEach(t => {
        const li = document.createElement('li');
        li.textContent = `${t.date} | To: ${t.recipient} | Amount: $${t.amount.toFixed(2)}`;
        history.appendChild(li);
    });
}

function transfer() {
    const recipientName = document.getElementById('transfer-recipient').value;
    const amount = parseFloat(document.getElementById('transfer-amount').value);

    if (!recipientName || amount <= 0) {
        alert('Enter valid recipient and amount.');
        return;
    }

    if (amount > currentUser.balance) {
        alert('Insufficient funds.');
        return;
    }

    const recipient = users.find(u => u.username === recipientName);
    if (!recipient) {
        alert('Recipient does not exist.');
        return;
    }

    currentUser.balance -= amount;
    recipient.balance += amount;

    const date = new Date().toLocaleDateString('en-US');
    currentUser.transactions.push({ recipient: recipientName, amount, date });
    recipient.transactions.push({ recipient: currentUser.username, amount, date });

    alert(`$${amount.toFixed(2)} sent to ${recipientName}!`);
    showDashboard();

    document.getElementById('transfer-recipient').value = '';
    document.getElementById('transfer-amount').value = '';
}

function logout() {
    currentUser = null;
    showLogin();

}
