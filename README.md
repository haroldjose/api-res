# api-res

La api-rest fue inicializada con los comandos 
“npm init ”
Después se precedió a instalar express y postgres con los siguientes comandos
“npm install express”
“npm install pg”
Se procedió a crear la base de datos 
````
contraseña: postgress
port:5432
````
Creacion Base de Datos
````
CREATE TABLE public.informacion
(
    id serial NOT NULL,
    name text,
    first_last_name text,
    second_last_name text,
    birth_day date,
    c_i integer,
    PRIMARY KEY (id)
);
````
Se realizaron las siguientes peticiones
````
POST crear usuarios
http://localhost:3002/add

GET listar usuarios
http://localhost:3002/usuarios

GET usuarios especifico (se obtiene al usuario por cedula de identidad)
http://localhost:3002/usuarios/321678 

GET Promedio edades (se utiliza la consulta brindada)
http://localhost:3002/years

PUT actualizar usuario
http://localhost:3002/usuarios/19

DELETE eliminar usuario por id
http://localhost:3002/usuarios/3(id)
````
