require([
    "esri/map", "application/bootstrapmap","esri/arcgis/Portal", "esri/arcgis/OAuthInfo", "esri/IdentityManager",
    "dojo/dom-style", "dojo/dom-attr", "dojo/dom", "dojo/on", "dojo/_base/array","esri/layers/FeatureLayer", "dojo/dom-style", 
    "dojo/domReady!"
  ], function (Map, bootstrapmap, arcgisPortal, OAuthInfo, esriId,
    domStyle, domAttr, dom, on, arrayUtils, FeatureLayer){

    //Global variable for resultsArray (object array of all AGOL items), map and appID.
    var resultsArray, map, appID, info;

    //OAuthInfo to store appId
    var info = new OAuthInfo({
      appId: appID,
      popup: true
    });
    esriId.registerOAuthInfos([info]);

    function trySignIn(){
      console.log("signing in...");
      appID = document.getElementById("appid").value;

      info.appId = appID; 

      reRegisterClicked();
      
      esriId.registerOAuthInfos([info]);

      console.log("appid: " + appID);
      displayItems();
  	}

    //Listen for the sign-in button to be clicked
  	on(dom.byId("sign-in"), "click", trySignIn);




    //displayItems called from sign-in click event
    function displayItems(){
      console.log("in displayItems");

      //Hide the jumbotron
      //Set the serviceDropdown list to visible (hidden initially)
      document.getElementById('toHide').style.display = "none";

      new arcgisPortal.Portal(info.portalUrl).signIn().then(
        function (portalUser){
          if(!portalUser) {
            trySignIn();    //sometimes the portal signin returns an undefined object. we don't use the Portal helper at all in our code (because of issues we had in IE). 
            return;
          }
          
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
        q: 'owner:jrmwillis',
        sortField: "numViews",
        sortOrder: "desc",
        num: 500
      };

      //After querying call createDropdownList
      portal.queryItems(queryParams).then(createDropdownList)


    }

    function createDropdownList(items){

      resultsArray = (items.results);
      console.log(resultsArray);


      var bootstrapSelect = document.getElementById("serviceDropdown2");
      var bootstrapSelectJQuery = $("#serviceDropdown2");

      for(var i = 0; i < resultsArray.length; i++){
        if(resultsArray[i].displayName === "Web Map"){
          

          var htmlFragment = "<li><a href=\"#\">" + resultsArray[i].title + "</a></li>";
          bootstrapSelectJQuery.append(htmlFragment);

        }
      }

      loadMap(items.results[0].id);
    }


    //event handler for bootstrap dropdown to add services
    $('#serviceDropdown2').on('click', "li", function(){
      var serviceUrlForSelection;
      console.log($(this).text());
      var selection = $(this).text();

      //Loop through the array of results to find object with cooresponding name selected
      for(var i=0; i < resultsArray.length; i++){
        if(resultsArray[i].displayName === "Web Map"){
          if(resultsArray[i].title === selection){
            console.log(resultsArray[i]);
            serviceUrlForSelection = resultsArray[i].id;
            console.log("Url is: " + serviceUrlForSelection);

          }
        }
      };

      //Add selection to the map
      loadMap(serviceUrlForSelection);
      


    });

    //Function to listen on click for re-register token
    var e2 = document.getElementById("reRegisterToken");
    e2.addEventListener("click", reRegisterClicked, false);

    function reRegisterClicked (){
      console.log("re-register clicked!");
    //   var myToken = esri.id.credentials[0].token;
      var myRegisterTokenJSON = {
        "expires": 10000,
        "server": "http://www.arcgis.com/sharing/rest",
        "ssl": false,
        
        // the following token came from the ArcGIS for Developers "Application" page: https://developers.arcgis.com/applications/#/<app id>/
        "token": "EmMrZGuPJOgRf68o3BNWVU3y3GjFvH_SFNruK1g8nQtM_h-0KcP-S4yhEWY8ErHAGOWApO_WwCSEpIufXaZWFJW7AUyGVaW7wMtA4ti_KVv70eDAx0OK_XVwd7DpbkayDXECtBa-aEYtv2hwQLQPhQ..",
        "userId": "cgcodysand"
      }
      
      esriId.registerToken(myRegisterTokenJSON);
      //loadMap();

    


      //token after re-register
      console.log("new token: " + esri.id.credentials[0].token);
    }
    var i = 1;
    
    function loadMap(id){
        if(map) {
            map.map.destroy();
        }
        
        if(!id) 
            return;
      //Set the serviceDropdown list to visible (hidden initially)
      //domStyle.set("serviceDropdown","visibility", "visible")
      domStyle.set("ddbstrap", "visibility", "visible");
      // Get a reference to the ArcGIS Map class
      bootstrapmap.createWebMap(id, "mapDiv",{
        basemap: "national-geographic",
        center:[-122.45, 37.77],
        zoom:12,
        scrollWheelZoom: false
      }).then(function(a, b) {
        map = a;
      });
      i++;
    }

  });
    
