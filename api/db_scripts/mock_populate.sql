INSERT INTO
    GRADO (nivel, descripcion)
VALUES
    ('M', 'Sistemas Microinformáticos y Redes'),
    ('S', 'Administración de Sistemas Informáticos en Red'),
    ('S', 'Desarrollo de Aplicaciones Multiplataforma'),
    ('S', 'Transporte y Logística'),
    ('S', 'Gestión de Ventas y Espacios Comerciales');

INSERT INTO
    ENTIDAD (
        cif,
        nombre,
        nombre_responsable,
        apellidos_responsable,
        contact_mail,
        login_mail
    )
VALUES
    (
        'B7012345A',
        'Residencias Amabir',
        'Laura',
        'García Pérez',
        'contacto@amabir.org',
        'login@amabir.org'
    ),
    (
        'G8234567B',
        'Solera Asistencial',
        'Javier',
        'Rodríguez Sanz',
        'info@solera.es',
        'login@solera.es'
    ),
    (
        'H3456789C',
        'Comedor Solidario Unzutxiki',
        'María',
        'López Fernández',
        'voluntariado@unzu.org',
        'login@unzu.org'
    ),
    (
        'J9876543D',
        'GazteLAN',
        'Aitor',
        'Martinez Echeverría',
        'coordinacion@gaztelan.org',
        'login@gaztelan.org'
    ),
    (
        'R1239876E',
        'Hermanitas de los Pobres Pamplona',
        'Sor Juana',
        'Blanco Vázquez',
        'direccion@hmpamplona.org',
        'login@hmpamplona.org'
    );

INSERT INTO
    ODS (id_ods, descripcion)
VALUES
    (1, 'Fin de la pobreza'),
    (3, 'Salud y bienestar'),
    (4, 'Educación de calidad'),
    (10, 'Reducción de las desigualdades'),
    (11, 'Ciudades y comunidades sostenibles');

INSERT INTO
    TIPO_ACTIVIDAD (descripcion)
VALUES
    ('Apoyo a Mayores'),
    ('Refuerzo Escolar'),
    ('Recogida de Alimentos'),
    ('Mantenimiento'),
    ('Actividades Lúdicas');

INSERT INTO
    ACTIVIDAD (
        nombre,
        descripcion,
        estado,
        convoca,
        inicio,
        fin,
        grado
    )
VALUES
    (
        'Tardes de Compañía',
        'Talleres sencillos de informática con residentes de la tercera edad.',
        'A',
        1,
        '2025-12-01 16:00:00',
        '2025-12-01 18:00:00',
        5
    ),
    (
        'Apoyo en Comedor',
        'Ayuda en el servicio de comidas y limpieza posterior en el comedor social.',
        'A',
        3,
        '2025-12-03 18:30:00',
        '2025-12-03 20:00:00',
        2
    ),
    (
        'Clases de Programación',
        'Refuerzo escolar en programación básica para jóvenes.',
        'A',
        4,
        '2025-12-04 17:00:00',
        '2025-12-04 19:30:00',
        3
    ),
    (
        'Mantenimiento de Jardines',
        'Tareas ligeras de jardinería y mantenimiento de exteriores.',
        'A',
        2,
        '2025-12-05 15:30:00',
        '2025-12-05 17:00:00',
        5
    );

INSERT INTO
    VOLUNTARIO (
        nif,
        nombre,
        apellido_1,
        apellido_2,
        grado,
        mail,
        password_hash
    )
VALUES
    (
        '11111111A',
        'Sofía',
        'Diez',
        'Gómez',
        5,
        'sofia.d@mail.com',
        '$2y$10$HASH_VOLUNTARIO_1'
    ),
    (
        '22222222B',
        'Pablo',
        'Sanz',
        'Ruiz',
        4,
        'pablo.s@mail.com',
        '$2y$10$HASH_VOLUNTARIO_2'
    ),
    (
        '33333333C',
        'Elena',
        'Gil',
        'Vidal',
        1,
        'elena.g@mail.com',
        '$2y$10$HASH_VOLUNTARIO_3'
    ),
    (
        '44444444D',
        'Carlos',
        'Ramos',
        NULL,
        3,
        'carlos.r@mail.com',
        '$2y$10$HASH_VOLUNTARIO_4'
    );

INSERT INTO
    ADMINISTRADOR (
        login_mail,
        password_hash,
        nombre,
        apellido_1,
    )
VALUES
    (
        'admin@cuatrovientos.org',
        '',
        'Iryna',
        'Pavlenko'
    );

INSERT INTO
    DISPONIBILIDAD (nif, id_dia, hora_inicio, hora_fin)
VALUES
    ('11111111A', 1, '15:30:00', '19:00:00'),
    ('11111111A', 4, '15:00:00', '18:00:00'),
    ('22222222B', 3, '18:00:00', '21:00:00'),
    ('22222222B', 5, '17:00:00', '19:00:00'),
    ('33333333C', 2, '18:00:00', '20:30:00'),
    ('44444444D', 1, '19:00:00', '21:00:00'),
    ('44444444D', 2, '15:00:00', '17:30:00'),
    ('44444444D', 5, '15:00:00', '18:00:00');

INSERT INTO
    VOLUNTARIO_TIPO (nif, id_tipo_actividad)
VALUES
    ('11111111A', 1),
    ('22222222B', 2),
    ('22222222B', 4),
    ('33333333C', 3),
    ('33333333C', 2),
    ('44444444D', 4);

INSERT INTO
    ACTIVIDAD_TIPO (id_actividad, id_tipo_actividad)
VALUES
    (1, 1),
    (2, 3),
    (3, 2),
    (4, 4);

INSERT INTO
    ACTIVIDAD_ODS (id_actividad, id_ods)
VALUES
    (1, 3),
    (1, 10),
    (2, 1),
    (3, 4),
    (4, 11);