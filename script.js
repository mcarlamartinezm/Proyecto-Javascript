//-----------Bienvenida

document.addEventListener('DOMContentLoaded', () => {
  Swal.fire({
    title: '¡Bienvenido!',
    text: 'Bienvenido a la calculadora de notas, en este simulador, podrás tener un registro de tus evaluaciones, y calcular la nota necesitas para aprobar. Recuerda, las notas parciales suman el 60% de la nota final y el examen un 40%, aunque siempre puedes modificar estos items',
    confirmButtonText: ' ¡Comencemos!',
  });
});

//------ Cargar configuración de porcentajes desde JSON
let configPorcentajes = { evaluaciones: 60, examen: 40 };

fetch('./porcentajes.json')
  .then(response => response.json())
  .then(data => {
    configPorcentajes = data;
    ('Porcentajes base cargados:', configPorcentajes);
  })
  .catch(error => {
    Toastify({
    text: "Error al cargar los porcentajes",
    duration: 2500,
    gravity: "top",
    position: "left",
    style: { background: "red" }
  }).showToast();('Error al cargar los porcentajes:', error);
  });

// Clase Materia
class Materia {
  constructor(nombre) {
    this.nombre = nombre;
    this.resultado = '';
    this.evaluaciones = [
      { nombre: 'Nota 1', nota: null, porcentaje: 15 },
      { nombre: 'Nota 2', nota: null, porcentaje: 15 },
      { nombre: 'Nota 3', nota: null, porcentaje: 15 },
      { nombre: 'Nota 4', nota: null, porcentaje: 15 },
      { nombre: 'Examen', nota: null, porcentaje: 40 }
    ];
  }

  guardar() { 
    localStorage.setItem('materias', JSON.stringify(materias)); //guardar en el storage
  }

  //------------Calcular promedio de notas
  calcularPromedio(notas, mensajeElemento) {
    let total = 0;
    let sumaPesos = 0;

    for (let i = 0; i < this.evaluaciones.length; i++) {
      const nota = notas[i];
      const peso = this.evaluaciones[i].porcentaje;

      if (nota === null || nota < 1 || nota > 7 || isNaN(nota)) {
        mensajeElemento.innerText = 'Corrige tus notas (1.0 a 7.0)';
        return;
      }
      this.evaluaciones[i].nota = nota;
      total += nota * (peso / 100);
      sumaPesos += peso;
    }

    if (sumaPesos !== 100) {
      mensajeElemento.innerText = 'Los porcentajes no suman 100';
      return;
    }

    const aprobado = total >= 4.0 ? '¡Aprobado!' : 'Reprobado';
    this.resultado = `Promedio final: ${total.toFixed(2)} — ${aprobado}`;


    if (!aprobado && this.evaluaciones[4].nota === null) {
      const notaNecesaria = this.simularNotaExamenNecesaria(notas.slice(0, 4));
      if (notaNecesaria > 7) {
        this.resultado += '\nNecesitarías más de 7 en el examen para aprobar.';
      } else {
        this.resultado += `\nNota mínima necesaria en examen para aprobar: ${notaNecesaria.toFixed(2)}`;
      }
    }

    mensajeElemento.innerText = this.resultado;
    this.guardar();
  }

  //---------- Función para calcular nota mínima necesaria en examen para aprobar
  simularNotaExamenNecesaria(notasInputs, porcentajes, materiaDiv) {
    let sumaParciales = 0;
    for (let i = 0; i < notasParciales.length; i++) {
      const nota = notasParciales[i] || 0;
      sumaParciales += nota * (this.evaluaciones[i].porcentaje / 100);
    }
    const pesoExamen = this.evaluaciones[4].porcentaje / 100;
    const notaNecesaria = (4.0 - sumaParciales) / pesoExamen;
    return notaNecesaria;
  }
}

const materias = JSON.parse(localStorage.getItem('materias')) || []; // Recuperar materias almacenadas


// Boton agregar nueva materia con tostada
document.getElementById('addMateriaBtn').addEventListener('click', () => {
  const nombre = document.getElementById('materiaInput').value.trim();
  if (!nombre) return;

  const nuevaMateria = new Materia(nombre);
  materias.push(nuevaMateria);

  Toastify({
    text: "¡Nueva Materia creada!",
    duration: 2500,
    gravity: "top",
    position: "left",
    style: { background: "black" }
  }).showToast();

  document.getElementById('materiaInput').value = '';
  document.getElementById('materiaInput').focus();

  renderMaterias();
});

