var uid=null;
var travelid=null;
apiready = function () {	
	//var header_h = api.pageParam.header_h;	
    //$api.fixStatusBar($api.dom('.header'));
    
    
	 uid = api.pageParam.uid;
	 travelid = api.pageParam.travelid;
	//'58dbad25c3ba71e25b0056ec';
	//api.pageParam.travelid;
	//$api.setStorage('uid',uid);
	//$api.setStorage('travelid',travelid);
	$api.setStorage('beginaddinfo',0);
   
   //设置起始日期
	var startdate ='2017-04-07'; 
	//api.pageParam.startdate; 
    var startmonth = startdate.split('-')[1];
    var startday = startdate.split('-')[2];
    $api.byId('startdate').innerHTML = startmonth+'月<br/>'+startday+'日';
    var enddate = '2017-04-09'; 
    //api.pageParam.enddate; 
    var endmonth = enddate.split('-')[1];
    var endday = enddate.split('-')[2];
    $api.byId('enddate').innerHTML=endmonth+'月<br/>'+endday+'日';
    
    
    /*
     * 2.0版本将把run的照片也存在手机里，传递过来。1.0版本暂时直接存照片
     */
    var type = api.pageParam.yjtype;
    switch(type){
    	case 'run':		    	
		    showyjinfo(travelid);
		    break;
    	case 'album':    				    	
		    showyjinfo(travelid);
    		break;
    	default:
    		break;
    }
    
    
    //处理添加文字成功后页面显示
    api.addEventListener({
        name:'viewappear'
    },function(ret,err){
    	if($api.getStorage('beginaddinfo')==0){
    	}
    	else{
	    	var returncontent =  $api.getStorage('returncontent');
	    	var returntype=  $api.getStorage('returntype');
	    	switch(returntype) {
	    		case 'title':
	    			$api.byId('yjtitle').innerHTML = $api.getStorage('returncontent');
	    			$api.setStorage('yjtitle',$api.byId('yjtitle').innerHTML);
	    			break;
				case 'titleinfo':
					$api.byId('yjtitleinfo').innerHTML = $api.getStorage('returncontent');
					$api.setStorage('yjtitleinfo',$api.byId('yjtitleinfo').innerHTML);
	    			break;
				case 'photoinfo':
					var photoid = $api.getStorage('returnphotoid');
					if(photoid!=null && photoid!=''){					
						$api.byId('info'+photoid).innerHTML = $api.getStorage('returncontent');
					}
					var photoarray = $api.getStorage('toreshowyjarrays');
					
					for(var id in photoarray){
						if(photoarray[id].photoid==photoid){
							var curnoteinfo = $api.getStorage('returncontent');
							var curphoto={
					    			arrayno:photoarray[id].arrayno,
					    			dvid:photoarray[id].dvid,
					    			photoid:photoid,
					    			seriano:photoarray[id].seriano,
					    			url:photoarray[id].url,
					    			noteinfo:curnoteinfo,
					    			info:photoarray[id].info
					    		};
							
							photoarray.splice(photoarray.arrayno-1,1,curphoto);
						}
					}
					
					$api.setStorage('toreshowyjarrays',photoarray);
	    			break;
	    		default:
	    			
	    			break;
	    	}
    	}
    });
}


/*
 * 首次打开yj内容编辑
 */
