\c caf

CREATE TABLE caf(
    id SERIAL PRIMARY KEY,
    fecha DATE,
    mapa TEXT,
    activa BOOLEAN
);

CREATE TABLE zona(
    id SERIAL PRIMARY KEY,
    idCaf INT REFERENCES caf(id) ON DELETE CASCADE,
    nombre VARCHAR(50),
    coordenadas TEXT
);

CREATE TABLE evento(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    horaInicio TIME,
    horaFin TIME,
    estado VARCHAR(20),
    ubicacion INT REFERENCES zona(id),
    descripcion TEXT,
    imagen VARCHAR(250)
);

CREATE TABLE eventoCaf(
    id SERIAL PRIMARY KEY,
    idEvento INT REFERENCES evento(id) ON DELETE CASCADE,
    idCaf INT REFERENCES caf(id) ON DELETE CASCADE
);

CREATE TABLE stand(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    descripcion TEXT,
    ubicacion INT REFERENCES zona(id)
);

CREATE TABLE standCaf(
    id SERIAL PRIMARY KEY,
    idStand INT REFERENCES stand(id) ON DELETE CASCADE,
    idCaf INT REFERENCES caf(id) ON DELETE CASCADE
);

CREATE TABLE usuario(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    contrasena VARCHAR(100),
    categoria VARCHAR(20)
);

CREATE TABLE alerta(
    id SERIAL PRIMARY KEY,
    idEvento INT REFERENCES evento(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    modo VARCHAR(20) CHECK (modo IN ('todos','por_iniciar','en_curso')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE auditoria(
    idUsuario INT REFERENCES usuario(id) ON DELETE CASCADE,
    fechaHora TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    ipTerminal VARCHAR(30)
);

CREATE TABLE suscripciones(
    id SERIAL PRIMARY KEY,
    endpoint TEXT UNIQUE,
    data JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
)