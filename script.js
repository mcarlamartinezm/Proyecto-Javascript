


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
  }
//   confirm('${notasExamen}');
  const promedio = (notaParcial * (n1 + n2 + n3 + n4)) + (notaExamen * porcentajeExamen);
  const aprobado = promedio >= notaAprobacion ? '¡Aprobado!' : 'Reprobado';
  confirm(`Promedio final: ${promedio.toFixed(2)} — ${aprobado}`);


Calcular nota mínima necesaria en el examen <--- por ver













