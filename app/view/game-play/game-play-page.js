const GamePlayViewModel = require("./game-play-view-model");
const Application = require("tns-core-modules/application");
const FrameModule = require("tns-core-modules/ui/frame");
const Dialog = require("tns-core-modules/ui/dialogs");
const Insomia = require("nativescript-insomnia");
const General = require("~/modules/general");
    
exports.NavigatingTo = (args)=>{
    var page = args.object;
    var context = args.context;
    global.count = 0;

    global.hasSelected = "";
    page.bindingContext = new GamePlayViewModel();
    global.pOneColor = context.pOneColor;
    global.pTwoColor = context.pTwoColor;
    page.bindingContext.GetGameMode(context.gMode);
    page.bindingContext.InitBoard(page, context.board);
    page.bindingContext.NewGame(page, context.board, false);

    if (Application.android) {
        Application.android.on(Application.AndroidApplication.activityBackPressedEvent, backEvent);
        global.onGame = true;
    }

    Insomia.keepAwake().then(function() {
        console.log("Insomnia is active");
    });
};

function backEvent(args) {  
    if(global.count == 0){
        global.count++;
        args.cancel = true; 
        if(global.onGame){
            Dialog.confirm({
                title: "Leave the game?",
                message: "Do you want to leave the game?",
                okButtonText: "Yes",
                cancelButtonText: "No"
            }).then((result)=>{
                if(result){
                    global.onGame = false;

                    FrameModule.topmost().navigate({
                        moduleName: "~/view/main-page/main-page",
                        animated: true,
                        clearHistory: true,
                        transition: {
                            name: "fade",
                            duration: 250,  
                            curve: "easeInOut"
                        }
                    });
                }
                else{
                    global.count = 0;
                    General.FullScreenMode(); 
                }
            });
        }
    }
}