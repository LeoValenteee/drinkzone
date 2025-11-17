function getUsersAdmin(){ return JSON.parse(localStorage.getItem('users')) || []; }
function saveUsersAdmin(list){ localStorage.setItem('users', JSON.stringify(list)); }
function getProdutosAdmin(){ return JSON.parse(localStorage.getItem('produtos')) || window.app.getProdutos(); }
function saveProdutosAdmin(list){ localStorage.setItem('produtos', JSON.stringify(list)); window.app.saveProdutos(list); }
function getPedidosAdmin(){ return JSON.parse(localStorage.getItem('pedidos')) || []; }
function savePedidosAdmin(list){ localStorage.setItem('pedidos', JSON.stringify(list)); }

function requireAdmin(){
  const raw = localStorage.getItem('loggedUser');
  if(!raw) { alert('Você precisa estar logado como admin'); window.location.href = 'login.html'; return false; }
  const user = JSON.parse(raw);
  if(user.role !== 'admin'){ alert('Acesso restrito'); window.location.href = 'login.html'; return false; }
  return true;
}

function renderProdutosList(){
  const div = document.getElementById('produtos-list');
  const produtos = getProdutosAdmin();
  if(!div) return;
  if(produtos.length === 0) { div.innerHTML = '<p>Nenhum produto cadastrado.</p>'; return; }
  div.innerHTML = produtos.map((p, idx) => `
    <div style="display:flex;gap:1rem;align-items:center;padding:.6rem;border-radius:8px;background:rgba(255,255,255,0.02);margin-bottom:.6rem;">
      <img src="${p.img||'img/placeholder.png'}" style="width:80px;height:60px;object-fit:cover;border-radius:8px" onerror="this.src='img/placeholder.png'"/>
      <div style="flex:1;">
        <div style="font-weight:800">${p.nome}</div>
        <div style="color:var(--muted)">${Number(p.preco).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</div>
      </div>
      <div style="display:flex;gap:.4rem;">
        <button class="btn" data-action="edit" data-idx="${idx}">Editar</button>
        <button class="btn ghost" data-action="del" data-idx="${idx}">Excluir</button>
      </div>
    </div>
  `).join('');

  div.querySelectorAll('button[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = btn.dataset.action;
      const idx = Number(btn.dataset.idx);
      let produtos = getProdutosAdmin();
      if(action === 'del'){
        if(!confirm('Excluir produto?')) return;
        produtos.splice(idx,1);
        saveProdutosAdmin(produtos);
        renderProdutosList();
      } else if(action === 'edit'){
        const p = produtos[idx];
        document.getElementById('prod-id').value = idx;
        document.getElementById('prod-nome').value = p.nome;
        document.getElementById('prod-preco').value = p.preco;
        document.getElementById('prod-img').value = p.img || '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

function renderUsuariosList(){
  const div = document.getElementById('usuarios-list');
  const users = getUsersAdmin();
  if(!div) return;
  if(users.length === 0) { div.innerHTML = '<p>Nenhum usuário cadastrado.</p>'; return; }
  div.innerHTML = users.map((u, idx) => `
    <div style="display:flex;gap:1rem;align-items:center;padding:.6rem;border-radius:8px;background:rgba(255,255,255,0.02);margin-bottom:.6rem;">
      <div style="flex:1;">
        <div style="font-weight:800">${u.nome}</div>
        <div style="color:var(--muted)">${u.email}</div>
      </div>
      <div style="display:flex;gap:.4rem;">
        <button class="btn" data-action="edit" data-idx="${idx}">Editar</button>
        <button class="btn ghost" data-action="del" data-idx="${idx}">Excluir</button>
      </div>
    </div>
  `).join('');

  div.querySelectorAll('button[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = btn.dataset.action;
      const idx = Number(btn.dataset.idx);
      let users = getUsersAdmin();
      const target = users[idx];
      if(action === 'del'){
        if(target.email === 'admin@drinkzone.com'){ alert('Não é possível excluir o admin'); return; }
        if(!confirm('Excluir usuário?')) return;
        users.splice(idx,1);
        saveUsersAdmin(users);
        renderUsuariosList();
      } else if(action === 'edit'){
        const newName = prompt('Novo nome:', target.nome);
        if(newName === null) return;
        users[idx].nome = newName.trim() || target.nome;
        saveUsersAdmin(users);
        renderUsuariosList();
      }
    });
  });
}

function renderPedidosList(){
  const div = document.getElementById('pedidos-list');
  const pedidos = getPedidosAdmin();
  if(!div) return;
  if(pedidos.length === 0) { div.innerHTML = '<p>Nenhum pedido encontrado.</p>'; return; }
  div.innerHTML = pedidos.map((p, idx) => `
    <div style="padding:.6rem;border-radius:8px;background:rgba(255,255,255,0.02);margin-bottom:.6rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div style="font-weight:800">Pedido #${p.id}</div>
        <div style="color:var(--muted)">${new Date(p.data).toLocaleString()}</div>
      </div>
      <div>Cliente: ${p.cliente} — Endereço: ${p.endereco}</div>
      <div>Total: ${Number(p.total).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</div>
      <div style="margin-top:.4rem;">
        <button class="btn ghost" data-action="del" data-idx="${idx}">Excluir Pedido</button>
      </div>
    </div>
  `).join('');

  div.querySelectorAll('button[data-action="del"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = Number(e.currentTarget.dataset.idx);
      const pedidos = getPedidosAdmin();
      if(!confirm('Excluir pedido?')) return;
      pedidos.splice(idx,1);
      savePedidosAdmin(pedidos);
      renderPedidosList();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if(!requireAdmin()) return;

  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabs = document.querySelectorAll('.tab');
  tabBtns.forEach(b => b.addEventListener('click', () => {
    tabBtns.forEach(x => x.classList.remove('active'));
    tabs.forEach(t => t.classList.remove('active'));
    b.classList.add('active');
    document.getElementById('tab-' + b.dataset.tab).classList.add('active');
  }));

  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('loggedUser');
    alert('Logout efetuado');
    location.href = 'index.html';
  });

  const form = document.getElementById('produto-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const idxVal = document.getElementById('prod-id').value;
    const nome = document.getElementById('prod-nome').value.trim();
    const preco = Number(document.getElementById('prod-preco').value);
    const img = document.getElementById('prod-img').value.trim();

    let produtos = getProdutosAdmin();

    if(idxVal === ''){
      produtos.push({ id: Date.now(), nome, preco, img });
    } else {
      const idx = Number(idxVal);
      produtos[idx].nome = nome;
      produtos[idx].preco = preco;
      produtos[idx].img = img;
    }
    saveProdutosAdmin(produtos);
    form.reset();
    document.getElementById('prod-id').value = '';
    renderProdutosList();
  });

  renderProdutosList();
  renderUsuariosList();
  renderPedidosList();
});