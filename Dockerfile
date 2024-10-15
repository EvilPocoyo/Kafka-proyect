FROM php:8.1-fpm

# Instalar dependencias y extensiones PHP necesarias
RUN apt-get update && apt-get install -y \
    librdkafka-dev \
    gnupg \
    zip \
    unzip \
    git \
    libzip-dev \
    && rm -rf /var/lib/apt/lists/*

# Instalar drivers de SQL Server
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql17 \
    && apt-get install -y unixodbc-dev \
    && rm -rf /var/lib/apt/lists/*

# Instalar y habilitar extensiones PHP
RUN docker-php-ext-install zip pdo_mysql \
    && pecl install rdkafka \
    && docker-php-ext-enable rdkafka

# Instalar extensiones SQL Server para PHP
RUN pecl install sqlsrv pdo_sqlsrv \
    && docker-php-ext-enable sqlsrv pdo_sqlsrv

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

COPY ./src .

# Instalar dependencias de Composer
RUN composer install --no-scripts --no-autoloader

# Generar el autoloader optimizado
RUN composer dump-autoload --optimize