function showyjinfo(travelid){
	api.showProgress({
        title: '加载中...',
        modal: false
    });
	var dayviewUrl = '/yj?filter=';
	var dayviewUrl_Param = {
      	 where:{
    		id:travelid
    		},
    	include: ['dayview']
    }
    
	 ajaxRequest(dayviewUrl+JSON.stringify(dayviewUrl_Param), 'GET', '', function (ret, err) {
        if (ret) {
        	if(ret[0].title && ret[0].title!=""){
        		$api.byId("yjtitle").innerHTML=ret[0].title;
        	}
        	if(ret[0].note && ret[0].note!=""){
        		$api.byId("yjtitleinfo").innerHTML=ret[0].note;
        	}
        	
        	var strArrays = new Array();
        	
        	
        	var dayviews = ret[0].dayview;  
        	var yjinfostr='';    
        	for(var id in dayviews){
        	    
        	    //获得时间
        	    var curdate = dayviews[id].dayinfo;
        	    var curMonth= curdate.split('-')[1];
        	    var curDay = curdate.split('-')[2];
        	    
        		var dvid = dayviews[id].id;
        		strr='';
        		strr+='<div class="daytitle" > ';   
			    strr+='<a id="daydate" class="curdate" tapmode="" onclick="">'+curMonth+'月<br/>'+curDay+'日</a>';  
			    strr+='</div>';  
			    strr+='<div class="daylabel" >  ';    
			    strr+='<a class="label" tapmode="" onclick=""></a>';  
			    strr+='</div>';  
        		
        		
        		var strArray={
        			id:dvid,
        			info:strr
        		}
        		strr+='<div id="'+dvid+'" class="dayview">'; 
	    		strr+='</div>';
        		yjinfostr+=strr;
        	
        		strArrays.push(strArray);
        	}        		
        	
        	    	
        	
        	$api.byId('yjinfo').innerHTML = yjinfostr;
        	//var num= strArrays.length;
        	//var i=0;
        	
        	var toreshowyjarrays = new Array();
        	$api.setStorage('toreshowyjarrays',toreshowyjarrays);
            for(var id in strArrays){            	
            	var sar = strArrays[id]; 
            	getphoto(sar.id,sar.info);
            	/*
	    		getphoto(sar.id,sar.info,function(info,tmpstr){	    			        
            		yjinfostr+=info;
	    			i++;
	    			if(tmpstr!='' && tmpstr!=null){
            			yjinfostr+='<div id="'+sar.id+'" class="dayview">';  
	    				yjinfostr+=tmpstr;
	    				yjinfostr+='</div>';
	    			}
	    			
	    			if(i==num){
	    				
	    				$api.byId('yjinfo').innerHTML = yjinfostr;
	    			}
	    		});
	    		*/
        	}
        	
        		/*
        		var photoUrl = '/dayview?filter=';
				var photoUrl_Param = {
			      	 where:{
			    		id:dvid
			    		},
			    	include: ['photo']
			    }
			    
				 ajaxRequest(photoUrl+JSON.stringify(photoUrl_Param), 'GET', '', function (ret, err) {
			        if (ret) {
			        	var strr2='';
			        	var photos = ret[0].photo;
			        	for(var id in photos){
			        		strr2+='<div class="photo">';
				    		strr2+='<a class="delbtn"></a>';
				    		strr2+='<img class="curimg" src="../image/frm_newnote/pic144.png" >';
				    		strr2+='<a class="photoinfo" onclick="">点击添加文字</a>';
				    		strr2+='</div>';
			        	}
			        	
						$api.byId(dvid).innerHTML=strr2;
			        }
			        else{
			        	api.alert({
			                msg: err.msg
			            });
			    	}  
		    	});
		    	*/
		    
			
        }
    	else{
    		api.alert({
                msg: err.msg
            });
    	}  
	    api.hideProgress();  
    });
}


function getphoto(dvid,info){
	var photoUrl = '/dayview?filter=';
	var photoUrl_Param = {
      	 where:{
    		id:dvid
    		},
    	include: ['photo']
    }
	ajaxRequest(photoUrl+JSON.stringify(photoUrl_Param), 'GET', '', function (ret, err) {
	    if (ret) {
	    	var toreshowyjarrays = $api.getStorage('toreshowyjarrays');	//存储每个photo信息，为了add、del和排序
			//var tmpstr='<div id="'+dvid+'" class="dayview">';  
        	var tmpstr='';	        		
	    	var photos = ret[0].photo;
	    	var photoseriano=0;
	    	for(var id in photos){
	    		photoseriano++;
	    			
	    		var arrayno= toreshowyjarrays.length+1;
	    		var showphotostr='';
	    		showphotostr+='<div class="addphoto">';
	    		showphotostr+='<img class="curimg" onclick="addphoto('+"'"+dvid+"',"+photoseriano+","+arrayno +')" height="20px" src="../image/frm_newnote/addphoto.png" >';
	    		showphotostr+='</div>';
	    		showphotostr+='<div id="'+ photos[id].id +'" class="photo">';
	    		showphotostr+='<a class="delbtn" onclick="delphoto('+"'"+photos[id].id+"','"+dvid+"',"+photoseriano+","+arrayno+')"></a>';
	    		showphotostr+='<img class="curimg" src="'+photos[id].url.url+'" >';
	    		
	    		tmpnotestr='点击添加文字';
	    		if(photos[id].note!=null && photos[id].note!=''){
	    			tmpnotestr=photos[id].note;
	    		}
	    	
	    		showphotostr+='<a id="info'+photos[id].id+'" class="photoinfo" onclick="addinfo('+"'photoinfo',"+"'"+photos[id].id+"'"+');">'+tmpnotestr+'</a>';
	    		showphotostr+='</div>';
	    	
	    		
	    		var showphoto={
	    			arrayno:arrayno,
	    			dvid:dvid,
	    			photoid:photos[id].id,
	    			seriano:photoseriano,
	    			url:photos[id].url.url,
	    			noteinfo:photos[id].note,
	    			info:showphotostr
	    		};
	    		toreshowyjarrays.push(showphoto);
	    		
	    		
	    		tmpstr+=showphotostr;
	    	}
	    	//再加一个'+'号
	    	photoseriano++;
	    	tmpstr+='<div class="addphoto">';
    		tmpstr+='<img class="curimg" onclick="addphoto('+"'"+dvid+"',"+photoseriano+')" height="20px" src="../image/frm_newnote/addphoto.png" >';
    		tmpstr+='</div>';
    		
        	$api.setStorage('toreshowyjarrays',toreshowyjarrays);
        	
        	
	    	//tmpstr+='</div>';
	    	$api.byId(dvid).innerHTML = tmpstr;
	    }
	    else{
	    	api.alert({
	            msg: err.msg
	        });
		}  
	});
}

