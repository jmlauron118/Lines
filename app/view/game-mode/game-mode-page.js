const GameModeViewModel = require("./game-mode-view-model");
const General = require("~/modules/general");
const FrameModule = require("tns-core-modules/ui/frame");
const Toast = require("nativescript-toast").makeText;

exports.onNavigatingTo = (args)=>{
    const page = args.object;
    const context = args.context;

    page.bindingContext = new GameModeViewModel();
};

exports.onNormalTap = (args) =>{
    GameSetUp("normal");
};

exports.onRushTap = (args) =>{
    GameSetUp("rush");
};

function GameSetUp(mode){
    FrameModule.topmost().navigate({
        moduleName: "~/view/game-setup/game-setup-page",
        animated: true,
        transition: { 
            name: "fade",
            duration: 250,
            curve: "easeInOut"  
        },
        context: {
            pOneColor: "green",
            pTwoColor: "orange",
            mode: mode
        }
    });
}
