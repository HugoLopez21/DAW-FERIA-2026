
let tablero = [];          
// 0 = agua, 1 = barco
let listaBarcos = [];       
let tirosRestantes = 50;  
let barcosHundidos = 0;    

const estadisitica ={  
    grande: 10,                
    tiros_max: 50,              
    barcos: [                   
        { nombre: "Portaaviones", tamano: 5, cantidad: 1 },  
        { nombre: "Cuirassat", tamano: 4, cantidad: 2 },    
        { nombre: "Destructor", tamano: 3, cantidad: 3 },    
        { nombre: "Fragata", tamano: 2, cantidad: 2 },      
        { nombre: "Submarí", tamano: 1, cantidad: 4 }       
    ]
};

function mezclador(lista){
    let resultado = [];             
    while (lista.length > 0){      
        let posirandom = Math.floor(Math.random() * lista.length);
        resultado.push(lista[posirandom]);
        
        lista.splice(posirandom, 1);
    }
    return resultado;  
}

function tablaBarcos(){
    let copiatablero = Array(estadisitica.grande).fill().map(() => 
        Array(estadisitica.grande).fill(0)
    );
    
    // colocamos cada barco
    estadisitica.barcos.forEach(tipoBarco => {
        for (let i = 0; i < tipoBarco.cantidad; i++){
            colocarbarco(copiatablero, tipoBarco.tamano);
        }
    });
    
    return copiatablero; 
}

function colocarbarco(tableroActual, tamanoBarco){
    let colocado = false;  
    
    while (!colocado) {
        let primefila =Math.floor(Math.random() * estadisitica.grande);
        let primecolumna= Math.floor(Math.random() *estadisitica.grande);

        // si es 0.5 horizontal, si no vertical
        let horiverti =Math.random() > 0.5;
        
        // verificaciones para no salirse
        if (horiverti == true) {
            if (primecolumna + tamanoBarco > estadisitica.grande) {
                continue;
            }
        } else {
            if (primefila + tamanoBarco > estadisitica.grande) {
                continue;
            }
        }
        
        let libre = true;            
        let posicionesBarco = [];    
        
        for (let i = 0; i < tamanoBarco; i++) {
            let nuevafila = horiverti ? primefila : primefila + i;
            let nuevacolumna = horiverti ? primecolumna + i : primecolumna;
            
            if (tableroActual[nuevafila][nuevacolumna] != 0){
                libre = false;
                break;  
            }
            
            // para tener un espacio alrededor entre cada barco
            let direcciones =[
                [nuevafila-1, nuevacolumna], // arriba
                [nuevafila+1, nuevacolumna], // abajo  
                [nuevafila, nuevacolumna-1], // izquierda
                [nuevafila, nuevacolumna+1]  // derecha
            ];
            
            for (let [filacerca, columnacerca] of direcciones) {
                // verifica si esta dentro del tablero
                if (filacerca >= 0 && filacerca < estadisitica.grande) {
                    if (columnacerca >= 0 && columnacerca < estadisitica.grande) {
                        // si hay uno cerca no se puede
                        if (tableroActual[filacerca][columnacerca] != 0) {
                            libre = false;
                            break;  
                        }
                    }
                }
            } 
            
            if (libre == false) {
                break;
            }
        
            posicionesBarco.push({fila: nuevafila, columna: nuevacolumna});
        }
        
        if (libre == true) {
            // pondremos el valor de la casilla en 1 de barco
            posicionesBarco.forEach(posi => {
                tableroActual[posi.fila][posi.columna] = 1;
            });
            
            listaBarcos.push({
                posiciones: posicionesBarco,  
                tocadas: 0,                    
                hundido: false                 
            });
            
            colocado = true;  
        }
    }
}


function iniciarJuego(){  
    tablero = [];          
    listaBarcos = [];
    tirosRestantes = estadisitica.tiros_max;  
    barcosHundidos = 0;    

    tablero = tablaBarcos();
    
    crearTableroHTML();
    

    contador();               
    info("Encuentra los barcos");  
}


function crearTableroHTML(){
    const tableroDiv = document.getElementById('tablero');
    tableroDiv.innerHTML = '';
    
    for (let fila = 0; fila < estadisitica.grande; fila++) {
        for (let columna = 0; columna < estadisitica.grande; columna++) {
            const celda = document.createElement('div');
            celda.className = 'celda';
            
            celda.dataset.fila = fila; // guardamos fila y columna 
            celda.dataset.columna = columna;
            
            celda.style.border = '2px solid white';
            
            const img = document.createElement('img');
            img.src = 'img/question.png';
            
            celda.addEventListener('click', function() {
                if (celda.disabled == true) {
                    return;
                }
                
                celda.disabled = true;
                
                if (tablero[fila][columna] == 1) {
                    img.src = 'img/ship.png';
                    celda.style.border = '2px solid red';
                    impacto(fila, columna);
                    info("Tocado!");
                } else {
                    tirosRestantes--;
                    img.src = 'img/waves.png';
                    info("Agua para todos");
                }

                contador();
                verificarFinJuego();
            });
            
            celda.appendChild(img);
            tableroDiv.appendChild(celda);
        }
    }
}

function impacto(filaImpacto, columnaImpacto){
    for (let barco of listaBarcos) {
        if (barco.hundido == false) {
            for (let posicion of barco.posiciones) {
                if (posicion.fila == filaImpacto) {
                    if (posicion.columna == columnaImpacto) {
                        barco.tocadas++;
                        
                        if (barco.tocadas == barco.posiciones.length) {
                            barco.hundido = true;
                            barcosHundidos++;
                            
                            barco.posiciones.forEach(posi => {
                                const celdas = document.querySelectorAll('.celda');
                                const indice = posi.fila * estadisitica.grande + posi.columna;
                                
                                if (celdas[indice] != null) {
                                 celdas[indice].style.border = '2px solid green';
                                }
                            });
                            
                            info("Barco hundido!");
                        }
                        return;
                    }
                }
            }
        }
    }
}

function contador() {
    const contador = document.getElementById('contador');
    
    if (contador != null) {
        contador.textContent = `Tiros: ${tirosRestantes} | Encontrados: ${barcosHundidos}`;
    }
}

function verificarFinJuego() {
    if (barcosHundidos == listaBarcos.length) {
        info("Todos los barcos encontrados");
        return;  
    }
    
    if (tirosRestantes <= 0) {
        info("No tienes mas tiros, perdiste");
    }
}

function info(texto) {
    const mensaje = document.getElementById('mensaje');
    
    if (mensaje != null) {
        mensaje.textContent = texto;
    }
}


iniciarJuego();
