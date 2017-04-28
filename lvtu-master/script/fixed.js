var uid=null;
var token=null;
apiready = function () { 
	
	uid = $api.getStorage('uid');
	token= $api.getStorage('token');
	var $header=$api.dom('.header');		
    $api.fixIos7Bar($header);	
    $api.fixStatusBar($header); 			
	//$api.setStorage('uid','58a45e8e6b1017645e8f437d');   
 	api.setRefreshHeaderInfo({
        visible: true,
        // loadingImgae: 'wgt://image/refresh-white.png',
        bgColor: '#f2f2f2',
        textColor: '#4d4d4d',
        textDown: '下拉刷新...',
        textUp: '松开刷新...',
        showTime: true
    }, function (ret, err) {   	
    	
    	showUserInfo();
        api.refreshHeaderLoadDone();
    });
    
    
    api.setStatusBarStyle({
        style: 'dark',
        color: '#000'
    });
    $api.fixStatusBar($api.dom('nav'));   
    
    showUserInfo();
    api.addEventListener({
            name:'viewappear'
        },function(ret,err){
            //operation
            //alert($api.getStorage('uid')); 
           uid = $api.getStorage('uid');    
		   token=$api.getStorage('token'); 
           showUserInfo();
        }) ;
    
};

function backToWin(){
	api.closeSlidPane();
}

/*
 * 设置fixed用户头像和信息
 */
function showUserInfo(){
	 
    //alert(uid);
	if(uid && uid!='undefined'){
		$api.byId("profile").style.visibility="hidden";
		
		$api.byId("logout").style.visibility="visible";
		api.showProgress({
	        title: '获取用户信息...',
	        modal: false
	    });
		var getUserInfoUrl = '/user?filter=';
	    var userinfo_urlParam = {
	    	where:{
	    		id:uid
	    		},
	    	include:['userinfoPointer']
	    };
	    ajaxRequest(getUserInfoUrl + JSON.stringify(userinfo_urlParam), 'GET', '', function (ret, err) { 
	        if (ret) {  
	        	var photoUrl = '';
	        	var nickname='尚无昵称';
	        	if(ret[0]!=null && ret[0].userinfo!=null){	        	
	        		if(ret[0].userinfo.userphoto!=null){
	        			photoUrl=ret[0].userinfo.userphoto.url;
	        		}
	        		if(ret[0].userinfo.nickname!=null && ret[0].userinfo.nickname!=''){
	        			nickname=ret[0].userinfo.nickname;
	        		}
	        	}
	                 
			    initPersonalCenter({
			        nickname: nickname,
			        photo: photoUrl,
			        point: 0
			    });
	             //$api.byId('userinfo').innerHTML=ret[0].userinfo.nickname;
	        	//getUserLvyou('myyouji');              
	            //getFavData('activity', localStorage.getItem('actFavArr'));
	        } else {
	            api.toast({msg: err.msg, location: 'middle'});
	            
	        }
	
            api.hideProgress();
	    });
	}
}

