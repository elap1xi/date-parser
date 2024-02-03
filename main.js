const posTagger = require('wink-pos-tagger');
const date = new Date();
const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const sub = require('./sub.js');

async function parse(content){
    // MM/DD, 슬래시 꼴의 날짜를 MM (DD)th의 형태로 번형
    const matchSlash_form = content.match(/(\d+)\/(\d+)/g);
    if (matchSlash_form) {
        let text_arr = (matchSlash_form[0]).split("/");
        let monthSlash_form = month[text_arr[0]];
        let daySlash_form = (text_arr[1])==1 ? "1st" : (text_arr[1])==2 ? "2nd" : (text_arr[1])==3 ? "3rd" : `${text_arr[1]}th`;
        let replacementString = `${monthSlash_form} ${daySlash_form}`;
        content = content.replace(/(\d+)\/(\d+)/g, replacementString);
    }

    var Translated_CONTENT = String(await sub.PAPAGO_translate(content, 'en'));
    Translated_CONTENT = Translated_CONTENT.replace(/Julie/g,"July");	// 7월이 Julie 라고 번역되는 경우 수정
    Tag_Arr = posTagger().tagSentence(Translated_CONTENT);
    let TagLeng = Tag_Arr.length;
    var Day_ARR = [];
    for (i = 0; i < TagLeng; i++) {
        val = Tag_Arr[i].value;
        pos = Tag_Arr[i].pos;
        if (pos == 'JJ') {	// 품사가 날짜를 나타내면 숫자만 추출해서 배열에 추가
            dy = val.replace(/st/gi, ''); dy = dy.replace(/nd/gi, ''); dy = dy.replace(/rd/gi, ''); dy = dy.replace(/th/gi, '');
            Day_ARR.push(dy);
        }
    }

    // 상대적인 일수 차이 계산
    Detected_day = String(Day_ARR.join(' '));
    var Date_calc = await sub.Check_Date_gap(Translated_CONTENT, content);
    if (Date_calc == 0) {
        if (sub.Check_Date_gap_month(Translated_CONTENT, true)) {
            var Year = String(date.getFullYear());
            var Detected_month = String(sub.Check_Date_gap_month(Translated_CONTENT, false));
            var Daterl = `${Year} ${Detected_month} ${Detected_day}`;
        } else {
            var Year = String(date.getFullYear());
            var Detected_month = String(date.getMonth() + 1);
            var Detected_day = String(date.getDate());
            var Daterl = `${Year} ${Detected_month} ${Detected_day}`;
        }
    } else {
        var Daterl = await sub.CalculateDate(Date_calc);
        var Year = (Daterl.split(" "))[0];
        var Detected_month = (Daterl.split(" "))[1];
        var Detected_day = (Daterl.split(" "))[2];
    }

    var Date_frmt = `${Year}/${Detected_month}/${Detected_day}`;
    console.log(Date_frmt);
    return Date_frmt;
}

parse('야야 근데 우리 어제 뭐했더라?');