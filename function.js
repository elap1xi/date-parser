const fs = require('node:fs');
var posTagger = require('wink-pos-tagger');
var tagger = posTagger();
var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var num = { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15 };
var month_Num = { 'January': 1, 'February': 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6, 'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12 };
var mn_dy = { '1': 31, '2': 28, '3': 31, '4': 30, '5': 31, '6': 30, '7': 31, '8': 31, '9': 30, '10': 31, '11': 30, '12': 31 };


module.exports = {
  PunctuationMark_RMV(content) {
    content = content.replace(/[^a-zA-Z0-9 ]/g, '');
    //console.log(`PCTMRK : ${content}`); 
    return content;
  },
  CHG_tton(mn) {
    return month[mn - 1];
  },
  CHG_tton_d(dy) {
    if (dy == 1) {
      return `1st`;
    } else if (dy == 2) {
      return `2nd`;
    } else if (dy == 3) {
      return `3rd`;
    } else {
      return `${dy}th`;
    }
  },
  // POS Function
  POS_Test_KR(content, dex) {
    if (dex == 10) {
      var pos = content.indexOf('급식');
      if (pos === -1) { return false; }
      else { return true; }
    } else if (dex == 11) {
      var pos = (content.toUpperCase()).indexOf("TOMORROW");
      if (pos === -1) { return false; }
      else { return true; }
    } else if (dex == 12) {
      var pos = (content.toUpperCase()).indexOf("YESTERDAY");
      if (pos === -1) { return false; }
      else { return true; }
    } else if (dex == 13) {
      var pos = content.indexOf("다다음주");
      if (pos === -1) { return false; }
      else { return true; }
    } else if (dex == 14) {
      var pos = (content.toUpperCase()).indexOf("THE DAY AFTER TOMORROW");
      if (pos === -1) { return false; }
      else { return true; }
    } else if (dex == 15) {
      var pos = (content.toUpperCase()).indexOf("THE DAY BEFORE YESTERDAY");
      if (pos === -1) { return false; }
      else { return true; }
    } else if (dex == 16) {
      var pos = (content.toUpperCase()).indexOf("NEXT WEEK");
      if (pos === -1) { return false; }
      else { return true; }
    } else if (dex == 17) {
      var pos = (content.toUpperCase()).indexOf("IN");
      if (pos === -1) { return false; }
      else {
        var ps = (content.toUpperCase()).indexOf("DAYS");
        if (ps === -1) { return false; }
        else { return true; }
      }
    } else if (dex == 18) {
      var pos = (content.toUpperCase()).indexOf("DAYS AGO");
      if (pos === -1) { return false; }
      else { return true; }
    } else if (dex == 19) {
      var pos = (content.toUpperCase()).indexOf("LAST WEEK");
      if (pos === -1) { return false; }
      else { return true; }
    } else if (dex == 20) {
      var pos = (content.toUpperCase()).indexOf("IN A DAY");
      if (pos === -1) { return false; }
      else { return true; }
    } else if (dex == 21) {
      var pos = (content.toUpperCase()).indexOf("/");
      if (pos === -1) { return false; }
      else { return true; }
    }
  },
  POS_check_Lunch_Date(content, content_kr) {
    if (this.POS_Test_KR(content, 11)) {
      if (this.POS_Test_KR(content, 14)) {
        return 2;
      } else {
        return 1;
      }
    } else if (this.POS_Test_KR(content, 12)) {
      if (this.POS_Test_KR(content, 15)) {
        return -2;
      } else {
        return -1;
      }
    } else if (this.POS_Test_KR(content, 16)) {
      if (this.POS_Test_KR(content_kr, 13)) {
        if (content_kr.indexOf('다다다음주') === -1) {
          return 14;
        } else {
          return 21;
        }
      } else {
        return 7;
      }
    } else if (this.POS_Test_KR(content, 20)) {
      return 1;
    } else if (this.POS_Test_KR(content, 17)) {
      var regexpCoordinates = /in+\s+\w+\s+days/g;
      dok = String(content.match(regexpCoordinates));
      dok = dok.replace(/in /gi, '');
      dok = dok.replace(/ days/gi, '');
      dok = dok.replace(/\./gi, '');
      // console.log(dok);
      if (num[dok] === undefined) {
        // console.log(`NYM_dl : `+num[dok]);
        return Number(dok);
      } else {
        return num[dok];
      }
    } else if (this.POS_Test_KR(content, 17)) {
      // console.log(content);
      var regexpCoordinates = /in+\s+\w+\s+days./g;
      dok = String(content.match(regexpCoordinates));
      dok = dok.replace(/in /gi, '');
      dok = dok.replace(/ days/gi, '');
      dok = dok.replace(/\./gi, '');
      // console.log(dok);
      if (num[dok] === undefined) {
        // console.log(`NYM_dl : `+num[dok]);
        return Number(dok);
      } else {
        return num[dok];
      }
    }
    else if (this.POS_Test_KR(content, 18)) {
      var regexpCoordinates = /\w+\s+days/g;
      dok = String(content.match(regexpCoordinates));
      dok = dok.replace(/ days/gi, '');
      dok = dok.replace(/\./gi, '');
      //console.log(dok);
      if (num[dok] === undefined) {
        return -Number(dok);
      } else {
        return -Number(num[dok]);
      }
    } else if (this.POS_Test_KR(content, 19)) {
      return -7;
    }
    else {
      return 0;
    }
  },
  POS_check_Lunch_Daterl(sentence, srt) {
    var dok = 0;
    var Mo;
    for (i = 0; i < 12; i++) {
      if (sentence.indexOf(month[i]) !== -1) {
        dok = dok + 1;
        Mo = month[i];
      }
    }
    if (dok > 0) {
      if (srt == 0) {
        return "RST";
      } else if (srt == 1) {
        return month_Num[Mo];
      }
    } else {
      return "NOT_DATERL";
    }
  },
  async POS_Test(content) {
    var contentArr = content.split(" ");
    var lengARR = contentArr.length;
    var KOP_l = 0;
    //console.log(content);
    //console.log(lengARR);

    if (this.POS_Test_KR(content, 10)) {
      //console.log("adw TRue")
      KOP_l = KOP_l + 1;
    }

    //console.log(`KOP : `,KOP_l);
    if (KOP_l >= 1) {
      return 10;
    } else {
      return 1;
    }

  },
  chk_pos$val(pova_value, dex) {
    function check(value, dex) {
      if (dex == 1) {
        chk_pnv = ['POS', '.', 'VBZ', ','];
      } else if (dex == 2) {
        chk_pnv = ['VB', 'POS', '.', 'VBZ', ',', 'WP', 'VBN', 'MD', 'CD', 'VBD', 'VBG', 'VBP', 'JJ'];
      } else if (dex == 3) {
        chk_pnv = ['Meal', 'meal', 'Meals', 'meals', 'lunch', 'Lunch', 'First', 'first', 'Second', 'second', 'Third', 'third', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      }
      return chk_pnv.indexOf(value);
    }
    if (check(pova_value, dex) == -1) {
      return true;
    } else {
      return false;
    }
  },
  // Naver Translation.
  async PAPAGO_translate(value, target) {
    async function trpago(value, target) {
      let json = fetch(`https://playentry.org/api/expansionBlock/papago/translate/n2mt?text=${value}&target=${target}`)
        .then(res => res.json())
        .catch(error => { console.log(error); });
      return json;
    }
    json = await trpago(value, target);
    TranslatedText = String(json.translatedText);
    // console.log("NTR_Function : ",TranslatedText);
    if (TranslatedText === 'undefined') {
      return 10001;
    } else {
      return TranslatedText;
    }
  },
  CHG_Date(RTNed_value) {
    var aa = new Date();
    var dy = aa.getDate() + RTNed_value;
    var mn = aa.getMonth() + 1;
    var yr = aa.getFullYear();
    if (mn == 1 || mn == 3 || mn == 5 || mn == 7 || mn == 8 || mn == 10 || mn == 12) {
      if (dy > 31) {
        mn = mn + 1;
        dy = dy - 31;
      }
    } else if (mn == 2) {
      if (dy > 28) {
        mn = mn + 1;
        dy = dy - 28
      }
    } else {
      if (dy > 30) {
        mn = mn + 1;
        dy = dy - 30;
      }
    }
    if (dy == 0) {
      if (mn == 5 || mn == 7 || mn == 10 || mn == 12) {
        mn = mn - 1;
        dy = 30;
      } else if (mn == 3) {
        mn = mn - 1;
        dy = 28;
      } else if (mn == 1) {
        yr = yr - 1;
        mn = 12;
        dy = 31;
      } else {
        mn = mn - 1;
        dy = 31;
      }
    } else if (dy == -1) {
      if (mn == 5 || mn == 7 || mn == 10 || mn == 12) {
        mn = mn - 1;
        dy = 29;
      } else if (mn == 3) {
        mn = mn - 1;
        dy = 27;
      } else if (mn == 1) {
        yr = yr - 1;
        mn = 12;
        dy = 30;
      } else {
        mn = mn - 1;
        dy = 30;
      }
    } else if (dy == -2) {
      if (mn == 5 || mn == 7 || mn == 10 || mn == 12) {
        mn = mn - 1;
        dy = 28;
      } else if (mn == 3) {
        mn = mn - 1;
        dy = 26;
      } else if (mn == 1) {
        yr = yr - 1;
        mn = 12;
        dy = 29;
      } else {
        mn = mn - 1;
        dy = 29;
      }
    }
    datefor = `${yr} ${mn} ${dy}`;
    //console.log(`yr : ${yr}, mn : ${mn}, dy : ${dy}`);
    return datefor;
  }
}
