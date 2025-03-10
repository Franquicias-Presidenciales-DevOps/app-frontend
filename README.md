
<div style="text-align: center">
<img src="https://cdn.inclusionfinanciera.gob.sv/wp-content/uploads/2021/05/MicrosoftTeams-image-8-1024x418.png" alt="Logo de la presidencia" width="400"/>
</div>

# Franquicias presenciales

Proyecto del gobierno que busca administrar las franquicias presidenciales de las distintas entidades
del gobierno. Este proyecto representa en front-end la interfaz de usuario para la administración de
las franquicias presidenciales.

## Tabla de contenido

- [Franquicias presenciales](#franquicias-presenciales)
  - [Tabla de contenido](#tabla-de-contenido)
  - [Requisitos](#requisitos)
  - [Instalación](#instalación)
  - [Ejecución](#ejecución)
  - [Creditos](#creditos)

## Requisitos

![Static Badge](https://img.shields.io/badge/Node.js-^20.0-green?logo=node.js)

## Instalación

Para instalar el proyecto, se debe clonar el repositorio:

```bash
git clone http://gitlab.egob.sv/avargas90/franquicias-presidenciales-front.git
```

```bash
cd franquicias-presidenciales-front
```

Luego, se debe instalar las dependencias del proyecto:

```bash
npm install
```

## Ejecución

Copiar el archivo `.env.example` a `.env.local` y configurar las variables de entorno necesarias.

```env
VITE_VUE_APP_API_URL=http://urldelbackend/
```

En caso que el proyecto se quiera ejecutar en modo de desarrollo, se puede hacer con el siguiente comando:

```bash
npm run dev
```

En caso que el proyecto se quiera ejecutar en modo de producción, se puede hacer con el siguiente comando:

```bash
npm run build
```

Después de ejecutar el comando, se generará una carpeta `dist` con los archivos necesarios para desplegar el proyecto.

## Creditos

Proyecto de la secretaría de innovación de la presidencia de la república de El Salvador.

[Secretaría de innovación](https://www.innovacion.gob.sv/)
