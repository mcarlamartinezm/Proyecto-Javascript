console.log ("El script está funcionando correctamente")


//SIMULADOR CALCULADORA DE EVALUACIONES (estudios)
//BASE: La calculadora puede agregar una sesión para guardar las notas del usuario. Puede agregar una materia y escoger el % de equivalencia de cada nota, y simular qué nota necesita sacar para aprobar la materia.

//El rango de notas va desde 1.0 a 7.0 y debes tener una nota superior a 4.0 para aprobar.


//---------------------------------------------------------------------
//registro

// ===============================
// 📌 1. Clases principales
// ===============================

// Clase Evaluacion
class Evaluacion {
  constructor(nombre, nota, ponderacion) {
    this.nombre = nombre;
    this.nota = nota;
    this.ponderacion = ponderacion;
  }
}

// Clase Materia
class Materia {
  constructor(nombre) {
    this.nombre = nombre;
    this.evaluaciones = [];
  }

  agregarEvaluacion(evaluacion) {
    this.evaluaciones.push(evaluacion);
  }

  calcularPromedio() {
    let suma = 0;
    this.evaluaciones.forEach(ev => {
      suma += ev.nota * (ev.ponderacion / 100);
    });
    return suma;
  }

  simularNotaNecesaria() {
    const totalPonderado = this.evaluaciones.reduce((acc, ev) => acc + ev.ponderacion, 0);
    const restante = 100 - totalPonderado;
    const notaActual = this.calcularPromedio();
    const faltante = 4.0 - notaActual;

    if (restante <= 0) return null;

    const notaNecesaria = faltante / (restante / 100);
    return Math.max(1, Math.min(7, notaNecesaria));
  }

  static desdeObjeto(obj) {
    const materia = new Materia(obj.nombre);
    materia.evaluaciones = obj.evaluaciones.map(ev => new Evaluacion(ev.nombre, ev.nota, ev.ponderacion));
    return materia;
  }
}

// Clase Estudiante
class Estudiante {
  constructor(nombre, apellido, password) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.password = password;
    this.materias = [];
  }

  agregarMateria(materia) {
    this.materias.push(materia);
    this.guardar();
  }

  guardar() {
    localStorage.setItem('usuario', JSON.stringify(this));
  }

  static cargar() {
    const data = JSON.parse(localStorage.getItem('usuario'));
    if (data) {
      const est = new Estudiante(data.nombre, data.apellido, data.password);
      est.materias = data.materias.map(m => Materia.desdeObjeto(m));
      return est;
    }
    return null;
  }
}

// =====================================================
// 📌 2. Registro.html — Guardar nuevo usuario
// =====================================================
const registerBtn = document.getElementById('registerBtn');

if (registerBtn) {
  registerBtn.addEventListener('click', () => {
    const nombre = document.getElementById('Nombre').value.trim();
    const apellido = document.getElementById('Apellido').value.trim();
    const password = document.getElementById('Contraseña').value.trim();

    if (!nombre || !apellido || !password) {
      alert('Completa todos los campos');
      return;
    }

    const nuevoUsuario = new Estudiante(nombre, apellido, password);
    nuevoUsuario.guardar();

    alert('Registro exitoso. Inicia sesión.');
    window.location.href = 'index.html';
  });
}

// =====================================================
// 📌 3. Index.html — Validar login
// =====================================================
const loginBtn = document.getElementById('loginBtn');

if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    const nombre = document.getElementById('Nombre').value.trim();
    const password = document.getElementById('Contraseña').value.trim();

    const usuarioGuardado = Estudiante.cargar();

    if (usuarioGuardado && usuarioGuardado.nombre === nombre && usuarioGuardado.password === password) {
      window.location.href = 'calculadora.html';
    } else {
      alert('Nombre o contraseña incorrectos');
    }
  });
}

