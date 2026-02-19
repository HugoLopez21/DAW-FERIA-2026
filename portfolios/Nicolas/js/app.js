// js/app.js

/**
 * ==========================================
 * 1. BASE DE DATOS DE PROYECTOS (DATA)
 * ==========================================
 * Aquí guardamos la información única de cada tarjeta.
 * El 'id' debe coincidir con el 'data-id' del HTML.
 */
const projectsData = [
    {
        id: 1,
        title: "YOGA STUDIO",
        category: "Web Design / Landing Page",
        description: "El objetivo fue transmitir calma absoluta a través de la interfaz. Utilicé espacios negativos amplios y una paleta cromática reducida para evocar la filosofía zen, manteniendo una estructura de rejilla estricta para la legibilidad.",
        tags: ["HTML5", "CSS Grid", "UX Research"],
        image: "assets/img/yoga.png" // Usamos la misma ruta
    },
    {
        id: 2,
        title: "TALLER LÁSER",
        category: "E-commerce / UI",
        description: "Diseño brutalista para un taller industrial. La interfaz simula un panel de control de maquinaria, con altos contrastes y tipografía monoespaciada. El desafío fue organizar 500 productos sin perder la identidad visual agresiva.",
        tags: ["Shopify", "SASS", "JS ES6"],
        image: "assets/img/atelierdali.png"
    },
    {
        id: 3,
        title: "TIENDA ROPA",
        category: "Branding / Identity",
        description: "Una experiencia de compra editorial. Las imágenes dominan la pantalla, rompiendo la cuadrícula tradicional. La navegación se reduce al mínimo para que el producto sea el único protagonista.",
        tags: ["Figma", "React", "Stripe API"],
        image: "assets/img/sublime.png"
    },
    {
        id: 4,
        title: "APP MÚSICA",
        category: "Mobile Concept",
        description: "Exploración de interfaz oscura (Dark Mode) para audiófilos. Se priorizó la visualización de ondas sonoras y metadatos técnicos. Inspirado en los sintetizadores analógicos de los años 80.",
        tags: ["Mobile First", "Prototyping", "UI Motion"],
        image: "assets/img/music.png"
    },
    {
        id: 5,
        title: "TO-DO LIST",
        category: "Web App / Productivity",
        description: "Aplicación de productividad sin distracciones. Elimina todo elemento decorativo para centrarse en la tarea. Uso intensivo de bordes negros y sombras duras para dar peso a cada tarea completada.",
        tags: ["JavaScript", "Local Storage", "DOM Manipulation"],
        image: "assets/img/tareas.png"
    },
    {
        id: 6,
        title: "CAFETERÍA",
        category: "Branding / Social",
        description: "Identidad visual para una cafetería de especialidad. El sitio web funciona como un menú digital interactivo. La estética mezcla texturas orgánicas con tipografía técnica suiza.",
        tags: ["Illustrator", "Webflow", "CMS"],
        image: "assets/img/cafe.png"
    }
];

/**
 * ==========================================
 * 2. SELECCIÓN DE ELEMENTOS DOM (VARIABLES)
 * ==========================================
 * Aquí "agerramos" los elementos del HTML para poder manipularlos.
 */

// A. El Contenedor del Modal (La ventana entera)
const modal = document.getElementById('project-modal');

// B. El Botón de Cerrar (La X)
const closeBtn = document.querySelector('.modal__close');

// C. Los elementos INTERNOS del Modal (Donde inyectaremos info)
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalTags = document.getElementById('modal-tags');

// D. Los "Gatillos" (Todas las tarjetas de proyectos)
// Usamos querySelectorAll porque son muchas
const projectCards = document.querySelectorAll('.project-card');


/**
 * ==========================================
 * 3. LÓGICA DE APERTURA (EVENT LISTENERS)
 * ==========================================
 */

