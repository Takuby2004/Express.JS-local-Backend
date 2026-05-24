//Configuraciones del Main.js
const express = require('express');
const db = require('./db');    //Esto lo saca de la instalacion realizada por el comando "npm install pg" (No te olvides del "require")
const app = express();
const port = 8080;

app.use(express.json());

app.get('/', async(req, res) => {
    res.send("Bienvenido a mi pequeño backend en ExpressJs");
});

//Ejemplo de un "POST" de un docente
app.post('/post/docente', async (req, res) => {
  const query = 'INSERT INTO DOCENTES(nombre, apellido, especialidad) VALUES ($1, $2, $3) RETURNING *';
  const { nombre, apellido, especialidad } = await req.body;

  try {
    
    const response = await db.query(query, [nombre, apellido, especialidad]);  //Aqui mandamos tambien el "body" (SIEMPRE ES UN ARRAY)
    res.json(response.rows);
  } catch (error) {
      res.status(500).json(error.message);
      console.log(error.message);
      
  }

});

//Ejemplo de un "DELETE" a un docente por su id
app.delete('/delete/docente/:id', async (req, res) =>{
  const query = 'DELETE FROM DOCENTES WHERE docente_id = $1 RETURNING *';
  const { id } = await req.params;
  try {
    const response = await db.query(query, [id]);
    res.json(response.rows);
    console.log(response);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
    
  }
});


//Ejemplo de un "GET" de todos los estudiantes
app.get('/get/estudiantes', async(req, res) => {
    try {
        const response = await db.query('SELECT * FROM ESTUDIANTES');
        res.json(response.rows);
    } catch (error) {
        res.status(500).json(error.message)
    }
});

//Ejemplo de un "GET" de todos los docentes.
app.get('/get/docentes', async (req, res) => {
  const query = 'SELECT * FROM DOCENTES';
  try {
    const response = await db.query(query);
    res.json(response.rows)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Ejemplo de un "GET" de un docente por su "docente_id".
app.get('/get/docente/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM DOCENTES WHERE docente_id = $1';
  try {
    const response = await db.query(query, [id]);
    res.json(response.rows);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

//MIO
//Ejemplo de un GET de un solo estudiante por su "estudiante_id"
/*app.get('/get/est/:id', async (req, res => {
  const query = 'SELECT nombre, apellido from ESTUDIANTES where estudiante_id = $1';

}));
*/

//DE GEMINI
//Ejemplo de un GET de un solo estudiante por su "estudiante_id"
app.get('/get/estudiante/:id', async (req, res) => {
  //1. Se extrae el parámetro "id" que el usuario mandó en la URL.
  const { id } = req.params;
  try {
    //2. Usamos "$1" como marcador de posición para mayor seguridad.
    const query = 'SELECT * FROM ESTUDIANTES WHERE estudiante_id = $1';
    const response = await db.query(query, [id]); //Aqui ya se almacenan los datos de la BD en la variable "response"
    
    //3. Verificamos si la base de datos devolvió algún resultado
    if(response.rows.length === 0){
      return res.status(404).json({ mensaje : 'Estudiante no encontrado' });
    }else{
      //4. Si lo encuentra, devolvemos solo ese objeto (la primera posición [OPCIONAL])
      res.json(response.rows[0]); //utilizando la función ".json()" para darle formato.
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});


//Lista una materia por su "materia_id"
app.get('/get/materia/:id', async(req, res) => {
  const { id } = req.params; //No te olvides de extraer los datos desde la URL.
  const query = 'SELECT * FROM MATERIAS WHERE materia_id = $1';
  try {
    const response = await db.query(query, [id]);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});



//Lista los estudiantes de sus respectivas materias.
//app.get('/get/estudiante/materia')


//Lista todas las Materias
app.get('/get/materias', async (req, res) => {
  try {
    const response = await db.query('SELECT * FROM MATERIAS');
    res.json(response.rows); //Sin el "rows", te devuelve una respuesta a detalle.
  } catch (error) {
    res.send(error)
    console.log(error);
    
  }
});

// Ejemplo: Insertar un nuevo estudiante
app.post('/post/estudiantes', async (req, res) => {
  const { nombre, apellido, email } = req.body;
  try {
    const query = 'INSERT INTO estudiantes (nombre, apellido, email) VALUES ($1, $2, $3) RETURNING *';
    const values = [nombre, apellido, email];
    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => console.log('Server corriendo en http://localhost:' + port));


