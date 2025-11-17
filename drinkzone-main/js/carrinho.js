function formatMoney(v) { return Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
function getCart() { return JSON.parse(localStorage.getItem('cart')) || []; }
function saveCart(c) { localStorage.setItem('cart', JSON.stringify(c)); }

function renderCartPage() {
  const container = document.getElementById('carrinho-list');
  const totalEl = document.getElementById('carrinho-total');
  if (!container) return;
  const cart = getCart();
  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = '<p>Seu carrinho está vazio.</p>';
    totalEl.textContent = 'Total: R$ 0,00';
    return;
  }
  cart.forEach((item, idx) => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="${item.img || 'img/placeholder.png'}" alt="${item.nome}" onerror="this.src='img/placeholder.png'"/>
      <div class="info">
        <div style="font-weight:800">${item.nome}</div>
        <div>${formatMoney(item.preco)} cada</div>
      </div>
      <div style="display:flex; flex-direction:column; gap:.4rem; align-items:flex-end;">
        <div style="display:flex; gap:.4rem; align-items:center;">
          <button class="btn ghost btn-dec" data-idx="${idx}">-</button>
          <div>${item.qtd}</div>
          <button class="btn ghost btn-inc" data-idx="${idx}">+</button>
        </div>
       <button class="btn btn-remove" data-idx="${idx}" style="margin-top:.4rem;">Remover</button>
      </div>
    `;
    container.appendChild(el);
  });
  const total = cart.reduce((s, it) => s + it.preco * (it.qtd || 1), 0);
  totalEl.textContent = `Total: ${formatMoney(total)}`;

  document.querySelectorAll('.btn-inc').forEach(b => b.addEventListener('click', e => {
    const i = Number(e.currentTarget.dataset.idx);
    const cart = getCart(); cart[i].qtd = (cart[i].qtd || 1) + 1; saveCart(cart); renderCartPage();
  }));

  document.querySelectorAll('.btn-dec').forEach(b => b.addEventListener('click', e => {
    const i = Number(e.currentTarget.dataset.idx);
    const cart = getCart();
    cart[i].qtd = (cart[i].qtd || 1) - 1;
    if (cart[i].qtd <= 0) cart.splice(i, 1);
    saveCart(cart); renderCartPage();
  }));

  document.querySelectorAll('.btn-remove').forEach(btn => btn.addEventListener('click', e => {
    const i = Number(e.currentTarget.dataset.idx);
    const cart = getCart();
    cart.splice(i, 1);
    saveCart(cart);
    renderCartPage();
  }));
}

document.addEventListener('DOMContentLoaded', () => {
  renderCartPage();
  const btnFinalizar = document.getElementById('btn-finalizar');
  const checkout = document.getElementById('checkout-form');
  const formFinal = document.getElementById('finalizar-form');

  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', () => {
      checkout.style.display = 'block';
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
  }

  if (formFinal) {
    formFinal.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('nome-cliente').value.trim();
      const endereco = document.getElementById('endereco-cliente').value.trim();
      const cart = getCart();
      if (!cart.length) { alert('Carrinho vazio'); return; }
      const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
      const total = cart.reduce((s, it) => s + it.preco * (it.qtd || 1), 0);
      const pedido = { id: Date.now(), cliente: nome, endereco, itens: cart, total, data: new Date().toISOString() };
      pedidos.push(pedido);
      localStorage.setItem('pedidos', JSON.stringify(pedidos));
      localStorage.removeItem('cart');
      alert('Pedido finalizado com sucesso!');
      formFinal.reset();
      renderCartPage();
      checkout.style.display = 'none';
    });
  }
});