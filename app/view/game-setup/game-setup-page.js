const GameSetupViewModel = require("./game-setup-view-model");
const General = require("~/modules/general");
const FrameModule = require("tns-core-modules/ui/frame");
const Toast = require("nativescript-toast").makeText;

exports.onNavigatingTo = (args)=>{
    const page = args.object;
    const context = args.context;

    page.bindingContext = new GameSetupViewModel();
    page.bindingContext.pOneColor = context.pOneColor;
    page.bindingContext.pTwoColor = context.pTwoColor;
    page.bindingContext.gameMode = context.mode;
    page.bindingContext.ButtonImage();
};

exports.Board3x3Selected = (args)=>{
    var page = args.object.page;
    var btnNext = page.getViewById("btnNext");  
    
    General.BoardTap(args, "btn4x4").then((res)=>{
        if(res){
            global.boardMode = 1;
            btnNext.visibility = "visible";
        }
        else{
            global.boardMode = "";
            btnNext.visibility = "collapsed";
        }
    });
};

exports.Board4x4Selected = (args)=>{
    var page = args.object.page;
    var btnNext = page.getViewById("btnNext");

    General.BoardTap(args, "btn3x3").then((res)=>{
        if(res){
            global.boardMode = 2;
            btnNext.visibility = "visible";
        }
        else{
            global.boardMode = "";
            btnNext.visibility = "collapsed";
        }
    });
};

exports.BoardMode = (args)=>{
    var elem = args.object;
    var page = elem.page;

    if(+global.boardMode != 0){
        FrameModule.topmost().navigate({
            moduleName: "~/view/game-play/game-play-page",
            animated: true,
            clearHistory: true,
            transition: {
                name: "fade",
                duration: 250,
                curve: "easeInOut"
            },
            context: {
                board: global.boardMode,
                pOneColor: page.bindingContext.get("p1Color"),
                pTwoColor: page.bindingContext.get("p2Color"),
                gMode: page.bindingContext.gameMode
            }
        });
    }
};

exports.BtnNavigationTouch = (args)=>{
    General.ButtonTouch(args, "#056abd", "#42a4f5");
};

exports.ChangeColor = (args)=>{
    var elem = args.object;
    var page = elem.page;
    var colors = ["red", "blue", "green", "orange"];
    var colorIndex = colors.indexOf(elem.btnColor);
    var assignColor = elem.id == "btnP1" ? "p1Color":"p2Color";
    var assignImage = elem.id == "btnP1" ? "p1ImageUrl":"p2ImageUrl";

    page.bindingContext.set(assignColor, colors[colorIndex == 3 ? 0 : colorIndex+1]);
    page.bindingContext.set(assignImage, "~/images/"+colors[colorIndex == 3 ? 0 : colorIndex+1]+".png");
};

exports.ReadyTap = (args)=>{
    var elem = args.object;
    var page = elem.page;
    var p1ColorBtn = page.getViewById("btnP1");
    var p2ColorBtn = page.getViewById("btnP2");

    if(elem.id == "btn1Ready"){
        var p2ReadyBtn = page.getViewById("btn2Ready");
        
        if(p2ReadyBtn.text != "Ready"){
            if(p1ColorBtn.btnColor == p2ColorBtn.btnColor){
                Toast("Color already selected!").show();
            }
            else{
                this.isReady(elem, p1ColorBtn); 
            }
        }
        else{
            this.isReady(elem, p1ColorBtn);
        }
    }
    else{
        var p1ReadyBtn = page.getViewById("btn1Ready");
        
        if(p1ReadyBtn.text != "Ready"){
            if(p2ColorBtn.btnColor == p1ColorBtn.btnColor){
                Toast("Color already selected!").show();
            }
            else{
                this.isReady(elem, p2ColorBtn); 
            }
        }
        else{
            this.isReady(elem, p2ColorBtn);
            
        }
    }

    this.isPlayersReady(args);
};

exports.isReady = (btnReady, btnColor)=>{
    if(btnReady.text == "Ready"){
        btnReady.text = String.fromCharCode(0xf00c)+" Ready";
        btnReady.style = "background-color: green;"
        btnColor.isUserInteractionEnabled = false;
    }
    else{
        btnReady.text = "Ready";
        btnReady.style = "background-color: #056abd;";
        btnColor.isUserInteractionEnabled = true;
    }
}

exports.isPlayersReady = (args)=>{
    var elem = args.object;
    var page = elem.page;
    var p1 = page.getViewById("btn1Ready");
    var p2 = page.getViewById("btn2Ready");
    
    if(p1.text != "Ready" && p2.text != "Ready"){
        this.BoardMode(args);
    }
};

exports.TapButton = (args)=>{
    var elem = args.object;
    var page = elem.page;
    var pickBoard = page.getViewById("pick-board");
    var pickColor = page.getViewById("pick-color");

    if(elem.id == "btnBack"){
        pickBoard.visibility = "visible";
        pickColor.visibility = "collapsed";
    }
    else{
        pickBoard.visibility = "collapsed";
        pickColor.visibility = "visible";
    }

    this.Reset(args);
};

exports.Reset = (args)=>{
    var elem = args.object;
    var page = elem.page;

    if(elem.id == "btnNext"){
        var p1 = page.getViewById("btn1Ready");
        var p2 = page.getViewById("btn2Ready");

        p1.text = "Ready";
        p1.style = "background-color: #056abd;"
        p2.text = "Ready";
        p2.style = "background-color: #056abd;"
        page.bindingContext.ButtonImage();

    }
    else{
        var b3x3 = page.getViewById("btn3x3");
        var b4x4 = page.getViewById("btn4x4");
        
        b3x3.style = "width:45%";
        b3x3.stat = "";
        b4x4.style = "width:45%";
        b4x4.stat = "";
    }
};
