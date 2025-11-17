function formatMoney(value){
  return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function mountMenuToggle(){
  const btn = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if(!btn || !nav) return;
  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

function renderDestaques(){
  const container = document.getElementById('cards-destaque');
  if(!container) return;
  const produtos = window.app.getProdutos();
  container.innerHTML = '';
  produtos.slice(0,6).forEach(prod => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${prod.img}" alt="${prod.nome}" onerror="this.src='img/placeholder.png'">
      <div class="nome">${prod.nome}</div>
      <div class="preco">${formatMoney(prod.preco)}</div>
      <div style="margin-top:auto;">
        <button class="btn primary add-cart" data-id="${prod.id}">Adicionar</button>
      </div>
    `;
    container.appendChild(card);
  });

  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      addToCart(Number(btn.dataset.id));
    });
  });
}

function renderListaProdutos(filtro='', precoFilter='all'){
  const container = document.getElementById('lista-produtos');
  if(!container) return;
  let produtos = window.app.getProdutos();
  if(filtro) produtos = produtos.filter(p => p.nome.toLowerCase().includes(filtro.toLowerCase()));
  if(precoFilter === 'low') produtos = produtos.filter(p => p.preco <= 10);
  if(precoFilter === 'mid') produtos = produtos.filter(p => p.preco > 10 && p.preco <= 80);
  if(precoFilter === 'high') produtos = produtos.filter(p => p.preco > 80);
  container.innerHTML = '';
  produtos.forEach(prod => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${prod.img}" alt="${prod.nome}" onerror="this.src='img/placeholder.png'">
      <div class="nome">${prod.nome}</div>
      <div class="preco">${formatMoney(prod.preco)}</div>
      <div style="margin-top:auto;display:flex;gap:.4rem;">
        <button class="btn add-cart" data-id="${prod.id}">Adicionar</button>
      </div>
    `;
    container.appendChild(card);
  });

  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.addEventListener('click', () => addToCart(Number(btn.dataset.id)));
  });
}

function getCart(){ return JSON.parse(localStorage.getItem('cart')) || []; }
function saveCart(c){ localStorage.setItem('cart', JSON.stringify(c)); }

function addToCart(prodId){
  const produtos = window.app.getProdutos();
  const produto = produtos.find(p => p.id === prodId);
  if(!produto) { alert('Produto não encontrado'); return; }
  const cart = getCart();
  const existing = cart.find(i => i.id === prodId);
  if(existing) existing.qtd = (existing.qtd || 1) + 1;
  else cart.push({ id: produto.id, nome: produto.nome, preco: produto.preco, img: produto.img, qtd: 1 });
  saveCart(cart);
  alert(`${produto.nome} adicionado ao carrinho`);
}

function setAnoRodape(){
  document.querySelectorAll('.site-footer span, .site-footer p').forEach(el => {
  });
}

document.addEventListener('DOMContentLoaded', () => {
  mountMenuToggle();
  renderDestaques();

  const busca = document.getElementById('busca');
  const filtro = document.getElementById('filtro-preco');
  if(busca){
    busca.addEventListener('input', (e) => renderListaProdutos(e.target.value, filtro ? filtro.value : 'all'));
    if(filtro) filtro.addEventListener('change', (e)=> renderListaProdutos(busca.value, e.target.value));
    renderListaProdutos();
  }

  document.querySelectorAll('.site-footer p').forEach(p => p.textContent = '© 2025 DrinkZone - Todos os direitos reservados');
});