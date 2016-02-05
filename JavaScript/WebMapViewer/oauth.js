require([
    "esri/map", "application/bootstrapmap","esri/arcgis/Portal", "esri/arcgis/OAuthInfo", "esri/IdentityManager",
    "dojo/dom-style", "dojo/dom-attr", "dojo/dom", "dojo/on", "dojo/_base/array","esri/layers/FeatureLayer", "dojo/dom-style",
    "dojo/domReady!"
  ], function (Map, bootstrapmap, arcgisPortal, OAuthInfo, esriId,
    domStyle, domAttr, dom, on, arrayUtils, FeatureLayer, domStyle){

    //Global variable for resultsArray (object array of all AGOL items) and map.
    var resultsArray, map;

    //OAuthInfo to store appId
    var info = new OAuthInfo({
      appId: "nVXcX14FD9j8fqiw",
      popup: true
    });
    esriId.registerOAuthInfos([info]);

    //Check if user is signed in already
    esriId.checkSignInStatus(info.portalUrl + "/sharing").then(
      function (){
        
        displayItems();
      }
    ).otherwise(
      function (){
        // Anonymous view
        console.log("in anonymous view - no user logged in");
        
      }
    );

    //Listen for the sign-in button to be clicked
  	on(dom.byId("sign-in"), "click", function (){
      console.log("signing in...");
      esriId.getCredential(info.portalUrl + "/sharing", {
          oAuthPopupConfirmation: false
        }
      ).then(function (){
          displayItems();
        });
  	});


    //Listen for appidButton to be clicked and get value
    on(dom.byId("appidButton"), "click", function(){
      console.log("button has been clicked");

    });

    //displayItems called from sign-in click event
    function displayItems(){
      console.log("in displayItems");

      new arcgisPortal.Portal(info.portalUrl).signIn().then(
        function (portalUser){
          
          window.alert("Welcome " + portalUser.fullName);

          //query the portal for content if sign in success
          queryPortal(portalUser)
        }

        ).otherwise(
          function (error){
            console.log("Error occurred while signing in: ", error);
          }
        );
    }

    function queryPortal(portalUser){
      var portal = portalUser.portal;

      var queryParams = {
        q: "owner:" + portalUser.username,
        sortField: "numViews",
        sortOrder: "desc",
        num: 20
      };

      //After querying call createDropdownList
      portal.queryItems(queryParams).then(createDropdownList)


    }

    function createDropdownList(items){

      resultsArray = (items.results);
      console.log(resultsArray);

      //Test filling array
      var select = document.getElementById("serviceDropdown");
      //var options = ["1", "2", "3", "4", "5"];
      for(var i = 0; i < resultsArray.length; i++) {
          //console.log(resultsArray[i]);
          if(resultsArray[i].displayName === "Feature Layer"){
            console.log(resultsArray[i].name);
            console.log(resultsArray[i].url);

            //Add to array
            var e1 = document.createElement("option");
            e1.textContent = resultsArray[i].name;
            e1.value = resultsArray[i].name;
            select.appendChild(e1);
          }
          //var opt = resultsArray[i];
          //console.log(opt);
          // var el = document.createElement("option");
          // el.textContent = opt;
          // el.value = opt;
          // select.appendChild(el);
      }



      loadMap();
    }
    
    //connect Dojo to DOM events
    var e1 = document.getElementById("serviceDropdown");
    e1.addEventListener("change", selectionMade, false);

    function selectionMade(){
        var serviceUrlForSelection;
        console.log("hello from selection made");
        console.log(e1.value);

        console.log(resultsArray);
        //Loop through the array and find that object to cooresponding name selected
        for (var i = 0; i < resultsArray.length; i++) {
          if(resultsArray[i].displayName === "Feature Layer"){
            //console.log(resultsArray[i]);
            if(resultsArray[i].name === e1.value){
              console.log(resultsArray[i]);
              serviceUrlForSelection = resultsArray[i].url;
            }
            //console.log(resultsArray[i].name);
          }
        };

        //Add selection to the map
        map.addLayer(new FeatureLayer(serviceUrlForSelection + "/0"));



    }

    //Function to listen on click for re-register token
    var e2 = document.getElementById("reRegisterToken");
    e2.addEventListener("click", reRegisterClicked, false);

    function reRegisterClicked (){
      console.log("re-register clicked!");
      var myToken = esri.id.credentials[0].token;
      var myRegisterTokenJSON = {
        "expires": 10000,
        "server": "http://www.arcgis.com/sharing/rest",
        "ssl": false,
        "token": myToken,
        "userId": "dchambers14"
      }

    

      esriId.registerToken(myRegisterTokenJSON);

      //token after re-register
      console.log("new token: " + esri.id.credentials[0].token);
    }

    function loadMap(){

      //Set the serviceDropdown list to visible (hidden initially)
      domStyle.set("serviceDropdown","visibility", "visible")

      // Get a reference to the ArcGIS Map class
      map = bootstrapmap.create("mapDiv",{
        basemap: "national-geographic",
        center:[-122.45, 37.77],
        zoom:12,
        scrollWheelZoom: false
      });

    }

  });
    
