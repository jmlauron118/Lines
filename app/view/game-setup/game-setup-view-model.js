const Observable = require("tns-core-modules/data/observable").Observable;

function GameSetupViewModel(){
    const viewModel = new Observable();
    var pOneColor = "";
    var pTwoColor = "";
    var gameMode = "";

    viewModel.ButtonImage = ()=>{
        viewModel.set("p1ImageUrl", "~/images/blue.png");
        viewModel.set("p2ImageUrl", "~/images/red.png");
        viewModel.set("p1Color", "blue");
        viewModel.set("p2Color", "red");
    };

    return viewModel;
}

module.exports = GameSetupViewModel;