
var uid=null;
function backToWin(){	
    setTimeout(function () {    
       api.closeWin();      
    }, 100);
}

function openyj(travelid){
	
     //var uid = $api.getStorage('uid');
	api.openWin({
	        name: 'win_yjview',
	        url: 'win_yjview.html',
	        opaque: true,
	        vScrollBarEnabled:false,
	        pageParam:{
	        	uid:uid,
	        	travelid:travelid,
	        	type:'viewyj'
	        }
	    });
}


/*
 * 初始化新建游记按钮
 */
function initNewYjbtn(uid){
	var winWidth = api.winWidth;
	var x = winWidth*3/4;
	var winHeight = api.winHeight;
	var y = winHeight-150;
	var button = api.require('UIButton');
	button.open({
	    rect: {
	        x: x,
	        y: y,
	        w: 50,
	        h: 50
	    },
	    corner: 5,
	    bg: {
	        normal: 'widget://image/frm_myyjlist/+.png',
	        highlight: 'widget://image/frm_myyjlist/+.png',
	        active: 'widget://image/frm_myyjlist/+.png'
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
	    	
	    	if(ret.eventType=="click")
	    	{
	    		api.openWin({
	            name: 'win_userpage',
	            url: '../html/win_userpage.html',
	            pageParam: {
		            title: '选择日期',
		            url: 'frm_calendar.html',
		            frameName: 'frm_calendar',
		            uid:uid
		        },
	            bounces: false,
	            rect: {
	                x: 0,
	                y: 0,
	                w: 'auto',
	                h: 'auto'
	            },           
	            reload: true,
	            showProgress: true
	        });
	    	}
	        //alert(JSON.stringify(ret));
	    } else {
	        //alert(JSON.stringify(err));
	    }
	});
}


/*
 * 获得游记天数和记录数
 */
/*
function getdaynum(travelid,callback){
	var daynum=0; 	
	var recnum=0;
	 var getdaynumUrl = '/youji?filter=';
    var getdaynum_urlParam = {
    	where:{
    		id:travelid
    		},
    	include:['zjofyouji','record']
    };
    ajaxRequest(getdaynumUrl + JSON.stringify(getdaynum_urlParam), 'GET', '', function (ret, err) { 
	 	//alert(JSON.stringify(ret));
        if (ret && ret[0]!=null &&  ret[0].zjofyouji!=null &&  ret[0].zjofyouji[0]!=null) {  
        		
        	  daynum=ret[0].zjofyouji.length;
        	  recnum = ret[0].record.length;
        	  callback&&callback(daynum,recnum);
        }
        else{
        	alert(JSON.stringify(err));
        }
        api.hideProgress();  
    });    
}
*/

function init(uid){
	api.showProgress({
        title: '加载中...',
        modal: false
    });
    /*
     * 第一期获得全部的point,二期开始分天显示点
     */    
	var yjUlr = '/user?filter=';
	var yjUlr_Param = {
      	 where:{
    		id:uid
    		},
    	include: ['yj'],
    	includefilter:{
    		yj:{
    			where:{
    				status:1
    			},
    			order:'updatedAt DESC'
    		}
    	}
			       
	    //	['record',{record:['img']}]
    }
    
	 ajaxRequest(yjUlr+JSON.stringify(yjUlr_Param), 'GET', '', function (ret, err) {
        if (ret) {
        	
			var yjstrr='';
        	var t = ret[0].yj;
        	for(var id in t){        	
        		  yjstrr+='<div class="youji-box" onclick="openyj('+"'"+t[id].id+"','"+uid+"'"+');">';		
			      yjstrr+='<div class="youji-top clearfix" tapmode="tap-active" onclick="" data-id="120333" data-type="">';		
			      var yjtitle='游记还未起名';
		            if(t[id].title!=null && t[id].title!=''){
		            	yjtitle=t[id].title;
		            }
		          var newdate = new Date(t[id].updatedAt);
		          var tmpMonth =newdate.getMonth()+1;
	   			  var newday = newdate.getFullYear()+'-'+tmpMonth+'-'+newdate.getDate();
	   			  
			      yjstrr+='<span class="user-name pull-left">'+newday+'&nbsp;&nbsp;&nbsp;'+yjtitle+'</span>';		
			      yjstrr+='</div>';	
			      var guideimgurl = "../image/frm_myyjlist/pic144.png";
			      if(t[id].guideimg!=null && t[id].guideimg.url!=null){
			      	guideimgurl=t[id].guideimg.url;
			      }
			      yjstrr+='<img src="'+guideimgurl+'"  height="200px">';	
			      yjstrr+='<div class="youji-content-text" tapmode="tap-active" onclick="" data-id="90000099">';		
			      
			      var yjinfo='';
		            if(t[id].note!=null && t[id].note!=''){
		            	yjinfo=t[id].note;
		            }
			      yjstrr+='<p class="text">'+yjinfo+'</p>	';	
			      yjstrr+='</div>';	
			      yjstrr+='</div>';	
	          		
        		
            }	
            $api.byId('yj').innerHTML = yjstrr;
           
        } 
        else {
            api.alert({
                msg: err.msg
            });
        }
        api.hideProgress();
    })
}

apiready = function () {


	var header = $api.dom('header');
	var headerPos = $api.offset(header);
	$api.fixStatusBar(header);
	
 	uid= api.pageParam.uid;
    //$api.setStorage('uid',uid);  
    initNewYjbtn(uid);
    init(uid);

    api.addEventListener({
        name: 'scrolltobottom'
    }, function (ret, err) {
     
    	initNewYjbtn(uid);
    	init(uid);
    });
	

};