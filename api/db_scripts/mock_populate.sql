INSERT INTO
    GRADO
    (nivel, descripcion)
VALUES
    ('M', 'Sistemas Microinformáticos y Redes'),
    ('S', 'Administración de Sistemas Informáticos en Red'),
    ('S', 'Desarrollo de Aplicaciones Multiplataforma'),
    ('S', 'Transporte y Logística'),
    ('S', 'Gestión de Ventas y Espacios Comerciales');

INSERT INTO
    ENTIDAD
    (
    cif,
    nombre,
    nombre_responsable,
    apellidos_responsable,
    contact_mail,
    login_mail,
    perfil_url
    )
VALUES
    (
        'B7012345A',
        'Residencias Amabir',
        'Laura',
        'García Pérez',
        'contacto@amabir.org',
        'login@amabir.org',
        'https://placehold.co/400/png?text=Amabir'
    ),
    (
        'G8234567B',
        'Solera Asistencial',
        'Javier',
        'Rodríguez Sanz',
        'info@solera.es',
        'login@solera.es',
        'https://placehold.co/400/png?text=Solera'
    ),
    (
        'H3456789C',
        'Comedor Solidario Unzutxiki',
        'María',
        'López Fernández',
        'voluntariado@unzu.org',
        'login@unzu.org',
        'https://placehold.co/400/png?text=Unzutxiki'
    ),
    (
        'J9876543D',
        'GazteLAN',
        'Aitor',
        'Martinez Echeverría',
        'coordinacion@gaztelan.org',
        'login@gaztelan.org',
        'https://placehold.co/400/png?text=GazteLAN'
    ),
    (
        'R1239876E',
        'Hermanitas de los Pobres Pamplona',
        'Sor Juana',
        'Blanco Vázquez',
        'direccion@hmpamplona.org',
        'login@hmpamplona.org',
        'https://placehold.co/400/png?text=HMPamplona'
    );

INSERT INTO
    ODS
    (id_ods, descripcion, imagen_url)
VALUES
    (
        1,
        'Fin de la pobreza',
        'https://placehold.co/400/png?text=Fin+de+la+pobreza'
    ),
    (
        3,
        'Salud y bienestar',
        'https://placehold.co/400/png?text=Salud+y+bienestar'
    ),
    (
        4,
        'Educación de calidad',
        'https://placehold.co/400/png?text=Educaci%C3%B3n+de+calidad'
    ),
    (
        10,
        'Reducción de las desigualdades',
        'https://placehold.co/400/png?text=Reducci%C3%B3n+de+las+desigualdades'
    ),
    (
        11,
        'Ciudades y comunidades sostenibles',
        'https://placehold.co/400/png?text=Ciudades+y+comunidades+sostenibles'
    );

INSERT INTO
    TIPO_ACTIVIDAD
    (descripcion, imagen_url)
VALUES
    (
        'Apoyo a Mayores',
        'https://placehold.co/400/png?text=Apoyo'
    ),
    (
        'Refuerzo Escolar',
        'https://placehold.co/400/png?text=Refuerzo'
    ),
    (
        'Recogida de Alimentos',
        'https://placehold.co/400/png?text=Recogida'
    ),
    (
        'Mantenimiento',
        'https://placehold.co/400/png?text=Mantenimiento'
    ),
    (
        'Actividades Lúdicas',
        'https://placehold.co/400/png?text=L%C3%BAdicas'
    );

INSERT INTO
    ACTIVIDAD
    (
    nombre,
    descripcion,
    estado,
    convoca,
    inicio,
    fin,
    grado,
    imagen_url
    )
VALUES
    (
        'Tardes de Compañía',
        'Talleres sencillos de informática con residentes de la tercera edad.',
        'A',
        1,
        '2025-12-01 16:00:00',
        '2025-12-01 18:00:00',
        5,
        'https://placehold.co/600x400/png?text=Tardes+de+Compa%C3%B1ia'
    ),
    (
        'Apoyo en Comedor',
        'Ayuda en el servicio de comidas y limpieza posterior en el comedor social.',
        'A',
        3,
        '2025-12-03 18:30:00',
        '2025-12-03 20:00:00',
        2,
        'https://placehold.co/600x400/png?text=Apoyo+en+Comedor'
    ),
    (
        'Clases de Programación',
        'Refuerzo escolar en programación básica para jóvenes.',
        'A',
        4,
        '2025-12-04 17:00:00',
        '2025-12-04 19:30:00',
        3,
        'https://placehold.co/600x400/png?text=Clases+de+Programaci%C3%B3n'
    ),
    (
        'Mantenimiento de Jardines',
        'Tareas ligeras de jardinería y mantenimiento de exteriores.',
        'A',
        2,
        '2025-12-05 15:30:00',
        '2025-12-05 17:00:00',
        5,
        'https://placehold.co/600x400/png?text=Mantenimiento+de+Jardines'
    );

INSERT INTO
    VOLUNTARIO
    (
    nif,
    nombre,
    apellido_1,
    apellido_2,
    grado,
    mail,
    password_hash,
    perfil_url
    )
VALUES
    (
        '11111111A',
        'Sofía',
        'Diez',
        'Gómez',
        5,
        'sofia.d@mail.com',
        '$2y$10$HASH_VOLUNTARIO_1',
        'https://placehold.co/400/png?text=Sof%C3%ADa'
    ),
    (
        '22222222B',
        'Pablo',
        'Sanz',
        'Ruiz',
        4,
        'pablo.s@mail.com',
        '$2y$10$HASH_VOLUNTARIO_2',
        'https://placehold.co/400/png?text=Pablo'
    ),
    (
        '33333333C',
        'Elena',
        'Gil',
        'Vidal',
        1,
        'elena.g@mail.com',
        '$2y$10$HASH_VOLUNTARIO_3',
        'https://placehold.co/400/png?text=Elena'
    ),
    (
        '44444444D',
        'Carlos',
        'Ramos',
        NULL,
        3,
        'carlos.r@mail.com',
        '$2y$10$HASH_VOLUNTARIO_4',
        'https://placehold.co/400/png?text=Carlos'
    );

INSERT INTO
    ADMINISTRADOR
    (
    login_mail,
    password_hash,
    nombre,
    apellido_1,
    perfil_url
    )
VALUES
    (
        'admin@cuatrovientos.org',
        '',
        'Iryna',
        'Pavlenko',
        'https://placehold.co/400/png?text=Jefa'
    );

INSERT INTO
    DISPONIBILIDAD
    (nif, id_dia, hora_inicio, hora_fin)
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
    VOLUNTARIO_TIPO
    (nif, id_tipo_actividad)
VALUES
    ('11111111A', 1),
    ('22222222B', 2),
    ('22222222B', 4),
    ('33333333C', 3),
    ('33333333C', 2),
    ('44444444D', 4);

INSERT INTO
    ACTIVIDAD_TIPO
    (id_actividad, id_tipo_actividad)
VALUES
    (1, 1),
    (2, 3),
    (3, 2),
    (4, 4);

INSERT INTO
    ACTIVIDAD_ODS
    (id_actividad, id_ods)
VALUES
    (1, 3),
    (1, 10),
    (2, 1),
    (3, 4),
    (4, 11);

INSERT INTO
    ACTIVIDAD_VOLUNTARIO
    (id_actividad, nif)
VALUES
    (1, '11111111A'),
    (2, '22222222B'),
    (4, '22222222B'),
    (3, '33333333C'),
    (2, '33333333C'),
    (4, '44444444D');
