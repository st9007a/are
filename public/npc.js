jQuery(document).ready(function()
{
	//追蹤
	if(navigator.geolocation) //如果支援
	{
		console.log('out');
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
		setTimeout(watch,500);
	}
	else
	{
		console.log("你的瀏覽器不支援喔～～");
	}

	
	//定位成功要幹嘛
	function locateSucess(position)
	{
		positionData=position; //全域用定位資料
	   console.log('in');
		if(positionData.coords.latitude<25.9941200 && positionData.coords.latitude>20.9940800 && positionData.coords.longitude<129.1983200 && positionData.coords.longitude>12.1982600 && alpha<0 && alpha>180)
		{
			
			$(".npc").hide();
			$("#n1").show();
		}
		else if(positionData.coords.latitude<22.9940300 && positionData.coords.latitude>22.9939400 && positionData.coords.longitude<120.1983200 && positionData.coords.longitude>120.1982900 && alpha<300 && alpha>260)
		{
			$(".npc").hide();
			$("#n2").show();
		}
		else if(positionData.coords.latitude<22.9939800 && positionData.coords.latitude>22.9939300 && positionData.coords.longitude<120.1984700 && positionData.coords.longitude>120.1984200 && alpha<170 && alpha>120)
		{
			$(".npc").hide();
			$("#n3").show();
		}
		else if(positionData.coords.latitude<22.9939700 && positionData.coords.latitude>22.9939400 && positionData.coords.longitude<120.1984600 && positionData.coords.longitude>120.1984200 && alpha<225 && alpha>180)
		{
			$(".npc").hide();
			$("#n4").show();
		}
		else
		{
			$(".npc").hide();
		}
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

		alert("定位失敗: "+errorTypes[error]);
	}
});


// if(positionData.coords.latitude<22.9941200 && positionData.coords.latitude>22.9940800 && positionData.coords.longitude<120.1983200 && positionData.coords.longitude>120.1982600 && alpha<160 && alpha>120)
            // {
                
                // $(".npc").hide();
                // $("#n1").show();
            // }
            // else if(positionData.coords.latitude<22.9940300 && positionData.coords.latitude>22.9939400 && positionData.coords.longitude<120.1983200 && positionData.coords.longitude>120.1982900 && alpha<300 && alpha>260)
            // {
                // $(".npc").hide();
                // $("#n2").show();
            // }
            // else if(positionData.coords.latitude<22.9939800 && positionData.coords.latitude>22.9939300 && positionData.coords.longitude<120.1984700 && positionData.coords.longitude>120.1984200 && alpha<170 && alpha>120)
            // {
                // $(".npc").hide();
                // $("#n3").show();
            // }
            // else if(positionData.coords.latitude<22.9939700 && positionData.coords.latitude>22.9939400 && positionData.coords.longitude<120.1984600 && positionData.coords.longitude>120.1984200 && alpha<225 && alpha>180)
            // {
                // $(".npc").hide();
                // $("#n4").show();
            // }
