let boardSize = 0;
let boardVisible = [];
let boardSecret = [];
let lastFlipped = null; // Coordenades de l'última casella girada
let wait = false; // Indica si s'està esperant per amagar caselles
let remainingPairs = 0; // Nombre de parelles restants

// TODO: Afegir event listener al botó

const empezar = document.getElementById('start-game');
empezar.addEventListener('click', startGame);


function startGame() {

    const sizeInput = document.getElementById('board-size');
    const mida = parseInt(sizeInput.value);
     // si es menor a 2 o mayor
    if (mida < 2 || mida > 8) {
        alert('Tiene que ser un par dentro de 2 y 8');
        return;
    }
    
    // Si es par 
    if (mida % 2 != 0) {
        alert('Un numero par como el 2 4 6 u 8');
        return;
    }
    
    boardSize = mida;
    
    boardSecret = createBoardSecret(boardSize);
    
    for (let fila = 0; fila < boardSize; fila++) {
            boardVisible[fila] = [];
            for (let columna = 0; columna < boardSize; columna++) {
                boardVisible[fila][columna] = false; 
            }
    }
    

    remainingPairs = (boardSize * boardSize) / 2;
    actualizarContador();

    showBoard();

}

function createBoardSecret(tamano) {
    const totalCells = tamano * tamano; 
    const totalPairs = totalCells / 2; 
    
    // Duplicaremos cada carta 
    const cartas = [];
    for (let i = 1; i <= totalPairs; i++) {
        cartas.push(i); 
        cartas.push(i); 
    }
    const cartasMezcladas = mezclador(cartas);

    const matriz = []; 
    let indice = 0; 
    
    for (let fila = 0; fila < tamano; fila++) {
        matriz[fila] = []; 
        
        for (let columna = 0; columna < tamano; columna++) {
            // Asignamos el valor del array 
            matriz[fila][columna] = cartasMezcladas[indice];
            indice++; 
        }
    }
    
    return matriz;
}


function actualizarContador() {
    const etiquetap = document.querySelectorAll('p');
    for (let j of etiquetap) {
        if (j.textContent.startsWith('Parelles restant')) {
            j.textContent = `Parelles restant: ${remainingPairs}`;
            break;
        }
    }
}
function mezclador(listaOriginal) {
    let lista = [...listaOriginal]; 
    let mapaRandom = []; 
    
    while (lista.length > 0) {
        let random = Math.floor(Math.random() * lista.length);
        mapaRandom.push(lista[random]);
        
        lista.splice(random, 1);
    }
    
    return mapaRandom;
}



function showBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = ''; // "limpiando"
    gameBoard.style.setProperty("--boardSize", boardSize);
    
    for (let fila = 0; fila < boardSize; fila++) {
        for (let columna = 0; columna < boardSize; columna++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            const img = document.createElement('img');
            
            if (boardVisible[fila][columna]) {
                // si es visible, muestra su imagen respectiva +1 
            img.src = `images/image${boardSecret[fila][columna]}.png`;
            } 
            else {
                // y si no pues la imege0 
                img.src = 'images/image0.png';
            }
            
            cell.addEventListener('click', function() {
                girarcarta(fila, columna);
            });


            cell.appendChild(img);
            gameBoard.appendChild(cell);
        }
    }
}

function girarcarta(fila, columna) {

    // mientras ya este visible o no hagamos nada
    if (boardVisible[fila][columna] || wait) {
        return;
    }
    // La hacemos visible 
    boardVisible[fila][columna] = true;
    showBoard();

    
    if (lastFlipped == null) {
        lastFlipped = { fila: fila, columna: columna };
    } 
    else {
        // declaramos los valores 
        const primeraValor = boardSecret[lastFlipped.fila][lastFlipped.columna];
        const segundaValor = boardSecret[fila][columna];
    
        
        // Comparamos si son iguales
        if (primeraValor == segundaValor) {
            remainingPairs--;
            actualizarContador();
            //si no quedan ganas
            if (remainingPairs == 0) {
                setTimeout(() => {
                    alert("GG has ganado");
                }, 300);
            }
            
            // reiniciamos la varialbe
            lastFlipped = null;
        } 
        else {
            
            wait = true;
            setTimeout(() => {
                // las tapamos otra vez
                boardVisible[lastFlipped.fila][lastFlipped.columna] = false;
                boardVisible[fila][columna] = false;
            
                wait = false;
                lastFlipped = null;
                
                showBoard();
            }, 1000);
        }
    }
}

