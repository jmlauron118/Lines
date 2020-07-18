const Observable = require("tns-core-modules/data/observable").Observable;
const ItemSpec = require("tns-core-modules/ui/layouts/grid-layout").ItemSpec;
const GridUnitType = require("tns-core-modules/ui/layouts/grid-layout").GridUnitType;
const Image = require("tns-core-modules/ui/image").Image;
const Gestures = require("tns-core-modules/ui/gestures").GestureTypes;
const Toast = require("nativescript-toast").makeText;
const Dialog = require("tns-core-modules/ui/dialogs");
const General = require("~/modules/general");
const FrameModule = require("tns-core-modules/ui/frame");    
const timerModule = require("tns-core-modules/timer");

function GamePlayViewModel(){
    let viewModel = new Observable();
    let boardSelected = "";
    let colorByPlayer = {};
    let lastSelected = "";
    let gameMode = "";
    var turnTime = 10;
    var timer;
     
    viewModel.GetGameMode = (mode)=>{
        gameMode = mode;
        viewModel.set("getMode", gameMode);
        viewModel.set("turnTime", turnTime);
    };

    viewModel.InitBoard = (page, boardMode)=>{
        var board = page.getViewById("board-container");
        var count = 0;

        try{
            if(boardMode == 1){
                for(let star = 0; star < 3; star++){
                    let row = new ItemSpec(1,GridUnitType.STAR); 
                    let col = new ItemSpec(1,GridUnitType.STAR); 
     
                    board.addRow(row);
                    board.addColumn(col);
                }

                for(let row = 0; row < 3; row++){
                     for(let col = 0; col < 3; col++){
                         let image = new Image();
                         
                         image.col = col;
                         image.row = row;
                         image.src = "~/images/blank.png";
                         image.style = "margin:5em;";
                         image.id = "btn" + (count++);
                         image.on(Gestures.tap, viewModel.SelectEvent);
                         board.addChild(image);
                     }
                }
             }
             else{
                 for(let star = 0; star < 4; star++){
                     let row = new ItemSpec(1,GridUnitType.STAR); 
                     let col = new ItemSpec(1,GridUnitType.STAR); 
      
                     board.addRow(row);
                     board.addColumn(col);
                 }
      
                 for(let row = 0; row < 4; row++){
                      for(let col = 0; col < 4; col++){
                          let image = new Image();
                          
                          image.col = col;
                          image.row = row;
                          image.src = "~/images/blank.png"
                          image.style = "margin:5em;";
                          image.id = "btn" + (count++);
                          image.on(Gestures.tap, viewModel.SelectEvent);
      
                          board.addChild(image);
                      }
                 }
             }
        }
        catch(ex){
            console.log(ex);
        }
    };
    
    viewModel.NewGame = (page, boardMode, isContinue)=>{
        if(!isContinue){
            viewModel.set("p1Score", 0);
            viewModel.set("p2Score", 0);
        }

        if(boardMode == 1){
            var bottomCount = 6;

            for(let i = 0; i< 3; i++){
                var topButton = page.getViewById("btn"+i);
                var bottomButton = page.getViewById("btn"+(bottomCount++));

                topButton.src = "~/images/"+ global.pOneColor +".png";
                topButton.colorVal = global.pOneColor;
                topButton.value = "unselected";
                
                bottomButton.src = "~/images/"+ global.pTwoColor +".png";
                bottomButton.colorVal = global.pTwoColor;
                bottomButton.value = "unselected";
            }
        }
        else{
            var bottomCount = 12;

            for(let i = 0; i< 4; i++){
                var topButton = page.getViewById("btn"+i);
                var bottomButton = page.getViewById("btn"+(bottomCount++));

                topButton.src = "~/images/"+ global.pOneColor +".png";
                topButton.colorVal = global.pOneColor;
                topButton.value = "unselected";
                
                bottomButton.src = "~/images/"+ global.pTwoColor +".png";
                bottomButton.colorVal = global.pTwoColor;
                bottomButton.value = "unselected";
            }
        }

        colorByPlayer = [
            {
                player: "Player 1",
                color: global.pOneColor
            },
            {
                player: "Player 2",
                color: global.pTwoColor
            }
        ];
        
        viewModel.PlayerTurn(page);
    };

    viewModel.RushMode = (page)=>{
        timer = timerModule.setInterval(()=>{
            viewModel.set("turnTime", turnTime--);

            if(turnTime == -1){
                viewModel.PlayerTurn(page); 
            }
        },1000);
    };

    viewModel.PlayerTurn = (page)=>{
        if(gameMode === "rush"){
            if(global.hasSelected != undefined && global.hasSelected != ""){
                var btn = page.getViewById(global.hasSelected);
                btn.src = "~/images/"+ btn.colorVal +".png";
                btn.value = "unselected";  
                global.hasSelected = "";
            }

            turnTime = 10;
            timerModule.clearInterval(timer); 
            viewModel.RushMode(page);
        } 
        
        var turnText1 = page.getViewById("turn-text1");   
        var turnText2 = page.getViewById("turn-text2"); 
        
        if(turnText1.text == ""){
            var rand = Math.floor((Math.random()*2) + 1); 

            turnText1.text = "Player " + rand + "'s Turn";
            turnText1.color = rand == 1 ? global.pOneColor: global.pTwoColor;
            turnText2.text = "Player " + rand + "'s Turn";
            turnText2.color = rand == 1 ? global.pOneColor: global.pTwoColor;
            global.playerTurnColor = rand == 1 ? global.pOneColor: global.pTwoColor;
        }
        else{
            if(turnText1.text.includes("1")){
                turnText1.text = "Player 2's Turn";
                turnText1.color = global.pTwoColor;
                turnText2.text = "Player 2's Turn";
                turnText2.color = global.pTwoColor;
                global.playerTurnColor = global.pTwoColor;
            }
            else{
                turnText1.text = "Player 1's Turn";
                turnText1.color = global.pOneColor;
                turnText2.text = "Player 1's Turn";
                turnText2.color = global.pOneColor;
                global.playerTurnColor = global.pOneColor;
            }
        }
    };

    viewModel.SelectEvent = (args)=>{
        var button = args.object;  

        if(button.value == "unselected"){
            if(button.colorVal.includes(global.playerTurnColor)){
                if(global.hasSelected == "" || global.hasSelected == button.id){
                    button.src = "~/images/"+ button.colorVal +"_selected.png";
                    button.value = "selected";
                    global.hasSelected = button.id;
                    lastSelected = args;
                }
            }
        }
        else if(button.value == "selected"){
            if(button.colorVal.includes(global.playerTurnColor)){
                button.src = "~/images/"+ button.colorVal +".png";
                button.value = "unselected";
                global.hasSelected = "";
            }
        }
        else{
            if(global.hasSelected != ""){
                viewModel.ButtonNavigation(args);
            }
        }
    };

    viewModel.ButtonNavigation = (args)=>{
        var currentSelected = args.object;
        var page = currentSelected.page;
        var formerButtonSelected = page.getViewById(global.hasSelected);
        var currentSelectedNumber = currentSelected.id.replace("btn", "");
        var buttonAccess = [];
 
        if(global.boardMode == 1){
            buttonAccess = [  
                {"button": "btn0", "canJump":[1,3,4]},
                {"button": "btn1", "canJump":[0,2,3,4,5]},
                {"button": "btn2", "canJump":[1,4,5]},
                {"button": "btn3", "canJump":[0,1,4,6,7]},
                {"button": "btn4", "canJump":[0,1,2,3,5,6,7,8]},
                {"button": "btn5", "canJump":[1,2,4,7,8]},
                {"button": "btn6", "canJump":[3,4,7]},
                {"button": "btn7", "canJump":[3,4,5,6,8]},
                {"button": "btn8", "canJump":[4,5,7]}
            ];
        }
        else{
            buttonAccess = [
                {"button": "btn0", "canJump":[1,4,5]},
                {"button": "btn1", "canJump":[0,2,4,5,6]},
                {"button": "btn2", "canJump":[1,3,5,6,7]},
                {"button": "btn3", "canJump":[2,6,7]},
                {"button": "btn4", "canJump":[0,1,5,8,9]},
                {"button": "btn5", "canJump":[0,1,2,4,6,8,9,10]},
                {"button": "btn6", "canJump":[1,2,3,5,7,9,10,11]},
                {"button": "btn7", "canJump":[2,3,6,10,11]},
                {"button": "btn8", "canJump":[4,5,9,12,13]},
                {"button": "btn9", "canJump":[4,5,6,8,10,12,13,14]},
                {"button": "btn10", "canJump":[5,6,7,9,11,13,14,15]},
                {"button": "btn11", "canJump":[6,7,10,14,15]},
                {"button": "btn12", "canJump":[8,9,13]},
                {"button": "btn13", "canJump":[8,9,10,12,14]},
                {"button": "btn14", "canJump":[9,10,11,13,15]},
                {"button": "btn15", "canJump":[10,11,14]}
            ];
        }

        var getAccess = buttonAccess.filter((e)=>{
            return e.button == global.hasSelected;
        });

        if(getAccess[0].canJump.includes(+currentSelectedNumber)){
            currentSelected.src = "~/images/"+ formerButtonSelected.colorVal +".png";
            formerButtonSelected.src = "~/images/blank.png";

            currentSelected.colorVal = formerButtonSelected.colorVal;
            formerButtonSelected.colorVal = "";

            currentSelected.value = "unselected"; 
            formerButtonSelected.value = "";
            global.hasSelected = ""; 

            viewModel.WinChecker(args).then((res)=>{
                if(res.hasWinner){
                    timerModule.clearInterval(timer);
                    viewModel.WinnerResult(res, page);
                }
                else{
                    viewModel.PlayerTurn(page);
                }
            });     
        }
    };

    viewModel.WinChecker = (args)=>{
        return new Promise((resolve, reject) =>{
            var elem = args.object;
            var page = elem.page;
            var playerInfo = colorByPlayer.filter((e)=>{
                return e.color == elem.colorVal;
            });
            var result = [];
            result.hasWinner = false;

            if(global.boardMode == 1){
                //Horizontal win checker
                if(playerInfo[0].player.includes("1")){
                    if(page.getViewById("btn6").colorVal == playerInfo[0].color &&
                        page.getViewById("btn7").colorVal == playerInfo[0].color &&
                        page.getViewById("btn8").colorVal == playerInfo[0].color){
                            result.hasWinner = true;
                    }
                }
                else{
                    if(page.getViewById("btn0").colorVal == playerInfo[0].color &&
                        page.getViewById("btn1").colorVal == playerInfo[0].color &&
                        page.getViewById("btn2").colorVal == playerInfo[0].color){
                            result.hasWinner = true;
                    }
                }

                if(page.getViewById("btn3").colorVal == playerInfo[0].color &&
                    page.getViewById("btn4").colorVal == playerInfo[0].color &&
                    page.getViewById("btn5").colorVal == playerInfo[0].color){
                        result.hasWinner = true;
                }

                //Vertical win checker
                if(page.getViewById("btn0").colorVal == playerInfo[0].color &&
                    page.getViewById("btn3").colorVal == playerInfo[0].color &&
                    page.getViewById("btn6").colorVal == playerInfo[0].color){
                        result.hasWinner = true;
                }
                else if(page.getViewById("btn1").colorVal == playerInfo[0].color &&
                    page.getViewById("btn4").colorVal == playerInfo[0].color &&
                    page.getViewById("btn7").colorVal == playerInfo[0].color){
                        result.hasWinner = true;
                }
                else if(page.getViewById("btn2").colorVal == playerInfo[0].color &&
                    page.getViewById("btn5").colorVal == playerInfo[0].color &&
                    page.getViewById("btn8").colorVal == playerInfo[0].color){
                        result.hasWinner = true;
                }

                //Diagonal win checker
                if(page.getViewById("btn0").colorVal == playerInfo[0].color &&
                    page.getViewById("btn4").colorVal == playerInfo[0].color &&
                    page.getViewById("btn8").colorVal == playerInfo[0].color){
                        result.hasWinner = true;
                }
                else if(page.getViewById("btn2").colorVal == playerInfo[0].color &&
                    page.getViewById("btn4").colorVal == playerInfo[0].color &&
                    page.getViewById("btn6").colorVal == playerInfo[0].color){
                        result.hasWinner = true;
                }
            }
            else{
                //Horizontal win checker
                if(playerInfo[0].player.includes("1")){
                    if(page.getViewById("btn12").colorVal == playerInfo[0].color &&
                        page.getViewById("btn13").colorVal == playerInfo[0].color &&
                        page.getViewById("btn14").colorVal == playerInfo[0].color &&
                        page.getViewById("btn15").colorVal == playerInfo[0].color){
                            result.hasWinner = true;
                    }
                }
                else{
                    if(page.getViewById("btn0").colorVal == playerInfo[0].color &&
                        page.getViewById("btn1").colorVal == playerInfo[0].color &&
                        page.getViewById("btn2").colorVal == playerInfo[0].color &&
                        page.getViewById("btn3").colorVal == playerInfo[0].color){
                            result.hasWinner = true;
                    }
                }

                if(page.getViewById("btn4").colorVal == playerInfo[0].color &&
                    page.getViewById("btn5").colorVal == playerInfo[0].color &&
                    page.getViewById("btn6").colorVal == playerInfo[0].color &&
                    page.getViewById("btn7").colorVal == playerInfo[0].color){
                        result.hasWinner = true;
                }
                else if(page.getViewById("btn8").colorVal == playerInfo[0].color &&
                    page.getViewById("btn9").colorVal == playerInfo[0].color &&
                    page.getViewById("btn10").colorVal == playerInfo[0].color &&
                    page.getViewById("btn11").colorVal == playerInfo[0].color){
                        result.hasWinner = true;
                }

                //Vertical win checker
                if(page.getViewById("btn0").colorVal == playerInfo[0].color &&
                    page.getViewById("btn4").colorVal == playerInfo[0].color &&
                    page.getViewById("btn8").colorVal == playerInfo[0].color &&
                    page.getViewById("btn12").colorVal == playerInfo[0].color){
                        result.hasWinner = true;
                }
                else if(page.getViewById("btn1").colorVal == playerInfo[0].color &&
                    page.getViewById("btn5").colorVal == playerInfo[0].color &&
                    page.getViewById("btn9").colorVal == playerInfo[0].color &&
                    page.getViewById("btn13").colorVal == playerInfo[0].color){
                        result.hasWinner = true;
                }
                else if(page.getViewById("btn2").colorVal == playerInfo[0].color &&
                    page.getViewById("btn6").colorVal == playerInfo[0].color &&
                    page.getViewById("btn10").colorVal == playerInfo[0].color &&
                    page.getViewById("btn14").colorVal == playerInfo[0].color){
                        result.hasWinner = true;
                }
                else if(page.getViewById("btn3").colorVal == playerInfo[0].color &&
                    page.getViewById("btn7").colorVal == playerInfo[0].color &&
                    page.getViewById("btn11").colorVal == playerInfo[0].color &&
                    page.getViewById("btn15").colorVal == playerInfo[0].color){
                        result.hasWinner = true;
                }

                //Diagonal win checker
                if(page.getViewById("btn0").colorVal == playerInfo[0].color &&
                    page.getViewById("btn5").colorVal == playerInfo[0].color &&
                    page.getViewById("btn10").colorVal == playerInfo[0].color &&
                    page.getViewById("btn15").colorVal == playerInfo[0].color){
                        result.hasWinner = true;
                }
                else if(page.getViewById("btn3").colorVal == playerInfo[0].color &&
                    page.getViewById("btn6").colorVal == playerInfo[0].color &&
                    page.getViewById("btn9").colorVal == playerInfo[0].color &&
                    page.getViewById("btn12").colorVal == playerInfo[0].color){
                        result.hasWinner = true;
                }
            }

            result.player = playerInfo[0].player;
            resolve(result);
        });
    };

    viewModel.WinnerResult = (data, page)=>{ 
        var boardContainer = page.getViewById("board-container");
        Toast(data.player +" wins!").show();

        if(data.player.includes("1")){
            viewModel.set("p1Score", viewModel.get("p1Score")+1);
        }
        else{
            viewModel.set("p2Score", viewModel.get("p2Score")+1);
        }

        Dialog.confirm({
            title: data.player +" wins!",
            message: "Do you want to play again?",
            okButtonText: "Yes",
            cancelButtonText: "No",
            neutralButtonText: "Reset"
        }).then(function(result) {
            boardContainer.rows="";
            boardContainer.columns="";
            boardContainer.removeChildren();

            if(result == true){
                viewModel.InitBoard(page, global.boardMode);
                viewModel.NewGame(page, global.boardMode, true);
            }
            else if(result == false){
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
                viewModel.InitBoard(page, global.boardMode);
                viewModel.NewGame(page, global.boardMode, false);
            }

            General.FullScreenMode();
        });
    };

    return viewModel;  
}

module.exports = GamePlayViewModel; 