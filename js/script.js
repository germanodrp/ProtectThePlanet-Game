var diryJ, dirxJ, jog, velJ, posX, posY;
var tamTelaW, tamTelaH;
var jogo;
var frames;
var velT;
var contBombas,painelContBombas;
var bombasTotal,velB;
var vidaPlaneta;
var intervaloCriaBomba;
var barraPlaneta;
var telaMsg;



//Função que determina os eventos quando eu APERTO as teclas.
function teclaDw() {
    /*"event.keyCode; Obtém o valor Unicode da tecla do teclado pressionada:*/
    var tecla = event.keyCode;
    if (tecla == 38) {//Cima
        //Observar que o "eixo Y é invertido", no caso, para cima é negativo
        diryJ = -1;
    }
    else if (tecla == 40) {//Baixo
        diryJ = +1;
    }
    if (tecla == 37) {//Esquerda
        dirxJ = -1;
    }
    else if (tecla == 39) {//Direita
        dirxJ = +1;
    }
    if (tecla == 32) {//TIRO
        atira(posX+27,posY);
    }

}

//Função que determina os eventos quando eu SOLTO as teclas.
function teclaUp() {
    var tecla = event.keyCode;
    if ((tecla == 38) || (tecla == 40)) {//Cima ou Baixo
        diryJ = 0;
    }
    if ((tecla == 37) || (tecla == 39)) {//Esquerda ou Direita
        dirxJ = 0;
    }

}

function criaBomba(){
    if(jogo){
        var y=0;
        var x=Math.random()*tamTelaW;
        var bomba=document.createElement("div");
        var att1=document.createAttribute("class");
        var att2=document.createAttribute("style");
        att1.value="bomba";
        att2.value="top:"+y+"px;left:"+x+"px;";
        bomba.setAttributeNode(att1);
        bomba.setAttributeNode(att2);

        document.body.appendChild(bomba);
        contBombas--;


    }
}

function colisaoTiroBomba(tiro){
    var tam =bombasTotal.length;

    for(var i=0;i<tam;i++){
        if(bombasTotal[i]){
            if(
                (
                    (tiro.offsetTop<=(bombasTotal[i].offsetTop+40))&&
                    ((tiro.offsetTop+6)>=(bombasTotal[i].offsetTop))

                )
                &&
                (
                    (tiro.offsetLeft<=(bombasTotal[i].offsetLeft+27))&&
                    ((tiro.offsetLeft+6)>=(bombasTotal[i].offsetLeft))
                )
            ){
                bombasTotal[i].remove();
                tiro.remove();
            }
        }
    }
}

function controlaBomba(){
    bombasTotal=document.getElementsByClassName("bomba");
    var tam=bombasTotal.length;
    for(var i=0;i<tam;i++){
        if(bombasTotal[i]){
            var posIndice=bombasTotal[i].offsetTop;
            posIndice+=velB;
            bombasTotal[i].style.top=posIndice+"px";
            if(posIndice>tamTelaH){
                vidaPlaneta-=10;
                bombasTotal[i].remove();
            }
        }
    }
}

function gerenciaGame(){
    barraPlaneta.style.width=vidaPlaneta+"px";
    if(contBombas<=0){
        jogo=false;
        clearInterval(intervaloCriaBomba);
       var tela= document.getElementsByClassName("telaMsg");
        tela.style.display = "block";
    }

    if(vidaPlaneta<=0){
        jogo=false;
        clearInterval(intervaloCriaBomba);
        var tela=document.getElementsByClassName("derrotaMsg");
        tela.value = tela.style.display = "block";
    }
}

function atira(x,y){
    var t=document.createElement("div");
    var att1 = document.createAttribute("class");
    var att2=document.createAttribute("style");
    att1.value = "tiroJog";
    att2.value = "top:"+y+"px;left:"+x+"px";
    t.setAttributeNode(att1);
    t.setAttributeNode(att2);
    document.body.appendChild(t);
}

function controleTiros(){
    var tiros=document.getElementsByClassName("tiroJog");
    var tamanho=tiros.length;
    for(var i=0;i<tamanho;i++){
        if(tiros[i]){
            var posicaoTiro=tiros[i].offsetTop;
            posicaoTiro-=velT;
            tiros[i].style.top=posicaoTiro+"px";
            colisaoTiroBomba(tiros[i]);
            if(posicaoTiro<0){
                tiros[i].remove();
            }
        }
    }
}

function controlaJogador(){
    posY += diryJ*velJ;
    posX += dirxJ*velJ;

    //retorna a posição de um elemento especificado.
    jog.style.top = posY + "px";
    jog.style.left = posX + "px";
}
function gameLoop() {
    //"If "jogo" for TRUE...
    if(jogo === true){
        //Funções de Controle
        controlaJogador();
        controleTiros();
        controlaBomba();
    }
    gerenciaGame();
    //Função que vai gerir o Loop do game, gerando a animação - OBSERVE A RECURSIVIDADE (gameLoop -> frames -> gameLoop)
    frames = requestAnimationFrame(gameLoop);
}

//Função que organiza a inicialização do jogo
function inicia() {
    jogo =true;
    //Inicialização da tela:
    //A propriedade innerHeight retorna a largura da área de conteúdo de uma janela
    tamTelaH = window.innerHeight;
    tamTelaW = window.innerWidth;

    //Inicialização Jogador:
    dirxJ = diryJ = 0;
    posX = tamTelaW/2;
    posY = tamTelaH/2;
    velJ = 5;
    velT = 5;
    
    jog = document.getElementById("naveJog");
    //retorna a posição de um elemento especificado.
    jog.style.top = posY + "px";
    jog.style.left = posX + "px";

    contBombas=150;

    clearInterval(intervaloCriaBomba);
    velB = 4;
    intervaloCriaBomba = setInterval(criaBomba,2000);

    vidaPlaneta=300;
    barraPlaneta=document.getElementById("barraPlaneta");
    barraPlaneta.style.width=vidaPlaneta+"px";


    telaMsg=document.getElementById("telaMsg");

    gameLoop();


}

//addEventListener() registra uma única espera de evento em um único alvo(no caso, window).
//alvo.addEventListener(tipo, escuta[, usarCaptura]);
window.addEventListener("load", inicia);

document.addEventListener("keydown", teclaDw);
document.addEventListener("keyup", teclaUp);