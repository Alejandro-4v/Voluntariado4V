FROM php:8.2-cli

RUN apt update && apt install -yqq --no-install-recommends \
    git \
    nano \
    zip \
    unzip \
    libzip-dev \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    mysqli \
    zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY --link \
    --from=ghcr.io/symfony-cli/symfony-cli:latest \
    /usr/local/bin/symfony /usr/local/bin/symfony

RUN curl -sS https://get.symfony.com/cli/installer | bash && mv /root/.symfony*/bin/symfony /usr/local/bin/symfony

WORKDIR /api

COPY ./php.ini /usr/local/etc/php/conf.d/php.ini

RUN echo "alias la='ls -la'" >> /root/.bashrc

CMD ["bash"]