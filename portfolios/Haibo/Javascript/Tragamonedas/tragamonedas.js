
let creditos = 100;
let apuesta = 10;
let ganancias = 0;
let girando = false;


const simbolos = [
    { icono: '🍒', nombre: 'Cereza', valor: 2 },
    { icono: '🍋', nombre: 'Limón', valor: 3 },
    { icono: '🍊', nombre: 'Naranja', valor: 4 },
    { icono: '🍉', nombre: 'Sandía', valor: 5 },
    { icono: '🔔', nombre: 'Campana', valor: 10 },
    { icono: '⭐', nombre: 'Estrella', valor: 20 },
    { icono: '7️⃣', nombre: 'Siete', valor: 50 }
];

// Resultados actuales de los rodillos
let resultados = ['🍒', '🍒', '🍒'];


function inicializarJuego() {
    crearRodillos();
    actualizarInterfaz();
    asignarEventos();
}


function crearRodillos() {
    const rodillosContainer = document.getElementById('rodillos');
    rodillosContainer.innerHTML = '';
    
    for (let i = 0; i < 3; i++) {
        const rodillo = document.createElement('div');
        rodillo.className = 'rodillo';
        rodillo.id = `rodillo${i}`;
        
        const simbolo = document.createElement('div');
        simbolo.className = 'simbolo';
        simbolo.id = `simbolo${i}`;
        simbolo.textContent = resultados[i];
        
        rodillo.appendChild(simbolo);
        rodillosContainer.appendChild(rodillo);
    }
}


function asignarEventos() {
    // Botón GIRAR
    document.getElementById('girar').addEventListener('click', girarRodillos);
    
    // Botones de ajuste de apuesta
    document.getElementById('menosApuesta').addEventListener('click', () => cambiarApuesta(-5));
    document.getElementById('masApuesta').addEventListener('click', () => cambiarApuesta(5));
    
    // Evento de teclado (barra espaciadora para girar)
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !girando && creditos >= apuesta) {
            e.preventDefault();
            girarRodillos();
        }
    });
}


function girarRodillos() {
    if (girando || creditos < apuesta) return;
    
    // Descontar apuesta
    creditos -= apuesta;
    girando = true;
    
    // Deshabilitar botones durante el giro
    document.getElementById('girar').disabled = true;
    
    // Mostrar mensaje de giro
    document.getElementById('resultado').textContent = '🎰 Girando... 🎰';
    document.getElementById('resultado').className = '';
    
    // Generar resultados aleatorios
    resultados = [
        simbolos[Math.floor(Math.random() * simbolos.length)].icono,
        simbolos[Math.floor(Math.random() * simbolos.length)].icono,
        simbolos[Math.floor(Math.random() * simbolos.length)].icono
    ];
    

    animarGiro(0);
}


function animarGiro(iteracion) {
    const duracionTotal = 100; 
    const velocidadInicial = 30; 
    const velocidadFinal = 100; 
   
    const progreso = iteracion / duracionTotal;
    const velocidad = velocidadInicial + (velocidadFinal - velocidadInicial) * progreso;
    

    for (let i = 0; i < 3; i++) {
        const simbolo = document.getElementById(`simbolo${i}`);
        const randomIndex = Math.floor(Math.random() * simbolos.length);
        simbolo.textContent = simbolos[randomIndex].icono;
    }
    

    if (iteracion < duracionTotal) {
        setTimeout(() => animarGiro(iteracion + 1), velocidad);
    } else {
        mostrarResultados();
    }
}