//----------- Renderizar materias en el DOM
function renderMaterias() {
  const container = document.getElementById('materiasContainer');
  container.innerHTML = '';

  materias.forEach((materia, index) => {
    const div = document.createElement('div');
    div.className = 'materia';

    const titulo = document.createElement('h3');
    titulo.textContent = materia.nombre;
    div.appendChild(titulo);

    

// Inputs para agregar las notas 
    const inputs = [];
    materia.evaluaciones.forEach((evalObj, i) => {
      const input = document.createElement('input');
      input.type = 'number';
      input.min = 1;
      input.max = 7;
      input.step = 0.01;
      input.placeholder = `${evalObj.nombre}`;
      if (evalObj.nota !== null) input.value = evalObj.nota;
      div.appendChild(input);
      inputs.push(input);
    });


  //----------- Botón calcular
    const btnCalcular = document.createElement('button');
    btnCalcular.textContent = 'Calcular';
    btnCalcular.addEventListener('click', () => {
      const notas = inputs.map(input => {
        const valor = parseFloat(input.value);
        return isNaN(valor) ? null : valor;
      });
      materia.calcularPromedio(notas, mensaje);
    });
    div.appendChild(btnCalcular);
    

//------------ Mensaje de resultado del calculo de notas
    const mensaje = document.createElement('p');
    mensaje.className = 'mensaje';
    mensaje.innerText = materia.resultado || '';
    div.appendChild(mensaje);

  

//---------- Botón para modificar porcentajes
    const btnModificarPesos = document.createElement('button');
    btnModificarPesos.textContent = 'Modificar porcentajes';
    btnModificarPesos.classList.add('modificar-pesos-btn');
    btnModificarPesos.addEventListener('click', () => {
      activarModoEdicionPesos(materia, div);
    });
    div.appendChild(btnModificarPesos);


//----------- Botón simular nota de examen para aprobar
    const btnSimular = document.createElement('button');
      btnSimular.textContent = 'Simular nota necesaria en el examen';
      div.appendChild(btnSimular); // ← usar el div correcto
      btnSimular.addEventListener('click', () => {
        const notasParciales = inputs.slice(0, 4).map(input => parseFloat(input.value) || 0);
        const pesoExamen = materia.evaluaciones[4].porcentaje / 100;
        const sumaParciales = notasParciales.reduce((sum, nota, i) => {
          const peso = materia.evaluaciones[i].porcentaje / 100;
          return sum + (nota * peso);
        }, 0);
        const notaNecesaria = (4 - sumaParciales) / pesoExamen;

        let mensaje = '';
        if (notaNecesaria > 7) {
          mensaje = 'Necesitarías más de un 7 en el examen para aprobar.';
        } else if (notaNecesaria < 1) {
          mensaje = 'Ya estás aprobado sin importar la nota del examen.';
        } else {
          mensaje = `Necesitas al menos un ${notaNecesaria.toFixed(2)} en el examen para aprobar la materia.`;
        }
        Toastify({
          text: mensaje,
          duration: 3000,
          gravity: "left",
          position: "left",
          style: { background: "black" }
        }).showToast();
      });


//------------- Botón eliminar con SweetAlert
    const eliminarBtn = document.createElement('button');
    eliminarBtn.textContent = 'Eliminar';
    eliminarBtn.className = 'eliminar-btn';
    eliminarBtn.addEventListener('click', () => {
      Swal.fire({
        title: '¡Cuidado!',
        text: `Vas a eliminiar la materia "${materia.nombre}" .`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
      }).then(result => {
        if (result.isConfirmed) {
          materias.splice(index, 1);
          localStorage.setItem('materias', JSON.stringify(materias));
          renderMaterias();
          Swal.fire('Materia eliminada', 'La materia fue eliminada con exito.', 'success');
        }
      });
    });
    div.appendChild(eliminarBtn);

    container.appendChild(div);
  });
}

//-------------- Función para activar modo edición de porcentajes

function activarModoEdicionPesos(materia, divContenedor) {
  divContenedor.innerHTML = ''; // limpiar contenido

  const titulo = document.createElement('h3');
  titulo.textContent = `Editando porcentajes: ${materia.nombre}`;
  divContenedor.appendChild(titulo);

  // Inputs para modificar porcentajes
  materia.evaluaciones.forEach(evalObj => {
    const label = document.createElement('label');
    label.textContent = `${evalObj.nombre}: `;

    const input = document.createElement('input');
    input.type = 'number';
    input.value = evalObj.porcentaje;
    input.classList.add('porcentaje-input');

    label.appendChild(input);
    divContenedor.appendChild(label);

    evalObj.inputRef = input;
  });

  //---------------- Botón guardar porcentajes

  const guardarBtn = document.createElement('button');
  guardarBtn.textContent = 'Guardar porcentajes';
  guardarBtn.addEventListener('click', () => {
    // Validar suma
    const suma = materia.evaluaciones.reduce((acc, evalObj) => acc + parseFloat(evalObj.inputRef.value), 0);
    if (suma !== 100) {
      Toastify({
        text: "¡Los porcentajes deben sumar 100!",
        duration: 3000,
        gravity: "top",
        position: "center",
        style: { background: "black" }
      }).showToast();
      return;
    }
    // Actualizar porcentajes
    materia.evaluaciones.forEach(evalObj => {
      evalObj.porcentaje = parseFloat(evalObj.inputRef.value);
    });

    guardarBtn.addEventListener('click', () => {
      guardarMateriasEnStorage();
    });
   
    renderMaterias();
  });
  divContenedor.appendChild(guardarBtn);
}

// Cargar materias
renderMaterias();
