const _fetch = require('../Controller/fetchingData.js')

// 0-> open/close
// 1->number order finish
// 2->order

// Arrays   //

exports.DBranches = function DBranchs() {
    return _fetch.Details_Branch
}
exports.DOrders = function DOrders() {
    return _fetch.Details_Orders
}

function today() {
    date = new Date().setHours(Math.floor(Math.random() * 24), 0, 0, 0);
    return date;
}

dict = _fetch.Details_Branch.dict
exports.open_close = function open_close(ArraysBranch) { /* Random Branchs */
    let randomBranch
    let Branchs_size = Object.keys(ArraysBranch).length;
    let i = Math.floor(Math.random() * Branchs_size);
    var _Branch = ArraysBranch[i];
    const randomNumber = Math.floor(Math.random() * 24);
    console.log(randomNumber);
    if (randomNumber >= 0 && randomNumber <= 3 && dict[_Branch[0]].length < 2) {
        dict[_Branch[0]][0] = "close";
    } else {
        dict[_Branch[0]][0] = "open";
    }
    const j = Math.floor(Math.random() * 12);
    result = {}
    if (j < 6) {
        result = {
            "0": {
                "Branch_Name": _Branch[0],
                "Open/Close": dict[_Branch[0]][0]
            }
        }
    } else {
        return "empty"
    }
    return JSON.stringify(result)
}


exports.Orders = function Orders(ArraysBranch, ArraysNumBranch, ArraysArea, ArraysTopping) { /* Random Branchs */
    let randomOrders;
    let Branchs_size = Object.keys(ArraysBranch).length;
    let i = Math.floor(Math.random() * Branchs_size);
    var _Branch = ArraysBranch[i];
    var _BranchNum = ArraysNumBranch[i];
    var _Area = ArraysArea[_Branch[1]];
    if (dict[_Branch[0]][0] != "open" || dict[_Branch[0]][0] != "close") {
        const randomNumber = Math.floor(Math.random() * 24);
        // console.log(randomNumber);
        if (randomNumber >= 0 && randomNumber <= 3) {
            dict[_Branch[0]][0] = {
                0: "close"
            };
        } else {
            dict[_Branch[0]][0] = {
                0: "open"
            };
        }

    }

    if (dict[_Branch[0]][0][0] == "open") {
        /* Date */

        /* Random topping */
        function randomTopping() {
            var id = Math.floor(Math.random() * ArraysTopping.length);
            return ArraysTopping[id];
        }

        function list_topping() {
            var amount = Math.floor(Math.random() * 4);
            var lst_Top = new Set();
            for (; lst_Top.size<amount;) {
                const top = randomTopping();
                if (top == "Olives") {
                    if (Math.round(Math.random()) == 1){
                        lst_Top.add("Onion");
                    } 
                }
                if (top == "Mushrooms") {
                    if (Math.round(Math.random()) == 1){
                        lst_Top.add("corn");
                    }
                }
                if (top == "Bulgarian") {
                    if (Math.round(Math.random()) == 1){
                        lst_Top.add("Tomato");
                    }
                }
                if (top == "eggplant") {
                    if (Math.round(Math.random()) == 1){
                        lst_Top.add("pepper");
                    }
                }
                lst_Top.add(top);
            }
            return lst_Top;
        }

        var date = today();
        function status() {
            var _NumOrder = _NumOrder = Date.now() + Math.trunc((Math.random() * 85684));
            dict[_Branch[0]].push({
                1: [_NumOrder, "in process", date]
            });
            return _NumOrder;
        }
        var _Top = Array.from(list_topping());
        result = {
            "2": {
                "Branch_Name": _Branch[0], "Area": _Area, "status": "in process", "Date": date, "Branch_Number": _BranchNum, "Topping": _Top, "Number_Order": status()
            }
        };
        randomOrders = JSON.stringify(result)


    } else {

        randomOrders = "empty";
    }

    return randomOrders
}


exports._sta = function _sta(ArraysBranch, ArraysArea) {
    let Branchs_size = Object.keys(ArraysBranch).length;
    let i = Math.floor(Math.random() * Branchs_size);
    var _Branch = ArraysBranch[i];
    var _Area = ArraysArea[_Branch[1]];

    if (dict[_Branch[0]].length >= 2) {
                const j = Math.floor(Math.random() * (dict[_Branch[0]].length - 1)) + 1;
                num = dict[_Branch[0]][j][1][0]
                date = new Date(dict[_Branch[0]][j][1][2])
                delete dict[_Branch[0]][j][1][1]
                result = {
                    "1": {
                        "Branch_Name": _Branch[0],
                        "Area": _Area,
                        "Number_Order": num,
                        "status": "finish",
                        "Date": date.setHours(Math.round(date.getHours() == 23 ? 0 : Math.random() * 23) + date.getHours(), Math.floor(Math.random() * (59 - date.getMinutes())) + date.getMinutes(), 0, 0)
                    }
                }
                return JSON.stringify(result)

            } else {
                return "empty"
            }
        }
