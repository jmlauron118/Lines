const MainPageViewModel = require("./main-view-model");
const FrameModule = require("tns-core-modules/ui/frame");
const General = require("~/modules/general");

exports.onNavigatingTo = (args)=> {
    const page = args.object;

    page.bindingContext = new MainPageViewModel();
    global.pOneColor = "";
    global.pTwoColor = "";
    global.hasSelected = "";
}

exports.onPageLoaded = (args)=>{
    General.FullScreenMode(args);
};

exports.Play = (args)=>{
    try{
        FrameModule.topmost().navigate({
            moduleName: "~/view/game-mode/game-mode-page",
            animated: true,
            transition: { 
                name: "fade",
                duration: 250,
                curve: "easeInOut"  
            },
            context: {
                pOneColor: "green",
                pTwoColor: "orange"
            }
        });
    }
    catch(ex){
        console.log(ex);
    }
};
