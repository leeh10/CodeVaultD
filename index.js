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

// --- MOTOR DE OFUSCACIÓN DE ALTA SEGURIDAD MONOLÍTICO ---
function motorOfuscadorFuerte(codigoOriginal) {
    let scriptProtegido = `-- [[ ZYROX VM OBFUSCATION v3.0 ]] --\n\n`;
    
    // 1. Inyección del decodificador interno de Base64 nativo en Lua
    scriptProtegido += `local b='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'\n`;
    scriptProtegido += `local function BufferDecode(data)\n`;
    scriptProtegido += `    data = string.gsub(data, '[^'..b..'=]', '')\n`;
    scriptProtegido += `    return (data:gsub('.', function(x)\n`;
    scriptProtegido += `        if (x == '=') then return '' end\n`;
    scriptProtegido += `        local r,f='',(b:find(x)-1)\n`;
    scriptProtegido += `        for i=6,1,-1 do r=r..(f%2^i-f%2^(i-1)>0 and '1' or '0') end\n`;
    scriptProtegido += `        return r;\n`;
    scriptProtegido += `    end):gsub('%d%d%d%d%d%d%d%d', function(x)\n`;
    scriptProtegido += `        local c=0\n`;
    scriptProtegido += `        for i=1,8 do c=c+(x:sub(i,i)=='1' and 2^(8-i) or 0) end\n`;
    scriptProtegido += `        return string.char(c)\n`;
    scriptProtegido += `    end))\n`;
    scriptProtegido += `end\n\n`;

    // 2. Trampas Anti-Deobfuscator Inteligentes (Compatibles con Delta / Android Exploits)
    scriptProtegido += `local _isBot = false\n`;
    scriptProtegido += `if (setupvalue and tostring(setupvalue):find("unveilr")) or (hookfunction and tostring(hookfunction):find("mock")) then \n`;
    scriptProtegido += `    _isBot = true\n`;
    scriptProtegido += `end\n\n`;
    scriptProtegido += `if _isBot then\n`;
    scriptProtegido += `    error("/app/unveilr/infinite_loop_err");\n`;
    scriptProtegido += `    while true do end\n`;
    scriptProtegido += `end\n\n`;

    // 3. Convertir TODO el script completo a Base64 sin romper líneas ni bloques
    const codigoCompletoBase64 = Buffer.from(codigoOriginal).toString('base64');

    scriptProtegido += `local _encryptedSource = "${codigoCompletoBase64}"\n\n`;

    // 4. Ejecutor seguro en memoria (Carga todo el script unificado)
    scriptProtegido += `local _decrypted = BufferDecode(_encryptedSource)\n`;
    scriptProtegido += `local _loaded, _err = loadstring(_decrypted)\n\n`;
    scriptProtegido += `if _loaded then\n`;
    scriptProtegido += `    local _status, _res = pcall(_loaded)\n`;
    scriptProtegido += `    if not _status then\n`;
    scriptProtegido += `        warn("[Zyrox Runtime Error]: " .. tostring(_res))\n`;
    scriptProtegido += `    end\n`;
    scriptProtegido += `else\n`;
    scriptProtegido += `    warn("[Zyrox VM Error]: Estructura corrupta de compilación: " .. tostring(_err))\n`;
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
                .setDescription('Debes adjuntar un archivo válido con extensión `.lua` o `.txt` para procesarlo.')
                .setFooter({ text: 'Zyrox Engine' });
            
            return message.reply({ embeds: [embedError] });
        }

        const embedProcesando = new EmbedBuilder()
            .setColor('#00FFFF')
            .setTitle('🌀 Iniciando Virtualización...')
            .setDescription(`Procesando \`${adjunto.name}\` en bloque monolítico para evitar errores de sintaxis...`)
            .setTimestamp();

        const mensajeEstado = await message.reply({ embeds: [embedProcesando] });

        try {
            const respuesta = await axios.get(adjunto.url);
            const codigoOriginal = respuesta.data;

            const codigoOfuscado = motorOfuscadorFuerte(codigoOriginal);

            const nombreSalida = `zyrox_${adjunto.name}`;
            fs.writeFileSync(nombreSalida, codigoOfuscado);

            const archivoFinal = new AttachmentBuilder(nombreSalida);

            const embedListo = new EmbedBuilder()
                .setColor('#00FF66')
                .setTitle('⚡ ¡Script Protegido Correctamente!')
                .setDescription('El código fue empaquetado en una sola capa de memoria limpia. Se eliminaron los fallos de cierre de variables.')
                .addFields(
                    { name: 'Archivo Original', value: `\`${adjunto.name}\``, inline: true },
                    { name: 'Motor', value: '`Zyrox Monolithic v3.0`', inline: true }
                )
                .setFooter({ text: 'Desarrollado con Zyrox Core Engine' })
                .setTimestamp();

            await mensajeEstado.edit({ embeds: [embedListo], files: [archivoFinal] });
            fs.unlinkSync(nombreSalida);

        } catch (error) {
            console.error(error);
            const embedFatal = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🚨 Error Interno')
                .setDescription('El motor falló al codificar el bloque principal.');
            
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
