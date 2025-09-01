var countDownDate =  new Date("Sep 07, 2025 00:00:00").getTime();
var x = setInterval(function(){
    var now = new Date().getTime();
    var distance =  countDownDate - now;

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML = hours;
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;

    if(distance < 0){
        clearInterval(x);
        document.getElementById("days").innerHTML = "00";
        document.getElementById("hours").innerHTML = "00";
        document.getElementById("minutes").innerHTML = "00";
        document.getElementById("seconds").innerHTML = "00";
    }
},1000)



function toggleDiv(divid, setaid){
    if(document.getElementById(divid).style.display == 'none'){
      document.getElementById(divid).style.display = 'block';
      document.getElementById(setaid).setAttribute('src', '../IMAGENS/arrow_forward_ios_up.png')
    }else{
      document.getElementById(divid).style.display = 'none';
      document.getElementById(setaid).setAttribute('src', '../IMAGENS/arrow_forward_ios_down.png')

  }
  }

function toggleDiv(modal){
  if(document.getElementById(modal).style.display == 'none'){
    document.getElementById(modal).style.display = 'grid';
  }else{
    document.getElementById(modal).style.display = 'none';

}
}

let pagina_atual = 24

function passar_dia(x) {
  const proximaPagina = pagina_atual + x;

  if (proximaPagina >= 24 && proximaPagina <= 26) {
    const idPaginaAtual = "dia_" + pagina_atual;
    const classePaginaAtual = "dia_" + pagina_atual;
    const idProximaPagina = "dia_" + proximaPagina;
    const classeProximaPagina = "dia_" + proximaPagina;
    const titulo = document.getElementById('dia_evento_semana')
    const titulo1 = document.getElementById('dia_event')
    const btnprx = document.getElementById('btn-prx')
    const btnant = document.getElementById('btn-ant')
    document.getElementById(idPaginaAtual).style.backgroundColor = "#C6E7E2";
    document.querySelectorAll("." + classePaginaAtual).forEach(el => el.classList.add("hidden"));

    pagina_atual = proximaPagina;

    if(pagina_atual === 24){
      titulo.innerText='TERÇA-FEIRA'
      titulo1.innerText = '24 DE SETEMBRO'
      btnprx.disabled = false
      btnant.disabled = true
  }
    if(pagina_atual === 25){
        titulo.innerText='QUARTA-FEIRA'
        titulo1.innerText = '25 DE SETEMBRO'
        btnprx.disabled = false
        btnant.disabled = false
    }
    if(pagina_atual === 26){
      titulo.innerText='QUINTA-FEIRA'
      titulo1.innerText = '26 DE SETEMBRO'
      btnprx.disabled = true
      btnant.disabled = false

  }
    document.getElementById(idProximaPagina).style.backgroundColor = "#01C0A1";
    document.querySelectorAll("." + classeProximaPagina).forEach(el => el.classList.remove("hidden"));
  } 
}

function exibir_modal(modal){
  document.getElementById(modal).style.visibility = 'visible';
}
function fechar_modal(modal){
  document.getElementById(modal).style.visibility = 'hidden';
}

function menuHamburguer(){
  if(document.getElementById("menu-itens").style.display == "none"){
    document.getElementById("menu-itens").style.display = "block"
    console.log('ola')
  }else{
    document.getElementById("menu-itens").style.display = "none"
  }
}