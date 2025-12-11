# Start from official PHP with Apache
FROM php:8.2-apache

# 1. Herramientas del Sistema y Configuración Base
RUN apt update && apt install -yqq --no-install-recommends \
    git \
    nano \
    zip \
    unzip \
    libzip-dev \
    # Limpiar caché después de la instalación para reducir el tamaño de la imagen
    && rm -rf /var/lib/apt/lists/*

# Set git config (Mantenido)
RUN git config --global user.email "alejandrolopez2048@gmail.com" \
    && git config --global user.name "Alejacks"

# 2. Instalación de Extensiones PHP
RUN docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    mysqli \
    zip

# 3. Instalación de Herramientas Globales
# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Instalar Symfony CLI
COPY --link \
    --from=ghcr.io/symfony-cli/symfony-cli:latest \
    /usr/local/bin/symfony /usr/local/bin/symfony

# 4. Creación del Proyecto Symfony y Dependencias
# Establecer el directorio de trabajo donde estará el proyecto
WORKDIR /var/www/html

# Crear un proyecto Symfony 'skeleton'
# Nota: La carpeta del proyecto se llamará 'voluntariado-cuatrovientos'
RUN symfony new voluntariado-cuatrovientos --version="7.4.*" --no-git

# Cambiar al directorio del proyecto
WORKDIR /var/www/html/voluntariado-cuatrovientos

# Instalar dependencias requeridas (Ahora se instalan en el proyecto)
RUN composer require symfony/orm-pack
RUN composer require symfony/maker-bundle --dev
RUN composer require symfony/serializer-pack
RUN composer require symfony/validator

# 5. Configuración del Servidor Web
# Habilitar mod_rewrite de Apache para URLs limpias (Front Controller)
RUN a2enmod rewrite

# Es más limpio copiar un archivo de configuración específico:
COPY ./000-default.conf /etc/apache2/sites-available/000-default.conf
RUN a2dissite 000-default
RUN a2ensite 000-default

# Ajustar permisos para el directorio cache y logs (importante para Symfony)
RUN chown -R www-data:www-data /var/www/html/voluntariado-cuatrovientos/var

# Copiar archivos de configuración de php.ini
COPY ./php.ini /usr/local/etc/php/conf.d/php.ini

# Dar nombre al servidor (ServerName)
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Creación de aliases
RUN echo "alias ssstart='symfony server:start --allow-all-ip'" >> /root/.bashrc
RUN echo "alias ssstop='symfony server:stop'" >> /root/.bashrc
RUN echo "alias ssrestart='symfony server:restart'" >> /root/.bashrc
RUN echo "alias la='ls -la'" >> /root/.bashrc

# Exponer el puerto
EXPOSE 80