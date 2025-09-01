const cards = document.querySelectorAll('[class*="card"]');

function exibir_modal(modal){
  document.getElementById(modal).style.visibility = 'visible';
}
function fechar_modal(modal){
  document.getElementById(modal).style.visibility = 'hidden';
}


const atividade1 = document.getElementById('atividade1')
const modal1 = document.getElementById('card-overlay1')
const fechar1 = document.getElementById('fechar1')

atividade1.addEventListener('click', exibir_modal(modal1))
fechar1.addEventListener('click', exibir_modal(modal1))

cards.forEach(card => {
  card.addEventListener('click', () => {
    
    const cardNumber = card.classList[0].replace('card', ''); 

    
    const overlayId = `card-overlay${cardNumber}`;

    
    const overlay = document.getElementById(overlayId);

    
    overlay.style.display = 'block';

    
    document.addEventListener('click', function handleClickOutside(event) {
      if (!overlay.contains(event.target)) {
        overlay.style.display = 'none';
        document.removeEventListener('click', handleClickOutside);
      }
    });
  });
});