//init personal center
function initPersonalCenter(json) {  
    json = json || {};
    if (!json.nickname) {
    
        return;
    }
	
	//$api.setStorage('appUid',ret[0].userinfo.id);
    var pc = api.require('personalCenter');
    //var headerH = api.pageParam.headerHeight;
    var photo = json.photo || 'widget://image/userTitle.png';  
    var point = json.point || 0;
    
  	var header = $api.dom('header');
	var headerPos = $api.offset(header);
    pc.open({
        y: headerPos.h,
        height: 201,
        fixed: true,
        imgPath: photo,
        placeHoldImg: '',
        showLeftBtn: false,
        showRightBtn: false,
        username: json.nickname,
        count: point,
        modButton: {
            bgImg: 'widget://image/fixed/edit.png',
            lightImg: 'widget://image/fixed/edit.png'
        },
        btnArray: [
            {
                bgImg: 'widget://image/fixed/personal_btn_nor.png',
                lightImg: 'widget://image/fixed/personal_btn_light.png',
                selectedImg: 'widget://image/fixed/personal_btn_sele.png',
                title: '笔记',
                count: 1,
                titleColor: '#ffffff',
                titleLightColor: '#55abce',
                countColor: '#ffffff',
                countLightColor: '#55abce'
            },
            {
                bgImg: 'widget://image/fixed/personal_btn_nor.png',
                lightImg: 'widget://image/fixed/personal_btn_light.png',
                selectedImg: 'widget://image/fixed/personal_btn_sele.png',
                title: '关注',
                count: 1,
                titleColor: '#ffffff',
                titleLightColor: '#55abce',
                countColor: '#ffffff',
                countLightColor: '#55abce'
            },
            {
                bgImg: 'widget://image/fixed/personal_btn_nor.png',
                lightImg: 'widget://image/fixed/personal_btn_light.png',
                selectedImg: 'widget://image/fixed/personal_btn_sele.png',
                title: '粉丝',
                count: 1,
                titleColor: '#ffffff',
                titleLightColor: '#55abce',
                countColor: '#ffffff',
                countLightColor: '#55abce'
            }
        ]
    }, function (ret, err) {
		if ( ret.click === 3) {
		
	 		//var uid = $api.getStorage('uid');  
	        api.openWin({
		        name: 'userinfo',
		        url: 'userinfo.html',
		        opaque: true,
		        vScrollBarEnabled: false,
		        pageParam:{uid:uid}
		    });
	    }
		
        //$api.byId('userLvyou').innerHTML = '';
        if (ret.click === 0) {
        	//getUserLvyou('myyouji');                	
            //getFavData('activity', localStorage.getItem('actFavArr'));
        }
        if (ret.click === 1) {
        	//getUserLvyou('favoryouji');      
            //getFavData('merchant', localStorage.getItem('merFavArr'));
        }
        if (ret.click === 2) {
        	//getUserLvyou('stamp');      
            //getFavData('news', localStorage.getItem('newsFavArr'));
        }
        
    });
	
	/*
    var uid = $api.getStorage('uid');
    
    var getUserInfoUrl = '/user?filter=';
    var userinfo_urlParam = {
    	where:{
    		id:uid
    		},
    	include:['userinfoPointer']
    };
    ajaxRequest(getUserInfoUrl + JSON.stringify(userinfo_urlParam), 'GET', '', function (ret, err) {   
        if (ret) {        	
        	
        	
            api.hideProgress();
        	//getUserLvyou('myyouji');              
            //getFavData('activity', localStorage.getItem('actFavArr'));
        } else {
            api.toast({msg: err.msg, location: 'middle'})
            api.hideProgress();
        }

    })
    */
}

function login(){
	//var uid = $api.getStorage('uid');     
    //alert(uid);
	if(!uid || uid=='undefined'){			
	    api.openWin({
            name: 'webpage',
            url: '../html/win_userpage.html',
            pageParam: {
	            title: '登录',
	            url: 'frm_login.html',
	            frameName: 'frm_login'	
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
		 
	    return;
	}	
}

function logout(){

	//var loginid = $api.getStorage("token");
	api.showProgress({
        title: '正在退出...',
        modal: false
    });
    var user = api.require('user');
	user.logout(function(ret, err){
	    if( ret ){
	   		$api.setStorage('uid', null);
            $api.setStorage('token', null);
            
            var pc = api.require('personalCenter');
            pc.close();
            
			$api.byId("profile").style.visibility="visible";
			$api.byId("logout").style.visibility="hidden";
	        //alert( JSON.stringify( ret) );
	    }else{
	        //alert( JSON.stringify( err) );
	    }	    
        api.hideProgress();
	});
    

}

/*
function showzuji(){
	
	 //var uid = $api.getStorage('uid'); 
	if(!uid || uid=='undefined'){
		api.openWin({
            name: 'win_userpage',
            url: '../html/win_userpage.html',
            pageParam: {
	            title: '登录',
	            url: 'frm_login.html',
	            frameName: 'frm_login',
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
		    return;
	}
	else{
		api.openWin({
	        name: 'userzuji',
	        url: 'userzuji.html',
	        opaque: true,
	        vScrollBarEnabled:false,
	        pageParam:{uid:uid}
	    });
    }
}
*/

function showyouji(){
	
	//var uid = $api.getStorage('uid'); 
	if(!uid || uid=='undefined'){
		api.openWin({
            name: 'win_userpage',
            url: '../html/win_userpage.html',
            pageParam: {
	            title: '登录',
	            url: 'frm_login.html',
	            frameName: 'frm_login',
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
		    return;
	}
	
	else{	
		api.openWin({
            name: 'win_userpage',
            url: '../html/win_userpage.html',
            pageParam: {
	            title: '我的游记',
	            url: 'frm_myyjlist.html',
	            frameName: 'frm_myyjlist',
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
}

function showabout(){
	
	 //var uid = $api.getStorage('uid'); 
		api.openWin({
	        name: 'aboutus',
	        url: 'aboutus.html',
	        opaque: true,
	        vScrollBarEnabled:false,
	        pageParam:{uid:uid}
	    });
	
}