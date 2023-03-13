
var map_Branches = [
    ["Kiryat_Motzkin", 0],
    ["Kiryat_Ata", 0],
    ["Zichron_Yaakov", 0],
    ["Ramat_Yishai", 0],
    ["Haifa_Moriah", 0],
    ["Haifa_a_German_colony", 0],
    ["Haifa_Technion", 0],
    ["Haifa", 0],
    ["Acre", 0],
    ["Nazareth", 0],
    ["Beit_Shean", 0],
    ["Nahariya", 0],
    ["Tiberias", 0],
    ["Yakneam", 0],
    ["Yercha", 0],
    ["Carmiel", 0],
    ["Maalot", 0],
    ["Eilat_Promenade", 1],
    ["Eilat_the_Red_Mall", 1],
    ["Ashkelon", 1],
    ["Sheva_Beer_Avisror", 1],
    ["Beer_heva_MALL", 1],
    ["Kiryat_Gat", 1],
    ["Dimona", 1],
    ["Mitzpe_Ramonona", 1],
    ["Be'er_Ya'akov", 2],
    ["Gedera", 2],
    ["Yavne", 2],
    ["Ramle_Lod", 2],
    ["Rosh_Haayin", 2],
    ["Rehovot", 2],
    ["Rehovot_Billo Center", 2],
    ["Ness_Ziona", 2],
    ["Modiin", 2],
    ["Shoham", 2],
    ["Rishon_LeZion_West", 3],
    ["Rishon_LeZion_Mizrah",3],
    ["Petah_Tikva_Sirkin", 3],
    ["Petah_Tikva_Beilinson", 3],
    ["Petah_Tikva_Kfar Ganim", 3],
    ["Tel_Aviv_Ramat Aviv", 3],
    ["Tel_Aviv_Hasmoneans", 3],
    ["Tel_Aviv_Yad_Eliyahu", 3],
    ["Ramat_Gan_the_city_center", 3],
    ["Ramat_Gan_Marom_Neve", 3],
    ["Yehud", 3],
    ["Holon_East", 3],
    ["West_Holon", 3],
    ["Bneiֹ_Brak", 3],
    ["Kfar Kara", 4],
    ["Hadera", 4],
    ["Or Akiva", 4],
    ["Taiba", 4],
    ["Kafr_Qasim", 4],
    ["Kfar_Sava", 4],
    ["Raanana", 4],
    ["Hod_Hasharon", 4],
    ["Netanya_city_center", 4],
    ["Netanya_Poleg", 4],
    ["Herzliya", 4],
    ["Ramat_Hasharon", 4],
    ["Jerusalem_Ramot", 5],
    ["Jerusalem_Niyot", 5],
    ["Jerusalem_Ben_Hillel", 5],
    ["Jerusalem_Talpiot", 5],
    ["Jerusalem_central_station", 5],
    ["Jerusalem_Malcha", 5],
    ["Jerusalem_BeiT_Hanina", 5],
    ["Mevaseret_Zion", 5],
    ["Jerusalem_Ben_Hillel", 5]
];

var Area=["North","South","Lowland","Central","Sharon","Jerusalem"];

var Toppings =  ["Olives", "Mushrooms", "Bulgarian", "Onion", "Tomato","corn","eggplant","pepper"];

var branch_number = [18139651592525, 806424026641103, 95800948021997, 254992619777344, 302129577241576,
847099, 282129, 207870, 208770, 746420, 260712288378, 261005756989437, 808840,529549,
711109,347591, 682051,040421,775249,753481,548771,080051,660810,743320,552299,
64324720345909,907822,387793892223776,3933910,981899,670130,722549,497670,
651331,706692,758850,158482,729408,3043072,511471,720139,911049,525261,939529,905418,532770,958149,936081,061440,86100,670130,777828,679482,840801,
12199,929430,866949,214691,304380,656700,661049,362820,668789,973572,744711,
908569,361891,7048779,100121,783451];


  /*
  Details Branch:
   -Branch Name
   -Area Name
   -Branch Number
  */
  
 var dict={"Kiryat_Motzkin":[] ,"Kiryat_Ata": [],
 "Zichron_Yaakov": [], "Ramat_Yishai":[], "Haifa_Moriah":[],
 "Haifa_a_German_colony":[],
 "Haifa_Technion":[],
 "Haifa":[],
"Acre":[],
"Nazareth":[],
"Beit_Shean":[],
"Nahariya":[],
"Tiberias": [],
"Yakneam":[],
"Yercha":[],
"Carmiel":[],
"Maalot":[],
"Eilat_Promenade":[],
"Eilat_the_Red_Mall":[],
"Ashkelon":[],
"Sheva_Beer_Avisror":[],
"Beer_heva_MALL":[],
"Kiryat_Gat":[],
"Dimona":[],
"Mitzpe_Ramonona":[],
"Be'er_Ya'akov":[],
"Gedera":[],
"Yavne":[],
"Ramle_Lod":[],
"Rosh_Haayin":[],
"Rehovot":[],
"Rehovot_Billo Center":[],
"Ness_Ziona":[],
"Modiin":[],
"Shoham":[],
"Rishon_LeZion_West":[],
"Rishon_LeZion_Mizrah":[],
"Petah_Tikva_Sirkin":[],
"Petah_Tikva_Beilinson":[],
"Petah_Tikva_Kfar Ganim":[],
"Tel_Aviv_Ramat Aviv":[],
"Tel_Aviv_Hasmoneans":[],
"Tel_Aviv_Yad_Eliyahu":[],
"Ramat_Gan_the_city_center":[],
"Ramat_Gan_Marom_Neve":[],
"Yehud":[],
"Holon_East":[],
"West_Holon":[],
"Bneiֹ_Brak":[],
"Kfar Kara":[],
"Hadera":[],
"Or Akiva":[],
"Taiba":[],
"Kafr_Qasim":[],
"Kfar_Sava":[],
"Raanana":[],
"Hod_Hasharon":[],
"Netanya_city_center":[],
"Netanya_Poleg":[],
"Herzliya":[],
"Ramat_Hasharon":[],
"Jerusalem_Ramot":[],
"Jerusalem_Niyot":[],
"Jerusalem_Ben_Hillel":[],
"Jerusalem_Talpiot":[],
"Jerusalem_central_station":[],
"Jerusalem_Malcha":[],
"Jerusalem_BeiT_Hanina":[],
"Mevaseret_Zion":[],
"Jerusalem_Ben_Hillel":[]};

var Details_Branch = {
    BranchName:map_Branches,
    AreaName:Area,
    BranchNumber:branch_number,
    dict:dict
}

  /*
  Details Orders:
   -Toppings
  */


var Details_Orders = {
    Toppings:Toppings
}

// j=[1,{}];
// j[1][1]="4"
// j[1][2]="5"
// console.log(j[1][2])
// delete j[1][2]
// console.log(j[1][2])


module.exports= {Details_Branch, Details_Orders}


