SET
    FOREIGN_KEY_CHECKS = 0;

CREATE TABLE
    GRADO (
        id_grado TINYINT AUTO_INCREMENT PRIMARY KEY,
        nivel ENUM ('E', 'B', 'M', 'S') NOT NULL,
        descripcion VARCHAR(50) NOT NULL UNIQUE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE
    ENTIDAD (
        id_entidad SMALLINT AUTO_INCREMENT PRIMARY KEY,
        cif VARCHAR(10) UNIQUE,
        nombre VARCHAR(50) NOT NULL,
        nombre_responsable VARCHAR(30) NOT NULL,
        apellidos_responsable VARCHAR(40) NOT NULL,
        fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        contact_mail VARCHAR(255) NOT NULL,
        login_mail VARCHAR(255),
        password_hash VARCHAR(255),
        perfil_url VARCHAR(255)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE UNIQUE INDEX IX_ENTIDAD_nombre_entidad ON ENTIDAD (nombre);

CREATE TABLE
    TIPO_ACTIVIDAD (
        id_tipo_actividad TINYINT AUTO_INCREMENT PRIMARY KEY,
        descripcion VARCHAR(50) NOT NULL,
        imagen_url VARCHAR(255)
    );

CREATE TABLE
    ODS (
        id_ods TINYINT PRIMARY KEY,
        descripcion VARCHAR(50) NOT NULL,
        imagen_url VARCHAR(255)
    );

CREATE TABLE
    ACTIVIDAD (
        id_actividad INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        descripcion VARCHAR(400),
        estado ENUM ('A', 'F', 'P', 'C', 'R', 'E') NOT NULL DEFAULT 'P',
        convoca SMALLINT NOT NULL,
        inicio TIMESTAMP NOT NULL,
        fin TIMESTAMP NOT NULL,
        grado TINYINT NOT NULL,
        lugar VARCHAR(100) NOT NULL,
        plazas TINYINT,
        FOREIGN KEY (convoca) REFERENCES ENTIDAD (id_entidad),
        FOREIGN KEY (grado) REFERENCES GRADO (id_grado),
        CONSTRAINT CK_ACTIVIDAD_inicio_anterior_al_fin CHECK (inicio < fin),
        imagen_url VARCHAR(255)
    );

CREATE INDEX IX_ACTIVIDAD_nombre ON ACTIVIDAD (nombre);

DELIMITER //

CREATE TRIGGER trg_actividad_before_insert
BEFORE INSERT ON ACTIVIDAD
FOR EACH ROW
    BEGIN
        SET NEW.estado = UPPER(NEW.estado);
    END //

CREATE TRIGGER trg_actividad_before_update
BEFORE UPDATE ON ACTIVIDAD
FOR EACH ROW
    BEGIN
        SET NEW.estado = UPPER(NEW.estado);
    END //

DELIMITER ;

CREATE TABLE
    VOLUNTARIO (
        nif CHAR(10) CHECK (
            UPPER(nif) REGEXP '^[0-9]{8}[A-Z]$'
            OR UPPER(nif) REGEXP '^[XYZ][0-9]{7}[A-Z]$'
        ) PRIMARY KEY,
        nombre VARCHAR(40) NOT NULL,
        apellido_1 VARCHAR(40) NOT NULL,
        apellido_2 VARCHAR(40),
        grado TINYINT NOT NULL,
        mail VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        estado ENUM ('A', 'P', 'R', 'I') NOT NULL DEFAULT 'P',
        FOREIGN KEY (grado) REFERENCES GRADO (id_grado),
        perfil_url VARCHAR(255)
    );

CREATE INDEX IX_VOLUNTARIO_nombre_completo ON VOLUNTARIO (nombre, apellido_1, apellido_2);

DELIMITER //

CREATE TRIGGER trg_voluntario_before_insert
BEFORE INSERT ON VOLUNTARIO
FOR EACH ROW
    BEGIN
        SET NEW.estado = UPPER(NEW.estado);
    END //

CREATE TRIGGER trg_voluntario_before_update
BEFORE UPDATE ON VOLUNTARIO
FOR EACH ROW
    BEGIN
        SET NEW.estado = UPPER(NEW.estado);
    END //

DELIMITER ;

CREATE TABLE
    ADMINISTRADOR (
        login_mail VARCHAR(255) PRIMARY KEY,
        password_hash VARCHAR(255) NOT NULL,
        nombre VARCHAR(40) NOT NULL,
        apellido_1 VARCHAR(40) NOT NULL,
        apellido_2 VARCHAR(40),
        perfil_url VARCHAR(255)
    );

CREATE TABLE
    VOLUNTARIO_TIPO (
        nif CHAR(10) NOT NULL,
        id_tipo_actividad TINYINT NOT NULL,
        PRIMARY KEY (nif, id_tipo_actividad),
        FOREIGN KEY (nif) REFERENCES VOLUNTARIO (nif),
        FOREIGN KEY (id_tipo_actividad) REFERENCES TIPO_ACTIVIDAD (id_tipo_actividad)
    );

CREATE TABLE
    ACTIVIDAD_TIPO (
        id_actividad INT NOT NULL,
        id_tipo_actividad TINYINT NOT NULL,
        PRIMARY KEY (id_actividad, id_tipo_actividad),
        FOREIGN KEY (id_actividad) REFERENCES ACTIVIDAD (id_actividad),
        FOREIGN KEY (id_tipo_actividad) REFERENCES TIPO_ACTIVIDAD (id_tipo_actividad)
    );

CREATE TABLE
    ACTIVIDAD_ODS (
        id_actividad INT NOT NULL,
        id_ods TINYINT NOT NULL,
        PRIMARY KEY (id_actividad, id_ods),
        FOREIGN KEY (id_actividad) REFERENCES ACTIVIDAD (id_actividad),
        FOREIGN KEY (id_ods) REFERENCES ODS (id_ods)
    );

CREATE TABLE 
    ACTIVIDAD_VOLUNTARIO (
        id_actividad INT NOT NULL,
        nif CHAR(10) NOT NULL,
        PRIMARY KEY (id_actividad, nif),
        FOREIGN KEY (id_actividad) REFERENCES ACTIVIDAD (id_actividad),
        FOREIGN KEY (nif) REFERENCES VOLUNTARIO (nif)
    );

CREATE TABLE
    DIA_SEMANA (
        id_dia TINYINT PRIMARY KEY,
        descripcion VARCHAR(10) NOT NULL UNIQUE
    );

CREATE TABLE
    DISPONIBILIDAD (
        nif CHAR(10) NOT NULL,
        id_dia TINYINT NOT NULL,
        hora_inicio TIME NOT NULL,
        hora_fin TIME NOT NULL,
        PRIMARY KEY (nif, id_dia),
        FOREIGN KEY (nif) REFERENCES VOLUNTARIO (nif),
        FOREIGN KEY (id_dia) REFERENCES DIA_SEMANA (id_dia),
        CONSTRAINT CK_DISPONIBILIDAD_inicio_antes_de_fin CHECK (hora_inicio < hora_fin)
    );

INSERT INTO
    DIA_SEMANA (id_dia, descripcion)
VALUES
    (1, 'Lunes'),
    (2, 'Martes'),
    (3, 'Miércoles'),
    (4, 'Jueves'),
    (5, 'Viernes');