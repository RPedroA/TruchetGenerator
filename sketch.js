/* 

Realizado por Rui Araujo nº30118 
Tema: Truchet Tiles

*/

let azulejos = []; // Array onde os azulejos vão ser armazenados
let cores = []; // Guarda a paleta de cores dos azulejos
let azulejosTamanho = 40; // Tamanho do azulejo
let colunas; // Variável usada para calcular o número de colunas
let linhas; // Variável usada para calcular o número de linhas
let moveX = 1; // Variável que define a velocidade de movimento dos azulejos
let tipoAzulejo; // Tipo de azulejo que será usado
let particulasApagadas = []; // Array que armazena as partículas quando um azulejo é apagado
let somApagado; // Som do azulejo a ser apagado
let somParabens; // Som de celebração
let azulejosApagados = 0; // Número de azulejos apagados
let requesitoAzulejos = 40; // Número de azulejos necessários para aparecer a celebração

function setup() {
  createCanvas(600, 600);
  frameRate(60); // Limite de framerate para animação funcionar corretamente em monitores com mais de 60Hz
  let botaoReset = createButton("Reset 🔄"); // Botão para resetar o Canvas
  botaoReset.id('botaoReset'); // Adiciona um id ao botão de reset
  botaoReset.mousePressed(resetCanvas); // Sempre que pressionado reseta o canvas
  angleMode(DEGREES); // Muda a unidade de medida dos anglos para Graus em vez do padrão Radianos 
  textAlign(CENTER, CENTER); // Alinha texto ao centro
  textSize(20); // Tamanho para o texto de celebração
  colunas = width / azulejosTamanho; // calcula a quantidade de colunas
  linhas = height / azulejosTamanho; // calcula a quantidade de linhas
  // Declara os sons associados a cada variável e da preload para ja estarem inicializados
  somApagado = loadSound('breaking_sound_effect.mp3');
  somParabens = loadSound('parabens.mp3');
  somApagado.setVolume(0.1); // Diminui o volume do somApagado
  somParabens.setVolume(0.2); // Diminui o volume do somParabens 
  resetCanvas();
}

function resetCanvas () {
  azulejosApagados = 0; // Reseta Número de azulejos apagados
  // Escolhe entre os tres tipos de azuleijos, escolhendo um novo tipo todas as vezes que se recaguerra a pagina ou o canvas
  tipoAzulejo = floor(random(3)); 
  // Declara paleta de cores dos azulejos
  cores = [color(100, 13, 107), color(181, 27, 117), color(230, 92, 25), color(0, 0, 139)];
  // Cria todos os azuleijos 
  for (let i = 0; i < colunas; i++) {
    azulejos[i] = [];
    for (let j = 0; j < linhas; j++) {
      // Seleciona uma cor aleatória
      let corEscolhida = cores[floor(random(cores.length))];
      if (tipoAzulejo == 0) { // Usado quando os azulejos sao triangulos pois tem quatro formas diferentes
        azulejos[i][j] = new Azulejo(i * azulejosTamanho, j * azulejosTamanho, floor(random(4)), corEscolhida);
      } else { // Usado quando os azulejos sao linhas ou circulos pois tem duas formas diferentes
        azulejos[i][j] = new Azulejo(i * azulejosTamanho, j * azulejosTamanho, floor(random(2)), corEscolhida);
      }
    }
  }
}

