\c caf

CREATE TABLE caf(
    idCaf SERIAL PRIMARY KEY,
    listaEventos JSON,
    listStands JSON,
    fecha DATE,
    mapa TEXT
);

CREATE TABLE evento(
    idEvento SERIAL PRIMARY KEY,
    nombreEvento VARCHAR(50),
    horaInicio TIME,
    horaFin TIME,
    estado VARCHAR(20),
    ubicacionEvento VARCHAR(20),
    descripcionEvento TEXT,
    imagenEvento VARCHAR(250)
);

CREATE TABLE eventoCaf(
    idEventoCaf SERIAL PRIMARY KEY,
    idEvento INT REFERENCES evento(idEvento),
    idCaf INT REFERENCES caf(idCaf)
);

CREATE TABLE tienda(
    idTienda SERIAL PRIMARY KEY,
    nombreTienda VARCHAR(50),
    descripcionTienda TEXT
);

CREATE TABLE stand(
    idStand SERIAL PRIMARY KEY,
    idTienda INT REFERENCES tienda(idTienda),
    ubicacionLote VARCHAR(20),
    estadoLote VARCHAR(20)
);

CREATE TABLE standCaf(
    idStandCaf SERIAL PRIMARY KEY,
    idStand INT REFERENCES stand(idStand),
    idCaf INT REFERENCES caf(idCaf)
);

CREATE TABLE usuario(
    idUsuario SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    contrasena VARCHAR(100),
    categoria VARCHAR(20)
);

CREATE TABLE alerta(
    idAlerta SERIAL PRIMARY KEY,
    hora TIME
);

CREATE TABLE auditoria(
    idUsuario INT REFERENCES usuario(idUsuario),
    fechaHora TIMESTAMP,
    ipTerminal VARCHAR(30)
);
