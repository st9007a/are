// jQuery(document).ready(function()
// {
    
//開啟視訊串流------------------------------------------


//看瀏覽器支不支援
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia|| navigator.msGetUserMedia;

var video = document.querySelector('#camera');


//若成功則執行
function successCallback(stream)
{
    window.stream = stream; // stream available to console

    //Chrome，Opera用
    if (window.URL)
        video.src = window.URL.createObjectURL(stream);
    //Firefox用
    else
        video.src = stream;
}


//若失敗則執行
function errorCallback(error)
{
    console.log("無法取得視訊串流 : ", error);
}


var exArray = []; //用來存裝置串流來源  
//取得裝置串流來源 
MediaStreamTrack.getSources(
    function (sourceInfos)
    {  
        for(var i = 0; i != sourceInfos.length; ++i)
        {  
            var sourceInfo = sourceInfos[i];  
            if (sourceInfo.kind === 'video') //會遍歷audio,video，所以要判斷 
                exArray.push(sourceInfo.id);  
        }
        //取得視訊串流
        navigator.getUserMedia(
            {
             'video':
             {  
                //0為前置，1為後置
                'optional': [ {'sourceId': exArray[1]} ]  
             }
            },
            successCallback, errorCallback);        
    });



//拍照-------------------------------------

function snapshot(canvasID)
{   
    var canvas = document.querySelector('#'+canvasID);
    var ctx = canvas.getContext('2d');
    var resolutionX=450;
    var resolutionY=800;

    if (stream)
    {
        // 將video的影像畫到一個canvas裡
        ctx.drawImage(video,0,0,resolutionX,resolutionY);

        //存成影像檔
        currentSnapshot=canvas.toDataURL('image/png');
    }
}

    
//傳送照片
function sendSnapshot()
{
    snapshot('test'); //拍照

    //傳送
    $.ajax(
    {
        type : 'POST',
        data : currentSnapshot,
        url : '/snapshot',
        success : function(currentSnapshot)
        {
            console.log("傳送照片成功～");;
            console.log(currentSnapshot);
        },
        beforeSend : function()
        {
            console.log("Ready to 傳送照片～");;
        },
        error : function(err)
        {
            console.log("傳送照片失敗!!!");
            console.log(err);
        }
    }); 
}



//陀螺儀----------------------------------------

if(window.DeviceOrientationEvent)
{
    //監聽裝置方向
    window.addEventListener('deviceorientation', function(event)
    {
        beta = event.beta;
        gamma = event.gamma;

        //iOS用
        if(event.webkitCompassHeading)
        {
            alpha = event.webkitCompassHeading;
        }
        //其他
        else
        {
            alpha = event.alpha;

            //非Chrome
            if(!window.chrome)
            {
                alpha = alpha-270;
            }
        }
    },false);
}
else
{
    console.log('不支援陀螺儀喔～～');
}


//傳送陀螺儀資訊
function sendDeviceOrientation()
{
    var data=
        {
            alpha:alpha,
            beta:beta,
            gamma:gamma
        }

    $.ajax(
    {
        type : 'POST',
        data : data,
        url : '/deviceorientation',
        success : function(data)
        {
            console.log("傳送陀螺儀資訊成功～");;
            console.log(data);
        },
        beforeSend : function()
        {
            console.log("Ready to 傳送陀螺儀資訊～");;
        },
        error : function(err)
        {
            console.log("傳送陀螺儀資訊失敗!!!");
            console.log(err);
        }
    }); 
}


//位置--------------------------------------
/*
//定位
if(navigator.geolocation) //如果支援
{
    //定位物件
    var locate=function()
    {
        var option=
            {
                enableAcuracy:true,
                maximumAge:0.5
            };
        navigator.geolocation.getCurrentPosition(locateSucess,locateErr,option);
    };

    //重複執行
    //setInterval(locate,1500); 
}
else
{
    console.log("你的瀏覽器不支援喔～～");
}


//追蹤
if(navigator.geolocation) //如果支援
{
    //追蹤物件
    var watch=function()
    {
        var option=
            {
                enableAcuracy:true,
                maximumAge:1000,
                timeout:60000
            };
        navigator.geolocation.watchPosition(locateSucess,locateErr,option);
    };

    var stopWatch=navigator.geolocation.clearWatch(watch); //停止追蹤

    //開始追蹤
//    setTimeout(watch,1500);
}
else
{
    console.log("你的瀏覽器不支援喔～～");
}



//定位成功要幹嘛
function locateSucess(position)
{
    positionData=position; //全域用定位資料
}


//定位失敗要幹嘛
function locateErr(error)
{
    //失敗種類
    var errorTypes=
    {
        0:"不明原因錯誤",
        1:"使用者拒絕提供位置資訊",
        2:"無法取得位置資訊",
        3:"位置查詢逾時"
    };

    console.log("定位失敗: "+errorTypes[error]);
}
*/

