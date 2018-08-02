
$(function(){

  var typeTime;
  var startTime1; //基準値１
  var startTime2; //基準値２
  var array1 = []; //タイムデータ１
  var array2 = []; //タイムデータ２
  var arrayTotal = []; //多次元配列
  var arrayResult = []; //結果計算
  var inputValue = []; //入力値
  var arrayDiff = [];


  $("#firstDataset").on("click",'input', '.form-control', function () {
    var click = $(this).data("click"); //data属性追加　
    if(!click) {　//input一つに対して一回実行
      var arrayTempo = []; //一時保存
      arrayTotal.push(arrayTempo);
      arrayTempo.length = 0;
      startTime1 = null;
      //打鍵間隔記録
      $(this).on('keydown',function(event) {
        if(startTime1 == null){
          typeTime = new Date().getTime(); //.getTime() …… 1970年からの経過ミリ秒数を取得する
          startTime1 = typeTime; //最初のkeypressミリ秒をstartTime変数に格納
          arrayTempo.push(0);
        }else if(arrayTempo.length == 0){
          typeTime = new Date().getTime();
          arrayTempo.push(typeTime - startTime1); //2回目のkeypressミリ秒からstartTimeを引く
          console.log(arrayTempo);
        }else {
          typeTime = new Date().getTime();
          arrayTempo.push(typeTime - (startTime1 + arrayTempo.reduce((a,x) => a+=x,0))); //3回目以降はkeypressミリ秒からstartTime＋keyとkey間ミリ秒を引く
          console.log(arrayTempo);
        }

        //Backspace押された場合の処理
        var keyCode = event.keyCode; //keycodeは keypressだと取得できない
        if(keyCode == 8){ //8は#Backspace
          $(this).val("");
          arrayTempo.length = 0;
          startTime1 = null;
          //$(this).html("<small class="form-text text-muted">Please enter from the beginning.</small>");
        }
      });
      $(this).data("click", true);
    }
  });


  //firstDataset検証(平均値計算)
  document.getElementById("insert").addEventListener('click',function(){
    array1.length = 0; //配列初期化
    var baseValue = $("#firstDataset input").eq(0).val(); //最初の要素el取得
    $("#firstDataset input").each(function() {
      var value = $(this).val();
      if(0 == value){
        alert("値がからです");
        return false;
      }else if(baseValue !== value){
        alert("値が一致していません")
        return false;
      }
    });
    //平均値計算
    for(var len = 0; len < arrayTotal[0].length; len++) {
    var total = 0;
      for(var i = 0; i < arrayTotal.length; i++) {
        total += arrayTotal[i][len];
      }
      array1.push(Math.round(total / arrayTotal.length));
      console.log(array1);
    }
  });

  document.getElementById("dataset").addEventListener('keydown',function(event){
    if(startTime2 == null){
      typeTime = new Date().getTime();
      startTime2 = typeTime;
    }else if(array2.length == 0){
      typeTime = new Date().getTime();
      array2.push(0);
      array2.push(typeTime - startTime2);
      console.log(array2);
    }else {
      typeTime = new Date().getTime();
      array2.push(typeTime - (startTime2 + array2.reduce((a,x) => a+=x,0)));
      console.log(array2);
    }

    //Backspace押された場合の処理
    var keyCode = event.keyCode;//keycodeはkeypressだと取得できない
    if(keyCode == 8){
      console.log("Backspace");
      $("#dataset").val("");
      array2.length = 0;
      startTime2 = null;
      inputValue.length = 0; //チャート生成用配列初期化
      var caution = document.getElementById("caution2");
      caution.innerHTML = "Please enter the tempo well to the end.";
    }else {
      inputValue.push(event.keyCode); //チャート生成用キーコード格納
    }
  });


  //差分計算
  function diffCalc() {
    arrayDiff.length = 0;
    arrayResult.length = 0;
    var diff;
    var result;
    for (var i = 0; i < array1.length; i++) {
      if (array1[i] > array2[i]) {
        diff = array1[i] - array2[i];
        result = 1000 - diff;
        arrayDiff.push(diff);
        arrayResult.push(result);
      }else {
        diff = array2[i] - array1[i]
        result = 1000 - diff;
        arrayDiff.push(diff);
        arrayResult.push(result);
      }
    }
    //差分出力
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

  function result() {
    var total = arrayResult.reduce((a,x) => a+=x,0) / array2.length;
    var result = Math.round(total / 10);
    document.getElementById('result').innerHTML = result + "%";
  }

  document.getElementById("compare").addEventListener('click',function(){
    if(!(document.getElementById('dataset1').value)){
      alert("Input content is null")
    }else if ($('#dataset1').val() != $('#dataset').val()) {
      alert("Input content is not match");
    }else{
      diffCalc();
      chart();
      result();
    }
  });

  //データセット追加処理
  {
    let i = 4;
    document.getElementById("addDataset").onclick = function(){
      var div_element = document.createElement("div");
      div_element.setAttribute('class', 'col-md-4 mb-3');
      div_element.innerHTML = '<label>dataset' + i + '</label><input type="text" name="password" id="dataset' + i + '"class="form-control test" placeholder="Enter something" required><small id="caution4" class="form-text text-muted"></small>';
      var parent_object = document.getElementById("addDatasetArea");
      parent_object.appendChild(div_element);
      i++;
    };
  }

});
