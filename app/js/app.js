"use strict";

$(function(){
  var typeTime;
  var upTime;
  var startTime1; //基準値１
  var startTime2; //基準値２
  var arrayTotalKey = []; //多次元配列 (入力間隔)
  var arrayTotalDU = []; //多次元配列 (ダウンからアップ)
  var arrayAveKey1 = []; //入力間隔１
  var arrayAveKey2 = []; //入力間隔２
  var arrayAveDU1 = []; //ダウンからアップ１
  var arrayAveDU2 = []; //ダウンからアップ２
  var arrayDiffKey = []; //入力間隔差分
  var arrayDiffDU = []; //ダウンからアップ差分
  var arrayKeycode = []; //入力値

  $("#firstDataset input").focus(function () {
    var click = $(this).data("click"); //data属性追加　
    if(!click) {　//input一つに対して一回実行
      var arrayKey = []; //入力間隔（一時保管）
      var arrayDownup = []; //ダウンからアップまで（一時保管）
      arrayTotalKey.push(arrayKey);
      arrayTotalDU.push(arrayDownup);
      arrayKey.length = 0;
      arrayDownup.length = 0;
      startTime1 = null;
      //入力間隔計測
      $(this).on('keydown',function(event) {
        if(event.keyCode == 8) {
          $(this).val("");
          arrayKey.length = 0;
          arrayDownup.length = 0;
          startTime1 = null;
          //$(this).html("<small class="form-text text-muted">Please enter from the beginning.</small>");
        }else if(event.keyCode == 9){
          //tabキーが押された場合の処理
        }else if(startTime1 == null){
          typeTime = new Date().getTime();
          startTime1 = typeTime; //最初のkeypressミリ秒をstartTime1変数に格納
          arrayKey.push(0);
        }else if(arrayKey.length == 0){
          typeTime = new Date().getTime();
          arrayKey.push(typeTime - startTime1); //2回目のkeypressミリ秒からstartTime1を引く
          console.log(arrayKey);
        }else {
          typeTime = new Date().getTime();
          arrayKey.push(typeTime - (startTime1 + arrayKey.reduce((a,x) => a+=x,0))); //3回目以降はkeypressミリ秒からstartTime1＋keyとkey間ミリ秒を引く
          console.log(arrayKey);
        }
      });
      //ダウンからアップ計測
      $(this).on('keyup',function(event) {
        if(event.keyCode == 8){
          arrayDownup.length = 0;
        }else if(event.keyCode == 9){
          //tabキーが押された場合の処理
        }else {
          upTime = new Date().getTime();
          var diff = upTime - typeTime;
          arrayDownup.push(diff);
          console.log(arrayDownup);
        }
    });

      $(this).data("click", true);
    }
  });

  //平均値計算、入力値の差異検証の関数
  function averageCalc(array, num, arrayResult){
    var arrayMaxmin = []; //最大値、最小値検証用配列
    for(var i = 0; i < array[0].length; i++) {　//入力文字数だけ回す
      var total = 0;
      arrayMaxmin.length = 0;
      for(var arr = 0; arr < array.length; arr++) {　//入力回数だけ回す（inputの数）
        arrayMaxmin.push(array[arr][i]);
        total += array[arr][i];　//array[配列番号][インデックス番号]
      }
      var minData = Math.min.apply(null, arrayMaxmin); //最小値精査
      var maxData = Math.max.apply(null, arrayMaxmin); //最大値精査
      var diff = maxData - minData;
      if(diff > num){
        alert("The tempo of the input value is disturbed. Please enter again.");
        throw new Error('end');
      }
      arrayResult.push(Math.round(total / array.length));
    }
  }
  //firstDataset検証(平均値計算)
  document.getElementById("insert").addEventListener('click',function(){
    try {
      arrayAveKey1.length = 0; //配列初期化
      var baseValue = $("#firstDataset input").eq(0).val(); //最初の要素value取得
      $("#firstDataset input").each(function(i) {
        var value = $(this).val();
        if(0 == value){
          alert("Input content is null");
          throw new Error('end');
        }else if(baseValue !== value){
          alert("Input content is not match");
          throw new Error('end');
        }
      });
      //平均値計算
      averageCalc(arrayTotalKey, 200, arrayAveKey1); //入力間隔に0.2秒以上の差異許容
      averageCalc(arrayTotalDU, 200, arrayAveDU1); //キーダウンからアップまでに0.2秒以上の差異許容

      $("#firstDataset input,#addDataset,#insert").prop("disabled", true);
      $("#secondDataset input,#compare").prop("disabled", false);
    } catch(e) {
      console.log(e.message);
    }

  });

  /*---------------------------------------------------------------------------------
  -----------------------------------------------------------------------------------*/
　
  var secondData = document.getElementById("secondData");
  //入力間隔計測
  secondData.addEventListener('keydown',function(event){
    if(event.keyCode == 8){
      $("#secondData").val("");
      arrayAveKey2.length = 0;
      startTime2 = null;
      arrayKeycode.length = 0; //チャート生成用配列初期化
      //var caution = document.getElementById("caution2");
      //caution.innerHTML = "Please enter the tempo well to the end.";
    }else if(event.keyCode == 9){
      //tabキーが押された場合の処理
    }else if(startTime2 == null){
      typeTime = new Date().getTime();
      startTime2 = typeTime;
    }else if(arrayAveKey2.length == 0){
      typeTime = new Date().getTime();
      arrayAveKey2.push(0);
      arrayAveKey2.push(typeTime - startTime2);
      console.log(arrayAveKey2);
    }else {
      typeTime = new Date().getTime();
      arrayAveKey2.push(typeTime - (startTime2 + arrayAveKey2.reduce((a,x) => a+=x,0)));
      console.log(arrayAveKey2);
    }
  });

  //ダウンからアップ計測
  secondData.addEventListener('keyup',function(event){
    if(event.keyCode == 8){
      arrayAveDU2.length = 0;
    }else if(event.keyCode == 9){
      //tabキーが押された場合の処理
    }else{
      upTime = new Date().getTime();
      var diff = upTime - typeTime;
      arrayAveDU2.push(diff);
      arrayKeycode.push(String.fromCharCode(event.keyCode)); //チャート生成用キーコード格納
    }
  });

  //差分計算関数
  function diffCalc(arrayDiff, arrayData1, arrayData2) {
    arrayDiff.length = 0;
    var diff;
    for (var i = 0; i < arrayData1.length; i++) {
      if (arrayData1[i] > arrayData2[i]) {
        diff = arrayData1[i] - arrayData2[i];
        arrayDiff.push(diff);
      }else {
        diff = arrayData2[i] - arrayData1[i]
        arrayDiff.push(diff);
      }
    }
  }

  //結果計算関数
  function resultCalc(arrayDiff) {
    var total = 0;
    for(var i = 0; i < arrayDiff.length; i++) {
      total += 100 - arrayDiff[i];  //基準値100
    }
    return Math.round(total / arrayAveKey2.length);
  }

  //グラフの生成関数
  function chart() {
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: arrayKeycode,
        datasets: [{
          label: 'First dataset Key',
          data: arrayAveKey1,
          backgroundColor: "rgba(0,123,256,0.4)"
        }, {
          label: 'Second data Key',
          data: arrayAveKey2,
          backgroundColor: "rgba(0,123,256,0.4)"
        }, {
          label: 'First dataset Down Up',
          data: arrayAveDU1,
          backgroundColor: "rgba(145,219,185,0.4)"
        }, {
          label: 'Second data Down Up',
          data: arrayAveDU2,
          backgroundColor: "rgba(145,219,185,0.4)"
        }
        // }, {
        //   label: 'Key Diff',
        //   data: arrayDiffKey,
        //   backgroundColor: "rgba(204,204,204,0.4)"
        // }, {
        //   label: 'Down Up Diff',
        //   data: arrayDiffDU,
        //   backgroundColor: "rgba(204,204,204,0.4)"
        // }
        ]
      }
    });
  }

  //最終処理
  document.getElementById("compare").addEventListener('click',function(){
    if(!(document.getElementById('firstData').value)){
      alert("Input content is null")
    }else if ($('#firstData').val() != $('#secondData').val()) {
      alert("Input content is not match");
    }else{
      diffCalc(arrayDiffKey, arrayAveKey1, arrayAveKey2);
      diffCalc(arrayDiffDU, arrayAveDU1, arrayAveDU2);
      var resultKey = resultCalc(arrayDiffKey);
      var resultDU = resultCalc(arrayDiffDU);
      var result = (resultKey + resultDU) / 2;
      document.getElementById('result').innerHTML = result + "%";
      chart();
    }
  });

  //データセット追加処理
  {
    let i = 4;
    document.getElementById("addDataset").onclick = function(){
      var div_element = document.createElement("div");
      div_element.setAttribute('class', 'col-md-4 mb-3');
      div_element.innerHTML = '<label>data' + i + '</label><input type="text" name="password" id="dataset' + i + '"class="form-control test" placeholder="Enter something" required><small id="caution4" class="form-text text-muted"></small>';
      var parent_object = document.getElementById("addDatasetArea");
      parent_object.appendChild(div_element);
      i++;
    };
  }

});
