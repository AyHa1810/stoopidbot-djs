const { readFileSync } = require('node:fs');

const ssh = require('ssh2').Client;

exports.run = (client, message, args, level) => {
  const conn = new ssh();
  conn.on('ready', () => {
    message.channel.send('Client :: ready');
    conn.shell((err, stream) => {
      if (err) throw err;
      stream.on('close', () => {
        message.channel.send('Stream :: close');
        conn.end();
      }).on('data', (data) => {
        message.channel.send('OUTPUT: ' + data);
      });
      stream.end('ls -l\nexit\n');
    });
  }).connect({
    host: args[0],
    port: args[1],
    username: args[2],
    password: args[3]
    //privateKey: readFileSync('/path/to/my/key')
  });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	cooldown: '1s',
	aliases: [],
	permLevel: 'User'
};

exports.help = {
	name: 'ssh',
	category: 'General',
	description: 'starts bot session',
	usage: 'ssh <user@server-ip:port> <password/authkey>'
};