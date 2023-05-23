var posTagger = require('wink-pos-tagger');
var tagger = posTagger();
var func = require('./function.js');
const content = "지금 날짜가 5월 20일이니!";

async function get(content){
    var DTE = new Date();
    var contentArr = content.split(" ");
    var leng = contentArr.length;

    var Translated_CONTENT = (String(await func.PAPAGO_translate(content, 'en'))).replace(/Moongi/gi, '');
    Tag_Arr = tagger.tagSentence(Translated_CONTENT);
    leng = Tag_Arr.length;
    Day_ARR = [];
    chk_dtt1 = true;
    for (i = 0; i < leng; i++) {
        val = Tag_Arr[i].value;
        pos = Tag_Arr[i].pos;
        if (pos == "JJ"){
            dy = val.replace(/st/gi, ''); dy = dy.replace(/nd/gi, ''); dy = dy.replace(/rd/gi, ''); dy = dy.replace(/th/gi, '');
            Day_ARR.push(dy);
            chk_dtt1 = false;
        }
    }
    Detected_day = String(Day_ARR.join(' '));
    var Date_calc = await func.POS_check_Lunch_Date(Translated_CONTENT, content);
    if (Date_calc == 0) {
        if (func.POS_check_Lunch_Daterl(Translated_CONTENT, 0) == "RST") {
            var Year = String(DTE.getFullYear());
            var Month_d = String(func.POS_check_Lunch_Daterl(Translated_CONTENT, 1));
            var Daterl = `${Year} ${Month_d} ${Detected_day}`;
        } else {
            if(func.POS_Test_KR(Translated_CONTENT, 21)){
                var Year = String(DTE.getFullYear());
                var regexpCoordinates = /\w+\/+\w+\s/g;
                dok = String(content.match(regexpCoordinates));
                dok = dok.split("/");
                var Month_d = String(dok[0]);
                var Detected_day = String(dok[1]);
                var Daterl = `${Year} ${Month_d} ${Detected_day}`;
            } else {
                var Year = String(DTE.getFullYear());
                var Month_d = String(DTE.getMonth() + 1);
                var Detected_day = String(DTE.getDate());
                var Daterl = `${Year} ${Month_d} ${Detected_day}`;
            }
        }
    } else {
        var Daterl = await func.CHG_Date(Date_calc);
        var Year = (Daterl.split(" "))[0];
        var Month_d = (Daterl.split(" "))[1];
        var Detected_day = (Daterl.split(" "))[2];
    }
    if (Month_d.length == 1) {
        Month = `0${Month_d}`;
    } else {
        Month = Month_d;
    }
    if (Detected_day.length == 1) {
        Day = `0${Detected_day}`;
    } else {
        Day = Detected_day;
    }
    var Date_frmt = `${Year}/${Month_d}/${Detected_day}`;
    console.log(`Detected Date : ${Date_frmt}`);
}
get(content);
