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

// --- MOTOR DE OFUSCACIÓN DE ALTA SEGURIDAD CON BYPASS HTTP v6.5 ---
function motorOfuscadorFuerte(bufferOriginal) {
    let scriptProtegido = `-- [[ ZYROX ENGINE v6.5 BYPASS & SECURE ]] --\n\n`;
    
    // 1. Hook de Bypass HTTP nativo para evitar el maldito Error 403
    // Esto obliga al ejecutor a usar caché y saltarse bloqueos de Cloudflare/GitHub en Android
    scriptProtegido += `local _oldHttpGet = game.HttpGet\n`;
    scriptProtegido += `game.HttpGet = function(self, url, nocache)\n`;
    scriptProtegido += `    local success, res = pcall(function()\n`;
    scriptProtegido += `        return _oldHttpGet(self, url, false) -- Forzamos el uso de caché\n`;
    scriptProtegido += `    end)\n`;
    scriptProtegido += `    if not success then\n`;
    scriptProtegido += `        -- Si falla, intentamos la llamada directa nativa sin el objeto 'self'\n`;
    scriptProtegido += `        return _oldHttpGet(url, false)\n`;
    scriptProtegido += `    end\n`;
    scriptProtegido += `    return res\n`;
    scriptProtegido += `end\n\n`;

    // 2. Trampas Anti-Deobfuscator
    scriptProtegido += `local _g = getfenv and getfenv() or _ENV\n`;
    scriptProtegido += `if (setupvalue and tostring(setupvalue):find("unveilr")) or (hookfunction and tostring(hookfunction):find("mock")) then \n`;
    scriptProtegido += `    error("Zyrox Security: Unveilr Detected")\n`;
    scriptProtegido += `    while true do end\n`;
    scriptProtegido += `end\n\n`;

    // 3. Procesamiento del código en bytes escapados (Chunks de 16KB para estabilidad total)
    const CHUNK_SIZE = 16384; 
    let chunks = [];
    
    for (let i = 0; i < bufferOriginal.length; i += CHUNK_SIZE) {
        let chunk = bufferOriginal.slice(i, i + CHUNK_SIZE);
        let escapedStr = "";
        for (let j = 0; j < chunk.length; j++) {
            escapedStr += "\\" + chunk[j].toString().padStart(3, '0');
        }
        chunks.push(`"${escapedStr}"`);
    }

    scriptProtegido += `local _src = ${chunks.join(' .. ')}\n\n`;
    
    // 4. Ejecución blindada
    scriptProtegido += `local _f, _e = loadstring(_src, "@ZyroxPhantom")\n`;
    scriptProtegido += `if _f then\n`;
    scriptProtegido += `    local _ok, _res = pcall(_f)\n`;
    scriptProtegido += `    if not _ok then\n`;
    scriptProtegido += `        warn("[Zyrox Runtime Error]: " .. tostring(_res))\n`;
    scriptProtegido += `    end\n`;
    scriptProtegido += `else\n`;
    scriptProtegido += `    warn("[Zyrox VM Error]: El exploit rechazó la carga: " .. tostring(_e))\n`;
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
            .setTitle('🌀 Iniciando Virtualización y Bypass...')
            .setDescription(`Procesando \`${adjunto.name}\` en formato cifrado con puente HTTP...`)
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
                .setTitle('⚡ ¡Script Ofuscado con Bypass HTTP!')
                .setDescription('Se integró un interceptor para evitar que GitHub o Pastebin bloqueen tus menús flotantes.')
                .addFields(
                    { name: 'Archivo Original', value: `\`${adjunto.name}\``, inline: true },
                    { name: 'Protección Visual', value: '`Activa (Bytes v6.5)`', inline: true }
                )
                .setFooter({ text: 'Desarrollado con Zyrox Core Engine v6.5' })
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
