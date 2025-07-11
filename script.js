
//SIMULADOR CALCULADORA DE EVALUACIONES (estudios)
//BASE: La calculadora puede agregar una sesión para guardar las notas del usuario. Puede agregar una materia y escoger el % de equivalencia de cada nota, y simular qué nota necesita sacar para aprobar la materia.

//El rango de notas va desde 1.0 a 7.0 y debes tener una nota superior a 4.0 para aprobar.


//-------------------crear Materias

class Materia {
  constructor(nombre) {
    this.nombre = nombre;
    this.evaluaciones = [];
  }
}

const materias = [];

document.getElementById('addMateriaBtn').addEventListener('click', () => {
  const nombre = document.getElementById('materiaInput').value.trim();
  if (!nombre) return;

  const nuevaMateria = new Materia(nombre);
  materias.push(nuevaMateria);

  renderMaterias();

  document.getElementById('materiaInput').value = ''; // Limpia el input y deja el cursor listo
  document.getElementById('materiaInput').focus();
});

function renderMaterias() {
  const container = document.getElementById('materiasContainer');
  container.innerHTML = ''; 

  materias.forEach(materia => {
    const div = document.createElement('div');
    div.textContent = materia.nombre;
    container.appendChild(div);
  });
}

function guardarMaterias() {
  localStorage.setItem('materias', JSON.stringify(materias));
}



//---------------------calculadora

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
    if ([n1, n2, n3, n4, notaExamen] > 7.0) 
      document.getElementById("mensaje").innerText = 'Corrige tus notas'
    else if ([n1, n2, n3, n4, notaExamen].includes(null)) {
      document.getElementById("mensaje").innerText = 'Completa los campos con tus notas';
    }
  }
// mensaje de aprobación
  const promedio = (notaParcial * (n1 + n2 + n3 + n4)) + (notaExamen * porcentajeExamen);
  const aprobado = promedio >= notaAprobacion ? '¡Aprobado!' : 'Reprobado';
      document.getElementById("mensaje").innerText = `Promedio final: ${promedio.toFixed(2)} — ${aprobado}`;
  


// Calcular nota mínima necesaria en el examen <--- por ver



