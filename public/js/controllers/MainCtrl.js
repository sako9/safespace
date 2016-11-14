angular.module('MainCtrl', ['ui.bootstrap']).controller('MainController', function($scope,$http){
    $scope.tagline = "ajdf;kajfla";
    var items = ['58282407a33613866df5a8ca','5828208da33613866df5a8c8']
    
    var conid = '58286f262645ecae873516a2';
    $scope.counter = 0;
    $scope.tabs = [];
    $scope.politics = [];
    $scope.gender = [];
    $scope.race = [];
    $scope.other = [];
    $scope.top = {topic:"",view:"",oview:"", id:"58282407a33613866df5a8ca"}
    var myIoSocket = io.connect('http://10.67.252.44:8080');
    
    myIoSocket.on("refresh messages", function(msg) {
        var elementPos = $scope.tabs.map(function(x) {return x.id; }).indexOf(msg);
        console.log(elementPos);
        $scope.tabs[elementPos].messages = []
        $http.get('http://10.67.252.44:8080/conversations/' +conid)
            .success(function(res){
                if(res){
                    console.log(res);
                    for( i = 0; i < res.conversation.length;i++){
                        console.log(res.conversation[i].body);
                        
                        $scope.tabs[elementPos].messages.push(res.conversation[i].body);
                    }
                }
        })
    });
    
    var sendMessage = function(tab){
        if(tab.new){
            var data = {}
            data.view = tab.item.view;
            data.oview = tab.item.oview;
            data.topic = tab.item.topic;
            data.user_id = "5828208da33613866df5a8c8"
            data.composedMessage = tab.currentmsg;
        
            $http.post('http://10.67.252.44:8080/new/'+tab.item.id,data)
                .success(function(res){
                    if(res){
                        tab.id = res.conversationId;
                        tab.new = false;
                    }else if(data.error){
                        alert(data.error);
                    }
                })
        }else{
            var data = {}
            data.user_id = items[Math.floor(Math.random()*items.length)];
            data.composedMessage = tab.currentmsg;
            $http.post('http://10.67.252.44:8080/conversations/'+tab.id,data)
                .success(function(res){
                    if(res){
                        console.log(res);
                        myIoSocket.emit("new message", conid);
                    }else if(data.error){
                        alert(data.error);
                    }
                })
        }
        tab.messages.push(tab.currentmsg);
        tab.currentmsg = "";
        console.log($scope.tabs)
    }

    var addTab = function (item) {
        
      $scope.tabs.push({ title: 'Tab ' + ($scope.counter+1 ), content: 'Tab ' + ($scope.counter +1) , id:conid, new:false, item: item, currentmsg:"", messages:[]});
      $scope.counter++;
      $scope.tabs[$scope.tabs.length - 1].active = true;
      myIoSocket.emit("enter conversation",conid);
    };
    
    var addTopic = function(){
        console.log("i was called");
        console.log($scope.top);
        if($scope.top.topic == "Politics"){
                    

            $scope.politics.push($scope.top);
        }
        else if($scope.top.topic == "Gender"){
            $scope.gender.push($scope.top);
        }
        else if($scope.top.topic == "Race"){ 
            $scope.race.push($scope.top);
        }else{
            $scope.other.push($scope.top);
        }
        
        $scope.top = {topic:"",view:"",oview:"", id:"58282407a33613866df5a8ca"}
        console.log($scope.politics)
        $('#myModal').modal('toggle');
    }

    var removeTab = function (event, index) {
      event.preventDefault();
      event.stopPropagation();
      $scope.tabs.splice(index, 1);
      $scope.counter--;
    };

    $scope.addTab    = addTab;
    $scope.removeTab = removeTab;
    $scope.addTopic = addTopic;
    $scope.sendMessage = sendMessage;

}).directive('tabHighlight', [function () {
    
    return {
      restrict: 'A',
      link: function (scope, element) {
        // Here is the major jQuery usage where we add the event
        // listeners mousemove and mouseout on the tabs to initalize
        // the moving highlight for the inactive tabs
        var x, y, initial_background = '#c3d5e6';

        element
          .removeAttr('style')
          .mousemove(function (e) {
            // Add highlight effect on inactive tabs
            if(!element.hasClass('active'))
            {
              x = e.pageX - this.offsetLeft;
              y = e.pageY - this.offsetTop;

              // Set the background when mouse moves over inactive tabs
              element
                .css({ background: '-moz-radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.0) 45px), ' + initial_background })
                .css({ background: '-webkit-radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.0) 45px), ' + initial_background })
                .css({ background: 'radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.0) 45px), ' + initial_background });
            }
          })
          .mouseout(function () {
            // Return the inital background color of the tab
            element.removeAttr('style');
          });
      }
    };
}]);