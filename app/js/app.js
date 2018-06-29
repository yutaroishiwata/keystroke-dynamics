$(function(){

  var typeTime;
  var diff; //値の差
  var startTime1; //基準値１
  var startTime2; //基準値２
  var array1 = []; //タイムデータ１
  var array2 = []; //タイムデータ２
  var inputValue = []; //入力値
  var arrayDiff = [];

  //.getTime() …… 1970年からの経過ミリ秒数を取得する
  document.getElementById("dataset1").addEventListener('keydown',function(event){
    if(startTime1 == null){
      typeTime = new Date().getTime();
      startTime1 = typeTime; //最初のkeypressミリ秒をstartTime変数に格納
    }else if(array1.length == 0){
      typeTime = new Date().getTime();
      array1.push(0);
      array1.push(typeTime - startTime1); //2回目のkeypressミリ秒からstartTimeを引く
      console.log(array1);
    }else {
      typeTime = new Date().getTime();
      array1.push(typeTime - (startTime1 + array1.reduce((a,x) => a+=x,0))); //3回目以降はkeypressミリ秒からstartTime＋keyとkey間ミリ秒を引く
      console.log(array1);
    }
    
    var keyCode = event.keyCode;//keycodeはkeypressだと取得できない
    if(keyCode == 8){
      console.log("Backspace");
      $("#dataset1").val("");
      array1.length = 0;
      inputValue.length = 0;
      startTime1 = null;
      var caution = document.getElementById("caution1");
      caution.innerHTML = "Please enter the tempo well to the end.";
    }else {
      inputValue.push(event.keyCode);//チャート生成用キーコード格納
    }
  });

  document.getElementById("dataset2").addEventListener('keydown',function(event){
    if(startTime2 == null){
      typeTime = new Date().getTime(); //時刻値 (ミリ秒) を取得して変数に格納（基準値）
      startTime2 = typeTime;
    }else if(array2.length == 0){
      typeTime = new Date().getTime(); //時刻値 (ミリ秒) を取得して配列に格納
      array2.push(0);
      array2.push(typeTime - startTime2); //基準値から経過時間を引く
      console.log(array2);
    }else {
      typeTime = new Date().getTime(); //時刻値 (ミリ秒) を取得して配列に格納
      array2.push(typeTime - (startTime2 + array2.reduce((a,x) => a+=x,0))); //基準値から経過時間を引く
      console.log(array2);
    }
    var keyCode = event.keyCode;//keycodeはkeypressだと取得できない
    if(keyCode == 8){
      console.log("Backspace");
      $("#dataset2").val("");
      array2.length = 0;
      startTime2 = null;
      var caution = document.getElementById("caution2");
      caution.innerHTML = "Please enter the tempo well to the end.";
    }
  });

  // $(document).keydown(function(event){
  //   // クリックされたキーコードを取得する
  //   var keyCode = event.keyCode;
  //   if(keyCode == 8){
  //       console.log("Backspace");
  //       $("#dataset1").val("");
  //       array1.length = 0;
  //       startTime1 = null;
  //       var caution = document.getElementById("caution");
  //       caution.innerHTML = "Please enter the tempo well to the end.";
  //   }
  // });

  //差分計算
  function diffCalc() {
    arrayDiff.length = 0;
    for (var i = 0; i < array1.length; i++) {
      if (array1[i] > array2[i]) {
        diff = array1[i] - array2[i]
        arrayDiff.push(diff);
      }else {
        diff = array2[i] - array1[i]
        arrayDiff.push(diff);
      }
    }
  }

  //差分出力
  function result(){
    var myp = document.getElementById("diff");
    myp.innerHTML = arrayDiff;
  }

  //グラフの生成
  function chart() {
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: inputValue,
        datasets: [{
          label: 'First dataset',
          data: array1,
          backgroundColor: "rgba(204,204,204,0.4)"
        }, {
          label: 'Second dataset',
          data: array2,
          backgroundColor: "rgba(0,123,256,0.4)"
        }, {
          label: 'Diff',
          data: arrayDiff,
          backgroundColor: "rgba(255,255,255,0.4)"
        }]
      }
    });
  }

  document.getElementById("insert").addEventListener('click',function(){
    if(!(document.getElementById('dataset1').value)){
      alert("Input content is null")
    }else if ($('#dataset1').val() != $('#dataset2').val()) {
      alert("Input content is not match");
    }else{
      //alert("Input content is match");
      diffCalc();
      console.log(arrayDiff);
      result();
      chart();
    }
  });



  // document.getElementById("dataset2").addEventListener('keydown',function(){
  //   array.pop();
  // });
});
