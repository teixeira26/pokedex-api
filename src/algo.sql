create table tipoDEDieta
(
    id serial primary key,
    nombre varchar(30)
);

create table receta
(
    id serial primary key,
    nombre varchar(70) not null,
    resumen_del_plato text not null,
    puntuacion integer,
    size varchar(255),
    paso_a_paso text

);

insert into receta (nombre, resumen_del_plato, puntuacion, size, paso_a_paso)
values ('bizcocho','uashuahdushuash',3,'vegano','isjdijasdisjdisjd');

//   