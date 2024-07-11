//yotaquery
document.addEventListener('DOMContentLoaded', () => {
    const formularioRegistro = document.getElementById('formularioRegistro');
    const seccionRegistro = document.getElementById('registro');
    const seccionJuego = document.getElementById('juego');
    const generarTableroAleatorioBtn = document.getElementById('generarTableroAleatorio');
    const elegirNumerosBtn = document.getElementById('elegirNumeros');
    const tablerosContenedor = document.getElementById('tableros');
    const generarBolillaBtn = document.getElementById('generarBolilla');
    const bolillaActual = document.getElementById('bolillaActual');
    const contadorFichas = document.getElementById('contadorFichas');
    const modalManual = document.getElementById('modalManual');
    const formManual = document.getElementById('formManual');
    const numerosManuales = document.getElementById('numerosManuales');
    const closeModal = document.querySelector('.close');
    const agregarFichasInput = document.getElementById('agregarFichas');
    const btnAgregarFichas = document.getElementById('btnAgregarFichas');

    let fichas = 2000;
    contadorFichas.textContent = fichas;

    let numerosGenerados = [];
    let tableros = [];

    // Manejar el registro de usuario
    formularioRegistro.addEventListener('submit', (event) => {
        event.preventDefault();
        seccionRegistro.style.display = 'none';
        seccionJuego.style.display = 'block';
    });

  
    // genera el tablero aleatorio
    generarTableroAleatorioBtn.addEventListener('click', () => {
        if (fichas >= 500) {
            const tablero = generarTableroAleatorio();
            tablerosContenedor.appendChild(tablero);
            fichas -= 500;
            contadorFichas.textContent = fichas;
        } else {
            alert('No tienes suficientes fichas.');
        }
    });

      //boton para agregar fichas
      btnAgregarFichas.addEventListener('click', () => {
        const cantidad = parseInt(agregarFichasInput.value);
        if (!isNaN(cantidad) && cantidad > 0) {
            fichas += cantidad;
            contadorFichas.textContent = fichas;
            agregarFichasInput.value = '';
        } else {
            alert('Por favor, ingresa una cantidad válida de fichas.');
        }
    });


    // Abrir el modal para elegir numeros manualmente
    elegirNumerosBtn.addEventListener('click', () => {
        if (fichas >= 500 && tableros.length < 4) {
            abrirModalManual();
        } else {
            alert('No tienes suficientes fichas .');
        }
    });

    // Generar el tablero con numeros elegidos manualmente
    formManual.addEventListener('submit', (event) => {
        event.preventDefault();
        const numeros = obtenerNumerosManuales();
        if (numeros) {
            const tablero = generarTableroManual(numeros);
            tablerosContenedor.appendChild(tablero);
            fichas -= 500;
            contadorFichas.textContent = fichas;
            cerrarModalManual();
        } else {
            alert('Verifica los números ingresados.');
        }
    });

    closeModal.addEventListener('click', cerrarModalManual);

    // para generar una nueva bolilla y verificar los tableros
    generarBolillaBtn.addEventListener('click', () => {
        const nuevoNumero = generarNumeroAleatorio();
        if (!numerosGenerados.includes(nuevoNumero)) {
            numerosGenerados.push(nuevoNumero);
            bolillaActual.textContent = nuevoNumero;
            resaltarNumero(nuevoNumero);
        } else {
            generarBolillaBtn.click();
        }
    });

    // Funcion para generar un tablero aleatorio
    function generarTableroAleatorio() {
        const tablero = document.createElement('div');
        tablero.classList.add('tablero');

        const cabecera = document.createElement('h4');
        cabecera.textContent = 'BINGO';
        tablero.appendChild(cabecera);

        const grid = document.createElement('div');
        grid.classList.add('grid');

        const numeros = generarNumerosUnicos();
        for (let i = 0; i < numeros.length; i++) {
            const numero = document.createElement('div');
            numero.classList.add('numero');
            numero.textContent = numeros[i];
            grid.appendChild(numero);
        }

        tablero.appendChild(grid);
        return tablero;
    }

    // funcion para abrir el modal para ingresar números manualmente
    function abrirModalManual() {
        modalManual.style.display = 'block';
        generarInputsManuales();
    }

    // func. para cerrar el modal
    function cerrarModalManual() {
        modalManual.style.display = 'none';
        formManual.reset();
    }

    // Genero inputs para ingresar numeros manualmente
    function generarInputsManuales() {
        numerosManuales.innerHTML = '';
        const letras = ['B', 'I', 'N', 'G', 'O'];
        letras.forEach(letra => {
            const columna = document.createElement('div');
            columna.classList.add('manual-columna');
            const letraHeader = document.createElement('div');
            letraHeader.classList.add('manual-header');
            letraHeader.textContent = letra;
            columna.appendChild(letraHeader);
            for (let i = 0; i < 5; i++) {
                const input = document.createElement('input');
                input.type = 'number';
                input.min = letra === 'B' ? 1 : letra === 'I' ? 16 : letra === 'N' ? 31 : letra === 'G' ? 46 : 61;
                input.max = letra === 'B' ? 15 : letra === 'I' ? 30 : letra === 'N' ? 45 : letra === 'G' ? 60 : 75;
                columna.appendChild(input);
            }
            numerosManuales.appendChild(columna);
        });
    }

    // Obtengo los numeros ingresados manualmente y verifico que no se repitan
    function obtenerNumerosManuales() {
        const inputs = numerosManuales.querySelectorAll('input');
        const numeros = [];
        for (let input of inputs) {
            const numero = parseInt(input.value);
            if (!isNaN(numero) && !numeros.includes(numero)) {
                numeros.push(numero);
            } else {
                return false;
            }
        }
        return numeros.length === 25 ? numeros : false;
    }

    // Genero un tablero manual
    function generarTableroManual(numeros) {
        const tablero = document.createElement('div');
        tablero.classList.add('tablero');

        const cabecera = document.createElement('h4');
        cabecera.textContent = 'BINGO';
        tablero.appendChild(cabecera);

        const grid = document.createElement('div');
        grid.classList.add('grid');

        for (let i = 0; i < numeros.length; i++) {
            const numero = document.createElement('div');
            numero.classList.add('numero');
            numero.textContent = numeros[i];
            grid.appendChild(numero);
        }

        tablero.appendChild(grid);
        return tablero;
    }

    // Genero un conjunto de 25 números únicos para el tablero
    function generarNumerosUnicos() {
        const numeros = [];
        while (numeros.length < 25) {
            const numero = generarNumeroAleatorio();
            if (!numeros.includes(numero)) {
                numeros.push(numero);

            }
        }
        return numeros;
    }

    // Genero un numero aleatorio entre 1 y 75
    function generarNumeroAleatorio() {
        return Math.floor(Math.random() * 75) + 1;
    }

    // Resalta el numero en los tableros si coincide con la bolilla generada
    function resaltarNumero(numero) {
        const numerosTableros = document.querySelectorAll('.tablero .numero');
        numerosTableros.forEach(numDiv => {
            if (parseInt(numDiv.textContent) === numero) {
                numDiv.classList.add('resaltado');
            }
        });
    }
});
