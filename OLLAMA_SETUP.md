# Configuración de Ollama para el Sistema de Gestión Hospitalaria

Este documento proporciona instrucciones detalladas para configurar y utilizar Ollama como asistente médico IA en el sistema de gestión hospitalaria.

## Requisitos previos

- Sistema operativo: Windows, macOS o Linux
- Espacio en disco: Al menos 5GB para modelos básicos, más para modelos más grandes
- RAM: Mínimo 8GB, recomendado 16GB o más

## Instalación de Ollama

1. Descarga Ollama desde el sitio oficial: [https://ollama.ai/download](https://ollama.ai/download)
2. Sigue las instrucciones de instalación específicas para tu sistema operativo:

### Windows

- Ejecuta el instalador descargado y sigue las instrucciones en pantalla
- Una vez instalado, Ollama se ejecutará como un servicio en segundo plano

### macOS

- Abre el archivo .dmg descargado
- Arrastra la aplicación Ollama a la carpeta de Aplicaciones
- Abre la aplicación desde la carpeta de Aplicaciones

### Linux

```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

## Descarga de modelos

Para que el asistente médico funcione correctamente, necesitas descargar al menos un modelo de lenguaje. Recomendamos usar Llama 3, pero puedes usar cualquier modelo compatible con Ollama.

1. Abre una terminal o línea de comandos
2. Ejecuta el siguiente comando para descargar Llama 3:

```bash
ollama pull llama3
```

Para modelos más pequeños con menos requisitos de hardware:

```bash
ollama pull llama3:8b
```

Para modelos más grandes con mejor rendimiento (requiere más RAM y GPU):

```bash
ollama pull llama3:70b
```

## Verificación de la instalación

Para verificar que Ollama está funcionando correctamente:

1. Abre una terminal o línea de comandos
2. Ejecuta el siguiente comando:

```bash
ollama list
```

Deberías ver una lista de los modelos instalados.

## Configuración del sistema

El sistema de gestión hospitalaria está configurado para conectarse a Ollama en `http://localhost:11434` por defecto. Si has modificado la configuración de Ollama para que se ejecute en una dirección o puerto diferente, deberás actualizar la variable `OLLAMA_BASE_URL` en el archivo `.env` del servidor.

## Uso del asistente médico IA

Una vez configurado, el asistente médico IA estará disponible en el chat del sistema. Para usarlo:

1. Accede al chat desde cualquier página del sistema
2. Ingresa tu nombre y selecciona una sala
3. El asistente IA responderá automáticamente a tus mensajes

### Comandos especiales

Puedes usar los siguientes comandos especiales en el chat:

- Mensajes que comienzan con `/` no serán procesados por la IA

## Solución de problemas

### El indicador de estado muestra "Asistente IA no disponible"

- Verifica que Ollama esté instalado y ejecutándose
- Comprueba que el servidor pueda conectarse a `http://localhost:11434`
- Asegúrate de haber descargado al menos un modelo

### Respuestas lentas o errores de tiempo de espera

- Considera usar un modelo más pequeño (como llama3:8b)
- Cierra aplicaciones que consuman muchos recursos
- Si tienes una GPU compatible, asegúrate de que Ollama esté configurado para usarla

### Errores en las respuestas

- Reinicia el servicio de Ollama
- Verifica que el modelo descargado sea compatible
- Comprueba los logs del servidor para más detalles

## Recursos adicionales

- [Documentación oficial de Ollama](https://github.com/ollama/ollama/blob/main/README.md)
- [Modelos disponibles](https://ollama.ai/library)
- [Optimización de rendimiento](https://github.com/ollama/ollama/blob/main/docs/faq.md)
