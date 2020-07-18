const Observable = require("tns-core-modules/data/observable");
let closeCallBack;

exports.OnShowModally = (args)=>{
    const page = args.object;
    const context = args.context;

    closeCallBack = args.closeCallBack;
    page.bindingContext = Observable.fromObject(context);
};