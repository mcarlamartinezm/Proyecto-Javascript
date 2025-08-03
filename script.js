//-------------------crear Materias
class Materia {
  constructor(nombre) {
    this.nombre = nombre; 
    this.evaluaciones = [];
    this.resultado = '';
  }
//------------------para guardar materias
  guardar() {
    localStorage.setItem('materias', JSON.stringify(materias));
  }
//--------------------Calcular promedio de notas
  calcularPromedio(notas, mensajeElemento) {
    const [n1, n2, n3, n4, examen] = notas;
    if ([n1, n2, n3, n4, examen].some(n => n > 7 || n < 1)) { //que no pase del 7.0
      mensajeElemento.innerText = 'Corrige tus notas (1.0 a 7.0)';
      return;
    }
//-----------------validar datos en la calculadora
    if ([n1, n2, n3, n4, examen].includes(null)) {
      mensajeElemento.innerText = 'Completa todos los campos';
      return;
    }
//-----------------calculos de promedio final y respuesta
    const promedio = (0.15 * (n1 + n2 + n3 + n4)) + (examen * 0.40);
    const aprobado = promedio >= 4.0 ? '¡Aprobado!' : 'Reprobado';
//----------------Actualizar resultado de la materia
    this.resultado = `Promedio final: ${promedio.toFixed(2)} — ${aprobado}`;
    mensajeElemento.innerText = this.resultado;

//guardar cambios
    this.evaluaciones = notas;
    this.guardar();
    }
  }
//-------------------recuperar materias en el localstorage
  const materias = JSON.parse(localStorage.getItem('materias')) || [];

//-------------------agregar nueva materia
  document.getElementById('addMateriaBtn').addEventListener('click', () => {
    const nombre = document.getElementById('materiaInput').value.trim();
    if (!nombre) return; //si se hace click, lee lo escrito y retorna el nombre y evita materias sin nombre
    Toastify({
          text: "¡Nueva Materia creada!",
          duration: 2500,
          newWindow: true,
          gravity: "top",
          position: "left",
          stopOnFocus: true,
          style: {background: "green"},
          onClick: function(){}
        }).showToast(); //tostada de materia agregada
   
  const nuevaMateria = new Materia(nombre); //instancias para el array
  materias.push(nuevaMateria);
   
//muestra materias actualizadas
  renderMaterias();
  
  const botonEliminar = document.createElement('button');
botonEliminar.textContent = 'Eliminar';
botonEliminar.classList.add('eliminar-btn');
botonEliminar.addEventListener('click', () => {
  eliminarMateria(index);
});

div.appendChild(botonEliminar); // agrega el botón al bloque div de la materia







  document.getElementById('materiaInput').value = ''; //limpia el input
  document.getElementById('materiaInput').focus();
});
//------------------para mostrar las materias
  function renderMaterias() {
    const container = document.getElementById('materiasContainer');
    container.innerHTML = '';

  materias.forEach((materia, index) => {
    const div = document.createElement('div');
    div.className = 'materia';

    const titulo = document.createElement('h3'); //para que tenga titulo
    titulo.textContent = materia.nombre;
    div.appendChild(titulo);

//------------------------Eliminar las materias

    




// -----------------Inputs únicos
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

    const mensaje = document.createElement('p'); //resultado
    mensaje.className = 'mensaje';
    mensaje.innerText = materia.resultado || '';
    div.appendChild(mensaje);

    const btn = document.createElement('button'); //boton del promedio
    btn.textContent = 'Calcular';
    btn.addEventListener('click', () => {
      const notas = inputs.map(input => {
        const valor = parseFloat(input.value);
        return isNaN(valor) ? null : valor;
      });
      materia.calcularPromedio(notas, mensaje);
    });
     div.appendChild(btn);

//agrega materia al contenedor
    container.appendChild(div);
  });
}
renderMaterias(); //imprime materias al cargar la pagina


