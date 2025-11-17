function getUsers() {
    try {
        return JSON.parse(localStorage.getItem('users')) || [];
    } catch (e) { return []; }
}
function saveUsers(list) { localStorage.setItem('users', JSON.stringify(list)); }
function ensureAdmin() {
    let users = getUsers();
    if (!users.some(u => u.email === 'admin@drinkzone.com')) {
        users.push({ id: Date.now(), nome: 'Admin', email: 'admin@drinkzone.com', senha: 'admin123', role: 'admin' });
        saveUsers(users);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    ensureAdmin();

    const formReg = document.getElementById('form-registro');
    const formLogin = document.getElementById('form-login');

    if (formReg) {
        formReg.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('reg-nome').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const senha = document.getElementById('reg-senha').value.trim();
            const users = getUsers();
            if (users.some(u => u.email === email)) { alert('Email já cadastrado'); return; }
            users.push({ id: Date.now(), nome, email, senha, role: 'user' });
            saveUsers(users);
            alert('Cadastro realizado! Faça login.');
            formReg.reset();
        });
    }

    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const senha = document.getElementById('login-senha').value.trim();
            const users = getUsers();
            const user = users.find(u => u.email === email && u.senha === senha);
            if (!user) { alert('Credenciais inválidas'); return; }
            localStorage.setItem('loggedUser', JSON.stringify(user));
            alert('Login efetuado!');
            if (user.role === 'admin') window.location.href = 'admin.html';
            else window.location.href = 'index.html';
        });
    }
});