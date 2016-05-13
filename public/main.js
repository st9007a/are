jQuery(document).ready(function()
{
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
        
        if (stream)
        {
            ctx.drawImage(video, -100, -100);
            console.log(ctx);
            //存成image用 - Chrome：“image/webp”，其他：“image/png”
            //document.querySelector('img').src = canvas.toDataURL('image/webp');
        }
    }

    video.addEventListener('click', function(){ snapshot('test') }, false);
    
    
    
    //陀螺儀----------------------------------------
    
    if(window.DeviceOrientationEvent)
    {
        //監聽裝置方向
        window.addEventListener('deviceorientation', function(event)
        {
            var a = document.getElementById('alpha'),
                b = document.getElementById('beta'),
                g = document.getElementById('gamma'),
                beta = event.beta,
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

            a.innerHTML = Math.round(alpha);
            b.innerHTML = Math.round(beta);
            g.innerHTML = Math.round(gamma);
            
        }, false);
    }
    else
    {
        document.querySelector('#alpha').innerHTML = '你的瀏覽器不支援喔～～';
    }
    
    
    
}); //end of jQuery(document).ready



//位置--------------------------------------


var x = document.getElementById("demo");


//定位
function getLocation()
{
    //如果支援
    if (navigator.geolocation)
    {
        //定位物件
        var locate=function()
        {
            var option=
                {
                    enableAcuracy:true,
                    maximumAge:0.5
                };
            navigator.geolocation.getCurrentPosition(showPosition,showPositionErr,option);
        };
        
        //重複執行
        setInterval(locate,1500);
    }
    else
    {
        x.innerHTML = "你的瀏覽器不支援喔～～";
    }
}


//定位成功要幹嘛
function showPosition(position)
{
    x.innerHTML = "緯度: " + position.coords.latitude+
              "<br>經度: " + position.coords.longitude+ 
              "<br>方位: " + alpha+
           "<br>移動方向: " + position.coords.heading+
           "<br>移動速度: " + position.coords.speed+ 
           "<br>位置誤差: " + position.coords.accuracy+ 
              "<br>高度: " + position.coords.altitude; 
    console.log("成功！！");
}


//定位失敗要幹嘛
function showPositionErr(error)
{
    console.log("定位失敗啊啊啊啊啊～～～");
}



//追蹤
function watch()
{
    //如果支援
    if (navigator.geolocation)
    {
        //追蹤物件
        var watchID=function()
        {
            var option=
                {
                    enableAcuracy:true,
                    maximumAge:1000,
                    timeout:60000
                };
            navigator.geolocation.watchPosition(watchPosition,watchPositionErr,option);
        };
        
        var stopWatch=geolocation.clearWatch(watchID); //停止追蹤
    }
    else
    {
        x.innerHTML = "你的瀏覽器不支援喔～～";
    }
}


//追蹤成功要幹嘛
function watchPosition(position)
{
    
}


//追蹤失敗要幹嘛
function watchPositionErr(error)
{
    //失敗種類
    var errorTypes=
    {
        0:"不明原因錯誤",
        1:"使用者拒絕提供位置資訊",
        2:"無法取得位置資訊",
        3:"位置查詢逾時"
    };
    
    console.log("追蹤失敗啊啊啊啊啊～～～");
}












