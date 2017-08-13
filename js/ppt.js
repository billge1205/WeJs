/**
 * Created by billge on 17/7/7.
 */
(function (module) {
    module.exports.changeFrame = function(status) {
        if (status){
            var url = $(this).attr('url');
            $('#showFrame').attr('src', url);
        }
    };

    module.exports.drawChart = function(status) {
        if (status){
            requires('highchart', function (_) {
                $('#chart').highcharts({chart:{backgroundColor:'#d7d7d7',type:'column'},title:{text:''},
                    xAxis:{type:'category'},yAxis:{title:{text:'QPS'}},legend:{enabled:false},
                    plotOptions:{series:{borderWidth:0,dataLabels:{enabled:true}}},
                    credits:{enabled:false},series:[{name:'QPS',data:[{name:'2.2.*',y:2023,},{name:'2.6.2',y:2291,}]}],}
                );
            });
        } else {
            $('#chart').empty();
        }
    };

    module.exports.fsightImg = function (status) {
        if (status){
            $('.fsight img').attr('src', '/node/images/fsight2.png');
        } else {
            $('.fsight img').attr('src', '/node/images/fsight1.png');
        }
    };

    module.exports.showPlat = function (status) {
        function nextShow(i) {
            if (i === $('.platform img').length){
                return;
            } else {
                var img = $('.platform img').eq(i);
                var width = img.data('width');
                img.css('z-index', i).animate({width: width}, 1500, 'swing', function () {
                    i++;
                    nextShow(i);
                })
            }
        }
        if (status){
            nextShow(0);
        } else {
            $('.platform img').css('width', 0);
        }
    };
    var editor;

    module.exports.runCode = function (obj) {
        var text = editor.getValue();
        eval(text);
    };

    module.exports.loadCode = function (status) {
        if (status && typeof editor === 'undefined'){
            requires(['../codemirror/lib/codemirror'], function () {
                require('../codemirror/mode/javascript/javascript');
                editor = CodeMirror.fromTextArea(document.getElementById("WeJsArea"), {
                    lineNumbers: true,
                    matchBrackets: true,
                    continueComments: "Enter",
                    extraKeys: {"Ctrl-Q": "toggleComment"}
                });
            });
        }
    };

    module.exports.add = function (a,b) {
       return a+b;
    };

})(WeJs.exports.ppt);