var lufthansaManager = function(){
  this.subtree = true;
};
lufthansaManager.prototype.getList = function(){
  var rawList = document.getElementsByClassName("cell segments");
  console.log("raw list");
  console.log(rawList);
  var processedList = [];
  for(var x = 0, i = rawList.length; x < i; x++){
    var rawStops = rawList[x].getElementsByTagName('abbr');
    var stops = [];
    for(var y = 1, j = rawStops.length; y < j-1; y += 2){
      stops.push(rawStops[y].innerHTML);
    }
    var aircrafts = [];
    var aircraftsDiv = rawList[x].getElementsByClassName("aircraft");
    segment = rawList[x].getElementsByClassName("segment-info");
    var a = 0;
    for(y = 0, j = segment.length; y < j; y++){
      if(segment[y].childNodes[1].childNodes.length > 7){
        aircrafts.push(aircraftsDiv[a++].alt.split(" ").pop());
      }
      else{
        aircrafts.push("A380"); // default aircraft if aircraft not specified;
      }
    }
    processedList.push({
      depart: rawStops[0].innerHTML,
      arrive: rawStops[rawStops.length - 1].innerHTML,
      stops: stops,
      aircraft: "A380" //hardcoded for now
    });
  }
  console.log("--- initial list ---");
  console.log(processedList);
  return processedList;
};

lufthansaManager.prototype.getCoordinates = function(processedList){
  processedList = core.getCoordinates(processedList);
  console.log("--- got coordinates ---");
  console.log(processedList);
  return processedList;
};

lufthansaManager.prototype.getDistances = function(processedList){
    for(var x = 0, i = processedList.length; x < i; x++){
        processedList[x].distance = 0;
    console.log(processedList[x]);
      if(processedList[x].stopCoordinatesNew){
          noOfStops = processedList[x].stopCoordinatesNew.length;
          console.log(noOfStops);
      processedList[x].distance += core.getDistance(processedList[x].departCoordinates.lat, processedList[x].departCoordinates.lon,
                                                   processedList[x].stopCoordinatesNew[0].lat, processedList[x].stopCoordinatesNew[0].lon) +
              core.getDistance(processedList[x].stopCoordinatesNew[noOfStops-1].lat, processedList[x].stopCoordinatesNew[noOfStops-1].lon,
                               processedList[x].arriveCoordinates.lat, processedList[x].arriveCoordinates.lon);
          for(var y = 0; y < noOfStops-1 ; y++){
              console.log("Totally working fine");
              processedList[x].distance += core.getDistance(processedList[x].stopCoordinatesNew[y].lat,processedList[x].stopCoordinatesNew[y].lon,processedList[x].stopCoordinatesNew[y+1].lat,processedList[x].stopCoordinatesNew[y+1].lon);
          }
    }
    else{
      processedList[x].distance += core.getDistance(processedList[x].departCoordinates.lat, processedList[x].departCoordinates.lon,
                                                   processedList[x].arriveCoordinates.lat, processedList[x].arriveCoordinates.lon);
    }
  }
  console.log("---got distances---");
  console.log(processedList);
  return processedList;
};

lufthansaManager.prototype.getEmission = function(processedList){
  processedList = core.getEmission(processedList);
  console.log("---got fuel consumption---");
  console.log(processedList);
  return processedList;
};

lufthansaManager.prototype.insertInDom = function(processedList){
  insertIn = document.getElementsByClassName("flight wdk-line");
  for(var x = 0, i = insertIn.length; x < i; x++){
    var insert = insertIn[x].getElementsByClassName("description")[0];
    if(insert.getElementsByClassName("carbon").length === 0){
         insert.appendChild(core.createMark(processedList[x].co2Emission));
    }
    //console.log(insertIn[x].childNodes[1].childNodes[1]);
  }
};

lufthansaManager.prototype.update = function(){
  var processedList = this.getList();
  if(core.airplanesData && core.airportsData){
    processedList = this.getCoordinates(processedList);
    processedList = this.getDistances(processedList);
    processedList = this.getEmission(processedList);
    this.insertInDom(processedList);
  }
};
var FlightManager = lufthansaManager;
