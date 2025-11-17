const produtosDefault = [
  { id: 1, nome: "Coca-Cola Zero 2L", preco: 9.0, img: "img/CocaZero2L.webp" },
  { id: 2, nome: "Tequila José Cuervo Gold 750ml", preco: 139.0, img: "img/JoseCuervo.webp" },
  { id: 3, nome: "Baly Lata 250ml", preco: 6.0, img: "img/Baly.webp" },
  { id: 4, nome: "Ciroc 750ml", preco: 89.0, img: "img/Ciroc.webp" },
  { id: 5, nome: "Água 500ml", preco: 2.0, img: "img/Agua.webp" },
  { id: 6, nome: "Gin Beefeater 750ml", preco: 79.0, img: "img/Beefeater.webp" },
  { id: 7, nome: "RedBull Lata 250ml", preco: 8.0, img: "img/RedBull.webp" },
  { id: 8, nome: "Licor 43 700ml", preco: 119.0, img: "img/Licor.webp" },
  { id: 9, nome: "Água com gás 500ml", preco: 2.9, img: "img/Agua1.webp" },
  { id:10, nome: "Jagermeister 700ml", preco: 99.0, img: "img/Jagermeister.webp"},
  { id:11, nome: "Jack Daniels 1L", preco: 127.0, img: "img/Jack.webp"},
  { id:12, nome: "Corona 355ml", preco: 7.6, img: "img/Corona.webp"}
];

function getProdutos(){
  const raw = localStorage.getItem('produtos');
  if(!raw) return produtosDefault.slice();
  try {
    const parsed = JSON.parse(raw);
    if(Array.isArray(parsed)) return parsed;
    return produtosDefault.slice();
  } catch(e){
    console.warn('Erro ao parsear produtos', e);
    return produtosDefault.slice();
  }
}
function saveProdutos(list){
  localStorage.setItem('produtos', JSON.stringify(list));
}

window.app = window.app || {};
window.app.getProdutos = getProdutos;
window.app.saveProdutos = saveProdutos;