function addinfo(type,photoid){
	var originalcontent='';
	switch(type){
		case 'title':
			
			var curcontent=$api.trim($api.byId('yjtitle').innerHTML);
			if(curcontent!='点击添加标题'){
				originalcontent=curcontent;
			}
			
			break;
		case 'titleinfo':
			var curcontent=$api.trim($api.byId('yjtitleinfo').innerHTML);
			if(curcontent!='点击这里记录游记简介'){
				originalcontent=curcontent;
			}
			
			break;
		case 'photoinfo':
		
			
			var curcontent=$api.trim($api.byId('info'+photoid).innerHTML);
			if(curcontent!='点击添加文字'){
				originalcontent=curcontent;
			}
			
		    break;
		default:
			break;
	}
	api.openWin({
	    name: 'addinfo',
	    url: 'win_noteaddinfo.html',
	    animation:{
		    type:"movein",                //动画类型（详见动画类型常量）
		    subType:"from_bottom",       //动画子类型（详见动画子类型常量）
		    duration:300                //动画过渡时间，默认300毫秒
		},
		pageParam:{
			type:type,
			photoid:photoid,
			content:originalcontent
		}
		
    });
}

/*
 * 删除后重新显示该dvid的dayvie内容
 */
function delphoto(photoid,dvid,seriano,arrayno){
	api.confirm({
    title: '提示',
    msg: '确定删除该段照片？',
    buttons: ['取消', '确定']
	}, function(ret, err) {
	    var index = ret.buttonIndex;
	    if(index==2){
		    api.showProgress({
		        title: '去除该照片中...',
		        modal: false
		    });
			var delphotoUrl = '/photo/'+photoid;
			var bodyParam = {
		        'dayview(uz*R*id)':null,
		    };
		   
			 ajaxRequest(delphotoUrl, 'put', JSON.stringify(bodyParam),function (ret, err) {	
			 	if(ret){
			 		var toreshowyjarrays = $api.getStorage('toreshowyjarrays');
			 		var reshowdayviewstr='';
			 		var maxseriano=0;
			 		//var delseriano=0;
			 		//var lastarrayno= 0;
			 		for(var id in toreshowyjarrays){			 			
			 		
			 			if(toreshowyjarrays[id].dvid==dvid){
			 				if(toreshowyjarrays[id].photoid!=photoid && toreshowyjarrays[id].seriano!=seriano ){			 							 					
			 					maxseriano++;
			 					if(toreshowyjarrays[id].seriano<seriano){
			 						reshowdayviewstr+=toreshowyjarrays[id].info;
			 						
			 					}			 					
			 					else{
			 						var photoseriano = toreshowyjarrays[id].seriano-1;			 						
			 						var curarrayno = toreshowyjarrays[id].arrayno-1;
			 						//lastarrayno = toreshowyjarrays[id].arrayno;
			 						
			 						var showphotostr=''
			 						showphotostr+='<div class="addphoto">';
						    		showphotostr+='<img class="curimg" onclick="addphoto('+"'"+dvid+"',"+photoseriano+","+curarrayno+')" height="20px" src="../image/frm_newnote/addphoto.png" >';
						    		showphotostr+='</div>';
						    		showphotostr+='<div id="'+ toreshowyjarrays[id].photoid +'" class="photo">';
						    		showphotostr+='<a class="delbtn" onclick="delphoto('+"'"+toreshowyjarrays[id].photoid+"','"+dvid+"',"+photoseriano+","+curarrayno+')"></a>';
						    		showphotostr+='<img class="curimg" src="'+toreshowyjarrays[id].url+'" >';
						    		tmpnotestr='点击添加文字';
						    		if(toreshowyjarrays[id].noteinfo!=null && toreshowyjarrays[id].noteinfo!=''){
						    			tmpnotestr=toreshowyjarrays[id].noteinfo;
						    		}
						    		showphotostr+='<a id="info'+toreshowyjarrays[id].photoid+'" class="photoinfo" onclick="addinfo('+"'photoinfo',"+"'"+toreshowyjarrays[id].photoid+"'"+');">'+tmpnotestr+'</a>';
						    		showphotostr+='</div>';
						    		
						    		var showphoto={
						    			arrayno:curarrayno,
						    			dvid:dvid,
						    			photoid:toreshowyjarrays[id].photoid,
						    			seriano:photoseriano,
						    			url:toreshowyjarrays[id].url,
						    			noteinfo:toreshowyjarrays[id].noteinfo,
						    			info:showphotostr
						    		};
						    		toreshowyjarrays.splice(curarrayno,1,showphoto);
						    		reshowdayviewstr+=showphotostr;
						    		
			 					}
			 				}	
			 						
			 			}
			 			else{
				 			if(toreshowyjarrays[id].arrayno>arrayno){
				 				var showphoto={
					    			arrayno:toreshowyjarrays[id].arrayno-1,
					    			dvid:toreshowyjarrays[id].dvid,
					    			photoid:toreshowyjarrays[id].photoid,
					    			seriano:toreshowyjarrays[id].seriano,
					    			url:toreshowyjarrays[id].url,
					    			noteinfo:toreshowyjarrays[id].noteinfo,
					    			info:toreshowyjarrays[id].info
					    		};
					    		toreshowyjarrays.splice(toreshowyjarrays[id].arrayno-2,1,showphoto);
				 			}
			 			}		 				 		
			 		}
			 		
			 		toreshowyjarrays.splice(arrayno-1,1);
			 		
			 		
			 		$api.setStorage('toreshowyjarrays',toreshowyjarrays);
			 		//再加一个'+'号
			 		maxseriano++;
			    	reshowdayviewstr+='<div class="addphoto">';
		    		reshowdayviewstr+='<img class="curimg" onclick="addphoto('+"'"+dvid+"',"+  maxseriano +')" height="20px" src="../image/frm_newnote/addphoto.png" >';
		    		reshowdayviewstr+='</div>';
			 		$api.byId(dvid).innerHTML= reshowdayviewstr;
			 	}
			 	else{ 
			 		api.alert({
			            msg: err.msg
			        });
			 	}
			 	api.hideProgress();
			 })
	    }
	});
	
	
}


