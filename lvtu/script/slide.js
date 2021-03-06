function sliding() {
	if(token!=null && token!=''){
   		 api.openSlidPane({type: 'left'});
	}
	else{
			api.openWin({
		        name: 'login',
			    url: 'login.html',
			    opaque: true,
			    vScrollBarEnabled: false
		    });
	}
   
    
}

var Htmls  = "";
var localuid='';
var token='';
var timeout='';
apiready = function(){
	localuid = $api.getStorage('localuid');     
	token = $api.getStorage('token');     
	

	var header = $api.dom('.header');
	$api.fixIos7Bar(header);
    $api.fixStatusBar(header);
    
     api.addEventListener({
    	name: 'closemap'
	}, function(ret, err) {
	    if(ret.value.key1=='fromrunstyle' || ret.value.key1=='fromrun-stopstyle' || ret.value.key1=='fromrun-spec' || ret.value.key1=='fromjilucontent' || ret.value.key1=='yj'){
	    	//alert();
	    	var amap = api.require('aMap');   
			amap.close(); 
	    }
	});
    
     api.sendEvent({
	    name: 'closemap',
	    extra: {
	        key1: 'fromslide'
	    }
	});
	
	api.addEventListener({
	    name:'swipedown'
	}, function(ret, err){  
		
	     if(Htmls != "")
            {
	   			alert('发现');
	   			Htmls="";
            } 
	   
	   
	});
	
	
    api.addEventListener({
        name: 'keyback'
    }, function(ret, err){
        api.closeWidget();
    });   
   
    
     api.addEventListener({
        name:'viewappear'
    },function(ret,err){
        //operation	 
        
	   
		localuid = $api.getStorage('localuid');     
		token = $api.getStorage('token');     
		 timeout=$api.getStorage('timeout');
		var curtime = new Date();
		if((timeout*1000-curtime)<0){
			api.openWin({
		        name: 'login',
		        url: 'login.html',
		        opaque: true,
		        vScrollBarEnabled: false
		    });
			 
		}
    
	    if(token!=null && token!=''){
	   		findcurpianduan(token,localuid);
	    }
	    init();	
    });
    
  
};


/*
 * 如果有未结束旅行，询问用户是否继续
 */  
function findcurpianduan(token,localuid){
	var db = api.require('db');
	var sqlstr ='select * from t_pianduan_index where status=0 and uid="'+localuid+'"';	
	db.selectSql({
	    name: 'ilvtu',
	    sql: sqlstr
	}, function(ret, err) {
	    if (ret.status && ret.data[0]!=null && ret.data[0].frag_id!=null) {
	    	
    		var curpid = ret.data[0].frag_id;
    		var lineid = ret.data[0].curline_id;
    		api.confirm({
			    title: '提示',
			    msg: '你有一个尚未完成的旅行记录,是否继续记录',
			    buttons: ['结束', '继续']
				}, function(ret, err) {
				    var index = ret.buttonIndex;
				    if(index==1){
				    	db.executeSql({
						    name: 'ilvtu',
						    sql: 'update  t_pianduan_index set status=1 where frag_id='+curpid
						}, function(ret, err) {
						    if (ret.status) {
						        //alert(JSON.stringify(ret));
						    } else {
						        //alert(JSON.stringify(err));
						    }
						});
				    }
				    if(index==2){
				    
	        			$api.setStorage('curPianduanId',curpid);
					    api.openWin({
					        name: 'runstyle',
					        url: 'runstyle.html',
					        opaque: true,
					        vScrollBarEnabled: false,
					        pageParam:{
					        	pid:curpid,
					        	lineid:lineid+1
					        }
					    });
				    }
			    });
	    	
	    }
	    else{
	    //alert(JSON.stringify(err2));
	    }
	});
	
	
}


function init(){
		
	var header = $api.dom('header');
	var headerPos = $api.offset(header);
	
	
	var footer = $api.dom('footer');
	var footerPos = $api.offset(footer);
	//alert(JSON.stringify(footerPos));
	var aMap = api.require('aMap');
	aMap.open({
	    rect: {
	        x: 0,
	        y:headerPos.h,
	        h:footerPos.t-headerPos.h
	    },
	    showUserLocation: true,
	    zoomLevel: 16,
	    center: {
	        lon: 116.4021310000,
	        lat: 39.9994480000
	    },
	    fixedOn: api.frameName,
	    fixed: false
	}, function(ret, err) {
	    if (ret.status) {         	   
	    	//setlocation();
	    	initsetLocationbtn();
	        //alert(JSON.stringify(ret));
	        
	    } else {
	        alert(JSON.stringify(err));
	    }
	});
	
}


/*
 * 本地数据库新建t_pianduan_index
 */
