# Usa imagem base PHP com Apache
FROM php:8.2-apache

# Instala dependências necessárias
RUN apt-get update && apt-get install -y \
    git unzip libicu-dev libzip-dev zip \
    && docker-php-ext-install intl pdo pdo_mysql zip opcache

# Habilita mod_rewrite (Symfony precisa)
RUN a2enmod rewrite

# Define diretório de trabalho
WORKDIR /var/www/html

# Copia os arquivos do projeto
COPY . .

# Instala o Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Configura o Apache para servir a pasta public/ como raiz
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Garante que o DirectoryIndex aceite index.php
RUN echo "DirectoryIndex index.php index.html" >> /etc/apache2/apache2.conf

# Configura permissões para a pasta public/
RUN echo "<Directory /var/www/html/public>\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>" > /etc/apache2/conf-available/symfony.conf \
    && a2enconf symfony

# Expõe a porta usada pelo Render
EXPOSE 10000

# Troca a porta padrão 80 para 10000
RUN sed -i 's/80/10000/g' /etc/apache2/ports.conf /etc/apache2/sites-available/000-default.conf

# Inicia o Apache
CMD ["apache2-foreground"]
