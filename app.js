const Discord = require('discord.js');
const Music = require('discord.js-musicbot-addon');
const opusscript = require('opusscript');
const request = require('request');
const cheerio = require('cheerio');
const package = require('package');
const client = new Discord.Client();
const { Key, botToKen } = require('./config/config')

client.on("ready", () => {
    console.log("준비 완료!");
    console.log()
});

const music = new Music(client, {
    prefix: "@",
    maxQueueSize: "100",
    disableLoop: true,
    leaveHelp: "Bad help text.",
    leaveAlt: ["lve", "leev", "un1c0rns"],
    helpCmd: 'mhelp',
    leaveCmd: 'begone',
    ownerOverMember: true,
    botOwner: '123456789101112',
    youtubeKey: Key
});
client.on("message", message => {
    if (message.content == "@명령어") {
        message.reply("\n@rank \n 멜론 차트 출력 \n @liverank \n 네이버 실시간 검색어 출력 \n @CGV \n CGV 영화 예매 순위 출력 \n @롯데시네마 \n 롯데시네마 영화 예매 순위 출력 \n @voice \n 음성채널로 불러오기 \n voiceout \n 음성채널 내보내기")
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
        request(url, function (error, res, html) {
            if (!error) {
                const $ = cheerio.load(html);
                for (var i = 0; i < 10; i++) {
                    $('.ellipsis.rank01>span>a').each(function () {
                        const title_info = $(this);
                        const title_info_text = title_info.text();
                        title[i] = title_info_text;
                        i++;
                    });
                }

                for (var i = 0; i < 10; i++) {
                    $('.checkEllipsis').each(function () {
                        const artist_info = $(this);
                        const artist_info_text = artist_info.text();
                        artist[i] = artist_info_text;
                        i++;
                    })
                }
                ranking = ('\n<멜론 차트 1 ~ 10 위> \n');
                for (i = 1; i <= 10; i++) {
                    ranking += (i + '위 ' + title[i - 1] + " - " + artist[i - 1] + "\n");
                }
                message.reply(ranking);
            }
        });
    }
    if (message.content === "@liverank") {
        const title = new Array();
        const url = 'https://www.naver.com/';
        request(url, function (error, res, html) {
            if (!error) {
                const $ = cheerio.load(html);
                for (var i = 1; i <= 10; i++) {
                    $('.ah_item>a>.ah_k').each(function () {
                        const ranking_info = $(this);
                        const ranking_info_text = ranking_info.text();
                        title[i] = ranking_info_text;
                        i++;
                    });
                }
                ranking = ('\n<실시간 검색어> \n');
                for (var i = 2; i <= 11; i++) {
                    ranking += (i - 1 + "위 : " + title[i - 1] + "\n");
                }
                message.reply(ranking);
            }
        });
    }

    if (message.content === "@CGV") {
        let url = 'http://www.cgv.co.kr/movies/';
        let title = new Array();
        let ratingPoint = new Array();
        let percent = new Array();
        let grade = new Array();
        let MovieUrl = new Array();
        let CGV = '';
        request(url, function (error, res, html) {
            if (!error) {
                const $ = cheerio.load(html);
                for (let i = 0; i < 7; i++) {
                    $('.box-contents>a>strong').each(function () {
                        const title_info = $(this);
                        const title_info_text = title_info.text();
                        title[i] = title_info_text;
                        i++;
                    })
                }

                for (let i = 0; i < 7; i++) {
                    $('.percent > span').each(function () {
                        const patingPoint_info = $(this);
                        const patingPoint_info_text = patingPoint_info.text();
                        ratingPoint[i] = patingPoint_info_text;
                        i++;
                    })
                }

                for (let i = 0; i < 14; i++) {
                    j = 0;
                    $('.percent').each(function () {
                        const percent_info = $(this);
                        const percent_info_text = percent_info.text();
                        if (i % 2 === 1 || j == 0) {
                            percent[j] = percent_info_text;
                            j++;
                        }
                        i++;
                    })
                }

                for (let i = 0; i < 4; i++) {
                    $('.box-image > a').each(function () {
                        const MovieUrl_info = $(this).attr('href');
                        MovieUrl[i] = MovieUrl_info;
                        i++;
                    })
                }

                for (let i = 0; i < 7; i++) {
                    $('.thumb-image > span').each(function () {
                        const grade_info = $(this)
                        const grade_info_text = grade_info.text();
                        grade[i] = grade_info_text;
                        i++;
                    })
                }
                CGV = '\n<CGV 영화 예매 순위>\n';
                for (let i = 1; i <= 7; i++) {
                    CGV += i + '위 :' + title[i - 1] + '\n';
                    CGV += '예매율 :' + ratingPoint[i - 1] + ', 평점 :' + percent[i] + '\n';
                    CGV += grade[i - 1] + '\n';
                    CGV += 'http://www.cgv.co.kr' + MovieUrl[i - 1] + '\n';
                }
                message.reply(CGV);
            }
        })
    }

    if (message.content === '@롯데시네마') {
        let url = 'http://www.lottecinema.co.kr/LCWS/Movie/MovieData.aspx';
        let title = new Array();
        let ratingPoint = new Array();
        let percent = new Array();
        let grade = new Array();
        let MovieUrl = new Array();
        let LC = '';
        request.post({
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            url: url,
            body: 'paramList={"MethodName":"GetMovies","channelType":"HO","osType":"Chrome","osVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36","multiLanguageID":"KR","division":1,"moviePlayYN":"Y","orderType":"1","blockSize":100,"pageNo":1}'
        }, function (error, res, html) {
            html = JSON.parse(html)
            j = 0;
            for (i = 0; i <= 10; i++) {
                if (html.Movies.Items[i].MovieNameKR !== 'AD') {
                    title[j] = html.Movies.Items[i].MovieNameKR
                    ratingPoint[j] = html.Movies.Items[i].ViewEvaluation
                    percent[j] = html.Movies.Items[i].ViewEvaluation
                    grade[j] = html.Movies.Items[i].ViewGradeNameUS
                    MovieUrl[j] = 'http://www.lottecinema.co.kr/LCHS/Contents/Movie/Movie-Detail-View.aspx?movie=' + html.Movies.Items[i].RepresentationMovieCode
                    j++;
                }
                if (j == 7) {
                    break;
                }
            }
            LC = "\n<롯데시네마 영화 예매 순위>"
            for (let i = 1; i <= 7; i++) {
                LC += i + '위 :' + title[i - 1] + '\n';
                LC += '예매율 :' + ratingPoint[i - 1] + ', 평점 :' + percent[i] + '\n';
                LC += grade[i - 1] + '\n';
                LC += MovieUrl[i - 1] + '\n';
            }
            message.reply(LC);
        })
    }

    if (message.content === '@voiceout') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.leave();
            //console.log("player : " +message.member.voiceChannel);
            message.reply('보이스 채널을 나갔습니다.');
        } else {
            //console.log("noplayer : "+message.member.voiceChannel);
            message.reply('이미 나가있습니다.');
        }
    }
    if (message.content === '@voice') {
        if (message.member.voiceChannel) {
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

// bot.setYoutubeKey('AIzaSyBGxbK035bxei_yCzoB97koBjNSa-ebHJs');
client.login(botToKen);