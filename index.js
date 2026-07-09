const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { Readable } = require('stream');

const client = new Client();

// هذا الكود يولد موجة صوتية بسيطة جداً (تردد)
class SineWave extends Readable {
    constructor() { super(); this.t = 0; }
    _read() {
        const buffer = Buffer.alloc(960);
        for (let i = 0; i < 480; i++) {
            const sample = Math.sin(this.t += 0.05) * 32767;
            buffer.writeInt16LE(sample, i * 2);
        }
        this.push(buffer);
    }
}

client.on('ready', () => {
    console.log(`تم الدخول كـ ${client.user.tag}`);
    const channelId = '1496674843184074945';

    const connectAndStream = () => {
        const channel = client.channels.cache.get(channelId);
        if (!channel) return;

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: false
        });

        const player = createAudioPlayer();
        // لاحظ هنا: نرسل الموجة مباشرة بدون الحاجة لـ FFmpeg
        player.play(createAudioResource(new SineWave()));
        connection.subscribe(player);
    };

    connectAndStream();
    setInterval(connectAndStream, 60000);
});

client.login(process.env.token);