function createPianduan(localuid){

	var db = api.require('db');
	var curday = new Date();	//获取建立草稿时间
	var newpdate= curday.Format("yyyy-MM-dd hh:mm:ss");
    //var tmpMonth =curday.getMonth()+1;
    //var newday = curday.getFullYear()+'-'+tmpMonth+'-'+curday.getDate();
    //var newdate = newday+"-"+ curday.getHours() + ':' + curday.getMinutes();
	var createPianduanstr ='insert into t_pianduan_index(frag_id,uid,Addtime,status,curline_id) values(null,"'+localuid+'","'+newpdate+'",0,1)';	
	db.executeSql({
	    name: 'ilvtu',
	    sql: createPianduanstr
	}, function(ret, err) {
		//alert(JSON.stringify(ret));
		//alert(JSON.stringify(err));
	    if (ret.status) {	
			var sqlstr ='select max(frag_id) as c from t_pianduan_index';	
			db.selectSql({
			    name: 'ilvtu',
			    sql: sqlstr
			}, function(ret, err) {
			    if (ret.status) {
			        //alert(JSON.stringify(ret));
			        var curPianduanId = ret.data[0].c;
			        $api.setStorage('curPianduanId',curPianduanId);
			      
			        api.openWin({
				        name: 'runstyle',
				        url: 'runstyle.html',
				        opaque: true,
				        vScrollBarEnabled: false,
				        pageParam:{
				        	pid:curPianduanId,
				        	lineid:1
				      
				        }
			    	});
			        
			        //alert(JSON.stringify(ret.data));
			    } else {
			    	
			    	//alert(JSON.stringify(err));
			    }
			});
		  
	        //alert(JSON.stringify(ret));
	    } else {
	    	
	    	//alert(JSON.stringify(err));
	    }
	});
	
	

			
	
}

//开始记录点
function zou(){
	token = $api.getStorage('token');     
	localuid = $api.getStorage('localuid');  
		
	if(!token || token=='undefined'){	
		api.openWin({
	        name: 'login',
	        url: 'login.html',
	        opaque: true,
	        vScrollBarEnabled: false
	    });
		
	    return;
	}	
	else
	{
		
		createPianduan(localuid);
	}

}

//开始制作游记
function bianji(){

	token = $api.getStorage('token');     
	
	if(!token || token=='undefined'){			
	    api.openWin({
	        name: 'login',
	        url: 'login.html',
	        opaque: true,
	        vScrollBarEnabled: false
	    });
		 
	    return;
	}	
	else
	{
		api.openWin({
	        name: 'choosedate',
	        url: 'edityj-choosedate.html',
	        opaque: true,
	        vScrollBarEnabled: false
	    });
		
	}
}


/*
 * 定位
 */
function setlocation(){
	var aMap = api.require('aMap');
        aMap.getLocation({
        	autoStop:true
        },function(ret, err) {
		    if (ret.status) {
		        //alert(JSON.stringify(ret));	
		        if(ret.lon>0){
					aMap.setCenter({
					    coords: {
					        lon: ret.lon,
					        lat: ret.lat
					    },
					    animation: false
					});
					
		        }
		        
		    } else {
		        alert(JSON.stringify(err));
		    }
		});	    
}

/*
 * 设定定位按钮
 */
function initsetLocationbtn(){
	var header = $api.dom('header');
	var headerPos = $api.offset(header);	
	
	var footer = $api.dom('footer');
	var footerPos = $api.offset(footer);
	var h= footerPos.t-headerPos.h;
	

	var button = api.require('UIButton');
	button.open({
	    rect: {
	        x: 10,
	        y: footerPos.t-h/6,
	        w: 30,
	        h: 30
	    },
	    corner: 5,
	    bg: {
	        normal: 'widget://image/slide/gps@3x.png',
	        highlight: 'widget://image/slide/gps@3x.png',
	        active: 'widget://image/slide/gps@3x.png'
	    },
	    title: {
	        size: 14,
	        highlight: '',
	        active: '',
	        normal: '',
	        highlightColor: '#000000',
	        activeColor: '#000adf',
	        normalColor: '#ff0000',
	        alignment: 'center'
	    },
	    fixedOn: api.frameName,
	    fixed: true,
	    move: true
	}, function(ret, err) {
	    if (ret) {	 
	    	setlocation();
	    	if(ret.eventType=="click")
	    	{	    		
	    		setlocation();
	    	}
	        //alert(JSON.stringify(ret));
	    } else {
	        //alert(JSON.stringify(err));
	    }
	});
}

/*
 * start开始显示更多point
 */
var timeOutEvent = 0;
//开始按
function gtouchstart(obj) {
  Htmls ="showmore";  
};

//手释放，取消长按事件
function gtouchend() {   
   Htmls = "";
   
};



//日期格式化
Date.prototype.Format = function(fmt) { //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}