// Recorremos cada tarjeta para ponerle un "oído" (Event Listener)
projectCards.forEach(card => {
    card.addEventListener('click', () => {

        // A. OBTENER ID: Leemos el atributo 'data-id' del HTML
        // Usamos parseInt porque el HTML nos da un texto "1" y queremos el número 1
        const projectId = parseInt(card.getAttribute('data-id'));

        // B. BUSCAR DATOS: Buscamos en el Array el proyecto que coincida
        const project = projectsData.find(p => p.id === projectId);

        // Si encontramos el proyecto (seguridad), rellenamos el modal
        if (project) {
            // 1. Inyectar Textos e Imagen
            modalTitle.textContent = project.title;
            modalDescription.textContent = project.description;
            modalImage.src = project.image;
            modalImage.alt = project.title;

            // 2. Inyectar Etiquetas (Tags)
            // Primero limpiamos las etiquetas del proyecto anterior
            modalTags.innerHTML = '';

            // Creamos una etiquetita <span> por cada tag y la metemos
            project.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.textContent = tag;
                modalTags.appendChild(tagElement);
            });

            // 3. MOSTRAR EL MODAL
            // Añadimos la clase que cambia la opacidad a 1 (definida en SCSS)
            modal.classList.add('is-visible');

            // 4. BLOQUEAR SCROLL
            // Para que la web de fondo no se mueva mientras lees el modal
            document.body.style.overflow = 'hidden';
        }
    });
});


/**
 * MASONRY GRID SYSTEM
 * Este script calcula la altura de cada tarjeta y le asigna
 * un "span" (espacio) en el CSS Grid para eliminar huecos verticales.
 */

// 1. Seleccionamos todos los elementos que vamos a manipular
const grid = document.querySelector('.masonry-grid');
const items = document.querySelectorAll('.project-card');

// 2. Función principal que recalcula la altura de un solo item
function resizeMasonryItem(item) {
    // Obtenemos el estilo del grid (necesitamos saber el 'gap' y el 'row-height')
    const gridStyles = window.getComputedStyle(grid);

    // Obtenemos el valor de 'grid-auto-rows' del CSS (que pusimos en 10px)
    // parseInt convierte "10px" en el número 10.
    const rowHeight = parseInt(gridStyles.getPropertyValue('grid-auto-rows'));

    // Obtenemos el valor del 'gap' (espacio entre huecos, 2rem = 32px aprox)
    const rowGap = parseInt(gridStyles.getPropertyValue('gap'));

    // Calculamos la altura total del contenido de la tarjeta (imagen + texto)
    // item.querySelector... busca el contenido real dentro de la tarjeta
    // .getBoundingClientRect().height nos da la altura exacta con decimales
    // Usamos la altura de la tarjeta completa, no solo del hijo.
    const contentHeight = item.getBoundingClientRect().height;

    // --- LA FÓRMULA MÁGICA ---
    // (AlturaTotal + Gap) / (AlturaFila + Gap) = Cuántas filas ocupa
    // Math.ceil redondea hacia arriba para que no falte espacio
    const rowSpan = Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap));

    // Aplicamos el estilo directamente al elemento HTML
    item.style.gridRowEnd = 'span ' + rowSpan;
}

// 3. Función para recalcular TODOS los items (bucle)
function resizeAllMasonryItems() {
    for (let i = 0; i < items.length; i++) {
        resizeMasonryItem(items[i]);
    }
}

// 4. EVENTOS (Cuándo se ejecuta esto)

// A) Cuando la página carga por primera vez
window.addEventListener('load', resizeAllMasonryItems);

// B) Cuando el usuario cambia el tamaño de la ventana (Responsive)
// Esto es importante por si pasa de Desktop a Tablet
window.addEventListener('resize', resizeAllMasonryItems);

// C) Ejecutar una vez al inicio por si acaso el 'load' ya pasó
resizeAllMasonryItems();


/**
 * ==========================================
 * 4. LÓGICA DE CIERRE (SALIDA)
 * ==========================================
 */

// Función reutilizable para cerrar el modal
function closeModal() {
    // 1. Ocultar visualmente
    modal.classList.remove('is-visible');

    // 2. Reactivar el scroll de la página principal
    document.body.style.overflow = 'auto';

    // 3. Pausar videos o limpiar src si fuera necesario (Opcional)
}

// A. Evento: Clic en el botón X
closeBtn.addEventListener('click', closeModal);

// B. Evento: Clic fuera de la tarjeta (en el telón oscuro)
modal.addEventListener('click', (event) => {
    // Si lo que clicaste es EXACTAMENTE el fondo oscuro (modal)
    // y no la tarjeta blanca o sus hijos...
    if (event.target === modal) {
        closeModal();
    }
});

// C. Evento: Tecla ESC (Accesibilidad)
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-visible')) {
        closeModal();
    }
});