/*
 * 增加后重新显示该dvid的dayvie内容
 */
function addphoto(dvid,seriano,arrayno){
	api.getPicture({
	    sourceType: 'album',
	    encodingType: 'png',
	    mediaValue: 'pic',
	    destinationType: 'url',
	    allowEdit: true,
	    quality: 60,
	    targetWidth: 200,
	    targetHeight: 200,
	    saveToPhotoAlbum: true
	}, function(ret, err) {
	    if (ret) {	    	
	    	var picurl = ret.data;
	    	var fs = api.require('fs');
			var ret = fs.getAttributeSync({
			    path: picurl
			});
			if (ret.status) {
				
				var t= ret.attribute.modificationDate;
				
				var tDate = new Date(parseInt(t) * 1000).toLocaleString().substr(0,17) ;
				saveaddphoto(tDate,picurl,dvid,seriano,arrayno);
			    
			    
			    
			}
			
	        //alert(JSON.stringify(picurl));
	    } 
	    else 
	    {
	        alert(JSON.stringify(err));
	    }
	});

}

function saveaddphoto(tDate,picurl,dvid,seriano,arrayno){
	api.showProgress({
	    title: '照片存储中...',
	    modal: false
    });
	var uploadphtoUlr = '/file';
	var bodyParam = {
        file:picurl
    }
	 ajaxPhotoRequest(uploadphtoUlr, 'post', picurl, function (ret, err) {	
        if (ret) {  
        	//alert(ret.id);
        	var file ={
        		id:ret.id,
        		name:ret.name,
        		url:ret.url
        	}
        	
        	var newdate = new Date();
		    var addphotoUlr ='/dayview/'+dvid+'/photo';
			var bodyParam = {
		        gpsinfo:null,
		        height:'',
		        filename:file.name,
		        note:'',
		        url:file,
		        tag:'',
		        status:0,
		        source:'album',
		        phototime:tDate,
		    }
			 ajaxRequest(addphotoUlr, 'post', JSON.stringify(bodyParam), function (ret, err) {							
		        if (ret) {
		        	var curphotoid = ret.id;
		        	var toreshowyjarrays = $api.getStorage('toreshowyjarrays');
			 		var reshowdayviewstr='';
			 		var maxseriano=0;
			 		var newphoto='';
			 		//var lastarrayno= 0;	 		
			 		for(var id in toreshowyjarrays){
			 			if(toreshowyjarrays[id].dvid==dvid){
			 				maxseriano++;	 			
			 				if(toreshowyjarrays[id].seriano<seriano){
		 						reshowdayviewstr+=toreshowyjarrays[id].info;
		 					}
		 					else if(toreshowyjarrays[id].seriano==seriano){
		 						var newseriano = toreshowyjarrays[id].seriano;			 						
		 						var newarrayno = toreshowyjarrays[id].arrayno;
		 							 						
		 						var photoseriano = toreshowyjarrays[id].seriano+1;			 						
		 						var curarrayno = toreshowyjarrays[id].arrayno+1;
		 						//lastarrayno = toreshowyjarrays[id].arrayno+1;
		 						maxseriano=photoseriano+1;
		 						var newphotostr='';
		 						
		 						
		 						//加上插入的数据
		 						newphotostr+='<div class="addphoto">';
					    		newphotostr+='<img class="curimg" onclick="addphoto('+"'"+dvid+"',"+newseriano+","+newarrayno+')" height="20px" src="../image/frm_newnote/addphoto.png" >';
					    		newphotostr+='</div>';
					    		newphotostr+='<div id="'+ curphotoid +'" class="photo">';
					    		newphotostr+='<a class="delbtn" onclick="delphoto('+"'"+curphotoid+"','"+dvid+"',"+newseriano+","+newarrayno+')"></a>';
					    		newphotostr+='<img class="curimg" src="'+picurl+'" >';
					    		
					    		newphotostr+='<a id="info'+curphotoid+'" class="photoinfo" onclick="addinfo('+"'photoinfo',"+"'"+curphotoid+"'"+');">点击添加文字</a>';
					    		newphotostr+='</div>';		 						
		 						newphoto={
					    			arrayno:newarrayno,
					    			dvid:dvid,
					    			photoid:curphotoid,
					    			seriano:newseriano,
					    			url:picurl,					    			
					    			noteinfo:'',
					    			info:newphotostr
					    		};
		 						var showphotostr='';
		 						showphotostr+='<div class="addphoto">';
					    		showphotostr+='<img class="curimg" onclick="addphoto('+"'"+dvid+"',"+photoseriano+","+arrayno+')" height="20px" src="../image/frm_newnote/addphoto.png" >';
					    		showphotostr+='</div>';
					    		showphotostr+='<div id="'+ toreshowyjarrays[id].photoid +'" class="photo">';
					    		showphotostr+='<a class="delbtn" onclick="delphoto('+"'"+toreshowyjarrays[id].photoid+"','"+dvid+"',"+photoseriano+","+arrayno+')"></a>';
					    		showphotostr+='<img class="curimg" src="'+toreshowyjarrays[id].url+'" >';
					    		tmpnotestr='点击添加文字';
					    		if(toreshowyjarrays[id].noteinfo!=null && toreshowyjarrays[id].noteinfo!=''){
					    			tmpnotestr=toreshowyjarrays[id].noteinfo;
					    		}
					    		showphotostr+='<a id="info'+toreshowyjarrays[id].photoid+'" class="photoinfo" onclick="addinfo('+"'photoinfo',"+"'"+toreshowyjarrays[id].photoid+"'"+');">'+tmpnotestr+'</a>';
					    		showphotostr+='</div>';
					    		
					    		var showphoto={
					    			arrayno:arrayno,
					    			dvid:dvid,
					    			photoid:toreshowyjarrays[id].photoid,
					    			seriano:photoseriano,
					    			url:toreshowyjarrays[id].url,
					    			noteinfo:toreshowyjarrays[id].noteinfo,
					    			info:showphotostr
					    		};
					    		toreshowyjarrays.splice(toreshowyjarrays[id].arrayno-1,1,showphoto);
					    		reshowdayviewstr+=newphotostr;
					    		reshowdayviewstr+=showphotostr;
					    		//alert('11-'+toreshowyjarrays.length);
		 						//toreshowyjarrays.splice(toreshowyjarrays[id].arrayno,1);
		 					}
		 					else{
		 					
		 						var photoseriano = toreshowyjarrays[id].seriano+1;	
		 						var newarrayno = toreshowyjarrays[id].arrayno+1;
		 						var curarryno= toreshowyjarrays[id].arrayno;			
		 						//lastarrayno = toreshowyjarrays[id].arrayno+1;
		 						maxseriano=photoseriano+1;
		 						var showphotostr=''
		 						showphotostr+='<div class="addphoto">';
					    		showphotostr+='<img class="curimg" onclick="addphoto('+"'"+dvid+"',"+photoseriano+","+newarrayno+')" height="20px" src="../image/frm_newnote/addphoto.png" >';
					    		showphotostr+='</div>';
					    		showphotostr+='<div id="'+ toreshowyjarrays[id].photoid +'" class="photo">';
					    		showphotostr+='<a class="delbtn" onclick="delphoto('+"'"+toreshowyjarrays[id].photoid+"','"+dvid+"',"+photoseriano+","+newarrayno+')"></a>';
					    		showphotostr+='<img class="curimg" src="'+toreshowyjarrays[id].url+'" >';
					    		tmpnotestr='点击添加文字';
					    		if(toreshowyjarrays[id].noteinfo!=null && toreshowyjarrays[id].noteinfo!=''){
					    			tmpnotestr=toreshowyjarrays[id].noteinfo;
					    		}
					    		showphotostr+='<a id="info'+toreshowyjarrays[id].photoid+'" class="photoinfo" onclick="addinfo('+"'photoinfo',"+"'"+toreshowyjarrays[id].photoid+"'"+');">'+tmpnotestr+'</a>';
					    		showphotostr+='</div>';
					    		
					    		var showphoto={
					    			arrayno:newarrayno,
					    			dvid:dvid,
					    			photoid:toreshowyjarrays[id].photoid,
					    			seriano:photoseriano,
					    			url:toreshowyjarrays[id].url,
					    			noteinfo:toreshowyjarrays[id].noteinfo,
					    			info:showphotostr
					    		};
					    		toreshowyjarrays.splice(curarryno-1,1,showphoto);
					    		
					    		//alert('22-'+toreshowyjarrays.length);
					    		reshowdayviewstr+=showphotostr;
					    		
		 					}	
			 			}	
		 				else{
				 			if(toreshowyjarrays[id].arrayno>arrayno){
				 				var showphoto={
					    			arrayno:toreshowyjarrays[id].arrayno+1,
					    			dvid:toreshowyjarrays[id].dvid,
					    			photoid:toreshowyjarrays[id].photoid,
					    			seriano:toreshowyjarrays[id].seriano,
					    			url:toreshowyjarrays[id].url,
					    			noteinfo:toreshowyjarrays[id].noteinfo,
					    			info:toreshowyjarrays[id].info
					    		};
					    		toreshowyjarrays.splice(toreshowyjarrays[id].arrayno-1,1,showphoto);
				 			}
			 			}		 					 		
			 		}	
			 		
		 			toreshowyjarrays.splice(arrayno-1,0,newphoto);	
		 				
			 		$api.setStorage('toreshowyjarrays',toreshowyjarrays);
			 		//alert('33-'+toreshowyjarrays.length);
			 		//再加一个'+'号
			 		maxseriano++;
			    	reshowdayviewstr+='<div class="addphoto">';
		    		reshowdayviewstr+='<img class="curimg" onclick="addphoto('+"'"+dvid+"',"+  maxseriano +')" height="20px" src="../image/frm_newnote/addphoto.png" >';
		    		reshowdayviewstr+='</div>';
			 		$api.byId(dvid).innerHTML= reshowdayviewstr;
			 		
			 		//alert(JSON.stringify(toreshowyjarrays));
		        }
		        else{
		        	api.alert({
		                msg: "图片上传失败,请重试一次！"
		            });
		        }					        
				api.hideProgress();
		    });
        	
        	
        	
        } else {
            api.alert({
                msg: "图片上传失败,请重试一次！"
            });
        }
        api.hideProgress();
    })
	    	
	    	
	    	
}