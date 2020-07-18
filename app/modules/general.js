const app = require("tns-core-modules/application");
const platform = require("tns-core-modules/platform");
const color = require("tns-core-modules/color");

exports.BoardTap = (args, otherBtn)=>{
    return new Promise((resolve, reject) =>{
        var elem = args.object;
        var page = elem.page;
        var otherButton = page.getViewById(otherBtn);

        if(elem.stat == undefined || elem.stat == ""){
            elem.style = "width:60%";
            elem.stat = "selected";
            otherButton.style = "width:45%";
            otherButton.stat = "";
            resolve(true);
        }
        else{
            elem.style = "width:45%";
            elem.stat = "";
            resolve(false);
        }
    });
};

exports.ButtonTouch = (args, oldColor, newColor)=>{
    var elem = args.object;

    if(args.action == "down"){
        elem.style = "background-color:" + newColor + ";";
    }
    else{
        elem.style = "background-color:" + oldColor + ";";
    }
};

exports.FullScreenMode = ()=>{
     var View = android.view.View;

     if(app.android && platform.device.sdkVersion >= 21){
        var window = app.android.startActivity.getWindow();
        
        window.setStatusBarColor(0x000000);

        var decorView = window.getDecorView();

        decorView.setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
            | View.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        );
     }
};
