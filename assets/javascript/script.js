// Initialize Firebase
  var config = {
    apiKey: "AIzaSyB16LAbcv6AsA6ON5GUssYT_KP3L0mDawE",
    authDomain: "train-scheduler-12345.firebaseapp.com",
    databaseURL: "https://train-scheduler-12345.firebaseio.com",
    projectId: "train-scheduler-12345",
    storageBucket: "train-scheduler-12345.appspot.com",
    messagingSenderId: "812434810316"
  };
  firebase.initializeApp(config);

var database = firebase.database();
 
 
//Button adds trains to the list 

$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    //Grabs user input from index form 
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var initialTime = moment($("#start-input").val().trim(), "hh:mm").subtract(1, "years");
    var trainFrequency = $("#frequency-input").val().trim()

    // gets current time
    var currentTime = moment();
    // console.log("CURRENT TIME: "+ moment(currentTime).format("hh:mm"))

    // Difference between the times
    var diffTime = moment().diff(moment(initialTime), "minutes");
    // console.log("Difference in time:" + diffTime)

    // Uses % operator to determine the time left until the next for the next train
    var timeLeft = diffTime % trainFrequency
    // console.log(timeLeft)

    // Combines data from lines 24-35 to calculate minutes remaining until next train
    var minRemaining = trainFrequency - timeLeft;
    // console.log("Minutes Till Next Train: " + minRemaining)

    // The exact time the train will be arriving 
    var nextTrain = moment().add(minRemaining, "minutes").format("hh:mm a")
    // console.log("Arrival Time: " + moment(nextTrain).format("hh:mm"))

    var newTrain = {
      name: trainName,
      destination: trainDestination,
      frequency: trainFrequency,
      nextArrival: nextTrain,
      minAway: minRemaining
    };

    //upload train data to the database
    database.ref().push(newTrain);

    //console.log(newTrain.name)
    //console.log(newTrain.destination)
    //console.log(newTrain.frequency)
    //console.log(newTrain.nextArrival)
    //console.log(newTrain.minAway)

    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");

});

//Adds Train arrival times to the database and display it on HTML 
database.ref().on("child_added", function(childSnapshot, prevChildKey){
    console.log(childSnapshot.val())

    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainFrequency = childSnapshot.val().frequency;
    var nextTrain = childSnapshot.val().nextArrival;
    var minRemaining = childSnapshot.val().minAway;

    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + 
        "</td><td>" + trainFrequency + "</td><td>" + nextTrain + "</td><td>" + minRemaining 
        + "</td></tr>");
    });