// =====================================================
// 📌 4. Calculadora.html — Funcionalidad principal
// =====================================================
const materiaInput = document.getElementById('materia');
const addMateriaBtn = document.querySelector('.boton');
const subjectsContainer = document.getElementById('subjectsContainer');

let estudiante = Estudiante.cargar();

if (materiaInput && addMateriaBtn && subjectsContainer) {
  if (!estudiante) {
    window.location.href = 'index.html'; // Si no hay usuario, vuelve a login
  } else {
    renderMaterias();

    addMateriaBtn.addEventListener('click', () => {
      const nombreMateria = materiaInput.value.trim();
      if (!nombreMateria) return;

      const materia = new Materia(nombreMateria);
      estudiante.agregarMateria(materia);
      renderMaterias();
    });
  }
}

function renderMaterias() {
  subjectsContainer.innerHTML = '';

  estudiante.materias.forEach(materia => {
    const div = document.createElement('div');
    div.innerHTML = `<h3>${materia.nombre}</h3>`;

    materia.evaluaciones.forEach(ev => {
      const p = document.createElement('p');
      p.textContent = `${ev.nombre}: ${ev.nota} (${ev.ponderacion}%)`;
      div.appendChild(p);
    });

    const evalName = document.createElement('input');
    evalName.placeholder = 'Nombre evaluación';
    const nota = document.createElement('input');
    nota.type = 'number';
    nota.step = '0.1';
    nota.min = '1';
    nota.max = '7';
    nota.placeholder = 'Nota';
    const pond = document.createElement('input');
    pond.type = 'number';
    pond.min = '1';
    pond.max = '100';
    pond.placeholder = '%';

    const btnAddEval = document.createElement('button');
    btnAddEval.textContent = 'Agregar Evaluación';

    btnAddEval.addEventListener('click', () => {
      const nombreEv = evalName.value.trim();
      const notaVal = parseFloat(nota.value);
      const pondVal = parseFloat(pond.value);
      if (!nombreEv || isNaN(notaVal) || isNaN(pondVal)) {
        alert('Datos inválidos');
        return;
      }
      materia.agregarEvaluacion(new Evaluacion(nombreEv, notaVal, pondVal));
      estudiante.guardar();
      renderMaterias();
    });

    const btnPromedio = document.createElement('button');
    btnPromedio.textContent = 'Calcular Promedio';
    btnPromedio.addEventListener('click', () => {
      const promedio = materia.calcularPromedio();
      alert(`Promedio: ${promedio.toFixed(2)} (${promedio >= 4 ? 'Aprobado' : 'Reprobado'})`);
    });

    const btnSimular = document.createElement('button');
    btnSimular.textContent = 'Simular Nota Necesaria';
    btnSimular.addEventListener('click', () => {
      const necesaria = materia.simularNotaNecesaria();
      if (necesaria === null) {
        alert('No queda % disponible');
      } else {
        alert(`Necesitas al menos un ${necesaria.toFixed(2)} para aprobar.`);
      }
    });

    div.appendChild(evalName);
    div.appendChild(nota);
    div.appendChild(pond);
    div.appendChild(btnAddEval);
    div.appendChild(btnPromedio);
    div.appendChild(btnSimular);

    subjectsContainer.appendChild(div);
  });
}



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

// //Promedio
// function calcularPromedio() {
//   const [n1, n2, n3, n4, notaExamen] = leerNotas();
//   if ([n1, n2, n3, n4, notaExamen].includes(null)) {
//     confirm('Completa los campos con tus notas');
//   }
// //   confirm('${notasExamen}');
//   const promedio = (notaParcial * (n1 + n2 + n3 + n4)) + (notaExamen * porcentajeExamen);
//   const aprobado = promedio >= notaAprobacion ? '¡Aprobado!' : 'Reprobado';
//   confirm(`Promedio final: ${promedio.toFixed(2)} — ${aprobado}`);


// Calcular nota mínima necesaria en el examen <--- por ver













