const _fetch = require('../Controller/fetchingData.js')


//   Arrays   //

exports.DBranches = function DBranches() { return _fetch.Details_Branch }
exports.DOrders = function DOrders() { return _fetch.Details_Orders }



//*************************************//
//   Produce random orders for Kafka   //
//***********************************//

exports.Orders = function Orders(ArraysBranch,ArraysNumBranch,ArraysArea,ArraysTopping) {
    /* Date */
    function today() {
        date = new Date()
        return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()+','+date.getHours()+':'+date.getMinutes();
    }
    /* Random Branches */
    let Branches_size = Object.keys(ArraysBranch).length;

    function random_Branches_Id() {
        let i = Math.floor(Math.random() * Branches_size);
            return i
        }
    //_Branche=Name+Arae
    var id=random_Branches_Id();
    var _Branche =ArraysBranch[id];
    var _BrancheNum=ArraysNumBranch[id];
    var _Area=ArraysArea[_Branche[1]];
    //*******************************************************************************************************************//


   
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

    function Open_Or_Close(){
        var bol=["open","close"];
        var id=Math.floor(Math.random() * 2);
        return bol[id];
    }

    function status(){
        var bol=["finished","in progress"];
        var id=Math.floor(Math.random() * 2);
        return bol[id];
    }
    var _Top = Array.from(list_topping());

    var _bol=Open_Or_Close();
    var _status=status();

    var _NumOrder=Date.now() + Math.trunc((Math.random()*85684));

    //*******************************************************************************************************************//

   


    let randomOrders = `{"Branche_Name": "${_Branche[0]}", "Area:${_Area}","status: ${_status}","Open/Close":"${_bol}","Date": "${today()}", "Branche_Number": "${_BrancheNum}", "Topping": "${_Top})}", "Number_Order": ${_NumOrder}}`;
    return randomOrders
}
