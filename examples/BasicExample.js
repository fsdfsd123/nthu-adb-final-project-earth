/*
 * Copyright 2003-2006, 2009, 2017, 2020 United States Government, as represented
 * by the Administrator of the National Aeronautics and Space Administration.
 * All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License
 * at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * NASAWorldWind/WebWorldWind also contains the following 3rd party Open Source
 * software:
 *
 *    ES6-Promise – under MIT License
 *    libtess.js – SGI Free Software License B
 *    Proj4 – under MIT License
 *    JSZip – under MIT License
 *
 * A complete listing of 3rd Party software notices and licenses included in
 * WebWorldWind can be found in the WebWorldWind 3rd-party notices and licenses
 * PDF found in code  directory.
 */
/**
* Illustrates how to build a basic WorldWind globe.
*/
var Equipment_db = [];
var Target_db = [];
var true_equipment_db = [];
var Project_db = [];
var Project_Target_db = [];
$(document).ready(function() {
   $.ajax({
       type: "GET",
       url: "dataset/User's_Equipment_db.tsv",
       dataType: "text",
       success: function(data) {Equipment_db = processData(data);}
    });
    $.ajax({
     type: "GET",
     async: false,
     url: "dataset/Target_db.tsv",
     dataType: "text",
     success: function(data) {Target_db = processData(data);}
  });
   $.ajax({
       type: "GET",
       url: "dataset/Equipment_db.tsv",
       dataType: "text",
       success: function(data) {true_equipment_db = processData(data);}
    });
    $.ajax({
       type: "GET",
       async: false,
       url: "dataset/Project_db.tsv",
       dataType: "text",
       success: function(data) {Project_db = processData(data);}
    });
    $.ajax({
       type: "GET",
       async: false,
       url: "dataset/Project's_Target_db.tsv",
       dataType: "text",
       success: function(data) {Project_Target_db = processData(data);}
    });
});

function processData(allText) {
   var buffer = [];
   var allTextLines = allText.split(/\r\n|\n/);
   var headers = allTextLines[0].split('\t');

   //console.log(headers);
   //for (var i=1; i<allTextLines.length; i++) {
   for (var i=1; i<allTextLines.length; i++) {
       var data = allTextLines[i].split('\t');
       //if (data.length == headers.length) {


           var tarr = {};
           for (var j=0; j<headers.length; j++) {
               //tarr.push(headers[j]+":"+data[j]);
               tarr[headers[j]] = data[j];
           }
           //console.log(tarr);
           buffer.push(tarr);
       //}
   }
   //console.log("fsd");
   //console.log(buffer);
   return buffer;
   // alert(lines);
}

var filter_data = {};
// function show_data(){

//   //console.log($('#daylight_saving').val());
// }

// console.log('end data load');
// console.log(Equipment_db);
// console.log("fsd");
// console.log(Target_db);