function mostrarResultados() {

    for (let i = 0; i < 3; i++) {
        const simbolo = document.getElementById(`simbolo${i}`);
        simbolo.textContent = resultados[i];
    }
    
    // Calcular premio
    const premio = calcularPremio();
    ganancias = premio;
    
    // Sumar premio a créditos si hay
    if (premio > 0) {
        creditos += premio;
    }
    
    // Mostrar resultado
    const resultadoDiv = document.getElementById('resultado');
    
    if (premio > 0) {
        resultadoDiv.innerHTML = `🎉 ¡GANASTE ${premio} créditos! 🎉`;
        resultadoDiv.className = 'premio';
        
        // Efecto visual para premios grandes
        if (premio >= 50) {
            resultadoDiv.innerHTML = `🏆 ¡JACKPOT! ${premio} créditos 🏆`;
            resultadoDiv.style.animation = 'premio 0.3s infinite alternate';
        }
    } else {
        resultadoDiv.textContent = '😢 Sin premio esta vez... ¡Sigue intentando!';
        resultadoDiv.className = '';
    }
    
    // Actualizar interfaz y reanudar juego
    actualizarInterfaz();
    girando = false;
    document.getElementById('girar').disabled = false;
    
    // Verificar si se quedó sin créditos
    if (creditos <= 0) {
        setTimeout(() => {
            if (confirm('¡Te quedaste sin créditos! ¿Quieres empezar de nuevo con 100 créditos?')) {
                reiniciarJuego();
            }
        }, 500);
    }
}


function calcularPremio() {
    // Premios base
    if (resultados[0] === resultados[1] && resultados[1] === resultados[2]) {
        // 3 símbolos iguales
        const simbolo = simbolos.find(s => s.icono === resultados[0]);
        return simbolo.valor * apuesta;
    }
    
    // 2 símbolos iguales (solo el primero y segundo)
    if (resultados[0] === resultados[1]) {
        const simbolo = simbolos.find(s => s.icono === resultados[0]);
        return Math.floor(simbolo.valor * apuesta * 0.5);
    }
    
    // Combinaciones especiales
    if (resultados.includes('7️⃣') && resultados.includes('⭐') && resultados.includes('🔔')) {
        return 25; // Combinación especial
    }
    
    return 0; // Sin premio
}


function cambiarApuesta(cantidad) {
    const nuevaApuesta = apuesta + cantidad;
    
    // Limitar apuesta entre 5 y 50 créditos
    if (nuevaApuesta >= 5 && nuevaApuesta <= 50 && nuevaApuesta <= creditos) {
        apuesta = nuevaApuesta;
        actualizarInterfaz();
    }
}


function actualizarInterfaz() {
    // Actualizar valores
    document.getElementById('creditos').textContent = creditos;
    document.getElementById('apuesta').textContent = apuesta;
    document.getElementById('ganancias').textContent = ganancias;
    
    // Actualizar botón de girar
    const botonGirar = document.getElementById('girar');
    botonGirar.textContent = `🎯 GIRAR (${apuesta} créditos)`;
    botonGirar.disabled = creditos < apuesta || girando;
    
    // Actualizar colores según estado
    if (creditos < apuesta) {
        botonGirar.style.background = 'linear-gradient(45deg, #7f8c8d, #95a5a6)';
    } else {
        botonGirar.style.background = 'linear-gradient(45deg, #2ecc71, #27ae60)';
    }
    
    // Actualizar resultados visualmente
    for (let i = 0; i < 3; i++) {
        const simbolo = document.getElementById(`simbolo${i}`);
        if (simbolo) {
            simbolo.textContent = resultados[i];
            
            // Destacar símbolos ganadores
            if (resultados[0] === resultados[1] && resultados[1] === resultados[2]) {
                simbolo.style.color = '#f1c40f';
                simbolo.style.textShadow = '0 0 10px gold';
            } else if (resultados[0] === resultados[1] && i < 2) {
                simbolo.style.color = '#2ecc71';
                simbolo.style.textShadow = '0 0 5px #2ecc71';
            } else {
                simbolo.style.color = '';
                simbolo.style.textShadow = '';
            }
        }
    }
}


function reiniciarJuego() {
    creditos = 100;
    apuesta = 10;
    ganancias = 0;
    resultados = ['🍒', '🍒', '🍒'];
    actualizarInterfaz();
    
    document.getElementById('resultado').textContent = '¡Nuevo juego! Presiona GIRAR';
    document.getElementById('resultado').className = '';
}


// Iniciar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', inicializarJuego);

function fuerzaResultado(s1, s2, s3) {
    resultados = [s1, s2, s3];
    actualizarInterfaz();
}

// Para pruebas: añade créditos
function agregarCreditos(cantidad) {
    creditos += cantidad;
    actualizarInterfaz();
}