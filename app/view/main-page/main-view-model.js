const Observable = require("tns-core-modules/data/observable").Observable;

function MainPageViewModel(){
    let viewModel = new Observable();
    viewModel.set("playtext", String.fromCharCode(0xf04b));

    return viewModel;
}

module.exports = MainPageViewModel; 
