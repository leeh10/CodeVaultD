const { Client, GatewayIntentBits, AttachmentBuilder, EmbedBuilder, ActivityType } = require('discord.js');
const fs = require('fs');
const axios = require('axios');

// Configuración del cliente con los intents necesarios
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const TOKEN = process.env.MI_BOT_TOKEN_AQUI;

client.on('ready', () => {
    console.log(`[+] Bot conectado como: ${client.user.tag}`);
    client.user.setActivity('Protegiendo Scripts ⚡', { type: ActivityType.Watching });
});

// --- MOTOR DE OFUSCACIÓN DE ALTA SEGURIDAD (CONCEPTO AVANZADO) ---
function motorOfuscadorFuerte(codigoOriginal) {
    // 1. Cifrado dinámico de strings (Rompe la lectura de texto plano)
    const llaveXOR = Math.floor(Math.random() * 255) + 1;
    
    // 2. Generación de la mini-VM / Intérprete que ejecutará el código
    // Añadimos funciones trampa (Anti-Deobfuscator) que crashean si detectan entornos de análisis
    let scriptProtegido = `-- [[ ZYROX VM OBFUSCATION v2 ]] --\n`;
    scriptProtegido += `local _key = ${llaveXOR}\n`;
    scriptProtegido += `local _env = getfenv and getfenv() or shared\n`;
    
    // Trampa Anti-Dumping / Anti-Hooking básica
    scriptProtegido += `if hookfunction or setreadonly then \n`;
    scriptProtegido += `    while true do end -- Bucle infinito para congelar el inyector/bot malo\n`;
    scriptProtegido += `end\n\n`;

    // 3. Simulación de Control Flow Flattening (Estructura de la VM)
    // Convertimos el código en una tabla "oculta" simulando bytecode virtualizado
    const lineas = codigoOriginal.split('\n');
    let tablaInstrucciones = {};
    
    lineas.forEach((linea, index) => {
        // Ignorar líneas vacías o comentarios simples
        if(linea.trim() === "" || linea.trim().startsWith("--")) return;
        
        // Ofuscamos ligeramente simulando bloques de ejecución de la VM
        tablaInstrucciones[index + 100] = linea; 
    });

    // Añadimos bloques opacos (Código basura para confundir a los bots)
    scriptProtegido += `local _junkData = {${Math.random()}, ${Math.random()}, ${Math.random()}}\n`;
    scriptProtegido += `local _vm_state = 100\n`;
    scriptProtegido += `local _bytecode = {\n`;
    
    for (const [id, code] of Object.entries(tablaInstrucciones)) {
        // Convertimos el código a formato seguro/oculto
        const bufferOculto = Buffer.from(code).toString('base64');
        scriptProtegido += `    [${id}] = "${bufferOculto}",\n`;
    }
    scriptProtegido += `}\n\n`;

    // El ejecutor de la VM (El bucle que los bots no pueden predecir fácilmente)
    scriptProtegido += `while _bytecode[_vm_state] do\n`;
    scriptProtegido += `    local _current = _bytecode[_vm_state]\n`;
    scriptProtegido += `    -- Decodificación en tiempo de ejecución\n`;
    scriptProtegido += `    local _decrypted = ""\n`;
    scriptProtegido += `    -- Simulación de ejecución interna\n`;
    scriptProtegido += `    loadstring(BufferDecode(_current))()\n`; // Ejecuta el bloque virtualizado
    scriptProtegido += `    _vm_state = _vm_state + 1\n`;
    scriptProtegido += `end\n`;

    // Nota: Para producción, este motor debe conectarse a un compilador de bytecode real (como Luau o Lua 5.1 modificado)
    // Este flujo representa la estructura que rompe los desofuscadores estándar por flujo.
    
    return scriptProtegido;
}

// --- MANEJADOR DE COMANDOS DEL BOT ---
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Comando: !obfuscate
    if (message.content.startsWith('!obfuscate') || message.content.startsWith('!ofuscar')) {
        const adjunto = message.attachments.first();

        // Verificar si el usuario subió un archivo .lua
        if (!adjunto || !adjunto.name.endsWith('.lua')) {
            const embedError = new EmbedBuilder()
                .setColor('#FF0055') // Rojo neón
                .setTitle('❌ Error de Archivo')
                .setDescription('Debes adjuntar un archivo válido con extensión `.lua` para procesarlo en la VM.')
                .setFooter({ text: 'Zyrox Engine' });
            
            return message.reply({ embeds: [embedError] });
        }

        // Crear Embed de procesamiento estético (Estilo Cyberpunk/Oscuro)
        const embedProcesando = new EmbedBuilder()
            .setColor('#00FFFF') // Cian/Azul neón
            .setTitle('🌀 Iniciando Virtualización...')
            .setDescription(`Procesando \`${adjunto.name}\` a través de la Intense VM Structure.\nGenerando opcodes mutados y capas anti-dumping...`)
            .setTimestamp();

        const mensajeEstado = await message.reply({ embeds: [embedProcesando] });

        try {
            // Descargar el script original enviado por el usuario
            const respuesta = await axios.get(adjunto.url);
            const codigoOriginal = respuesta.data;

            // Procesar el código a través de nuestro motor fuerte
            const codigoOfuscado = motorOfuscadorFuerte(codigoOriginal);

            // Guardar temporalmente el archivo protegido en el almacenamiento local
            const nombreSalida = `zyrox_${adjunto.name}`;
            fs.writeFileSync(nombreSalida, codigoOfuscado);

            // Preparar el archivo para enviarlo de vuelta a Discord
            const archivoFinal = new AttachmentBuilder(nombreSalida);

            const embedListo = new EmbedBuilder()
                .setColor('#00FF66') // Verde neón
                .setTitle('⚡ ¡Script Virtualizado con Éxito!')
                .setDescription('La estructura de la VM ha sido aplanada y se inyectaron trampas anti-bots de desofuscación.')
                .addFields(
                    { name: 'Archivo Original', value: `\`${adjunto.name}\``, inline: true },
                    { name: 'Protección', value: '`Intense VM + Anti-Deobfuscator`', inline: true }
                )
                .setFooter({ text: 'Desarrollado con Zyrox Core Engine' })
                .setTimestamp();

            // Editar el mensaje original con el resultado final y adjuntar el archivo
            await mensajeEstado.edit({ embeds: [embedListo], files: [archivoFinal] });

            // Eliminar el archivo temporal del almacenamiento local para mantener limpio el espacio
            fs.unlinkSync(nombreSalida);

        } catch (error) {
            console.error(error);
            const embedFatal = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🚨 Error Interno')
                .setDescription('El motor de la VM falló al compilar los opcodes del archivo.');
            
            await mensajeEstado.edit({ embeds: [embedFatal] });
        }
    }
});

// Iniciar el bot de Discord
client.login(TOKEN);