function draw() { // Desenha os elementos
  background(220); // Muda cor do background
  // Desenha todos os azulejos dentro do array
  for (let i = 0; i < colunas; i++) {
    for (let j = 0; j < linhas; j++) {
      if (azulejos[i] && azulejos[i][j] !== null) {
        azulejos[i][j].displayAzulejo();
      }
    }
  }
  // Move os azulejos para a direita
  for (let i = 0; i < colunas; i++) {
    for (let j = 0; j < linhas; j++) {
      if (azulejos[i] && azulejos[i][j] !== null) {
        azulejos[i][j].x += moveX;

        // Faz com que os triângulos quando chegam ao canto do canvas apareçam do outro lado
        if (azulejos[i][j].x > width) {
          azulejos[i][j].x = 0;
        }
      }
    }
  }

  // Desenha as particulas
  for (let i = particulasApagadas.length - 1; i >= 0; i--) {
    particulasApagadas[i].atualizar(); 
    particulasApagadas[i].displayParticulaApagada();
    if (particulasApagadas[i].foraEcra()) { 
      particulasApagadas.splice(i, 1);
    }
  }

  // Celebração, se apagar um certo numero de azulejos
  if (azulejosApagados === requesitoAzulejos) {
    // Verifica se o número de azulejos apagados atingiu o requisito
    noStroke(); // Tira a "borda"
    fill(40); 
    rectMode(CENTER); // Muda o rectMode temporariamente
    rect(width / 2, height / 2, 440, 40, 10); // Background do texto
    fill(255);
    text("🎉Parabéns, clicaste muitas vezes no ecrã🎉", width / 2, height / 2); 
    rectMode(CORNER); // Volta para o rectMode padrão
  }

  // Quadro ao redor
  noStroke();
  fill(40);
  rect(0, height - 40, width, 40);
  rect(0, 0, 40, height);
  rect(0, 0, width, 40);
  rect(width - 40, 0, 40, height);
}

// Se o rato é pressionado o seguinte acontece
function mousePressed() {
  // Declara que o pressedX e pressedY são as coordenadas do clique
  let pressedX = mouseX;
  let pressedY = mouseY;

// Verifica se azulejo ja foi apagado se nao apaga-o
  for (let i = 0; i < colunas; i++) {
    for (let j = 0; j < linhas; j++) {
      if (azulejos[i] && azulejos[i][j] !== null && azulejos[i][j].eClicado(pressedX, pressedY)) {
        if (!azulejos[i][j].apagado) {
          azulejos[i][j].apagado = true;
          azulejosApagados++;
          if (azulejosApagados === requesitoAzulejos) {
            somParabens.play(); // Reproduz o som de parabéns
          }
          // Cria as particulas
          for (let k = 0; k < 4; k++) {
            // Declara que o x e y são as coordenadas do clique
            let x = mouseX;
            let y = mouseY;
            let vx = random(-2, 2); // velocidade x
            let vy = random(-5, -3); // velocidade y
            let corParticula = azulejos[i][j].cor; // Obtém a cor do azulejo clicado
            particulasApagadas.push(new ParticulaApagada(x, y, vx, vy, corParticula)); // Chama o construtor para criar a particula
            somApagado.play(); // Reproduz o som de azulejo apagado
          }
        }
      }
    }
  }
}

// Classe do Azulejo que armazeno grande parte do codigo relacionado com ele mesmo
class Azulejo {
  // Construtor do azulejo
  constructor(x, y, tipo, cor) {
    // Define as coordenadas do canto superior esquerdo
    this.x = x; 
    this.y = y;
    // Define tipo de azulejo, por exemplo no tipoAzulejo == 0, vai ecolher entre os 3 possiveis
    this.tipo = tipo;
    // Define se o objeto tem que ser amoastrado ou nao, enquanto esta em false tem de ser
    this.apagado = false; 
    this.cor = cor; // Define a cor
  }

