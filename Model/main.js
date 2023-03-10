const _fetch = require('../Controller/fetchingData.js')


//   Arrays   //

exports.DBranches = function DBranches() { return _fetch.Details_Branch }
exports.DOrders = function DOrders() { return _fetch.Details_Orders }
dict=_fetch.Details_Branch.dict
exports.open_close=function open_close(ArraysBranch){
    /* Random Branches */
    let Branches_size = Object.keys(ArraysBranch).length;
    let i = Math.floor(Math.random() * Branches_size);
    var _Branche =ArraysBranch[i];
    const randomNumber = Math.floor(Math.random() * 24);
    console.log(randomNumber);
    if(randomNumber>=0 && randomNumber<=3){
        dict[_Branche[0]][0]="close";
    }else{
        dict[_Branche[0]][0]="open"; 
    }
    
    let randomBranche = `{"Branche_Name": "${_Branche[0]}" ,"Open/Close":"${ dict[_Branche[0]][0]}"}`;
    return randomBranche
}




exports.Orders = function Orders(ArraysBranch,ArraysNumBranch,ArraysArea,ArraysTopping) {
/* Random Branches */
let randomOrders;
let Branches_size = Object.keys(ArraysBranch).length;
let i = Math.floor(Math.random() * Branches_size);
var _Branche =ArraysBranch[i];
var _BrancheNum=ArraysNumBranch[i];
var _Area=ArraysArea[_Branche[1]];
if(dict[_Branche[0]][0]!="open"||dict[_Branche[0]][0]!="close"){
    const randomNumber = Math.floor(Math.random() * 24);
    console.log(randomNumber);
    if(randomNumber>=0 && randomNumber<=3){
        dict[_Branche[0]][0]="close";
    }else{
        dict[_Branche[0]][0]="open"; 
    }

}

if(dict[_Branche[0]][0]=="open"){
/* Date */
function today() {
    date = new Date()
    return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()+','+date.getHours()+':'+date.getMinutes();
}

/* Random topping */
function randomTopping() {
 var id=Math.floor(Math.random() * ArraysTopping.length);
     return ArraysTopping[id];
}

function list_topping(){
    var amount=Math.floor(Math.random() * 10);
    var lst_Top=new Set();
    for (let i = 0; i <amount; i++) {
        lst_Top.add(randomTopping());
      }
      return lst_Top;
}

function status(){
    var _NumOrder=_NumOrder=Date.now() + Math.trunc((Math.random()*85684)); 
    dict[_Branche[0]].push(_NumOrder);
    return  _NumOrder;
}
var _Top = Array.from(list_topping());
randomOrders = `{"Branche_Name": "${_Branche[0]}", "Area:${_Area}","status: ${"in process"}","Date": "${today()}", "Branche_Number": "${_BrancheNum}", "Topping": "${_Top})}", "Number_Order": ${status()}}`;
}else{

 randomOrders = "empty";
}

return randomOrders
 }


 exports._sta= function _sta(ArraysBranch){
    let Branches_size = Object.keys(ArraysBranch).length;
    let i = Math.floor(Math.random() * Branches_size);
    var _Branche =ArraysBranch[i];
    if(dict[_Branche[0]].length>=2){
        console.log(dict[_Branche[0]].length+"len")
        const j = Math.floor(Math.random() * dict[_Branche[0]].length)+1;
        return randomBranche = `{"Number_Order": ${dict[_Branche[0]][j]} ,"finish"}`;

    }else{
        return "empty"

    }   
}    
    

// exports.status_finish=function status_finish(ArraysBranch){
//     let randomBranche;
//     let Branches_size = Object.keys(ArraysBranch).length;
//     let i = Math.floor(Math.random() * Branches_size);
//     var _Branche =ArraysBranch[i]
//     if(_Branche[0] in dict){
//         var status=dict[_Branche[0]][3]
//         const j = Math.floor(Math.random() * status.length);
//         randomBranche = `{"Number_Order": ${status[j]} ,"finish"}`;
//         return randomBranche
//     }else{
//          randomBranche = `{"not finish"}`;
//     }
//     return randomBranche
// }

// exports.status_finish=function status_finish(ArraysBranch){
//     let randomBranche="";
//     let Branches_size = Object.keys(ArraysBranch).length;
//     let i = Math.floor(Math.random() * Branches_size);
//     var _Branche =ArraysBranch[i]
//     if(_Branche[0] in dict){
//         var status=dict[_Branche[0]][3]
//         const j = Math.floor(Math.random() * status.length);
//         randomBranche = `{"Number_Order": ${status[j]} ,"finish"}`;
//     }
    
//     return randomBranche

// }

// function status_finish1(ArraysBranch) {
//     var delayTime = Math.floor(Math.random() * 300000) + 300000;
//     setTimeout(function(ArraysBranch) {
//         status_finish();
//     }, delayTime);
//   }
  
// const timeout = Math.floor(Math.random() * 300000) + 300000;
// exports.status_finish1= function status_finish1(){
//     setTimeout(() => status_finish(), timeout);
// }