//傳送位置資訊
function sendPosition()
{
    var data=
        {
            latitude:positionData.coords.latitude,
            longitude:positionData.coords.longitude,
            accuracy:positionData.coords.accuracy
        }

    $.ajax(
    {
        type : 'POST',
        data : data,
        url : '/position',
        success : function(data)
        {
            console.log("傳送位置資訊成功～");;
            console.log(data);
        },
        beforeSend : function()
        {
            console.log("Ready to 傳送位置資訊～");;
        },
        error : function(err)
        {
            console.log("傳送位置資訊失敗!!");
            console.log(err);
        }
    }); 
}
    
    
    
//測試區==============================================
    
$("#hintBtn").click(function()
{
    $('.testClass').toggle();

});

//顯示測試按鈕
$("<button>",
{
    "class": "testClass",
    "id": "ShowTestButton",
    "style":"position:absolute; left:0;top:90vh; z-index:3;",
    "text": "Test Button"
}).appendTo("body");
$("#ShowTestButton").click(function(){ShowTestButton();}); 
function ShowTestButton()
{
    //測試GPS
    $("<button>",
    {
        "class": "testClass",
        "id": "testGPS",
        "style":"position:absolute; left:0;top:80vh; z-index:3;",
        "text": "GPS"
    }).appendTo("body");
    $("#testGPS").click(function(){testGPS();}); 
    function testGPS()
    {
        $("<p>",
        {
            "class": "testClass",
            "id": "demo",
            "style":"position:absolute; left:20vw;top:0; z-index:3;"
        }).appendTo("body");
        
        setInterval(function()
        {
			console.log('main');
            document.getElementById("demo").innerHTML = 
                          "緯度: " + positionData.coords.latitude+
                      "<br>經度: " + positionData.coords.longitude+ 
                      "<br>方位: " + alpha+
                   "<br>移動方向: " + positionData.coords.heading+
                   "<br>移動速度: " + positionData.coords.speed+ 
                   "<br>位置誤差: " + positionData.coords.accuracy+ 
                      "<br>高度: " + positionData.coords.altitude;
        },500);

        sendPosition();
    }

    //測試陀螺儀
    $("<button>",
    {
        "class": "testClass",
        "id": "testTLE",
        "style":"position:absolute; left:20vw;top:80vh; z-index:3;",
        "text": "TLE"
    }).appendTo("body");
    $("#testTLE").click(function(){testTLE();}); 
    function testTLE()
    {
        $("<p>",
        {
            "class": "testClass",
            "id": "alpha",
            "style":"position:absolute; left:0;top:10vh; z-index:3;",
        }).appendTo("body");
        $("<p>",
        {
            "class": "testClass",
            "id": "beta",
            "style":"position:absolute; left:0;top:20vh; z-index:3;",
        }).appendTo("body");
        $("<p>",
        {
            "class": "testClass",
            "id": "gamma",
            "style":"position:absolute; left:0;top:30vh; z-index:3;",
        }).appendTo("body");
        
        window.addEventListener('deviceorientation', function(event)
        {
            document.getElementById('alpha').innerHTML = Math.round(alpha);
            document.getElementById('beta').innerHTML = Math.round(beta);
            document.getElementById('gamma').innerHTML = Math.round(gamma);
        },false);

        sendDeviceOrientation();
    }
    
    
//    //測試傳照片
//    $("<button>",
//    {
//        "class": "testClass",
//        "id": "testSendSnapshot",
//        "style":"position:absolute; left:40vw;top:80vh; z-index:3;",
//        "text": "傳照片～"
//    }).appendTo("body");
//    $("#testSendSnapshot").click(function(){sendSnapshot();});

}


// }); //end of jQuery