var Project_Target_db_dic = {};
var Target_db_dic = {};
var transfer_dic = false;
requirejs(['./WorldWindShim',
        './LayerManager'],



    function (WorldWind,
              LayerManager) {
        "use strict";




        // Tell WorldWind to log only warnings and errors.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");



        //console.log("fsd");
        
        //placemarkLayer = initDataPlacemark(Equipment_db);


        var placemarkLayer = new WorldWind.RenderableLayer("Placemark");

        // Create and add layers to the WorldWindow.
        var layers = [
            // Imagery layers.
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialLayer(null), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
            {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: false},
            // Add atmosphere layer on top of all base layers.
            {layer: new WorldWind.AtmosphereLayer(), enabled: true},
            // WorldWindow UI layers.
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true},
            {layer: new WorldWind.RenderableLayer("Placemark"), enabled: true},
            {layer:placemarkLayer,enabled:true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);




        // //target text
        // var screenText, screenOffset;
        // var textLayer = new WorldWind.RenderableLayer("Screen Text");
        // screenOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 0.9);
        // screenText = new WorldWind.ScreenText(screenOffset,'empty');//JSON.stringify(Equipment_db[pickList.objects[p].userObject.index]));
        // screenText.attributes.offset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 0.5);
        // //screenText.screenBounds = new WorldWind.Rectangle(0,0,100,100);
        // textLayer.addRenderable(screenText);
        // // console.log('fsd');
        // // console.log(textLayer);
        // wwd.addLayer(textLayer);


        // The common pick-handling function.
        var handlePick = function (o) {
            // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
            // the mouse or tap location.
            console.log("pick");
            var x = o.clientX,
                y = o.clientY;

            // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
            // relative to the upper left corner of the canvas rather than the upper left corner of the page.
            var pickList = wwd.pick(wwd.canvasCoordinates(x, y));
            // if (pickList.objects.length > 0) {
            //     redrawRequired = true;
            // }
            //console.log(pickList.objects[0].userObject);
            // Highlight the items picked by simply setting their highlight flag to true.
            if (pickList.objects.length > 0) {
                for (var p = 0; p < pickList.objects.length; p++) {
                    console.log(pickList.objects[p].userObject.index);
                    if(pickList.objects[p].userObject.index *1 == pickList.objects[p].userObject.index){
                        console.log("isPlaceMark");
                        console.log(Equipment_db[pickList.objects[p].userObject.index]);
                        new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 0.5);
                        //alert(""+Equipment_db[pickList.objects[p].userObject.index]);
                        //screenText.text = JSON.stringify(Equipment_db[pickList.objects[p].userObject.index]);

                        //!!find the matched equipment data and true equipment data for this placemark
                        if(pickList.objects[p].userObject.type == 'Equipment_db'){
                                var true_equipment_data = '';
                                var true_equipment_dataArr = '';
                                for(var i=0;i<true_equipment_db.length;i++){
                                    //console.log(true_equipment_db[i]['EID'] == Equipment_db[pickList.objects[p].userObject.index]['EID']);
                                    if(true_equipment_db[i]['EID'] == Equipment_db[pickList.objects[p].userObject.index]['EID']){
                                        true_equipment_data = true_equipment_db[i];
                                        console.log('true_equipment_data');
                                        console.log(true_equipment_db[i]);
                                        break;
                                    }
                                }
                                var equipment_dataArr = JSON.stringify(Equipment_db[pickList.objects[p].userObject.index]).replace('{','').replace('}','').split(',');
                                if(true_equipment_data != ''){
                                  true_equipment_dataArr = JSON.stringify(true_equipment_data).replace('{','').replace('}','').split(',');
                                  console.log(true_equipment_dataArr);
                                }
                                var dataHtml = "";
                                for(var i =0;i<equipment_dataArr.length;i++){
                                    dataHtml += equipment_dataArr[i]+'<br>';
                                }
                                if(true_equipment_dataArr != ''){
                                    for(var i =0;i<true_equipment_dataArr.length;i++){
                                        dataHtml += true_equipment_dataArr[i]+'<br>';
                                    }
                                }
                        }       
                        if(pickList.objects[p].userObject.type == 'Project_db'){
                                var dataHtml = '';
                                var project_data_str = JSON.stringify(Project_db[pickList.objects[p].userObject.index]).replace('{','').replace('}','').split(',');
                                console.log(project_data_str);
                                for(var i =0;i<project_data_str.length;i++){
                                    dataHtml += project_data_str[i]+'<br>';
                                }
                                // var target_data = '';
                                // var target_dataArr = '';
                                // var PID;
                                // var project_data;
                                // console.log('len'+Project_Target_db.length);
                                // for(var i=0;i<Project_Target_db.length;i++){
                                //     //console.log(Project_Target_db[i]['TID'] == Target_db[pickList.objects[p].userObject.index]['TID']);
                                //     if(Project_Target_db[i]['TID'] == Target_db[pickList.objects[p].userObject.index]['TID']){
                                //         PID = Project_Target_db[i]['PID'];
                                //         break;
                                //     }
                                // }
                                // console.log('PID'+PID);
                                // for(var i=0;i<Project_db.length;i++){
                                //     if(Project_db[i]['PID'] == PID){
                                //         project_data = Project_db[i];
                                //         break;
                                //     }
                                // }
                                // console.log('project_data'+project_data);
                                // var project_data_arr = JSON.stringify(project_data).replace('{','').replace('}','').split(',');
                                // var target_data_arr = JSON.stringify(Target_db[pickList.objects[p].userObject.index]).replace('{','').replace('}','').split(',');
                                
                                // var dataHtml = "";
                                // for(var i =0;i<project_data_arr.length;i++){
                                //     dataHtml += project_data_arr[i]+'<br>';
                                // }
                                // for(var i =0;i<target_data_arr.length;i++){
                                //     dataHtml += target_data_arr[i]+'<br>';
                                // }


                        }
                        $('#data-content').html(dataHtml);
                        console.log('html');
                        console.log($('#data-content').html());
                        console.log('isPlaceMark');
                        break;
                        //continue;
                    }
                    if(pickList.objects[p].userObject.index === undefined){
                        console.log('isnot');
                        //$('#data-content').html('');
                        // screenText.text = '';
                    }
                    //screenText.text = "empty";

                }
            }

            // If only one thing is picked and it is the terrain, tell the WorldWindow to go to the picked location.
            //if (pickList.objects.length === 1 && pickList.objects[0].isTerrain) {
                var position = pickList.objects[0].position;
                wwd.goTo(new WorldWind.Location(position.latitude, position.longitude));
            //}
            // Update the window if we changed anything.
            //switchconsole.log(redrawRequired);
            //if (redrawRequired) {
                //wwd.redraw(); // redraw to make the highlighting changes take effect on the screen
            //}
        };

        // Listen for mouse moves and highlight the placemarks that the cursor rolls over.
        wwd.addEventListener("click", handlePick);

        // Listen for taps on mobile devices and highlight the placemarks that the user taps.
        var tapRecognizer = new WorldWind.TapRecognizer(wwd, handlePick);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);




        
        var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);

        placemarkAttributes.imageOffset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.3,
            WorldWind.OFFSET_FRACTION, 0.0);

        placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
                    WorldWind.OFFSET_FRACTION, 0.5,
                    WorldWind.OFFSET_FRACTION, 1.0);
        placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/pushpins/plain-red.png";
        var highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
        highlightAttributes.imageScale = 1.2;

        var highlightController = new WorldWind.HighlightController(wwd);
        // var data = Equipment_db;
        //   for (var i=1; i<100; i++) {
        //     var position = new WorldWind.Position(parseFloat(data[i]['latitude']), parseFloat(data[i]['longitude']), 100.0);
        //     console.log(position);
        //     var placemark = new WorldWind.Placemark(position, false, placemarkAttributes);
        //     // Draw placemark at altitude defined above, relative to the terrain.
        //     placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
        //     //placemark.label.
        //     // Assign highlight attributes for the placemark.
        //     placemark.highlightAttributes = highlightAttributes;
        //     placemark.index = i;
        //     placemark.type = 'Equipment_db';
        //     console.log(placemark.index);
        //     placemarkLayer.addRenderable(placemark);
        //   }

        
    

        // function initDataPlacemark(data){
        //       //var data = Equipment_db;
        //     console.log("init");


        //   // Now set up to handle highlighting.


        //       return placemarkLayer;
        // }

        $("#show-data").on("click", function (e) {
            //thisExplorer.onSearchButton(e);
            console.log("show data");
            //console.log("show data");
            //filter_data = {};
            var data_number = parseInt($('#data_number').val());
            if($('#show-data').val() == 'show-equipment'){
                  var daylight_saving = $('#daylight_saving').val();
                  //console.log($('#light_polution').val());
                  var light_polution = $('#light_polution').val().replace(' ','').split('-');
                  //console.log(light_polution);
                  //console.log($('#water_vapor').val());
                  var water_vapor = $('#water_vapor').val().replace(' ','').split('-');
                  //console.log(water_vapor);
                  // filter_data['light_polution'] = {'min':$('#light_polution').val().substr(0,1),'max':$('#light_polution').val().substr(-1)}
                  // filter_data['water_vapor'] = {'min':$('#water_vapor').val().substr(0,1),'max':$('#water_vapor').val().substr(-1)}
                  
                  var time_zone = $('#time_zone').val();
                  //console.log(data_number);
                  //console.log(filter_data);
            
                  placemarkLayer.removeAllRenderables();
                  var data_count = 0;
                  var data = Equipment_db;
                  for (var i=1; i<data.length; i++) {
                      //console.log(data[i]);
                      //console.log(parseFloat(data[i]['light_pollution(m/sas)']) >= parseFloat(light_polution[0]) );
                      // console.log(data[i]['daylight_saving']);
                      // console.log(daylight_saving);
                      // console.log( data[i]['daylight_saving'] == daylight_saving);
                      //console.log(parseFloat(data[i]['light_pollution(m/sas)']);
                      var daylight_saving_judge = false;
                      if(data[i]['daylight_saving'] != daylight_saving){
                          daylight_saving_judge = false;
                          if(daylight_saving == 'ny'){
                              //console.log('it is true');
                              daylight_saving_judge = true;
                          }

                      }else{
                        daylight_saving_judge = true;
                      }

                      var time_zone_judge = true;
                      if(time_zone != data[i]['time_zone']){
                          time_zone_judge= false;
                          if(time_zone == ''){
                            time_zone_judge = true;
                          }
                      }

                      //console.log(time_zone_judge);
                      //console.log(daylight_saving_judge);
                      if(daylight_saving_judge
                        & time_zone_judge
                        & parseFloat(data[i]['light_pollution(m/sas)']) >= parseFloat(light_polution[0]) 
                        & parseFloat(data[i]['light_pollution(m/sas)']) <= parseFloat(light_polution[1])
                        & parseFloat(data[i]['water_vapor']) >= parseFloat(water_vapor[0]) 
                        & parseFloat(data[i]['water_vapor']) <= parseFloat(water_vapor[1])
                        ){
                            //console.log("suitable data");
                            var position = new WorldWind.Position(parseFloat(data[i]['latitude']), parseFloat(data[i]['longitude']), 100.0);
                            //console.log(position);
                            var placemark = new WorldWind.Placemark(position, false, placemarkAttributes);
                            // Draw placemark at altitude defined above, relative to the terrain.
                            placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
                            //placemark.label.
                            // Assign highlight attributes for the placemark.
                            placemark.highlightAttributes = highlightAttributes;
                            placemark.type = 'Equipment_db';
                            placemark.index = i;
                            //console.log(placemark.index);
                            placemarkLayer.addRenderable(placemark);
                            data_count += 1;
                            //console.log('data_count:' + data_count);
                            if(data_count == data_number){
                              break;
                            }
                      }
                  }
            }

            if($('#show-data').val() == 'show-target'){
                placemarkLayer.removeAllRenderables();
                var data = Project_db;
                var data_count = 0;
                console.log('fsd');
                console.log('show target');
                console.log(data_number);
                var judge_dic = {};
                judge_dic['project_type'] = $('#project_type').val();
                judge_dic['mount_type(german,fork,theodolite)'] = $('#mount_type').val();
                judge_dic['camera_type_(colored,mono)'] = $('#camera_type').val();
                console.log(judge_dic);
                var PI = $('#PI').val().replace(' ','').split('-');
                console.log('PI');
                console.log(PI);
                var data_number = parseInt($('#data_number').val());
                
                var filter_project_data = {};
                var data_count = 0;
                for (var i=0; i<data.length; i++) {
                    //console.log(data[i]);
                    //console.log('data:'+i);
                    var total_key_judge = true;
                    for(var key in judge_dic){
                        // console.log('data judge:');
                        // console.log(data[i][key]);
                        // console.log('filter:');
                        // console.log(judge_dic[key]);
                        var key_judge = false;
                        
                        
                        if(data[i][key] != judge_dic[key]){
                            key_judge = false;
                            if(judge_dic[key] == 'all'){
                                console.log('it is true');
                                key_judge = true;
                            }

                        }
                        if(data[i][key] == judge_dic[key]){
                          key_judge = true;
                        }
                        //console.log('judge:'+ data[i][key] +',' + judge_dic[key] + ',' + key_judge);
                        //console.log(''+key+':'+key_judge);
                        if(key_judge == false){
                          total_key_judge = false;
                        }

                    }
                    //console.log('total_key_judge:' + total_key_judge);
                    
                    
                    // console.log(total_key_judge)
                    // console.log('pidata');
                    // console.log(parseInt(data[i]['PI']));
                    var PI_judge = (parseInt(data[i]['PI']) >= parseInt(PI[0])) & (parseInt(data[i]['PI']) <= parseInt(PI[1]));
                    //console.log('PI_judge:'+PI_judge);
                    if(total_key_judge & PI_judge) {
                        // console.log('push');
                        filter_project_data[i] = data[i];
                        data_count += 1;
                        if(data_count >= parseInt(data_number)){
                            console.log('enough data');
                           break;
                        }
                    }

                }
                console.log('filter_project_data');
                console.log(filter_project_data);
                if(Object.keys(filter_project_data).length>0){
                    

                    for(var key in filter_project_data){
                        var PID = filter_project_data[key]['PID'];
                        //console.log('PID:'+PID);
                        var Project_Target_db_dic_data = Project_Target_db_dic[PID];
                        //console.log(Project_Target_db_dic_data);
                        var TID = Project_Target_db_dic[PID]['TID'];
                        //console.log(TID);
                        var target_dic_data = Target_db_dic[TID];
                        //console.log(target_dic_data);
                        //var result = Target_db_dic[['TID']];
                        
                        var position = new WorldWind.Position(parseFloat(target_dic_data['Dec (latitude)']), parseFloat(target_dic_data['RA (longitude)']), 100.0);
                        //console.log(position);
                        var placemark = new WorldWind.Placemark(position, false, placemarkAttributes);
                        // Draw placemark at altitude defined above, relative to the terrain.
                        placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
                        //placemark.label.
                        // Assign highlight attributes for the placemark.
                        placemark.highlightAttributes = highlightAttributes;
                        placemark.type = 'Project_db';
                        placemark.index = key;
                        //console.log(placemark.index);
                        placemarkLayer.addRenderable(placemark);
                        data_count += 1;
                        //console.log('data_count:' + data_count);
                        // if(data_count >= data_number){
                        //   console.log('break');
                        //   //break;
                        // }
                    }
                }



            }

        });


    });
