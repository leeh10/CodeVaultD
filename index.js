const { Client, GatewayIntentBits, AttachmentBuilder, EmbedBuilder, ActivityType } = require('discord.js');
const fs = require('fs');
const axios = require('axios');

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

// --- MOTOR DE OFUSCACIÓN SIN LOADSTRING (MÁXIMA COMPATIBILIDAD) ---
// --- MOTOR DE OFUSCACIÓN DE ALTA SEGURIDAD (ARRAY DE BYTES) v5.0 ---
// --- MOTOR DE OFUSCACIÓN DE ALTA SEGURIDAD (STRINGS NATIVOS) v6.0 ---
function motorOfuscadorFuerte(bufferOriginal) {
    let scriptProtegido = `-- [[ ZYROX ENGINE v6.0 NATIVE STRINGS ]] --\n\n`;
    
    // 1. Trampas Anti-Deobfuscator
    scriptProtegido += `local _g = getfenv and getfenv() or _ENV\n`;
    scriptProtegido += `if (setupvalue and tostring(setupvalue):find("unveilr")) or (hookfunction and tostring(hookfunction):find("mock")) then \n`;
    scriptProtegido += `    error("Zyrox Security: Unveilr Detected")\n`;
    scriptProtegido += `    while true do end\n`;
    scriptProtegido += `end\n\n`;

    // 2. Procesamiento del código en bytes puros de 3 dígitos (\000)
    // Se divide en pedazos (chunks) para no saturar el límite de longitud de texto de Luau
    const CHUNK_SIZE = 16384; // 16KB por bloque
    let chunks = [];
    
    for (let i = 0; i < bufferOriginal.length; i += CHUNK_SIZE) {
        let chunk = bufferOriginal.slice(i, i + CHUNK_SIZE);
        let escapedStr = "";
        
        for (let j = 0; j < chunk.length; j++) {
            // Convierte cada byte en formato \xxx asegurando 3 dígitos (ej. \065)
            let byteStr = chunk[j].toString();
            escapedStr += "\\" + byteStr.padStart(3, '0');
        }
        chunks.push(`"${escapedStr}"`);
    }

    // 3. Concatenación hiper-rápida y directa
    scriptProtegido += `local _src = ${chunks.join(' .. ')}\n\n`;
    
    // 4. Ejecución blindada
    scriptProtegido += `local _f, _e = loadstring(_src, "@ZyroxPhantom")\n`;
    scriptProtegido += `if _f then\n`;
    scriptProtegido += `    local _ok, _res = pcall(_f)\n`;
    scriptProtegido += `    if not _ok then\n`;
    scriptProtegido += `        warn("[Zyrox] Error interno del script: " .. tostring(_res))\n`;
    scriptProtegido += `    end\n`;
    scriptProtegido += `else\n`;
    scriptProtegido += `    warn("[Zyrox] Error crítico del ejecutor: " .. tostring(_e))\n`;
    scriptProtegido += `end\n`;

    return scriptProtegido;
}



// --- MANEJADOR DE COMANDOS DEL BOT ---
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('!obfuscate') || message.content.startsWith('!ofuscar')) {
        const adjunto = message.attachments.first();

        if (!adjunto || (!adjunto.name.endsWith('.lua') && !adjunto.name.endsWith('.txt'))) {
            const embedError = new EmbedBuilder()
                .setColor('#FF0055')
                .setTitle('❌ Error de Archivo')
                .setDescription('Debes adjuntar un archivo válido con extensión `.lua` o `.txt`.')
                .setFooter({ text: 'Zyrox Engine' });
            
            return message.reply({ embeds: [embedError] });
        }

        const embedProcesando = new EmbedBuilder()
            .setColor('#00FFFF')
            .setTitle('🌀 Iniciando Virtualización Nativa...')
            .setDescription(`Procesando \`${adjunto.name}\` sin bypass de carga...\nAsegurando ejecución inmediata en ejecutores móviles.`)
            .setTimestamp();

        const mensajeEstado = await message.reply({ embeds: [embedProcesando] });

        try {
            const respuesta = await axios.get(adjunto.url, { responseType: 'arraybuffer' });
            const bufferArchivo = Buffer.from(respuesta.data);

            const codigoOfuscado = motorOfuscadorFuerte(bufferArchivo);

            const nombreSalida = `zyrox_${adjunto.name}`;
            fs.writeFileSync(nombreSalida, codigoOfuscado, 'utf-8');

            const archivoFinal = new AttachmentBuilder(nombreSalida);

            const embedListo = new EmbedBuilder()
                .setColor('#00FF66')
                .setTitle('⚡ ¡Script Protegido e Inyectable!')
                .setDescription('Removido el uso de entornos virtuales inestables. Formato ejecutable directo optimizado.')
                .addFields(
                    { name: 'Archivo Original', value: `\`${adjunto.name}\``, inline: true },
                    { name: 'Compatibilidad', value: '`Delta, Fluxus, Arceus, etc.`', inline: true }
                )
                .setFooter({ text: 'Desarrollado con Zyrox Core Engine v4.0' })
                .setTimestamp();

            await mensajeEstado.edit({ embeds: [embedListo], files: [archivoFinal] });
            fs.unlinkSync(nombreSalida);

        } catch (error) {
            console.error(error);
            const embedFatal = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🚨 Error de Compilación')
                .setDescription('El motor falló al estructurar la función nativa.');
            
            await mensajeEstado.edit({ embeds: [embedFatal] });
        }
    }
});

client.login(TOKEN);

// --- SOLUCIÓN PARA RENDER WEB SERVICE ---
const http = require('http');
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Zyrox VM Engine Online');
}).listen(process.env.PORT || 3000, () => {
    console.log('[+] Puerto web simulado abierto con éxito para evitar bloqueos en Render.');
});
