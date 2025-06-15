console.log ("El script está funcionando correctamente")

const titulo = document.getElementById("titulo");
titulo.textContent = "Proyecto JavaScript"

//simulador de calculo de notas examenes
//uso del if - if else - else if - switch
// uso ciclo for - while - do while - for of
//for para repetir aviso de la toma de medicamentos
//uso de input(prompt)-output (console.log) (datos y resultados) 
//uso array

//SIMULADOR CALCULADORA DE EVALUACIONES (estudios)
//BASE: El semestre consta de 4 evaluaciones + examen final. Las 4 evaluaciones equivalen un 60% y el examen equivale un 40% de la nota final de aprobación.
//El rango de notas va desde 1.0 a 7.0 y debes tener una nota superior a 4.0 para aprobar.

const notaParcial = 0.15;
const notaExamen = 0;
const notaAprobacion = 4.0
const porcentajeExamen = 0.40;

//Leer notas
function leerNotas() {
  const ids = ['n1', 'n2', 'n3', 'n4', 'examen'];
  return ids.map(id => {
    const valor = parseFloat(document.getElementById(id).value);
    return isNaN(valor) ? null : valor;
  });
}

//Promedio
function calcularPromedio() {
  const [n1, n2, n3, n4, notaExamen] = leerNotas();
  if ([n1, n2, n3, n4, notaExamen].includes(null)) {
    confirm('Completa los campos con tus notas');
    return;
  }
//   confirm('${notasExamen}');
  const promedio = (notaParcial * (n1 + n2 + n3 + n4)) + (notaExamen * porcentajeExamen);
  const aprobado = promedio >= notaAprobacion ? '¡Aprobado!' : 'Reprobado';
  confirm(`Promedio final: ${promedio.toFixed(2)} — ${aprobado}`);
}

// Calcular nota mínima necesaria en el examen <--- por ver













