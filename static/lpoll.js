
var prev_data = null;  // remember data fetched last time
var chart1;

function load_data() 
{
    var url = '/data';
    
    $.ajax({ url:     url,
             success: function(data) {
                          display_data(data);
                      },
             error: function() {
                        display_connection_lost();
                    }
    });
    return true;
}

function load_history_data() 
{
    var url = '/data-history';
    
    $.ajax({ url:     url,
             success: function(data) {
                          update_graph(data);
                      },
             error: function() {
                        //display_connection_lost();
                    }
    });
    return true;
}

function display_data(data) 
{
    // show the data acquired by load_data()

    if (data && (data != prev_data)) {      // if there is data, and it's changed
 
        // update the contents of several HTML divs via jQuery
        $('#temperature').html(data.temperature);
        
        // TODO: this could be simplified
        $('div#temp-container').removeClass("target_close_increasing target_reached_increasing target_close_decreasing target_reached_decreasing");
        if( data.target_proximity == 1 ) {
            if( data.target_increasing == 1 ) {
                $('div#temp-container').addClass("target_close_increasing");
            }
            else
            {
            	$('div#temp-container').addClass("target_close_decreasing");
            }
        } else if( data.target_proximity == 2 ) {
        	if( data.target_increasing == 1 ) {
                $('div#temp-container').addClass("target_reached_increasing");
        	}
        	else
        	{
        		$('div#temp-container').addClass("target_reached_decreasing");
        	}
        }
        
        if( data.target_proximity == 2 && !$("div#clear").is(":visible") )
        {
        	$( "div#clear" ).show( 'fast' );
        }
        
        if( data.target_value != null )
        {
        	chart1.yAxis[0].addPlotLine({
                value: data.target_value,
                color: 'red',
                width: 2,
                id: 'target_value'
            });
        }
        else
        {
        	chart1.yAxis[0].removePlotLine( 'target_value' )
        }
        
        //$('div#history-data').html(data.history);
        
        $('div#timestamp').html(data.timestamp);
        
        // remember this data, in case want to compare it to next update
        prev_data = data;
    }
}

function display_connection_lost()
{
    $('div#timestamp').html("<b>Connection lost</b>");
}

// chart stuff
function load_graph()
{ 
	Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
        
    chart1 = new Highcharts.Chart({
        chart: {
            renderTo: 'history-data',
            type: 'spline',
            marginRight: 10,
            events: {
                load: function() {
                    setInterval( load_history_data, 30000);
                }
            }
        },
        title: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                minute: '%l:%M',
                hour: '%l:%M'
            },
            tickPixelInterval: 150
        },
        yAxis: {
            title: null,
            allowDecimals: false,
            tickPixelInterval: 150
        },
        tooltip: {
            useHTML: true,
            formatter: function() {
                return '<b>'+ this.y + '&deg; F</b><br/>'+
                    Highcharts.dateFormat('%l:%M %P', this.x);
            }
        },
        series: [{}],
		legend: {
            enabled: false
        },
        exporting: {
            enabled: false
        }
    });
    load_history_data();
}

function update_graph(data)
{
	var series = chart1.series[0];
	series.setData( data.history, true );
}

function clearTarget()
{
	$( "div#clear" ).hide( 'fast' );
	$( "input#field1" ).val( '-1' );
	$( "form#target_form" ).submit();
}

$(document).ready(function() {
    // load the initial data (assuming it will be immediately available)
    load_data();
    load_graph();
    setInterval(load_data, 5000);
    // wait_for_pdate();
});
