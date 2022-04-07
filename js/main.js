$('document').ready(()=>{
    console.log("ok");    
    repe();
    tata();
    //CONTROL MANUAL
    $('#potencia').on('change', (e)=>{
        $('#mensaje').html("Se envía la petición al servidor...");        
                let dataS = "status=" + $('#potencia').val();
                    e.preventDefault();
                    $('.pote').text("Potencia: " + $('#potencia').val());
                    $.ajax({
                        type: "GET",
                        url: "https://ihc-dlk.000webhostapp.com/backend/setStatusRange.php",
                        data: dataS,
                        success: function(res2){
                            console.log(res2);  
                            repe();
                            $('#history').DataTable().destroy();
                            tata();
                        }
                    });                    
    });                                          
});
//RECONOCIMIENTO POR VOZ
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
let gramatica = ['POTENCIA', 0, 100];
recognition.interimResults = true;
recognition.lang = "es-MX";
    window.onload = (e) => {
        if (validateSpeechRecognition()) {
            $('#compatible').html("¡El navegador es compatible con Speech Recocgnition API!");
            recognition.start();
        }else{
            $('#compatible').html("El navegador NO es compatible con Speech Recocgnition API");
        }            
    }

    recognition.onresult = (e) => {
        let text = Array.from(e.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join("");

        text = text.toUpperCase();

        let arrayText = text.split(" ");

        let segundoValor = parseInt(arrayText[1], 10);

        if (e.results[0].isFinal) {
            if (validaGramatica(arrayText[0], segundoValor, gramatica[0], gramatica[1], gramatica[2])) {
                $('.pote').text("Potencia: " + segundoValor);
                $('#potencia').val(segundoValor);
                $('#mensaje').html("Se envía la petición al servidor...");
                let dataS = "status=" + segundoValor;
                    e.preventDefault();
                    $.ajax({
                        type: "GET",
                        url: "https://ihc-dlk.000webhostapp.com/backend/setStatusRange.php",
                        data: dataS,
                        success: function(res){
                            console.log(res);   
                            repe();
                            $('#history').DataTable().destroy();
                            tata();             
                        }
                    });
            }
        }
    };

    recognition.onend = () => {
        recognition.start();
    };

    recognition.onstart = () => {
        console.log('Speech recognition service has started');
    };

    function validateSpeechRecognition() {
        if (!('webkitSpeechRecognition' in window) ||
            !window.hasOwnProperty("webkitSpeechRecognition") ||
            typeof (webkitSpeechRecognition) != "function"
        ){
            return false;
        }else {
            return true;
        }
    }

    function validaGramatica(palabra1, palabra2, gramatica1, gramatica2, gramatica3) {
        if (palabra1 == gramatica1 &&
            Number.isInteger(palabra2) &&
            palabra2 >= gramatica2 && palabra2 <= gramatica3) {
            return true;
        }else{
            return false;   
        }
    }

    function grafica(dato){        
    google.charts.load('current', {'packages':['line']});
    google.charts.setOnLoadCallback(drawChart);
    console.log(dato);
    // let d = JSON.parse(dato);
    // console.log(d);
    function drawChart() {
    
      var data = new google.visualization.DataTable();
      data.addColumn('number', 'Registro');
      data.addColumn('number', 'Stauts');

      data.addRows(dato);

      var options = {
        chart: {
          title: 'Valores almacenados del potenciometro'
        },
        width: 900,
        height: 500
      };

      var chart = new google.charts.Line(document.getElementById('gra'));
      chart.draw(data, google.charts.Line.convertOptions(options));
    }
}
//FUNCIÓN PARA ACTUALIZAR LA GRÁFICA
function repe(){
    $.ajax({
        type: "GET",
        url: "https://ihc-dlk.000webhostapp.com/backend/historial.php",
        success: function(res){
            let arr = JSON.parse(res);
            grafica(arr.graf);
        }
    });
}
//FUNCIÓN PARA ACTUALIZAR LA TABLA
function tata(){
    $('#history').DataTable({
        "ajax":{
            "method":"POST",
            "url":"https://ihc-dlk.000webhostapp.com/backend/historial.php"
        },
        "columns":[
            {"data":"id"},
            {"data":"status"},
            {"data":"date"}
        ]
    });  
}  