  // Faz com que o azulejo aparece no ecra
  displayAzulejo() {
    if (!this.apagado) { // Verifica se foi apagado
      push(); // Salva o tipo de desenho atual 
      translate(this.x, this.y); // Move o ponto de origem
      stroke(this.cor); // Define a cor da "borda"
      fill(this.cor); // Define a cor do desenho
      strokeWeight(5); // Define o tamnaho da "borda"
      
      if (tipoAzulejo == 0) { // Vai usar o azulejo triangulo
        if (this.tipo == 0) { // Vai usar o estilo 1 do triangulo
          noStroke(); // Tira a "borda"
          triangle(0, 0, 0, azulejosTamanho, azulejosTamanho, 0); // Forma do triangulo
        } else if (this.tipo == 1) { // Vai usar o estilo 2 do triangulo
          noStroke();
          triangle(azulejosTamanho, 0, 0, azulejosTamanho, azulejosTamanho, azulejosTamanho);
        } else if (this.tipo == 2) { // Vai usar o estilo 3 do triangulo
          noStroke(); 
          triangle(azulejosTamanho, azulejosTamanho, 0, azulejosTamanho, 0, 0);
        } else if (this.tipo == 3) { // Vai usar o estilo 4 do triangulo
          noStroke();
          triangle(azulejosTamanho, 0, azulejosTamanho, azulejosTamanho, 0, 0);
        }
      } else if (tipoAzulejo == 1) { // Vai usar o azulejo Circulo
        if (this.tipo == 0) { // Vai usar o estilo 1 do Circulo
          noFill(); // Retira a cor do Interior
          arc(0, 0, azulejosTamanho, azulejosTamanho, 0, 90); // Define primeiro Semicirculo do Estilo
          arc(azulejosTamanho, azulejosTamanho, azulejosTamanho, azulejosTamanho, 180, 270); // Define segundo Semicirculo do Estilo
        } else if (this.tipo == 1) { // Vai usar o estilo 2 do Circulo
          noFill();
          arc(azulejosTamanho, 0, azulejosTamanho, azulejosTamanho, 90, 180);
          arc(0, azulejosTamanho, azulejosTamanho, azulejosTamanho, 270, 360);
        }
      } else if (tipoAzulejo == 2) { // Vai usar o azulejo Linha
        if (this.tipo == 0) { // Vai usar o estilo 1 da Linha
          line(0, 0, azulejosTamanho, azulejosTamanho); // Forma da Linha
        } else if (this.tipo == 1) {
          line(azulejosTamanho, 0, 0, azulejosTamanho); // Vai usar o estilo 2 da Linha
        }
      }
      pop(); // Restora o tipo de desenho usado anteriormente
    }
  }

  // Verifica  se um azulejo foi clicado
  eClicado(mx, my) {
    return (mx > this.x && mx < this.x + azulejosTamanho && my > this.y && my < this.y + azulejosTamanho);
  }
}

class ParticulaApagada {
  // Construtor da partícula apagada
  constructor(x, y, vx, vy, cor) {
    this.x = x; // Posição x da partícula
    this.y = y; // Posição y da partícula
    this.vx = vx; // Velocidade na direção x
    this.vy = vy; // Velocidade na direção y
    this.size = random(5, 15); // Tamanho aleatório da partícula
    this.cor = cor; // Cor da partícula
  }

  // Atualiza a posição da partícula com base em sua velocidade
  atualizar() {
    this.x += this.vx; // Atualiza a posição x de acordo com a velocidade x
    this.y += this.vy; // Atualiza a posição y de acordo com a velocidade y
    this.vy += 0.2; // Adiciona uma aceleração à velocidade y (simulando a gravidade)
  }

  // Desenha a partícula na tela
  displayParticulaApagada() {
    // Dependendo do tipo de azulejo, desenhamos a partícula de forma diferente
    if (tipoAzulejo == 0) { // Azulejo de triângulo
      noStroke(); // Sem contorno
      fill(this.cor); // Preenchimento com a cor da partícula
      // Desenha um triângulo com base no tamanho e posição da partícula
      triangle(this.x, this.y, this.x + this.size, this.y - this.size, this.x - this.size, this.y - this.size);
    }
    if (tipoAzulejo == 1) { // Azulejo de círculo
      noFill(); // Sem preenchimento
      strokeWeight(2); // Espessura do contorno
      stroke(this.cor); // Cor do contorno
      // Desenha um círculo com base no tamanho e posição da partícula
      ellipse(this.x, this.y, this.size);
    }
    if (tipoAzulejo == 2) { // Azulejo de linha
      strokeWeight(2); // Espessura da linha
      stroke(this.cor); // Cor da linha
      // Desenha uma linha com base no tamanho e posição da partícula
      line(this.x, this.y, this.x + this.size, this.y + this.size);
    }
  }

  // Verifica se a partícula está fora da tela
  foraEcra() {
    return (this.y > height + this.size); // Retorna verdadeiro se a partícula estiver abaixo do limite inferior da tela
  }
}
