const _fetch = require('../Controller/fetchingData.js')

//0-> open/close
//1->number order finish
//2->order

//   Arrays   //

exports.DBranches = function DBranches() { return _fetch.Details_Branch }
exports.DOrders = function DOrders() { return _fetch.Details_Orders }
dict=_fetch.Details_Branch.dict
exports.open_close=function open_close(ArraysBranch){
    /* Random Branches */
    let randomBranche
    let Branches_size = Object.keys(ArraysBranch).length;
    let i = Math.floor(Math.random() * Branches_size);
    var _Branche =ArraysBranch[i];
    const randomNumber = Math.floor(Math.random() * 24);
    console.log(randomNumber);
    if(randomNumber>=0 && randomNumber<=3 && dict[_Branche[0]].length<2){
        dict[_Branche[0]][0]="close";
    }else{
        dict[_Branche[0]][0]="open"; 
    }
    const j = Math.floor(Math.random() * 12);
    if(j<6){
     randomBranche = `{"0": "${`{"Branche_Name": "${_Branche[0]}" ,"Open/Close":"${ dict[_Branche[0]][0]}"}`}}`;
    }else{
        randomBranche="empty" 
    }
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
   // console.log(randomNumber);
    if(randomNumber>=0 && randomNumber<=3){
        dict[_Branche[0]][0]={0:"close"};
    }else{
        dict[_Branche[0]][0]={0:"open"}; 
    }

}

if(dict[_Branche[0]][0][0]=="open"){
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
    var amount=Math.floor(Math.random() * 10)+1;
    var lst_Top=new Set();
    for (let i = 0; i <amount; i++) {
        lst_Top.add(randomTopping());
      }
      return lst_Top;
}

function status(){
    var _NumOrder=_NumOrder=Date.now() + Math.trunc((Math.random()*85684)); 
    dict[_Branche[0]].push({1:[_NumOrder, "in process"]});
    return  _NumOrder;
}
var _Top = Array.from(list_topping());
randomOrders = `{"2": "${`{"Branche_Name": "${_Branche[0]}", "Area:${_Area}","status: ${"in process"}","Date": "${today()}", "Branche_Number": "${_BrancheNum}", "Topping": "${_Top})}", "Number_Order": ${status()}}"`}}`;


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
        const j = Math.floor(Math.random() * (dict[_Branche[0]].length - 1)) + 1;
        num=dict[_Branche[0]][j][1][0]
        delete dict[_Branche[0]][j][1][1]
        return randomBranche = `{"1": "${`{"Branche_Name": "${_Branche[0]}" ,"Number_Order": ${num}","status":"${"finish"}"}`}}`;

    }else{
        return "empty"

    }   
}    
    