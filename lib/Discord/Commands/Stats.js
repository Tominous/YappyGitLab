const moment = require('moment');
const DiscordJS = require('discord.js');
const Command = require('../Command');
const pack = require('../../../package.json');

require('moment-duration-format');

const unit = ['', 'K', 'M', 'G', 'T', 'P'];
const getUptime = (bot) => moment.duration(bot.uptime).format('d[ days], h[ hours], m[ minutes, and ]s[ seconds]');
const bytesToSize = (input, precision) => {
    let index = Math.floor(Math.log(input) / Math.log(1024));
    if (unit >= unit.length) return `${input} B`;
    let msg = `${(input / Math.pow(1024, index)).toFixed(precision)} ${unit[index]}B`;
    return msg;
};

class StatsCommand extends Command {
    constructor(bot) {
        super(bot);
        this.props.help = {
            name: 'stats',
            description: 'Shows some stats of the bot... what else?',
            usage: 'stats',
        };
        this.setConf({
            aliases: ['info'],
        });
    }
    run(msg) {
        const bot = this.bot;
        const MemoryUsage = bytesToSize(process.memoryUsage().heapUsed, 3);
        const booted = bot.booted;
        const channels = bot.channels.cache;
        const textChannels = bot.channels.cache.filter((e) => e.type !== 'voice').size;
        const voiceChannels = bot.channels.cache.filter((e) => e.type === 'voice').size;

        const embed = {
            color: 0xfd9827,
            footer: {
                text: bot.user.username,
                icon_url: bot.user.avatarURL(),
            },
            description: `**${bot.user} Stats**`,
            fields: [
                {
                    name: '❯ Uptime',
                    value: getUptime(bot),
                    inline: true,
                },
                {
                    name: '❯ Booted',
                    value: `${booted.date} ${booted.time}`,
                    inline: true,
                },
                {
                    name: '❯ Memory Usage',
                    value: MemoryUsage,
                    inline: true,
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: false,
                },
                {
                    name: '❯ Guilds',
                    value: bot.guilds.cache.size,
                    inline: true,
                },
                {
                    name: '❯ channels',
                    value: `${channels.size} (${textChannels} text, ${voiceChannels} voice)`,
                    inline: true,
                },
                {
                    name: '❯ Users',
                    value: bot.users.cache.size,
                    inline: true,
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: false,
                },
                {
                    name: '❯ Author',
                    value: pack.author.replace(/<\S+[@]\S+[.]\S+>/g, ''),
                    inline: true,
                },
                {
                    name: '❯ Version',
                    value: pack.version,
                    inline: true,
                },
                {
                    name: '❯ DiscordJS',
                    value: `v${DiscordJS.version}`,
                    inline: true,
                },
            ],
        };

        return msg.channel.send({ embed });
    }
}

module.exports = StatsCommand;
