const fs = require('fs');

// Función principal para resolver el problema
const procesarDatos = (input) => {
  const lines = input.trim().split('\n');
  const casos = parseInt(lines[0]);
  const resultados = [];


  let indice = 1;
  for (let i = 0; i < casos; i++) {
    indice++; // Línea en blanco
    const posicionesEspera = [];
    const posicionesLiberadas = [];

    // Leer posiciones en espera
    while (lines[indice] !== '99') {
      posicionesEspera.push(parseInt(lines[indice]));
      indice++;
    }
    indice++; // Avanzar después del 99

    // Leer posiciones liberadas
    while (indice < lines.length && lines[indice] !== '') {
      posicionesLiberadas.push(parseInt(lines[indice]));
      indice++;
    }

    // Resolver el caso utilizando la lógica adaptada
    const resultadoCaso = simularEstacionamiento(posicionesEspera, posicionesLiberadas);
    resultados.push(resultadoCaso);
  }

  // Generar salida
  fs.writeFileSync('salida.txt', resultados.join('\n\n'));
}

// Función que simula el estacionamiento (adaptación de la lógica de tu amigo)
const simularEstacionamiento = (espera, liberadas) => {
  const autosParqueados = [];
  const posicionAuto = new Map();

  // Inicializar las posiciones actuales de los autos
  for (const auto of espera) {
    posicionAuto.set(auto, auto);
  }

  // Procesar los espacios desocupados
  for (const newPos of liberadas) {
    let distanciaMin = 21;
    let parquearAuto = null;

    // Buscamos el auto más cercano para estacionar
    for (const auto of espera) {
      if (!autosParqueados.includes(auto)) {
        const pos = posicionAuto.get(auto);

        if (pos === newPos) {
          distanciaMin = 0;
          parquearAuto = auto;
          break;
        } else if (pos < newPos && newPos - pos < distanciaMin) {
          distanciaMin = newPos - pos;
          parquearAuto = auto;
        } else if (pos > newPos && 20 + newPos - pos < distanciaMin) {
          distanciaMin = 20 + newPos - pos;
          parquearAuto = auto;
        }
      }
    }

    // Actualizar las posiciones de todos los autos no estacionados
    for (const auto of espera) {
      if (!autosParqueados.includes(auto)) {
        const pos = posicionAuto.get(auto);
        const posActualizada = (pos + distanciaMin) % 20;
        posicionAuto.set(auto, posActualizada === 0 ? 20 : posActualizada); // Ajustar al rango 1-20
      }
    }

    // Marauto el auto como estacionado
    if (parquearAuto !== null) {
      autosParqueados.push(parquearAuto);
    }
  }

  // Generar el resultado para este caso
  const resultados = [];
  for (const auto of espera) {
    if (autosParqueados.includes(auto)) {
      resultados.push(`El auto de la posicion inicial ${auto} aparco en ${posicionAuto.get(auto)}`);
    } else {
      resultados.push(`El auto de la posicion inicial ${auto} no aparcó`);
    }
  }

  return resultados.join('\n');
}

// Entrada de ejemplo
// const input = `1

// 6
// 19
// 17
// 13
// 1
// 99
// 1
// 3
// 20
// 16`;

let inputData = fs.readFileSync('./input.txt').toString().replaceAll('\r', '');

procesarDatos(inputData);