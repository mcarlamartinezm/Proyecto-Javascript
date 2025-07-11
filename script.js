
//SIMULADOR CALCULADORA DE EVALUACIONES (estudios)
//BASE: La calculadora puede agregar una sesión para guardar las notas del usuario. Puede agregar una materia y escoger el % de equivalencia de cada nota, y simular qué nota necesita sacar para aprobar la materia.

//El rango de notas va desde 1.0 a 7.0 y debes tener una nota superior a 4.0 para aprobar.

//flujo: nombre materia-agregar - crea nueva materia con input de calculadora -hace calculo de las materias
//otras funciones por agregar. Borrar materias; logear usuario, simular nota de examen. 



//-------------------crear Materias

class Materia {
  constructor(nombre) {
    this.nombre = nombre; 
    this.evaluaciones = [];
    this.resultado = '';
  }

  //para guardar materias
  guardar() {
    localStorage.setItem('materias', JSON.stringify(materias));
  }

  calcularPromedio(notas, mensajeElemento) {
    const [n1, n2, n3, n4, examen] = notas;
    if ([n1, n2, n3, n4, examen].some(n => n > 7 || n < 1)) {
      mensajeElemento.innerText = 'Corrige tus notas (1.0 a 7.0)';
      return;
    }

   //validar datos en la calculadora
    if ([n1, n2, n3, n4, examen].includes(null)) {
      mensajeElemento.innerText = 'Completa todos los campos';
      return;
    }

    const promedio = (0.15 * (n1 + n2 + n3 + n4)) + (examen * 0.40);
    const aprobado = promedio >= 4.0 ? '¡Aprobado!' : 'Reprobado';

   
   //Actualizar resultado de la materia
 this.resultado = `Promedio final: ${promedio.toFixed(2)} — ${aprobado}`;
    mensajeElemento.innerText = this.resultado;
    this.evaluaciones = notas;
    this.guardar();
  }
}
//guardar materias en el localstorage
const materias = JSON.parse(localStorage.getItem('materias')) || [];

document.getElementById('addMateriaBtn').addEventListener('click', () => {
  const nombre = document.getElementById('materiaInput').value.trim();
  if (!nombre) return; //si se hace click, lee lo escrito y retorna el nombre

  const nuevaMateria = new Materia(nombre);
  materias.push(nuevaMateria);

  renderMaterias();

  document.getElementById('materiaInput').value = '';
  document.getElementById('materiaInput').focus();
});

function renderMaterias() {
  const container = document.getElementById('materiasContainer');
  container.innerHTML = '';

  materias.forEach((materia, index) => {
    const div = document.createElement('div');
    div.className = 'materia';

    const titulo = document.createElement('h3');
    titulo.textContent = materia.nombre;
    div.appendChild(titulo);

    // Inputs únicos
    const inputs = [];
    for (let i = 1; i <= 4; i++) {
      const input = document.createElement('input');
      input.type = 'number';
      input.placeholder = `Nota ${i}`;
      div.appendChild(input);
      inputs.push(input);
    }
    const examenInput = document.createElement('input');
    examenInput.type = 'number';
    examenInput.placeholder = 'Examen';
    div.appendChild(examenInput);
    inputs.push(examenInput);

    const mensaje = document.createElement('p');
    mensaje.className = 'mensaje';
    mensaje.innerText = materia.resultado || '';
    div.appendChild(mensaje);

    const btn = document.createElement('button');
    btn.textContent = 'Calcular';
    btn.addEventListener('click', () => {
      const notas = inputs.map(input => {
        const valor = parseFloat(input.value);
        return isNaN(valor) ? null : valor;
      });
      materia.calcularPromedio(notas, mensaje);
    });
    div.appendChild(btn);

    container.appendChild(div);
  });
}

renderMaterias(); 









//-----------calculadora primera entrega


// const notaParcial = 0.15;
// const notaExamen = 0;
// const notaAprobacion = 4.0
// const porcentajeExamen = 0.40;

// //Leer notas
// function leerNotas() {
//   const ids = ['n1', 'n2', 'n3', 'n4', 'examen'];
//   return ids.map(id => {
//     const valor = parseFloat(document.getElementById(id).value);
//     return isNaN(valor) ? null : valor;
//   });
// }

//Promedio
// function calcularPromedio() {
//     const [n1, n2, n3, n4, notaExamen] = leerNotas();
//     if ([n1, n2, n3, n4, notaExamen] > 7.0) 
//       alert = 'Corrige tus notas'
//     else if ([n1, n2, n3, n4, notaExamen].includes(null)) {
//       alert = 'Completa los campos con tus notas';
//     }
//   }
// // mensaje de aprobación
//   const promedio = (notaParcial * (n1 + n2 + n3 + n4)) + (notaExamen * porcentajeExamen);
//   const aprobado = promedio >= notaAprobacion ? '¡Aprobado!' : 'Reprobado';
//       alert = Promedio final: ${promedio.toFixed(2)} — ${aprobado};
  


// Calcular nota mínima necesaria en el examen <--- por ver