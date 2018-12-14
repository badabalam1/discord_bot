const Discord = require('discord.js');
const Music = require('discord.js-musicbot-addon');
const opusscript = require('opusscript');
const request = require('request');
const cheerio = require('cheerio');
const package = require('package');
const client = new Discord.Client();

client.on("ready", () => {
    console.log("준비 완료!");
});

const music = new Music(client, {
    prefix: "@",
    maxQueueSize: "100",
    disableLoop: true,
    leaveHelp: "Bad help text.",
    leaveAlt: ["lve","leev","un1c0rns"],
    helpCmd: 'mhelp',
    leaveCmd: 'begone',
    ownerOverMember: true,
    botOwner: '',
    youtubeKey: ''
});
client.on("message", message => {
    if (message.content == "ping") {
        //일반 메세지를 출력
        message.reply('ping');
    }
    if (message.content == "Hello" || message.content == "hello" || message.content == "HELLO") {
        //이름 언급해서 메세지를 출력
        message.reply("hi hi");
    }
    if (message.content === "@rank") {
        var title = new Array(),
        artist = new Array(),
        ranking = new Array(),
        up_date,
        up_time;
        const url = 'http://www.melon.com/chart/';
        request(url, function(error, res, html){
            if(!error) {
                const $ = cheerio.load(html);
                for(var i= 0; i < 10; i++) {
                    $('.ellipsis.rank01>span>a').each(function() {
                        const title_info = $(this);
                        const title_info_text = title_info.text();
                        title[i] = title_info_text;
                        i++;
                    });
                }

                for(var i = 0; i < 10; i++) {
                    $('.checkEllipsis').each(function() {
                        const artist_info = $(this);
                        const artist_info_text = artist_info.text();
                        artist[i] = artist_info_text;
                        i++;
                    })
                }
                ranking = ('<멜론 차트 1 ~ 10 위> \n');
                for(i = 1; i <= 10; i++) {
                ranking += (i + '위 ' +title[i-1]+ " - " + artist[i-1] + "\n");
                }
                message.reply(ranking);
            }
        });
    }
    if (message.content === "@liverank") {
        const title = new Array();
        const url = 'https://www.naver.com/';
        request(url, function(error, res, html) {
            if(!error) {
                const $ = cheerio.load(html);
                for(var i =1; i <= 10; i++) {
                    $('.ah_item>a>.ah_k').each(function() {
                        const ranking_info = $(this);
                        const ranking_info_text = ranking_info.text();
                        title[i] = ranking_info_text;
                        i++;
                    });
                }
                ranking =('<실시간 검색어> \n');
                for(var i =2; i <= 11; i++) {
                    ranking += (i-1 +"위 : " + title[i-1] + "\n" );
                }
                message.reply(ranking);
            }
        });
    }
    if(!message.guild) {
        message.reply("Test");
    }
    if(message.content === '@voiceout') {
        if(message.member.voiceChannel) {
            message.member.voiceChannel.leave();
            //console.log("player : " +message.member.voiceChannel);
            message.reply('보이스 채널을 나갔습니다.');
        } else {
            //console.log("noplayer : "+message.member.voiceChannel);
            message.reply('이미 나가있습니다.');
        }
    }
    if(message.content === '@voice') {
        if(message.member.voiceChannel) {
            //보이스 채널에 입성하기
            message.member.voiceChannel.join().then(connection => {
                message.reply('보이스 채널에 연결되었습니다.');
                //연결시 실행파일 틀기
                const dispatcher = connection.playFile('');
            }).catch(console.log);
        } else {
            message.reply('먼저 보이스 채널에 들어가 주십시오 !');
        }
    }
});
      

client.login("");
