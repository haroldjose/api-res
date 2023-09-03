const express = require("express");

const { Pool }= require("pg");

const app=express();
const port=3002;

const pool=new Pool({
    user: "postgres",
    password: "postgress",
    host: "localhost",
    database: "DatosUsuario",
    port: 5432,
})

//modelo
class Model {
    //obtener los datos de la tabla
    async getData() {
      const { rows } = await pool.query("select * from informacion;");
      return rows;
    }

  
    async getItemById(id) {
      const { rows } = await pool.query("select * from informacion where id = $1;", [
        id,
      ]);
      return rows[0];
    }

    // promedio de edades
    async getDate() {
        const promedio = await pool.query("SELECT AVG(EXTRACT(YEAR FROM AGE(NOW(),birth_day)))::NUMERIC(10,2) AS promedio_edades FROM informacion;");
        return promedio.rows[0];
      }
  
    async addItems(name,first_last_name,second_last_name,birth_date,identification_number) {
      await pool.query("INSERT INTO informacion (name,first_last_name,second_last_name,birth_day,c_i) values ($1,$2,$3,$4,$5);",[name,first_last_name,second_last_name,birth_date,identification_number]);
    }

    //update
    async updateItem(id, name) {
      await pool.query("UPDATE informacion SET name = $1 WHERE id = $2", [name, id]);
    }

    //obtener
    async getItemByCi(ci) {
        const { rows } = await pool.query("select * from informacion where c_i = $1;", [
          ci,
        ]);
        return rows[0];
      } 
    

    //eliminar
    async deleteItem(id) {
        await pool.query("DELETE FROM informacion WHERE id = $1", [id]);
    }
  
  }

  // Vista
class View {
    render(data) {
        let html = `
        <form action="/add" method="post">
        <input type="text" name="name" placeholder="nombre">
        <input type="text" name="first" placeholder="primer apellido">
        <input type="text" name="second" placeholder="segundo apellido">
        <input type="date" name="date" placeholder="fecha nacimiento">
        <input type="number" name="dni" placeholder="DNI">
        <input type="submit">
        </form>`;
        for (let i = 0; i < data.length; i++){
            html += `<li>${data[i].name}</li>`
        } 
        return html;
    }
}

// Controlador
class Controller {
    constructor(model, view){
        this.model = model;
        this.view = view;
    }

    async getDatos(req, res){
        const data = await this.model.getData();
        const html = this.view.render(data);
        res.send(html);
    }

    async getDate(req, res){
        const data= await this.model.getDate();
        res.send(data);
        
    }
    async addDatos(req, res) {

        const {name,first,second,date,dni} = req.body;
        await this.model.addItems(name,first,second,date,dni);
        const data = await this.model.getData();
        const html = this.view.render(data);
        res.send(html)
    }

    //obtener usuario por ci
    async getItemByCi(req, res) {
        const ci = req.params.ci;
        const data = await this.model.getItemByCi(ci);
        res.send(data);
      }
//actulizar
    async updateItem(req, res) {
      const id = req.params.id;
      const name = req.body.name;
      await this.model.updateItem(id, name);
      res.sendStatus(200);
    }

    async deleteItem(req, res) {
        const id = req.params.id;
        await this.model.deleteItem(id);
        res.sendStatus(200);
      }
}

// Instanciación
const model = new Model();
const view = new View();
const controller = new Controller(model, view);


app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get("/usuarios", controller.getDatos.bind(controller));
app.get("/usuarios/:ci", controller.getItemByCi.bind(controller));
app.get("/years", controller.getDate.bind(controller));


app.post("/add", controller.addDatos.bind(controller));

app.put("/usuarios/:id", controller.updateItem.bind(controller)); 

app.delete("/usuarios/:id", controller.deleteItem.bind(controller));

app.listen(port,()=>{
    console.log(`Servidor levantado en el puerto http://localhost:${port}`);
});