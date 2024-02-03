const axios = require('axios');

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const num = { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15 };
const month_Num = { 'January': 1, 'February': 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6, 'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12 };
  
module.exports = {
  
  /**
   * @param {string} content 문장(영어) 
   * @param {string} content_kr 문장(한글)
   * @returns 문장 내의 날짜 관련 단어를 검사하여 현재로부터의 상대적인 일수 차를 반환
   */
  Check_Date_gap(content, content_kr) {
    if (this.CheckIndex(content, "TOMORROW")) {
      if (this.CheckIndex(content, "THE DAY AFTER TOMORROW")) {
        return 2;
      } else {
        return 1;
      }
    } else if (this.CheckIndex(content, "YESTERDAY")) {
      if (this.CheckIndex(content, "THE DAY BEFORE YESTERDAY")) {
        return -2;
      } else {
        return -1;
      }
    } else if (this.CheckIndex(content, "NEXT WEEK")) {
      if (this.CheckIndex(content_kr, "다다음주")) {
        if (content_kr.indexOf('다다다음주') === -1) {
          return 14;
        } else {
          return 21;
        }
      } else {
        return 7;
      }
    } else if (this.CheckIndex(content, "IN A DAY")) {
      return 1;
    } else if (this.CheckIndex(content, 17)) {
      dok = String(content.match(/in+\s+\w+\s+days/g));
      dok = dok.replace(/in /gi, '');
      dok = dok.replace(/ days/gi, '');
      dok = dok.replace(/\./gi, '');
      if (num[dok] === undefined) {
        return Number(dok);
      } else {
        return num[dok];
      }
    } else if (this.CheckIndex(content, 17)) {
      dok = String(content.match(/in+\s+\w+\s+days./g));
      dok = dok.replace(/in /gi, '');
      dok = dok.replace(/ days/gi, '');
      dok = dok.replace(/\./gi, '');
      if (num[dok] === undefined) {
        return Number(dok);
      } else {
        return num[dok];
      }
    } else if (this.CheckIndex(content, "DAYS AGO")) {
      dok = String(content.match(/\w+\s+days/g));
      dok = dok.replace(/ days/gi, '');
      dok = dok.replace(/\./gi, '');
      if (num[dok] === undefined) {
        return -Number(dok);
      } else {
        return -Number(num[dok]);
      }
    } else if (this.CheckIndex(content, 18)) {
      dok = String(content.match(/\w+\s+days/g));
      dok = dok.replace(/ days/gi, '');
      dok = dok.replace(/ later/gi, '');
      dok = dok.replace(/\./gi, '');
      if (num[dok] === undefined) {
        return Number(dok);
      } else {
        return num[dok];
      }
    } else if (this.CheckIndex(content, "LAST WEEK")) {
      return -7;
    }
    else {
      return 0;
    }
  },

  /**
   * @param {string} content 확인할 문장
   * @param {string} dex
   * @returns {boolean} 문장 내 단어 존재 여부 판단
   */
  CheckIndex(content, dex) {
    if (dex == 17) {
      var pos = (content.toUpperCase()).indexOf("IN");
      if (pos === -1) { return false; }
      else {
        var ps = (content.toUpperCase()).indexOf("DAYS");
        if (ps === -1) { return false; }
        else { return true; }
      }
    } else if (dex == 18) {
      var pos = (content.toUpperCase()).indexOf("DAYS");
      if (pos === -1) { return false; }
      else {
        var ps = (content.toUpperCase()).indexOf("LATER");
        if (ps === -1) { return false; }
        else { return true; }
      }
    } else {
      var pos = (content.toUpperCase()).indexOf(dex);
      if (pos === -1) { return false; }
      else { return true; }
    }
  },

  /**
   * @param {string} sentence 문장
   * @param {boolean} isString 월이 문자의 형태로 존재하는지 확인, false일 경우 숫자 반환
   */
  Check_Date_gap_month(sentence, isString) {
    var dok = 0;
    var Mo = 0;
    for (i = 0; i < 12; i++) {
      if (sentence.indexOf(month[i]) !== -1) {
        dok = dok + 1;
        Mo = month[i];
      }
    }
    if (dok > 0) {
      if (isString) {
        return true;
      } else {
        return month_Num[Mo];
      }
    } else {
      return false;
    }
  },

  /**
   * @param {Number} gap 일수 차이
   * @returns 차이나는 일수 만큼 계산해서 요청한 날짜를 반환
   */
  CalculateDate(gap) {
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + gap);
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
  
    var lastDayOfMonth;
    if (month == 2) {
      // 2월인 경우 윤년 여부 체크
      lastDayOfMonth = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
    } else if (month == 4 || month == 6 || month == 9 || month == 11) {
      // 4, 6, 9, 11월인 경우 30일까지
      lastDayOfMonth = 30;
    } else {
      // 나머지 달은 31일까지
      lastDayOfMonth = 31;
    }
  
    // 날짜가 음수인 경우 이전 달로 이동
    while (day < 1) {
      month--;
      if (month < 1) {
        year--;
        month = 12;
      }
      lastDayOfMonth = (month == 2 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) ? 29 : 28;
      day += lastDayOfMonth;
    }
  
    // 날짜가 마지막 날짜를 초과하는 경우 다음 달로 이동
    while (day > lastDayOfMonth) {
      day -= lastDayOfMonth;
      month++;
      if (month > 12) {
        year++;
        month = 1;
      }
      lastDayOfMonth = (month == 2 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) ? 29 : 28;
    }
  
    var result_date = `${year} ${month} ${day}`;
    return result_date;
  },

  async PAPAGO_translate(value, target) {
    async function get(value, target) {
      let json = axios.get(encodeURI(`https://playentry.org/api/expansionBlock/papago/translate/n2mt?text=${value}&target=${target}`))
        .then(res => res.data)
      return json;
    }
    json = await get(value, target);
    TranslatedText = String(json.translatedText);
    if (TranslatedText === 'undefined') {
      return 10001;
    } else {
      return TranslatedText;
    }
  }
}