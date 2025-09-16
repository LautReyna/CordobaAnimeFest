\c caf

CREATE TABLE caf(
    id SERIAL PRIMARY KEY,
    fecha DATE,
    mapa TEXT
);

CREATE TABLE evento(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    horaInicio TIME,
    horaFin TIME,
    estado VARCHAR(20),
    ubicacion VARCHAR(20),
    descripcion TEXT,
    imagen VARCHAR(250)
);

CREATE TABLE eventoCaf(
    id SERIAL PRIMARY KEY,
    idEvento INT REFERENCES evento(id),
    idCaf INT REFERENCES caf(id)
);

CREATE TABLE stand(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    descripcion TEXT,
    ubicacion VARCHAR(20),
    estado VARCHAR(20)
);

CREATE TABLE standCaf(
    id SERIAL PRIMARY KEY,
    idStand INT REFERENCES stand(id),
    idCaf INT REFERENCES caf(id)
);

CREATE TABLE usuario(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    contrasena VARCHAR(100),
    categoria VARCHAR(20)
);

CREATE TABLE alerta(
    id SERIAL PRIMARY KEY,
    hora TIME
);

CREATE TABLE auditoria(
    idUsuario INT REFERENCES usuario(id),
    fechaHora TIMESTAMP,
    ipTerminal VARCHAR(30)
);
