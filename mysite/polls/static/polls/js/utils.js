
PARTYNET.clear_table = function(table_name) {
	
	//alert('table_name: ' + table_name);
	var table_view = table_name + '_table_view';
	$('#' + table_view).empty();

	
}

PARTYNET.generate_summary_box = function (data) {

	//todo
	jumbotron_element = '<div class="jumbotron" id="jumbotron_view" style="margin:10px">';
	jumbotron_element += '<h3>At a Glance</h3>';
	jumbotron_element += '<br><b>Name: </b>' + data.party_info.name;
	jumbotron_element += '<br><b>CIN: </b>' + data.party_info.cin;
	if (data.email != undefined) {
		jumbotron_element += '<br><b>Email: </b>' + data.email[0].email;
	}
	if (data.phone != undefined) {
		jumbotron_element += '<br><b>Phone: </b>' + data.phone[0].phone;
	}
	if (data.address != undefined) {
		jumbotron_element += '<br><b>Address: </b>' + data.address[0].address;

	}
	
	if (data.account != undefined) {
		jumbotron_element += '<br><br>Holds ' + data.account.length + ' accounts. Details:';
		for (i in data.account){
			jumbotron_element += '<br><b>' + data.account[i].fin_agr_code + ': ' + data.account[i].acct_id + '</b>, active since ' + data.account[i].open_date;
		}
	}
	

	jumbotron_element += '</div>'
	
	$('#summary_view').html(jumbotron_element);
}

PARTYNET.generate_network_view = function (party_id) {
	d3_element = '<svg width="900" height="600"></svg>'
	$('#network_view').html(d3_element);
	PARTYNET.make_network(party_id);
}

PARTYNET.empty_network_view = function () {
	$('#network_view').empty();
}

PARTYNET.empty_summary_view = function () {
	$('#summary_view').empty();
}

PARTYNET.generate_temp_network_view = function (party_id) {
	temp_d3_element = '<svg width="600" height="600"></svg>'
	$('#temp_er_network_view').html(temp_d3_element);
	PARTYNET.make_temp_network(party_id);
}

PARTYNET.empty_temp_network_view = function () {
	$('#temp_er_network_view').empty();
}

PARTYNET.empty_er_view = function () {
  $('#er_results_view').empty();
}

PARTYNET.generate_table_v2 = function(data, table_name_id, column_order, table_name, column_names) {

  var my_columns = [];
	$.each(column_order,function(i) {
		var my_item = {};
		my_item.data = column_order[i];
		my_columns.push(my_item);
  });
  
  var table_id = table_name_id + '_view_empTable';
  var table_view = table_name_id + '_table_view';

  var title = "<div class='table-title'><h4>" + table_name + "</h4><div class='h-divider'></div></div>";
  var table_element = title;
  table_element += "<table id='" + table_id + "' class='display' cellspacing='0'>";

  var header_element = "<thead><tr>";
  header_element += PARTYNET.table_header_maker(column_names);
  header_element += "</tr></thead>"

  // Enable the following lines if you want the header to repeat at the bottom:
	//header_element += "<tfoot><tr>";
	//header_element += PARTYNET.table_header_maker(column_names);
  //header_element += "</tr></tfoot>";
  
  table_element += header_element;
  table_element += '</table>';

  $('#' + table_view).html(table_element);
  
	//display the table
	$('#' + table_id).dataTable( {
		data: data,
		'columns': my_columns,
		'dom': 'Bfrtip',
		'buttons': [
			'copy','csv','excel','pdf','print'
		]
		
	});
  

}

PARTYNET.generate_table = function (data, table_name) {

  var table_id = table_name + '_view_empTable';
  var table_view = table_name + '_table_view';
  
	// get column names from the data
	var my_columns = [];
	$.each(data[0],function(key,value) {
		var my_item = {};
		my_item.data = key;
		my_columns.push(my_item);
  });
  
  console.log(my_columns);
	
	// create the html for the table
	//add title
	var title = '<div>' + table_name + '</div>';
	var table_element = title;
	table_element += "<table id='" + table_id + "' class='display' cellspacing='0'>";
	
	var header_element = "<thead><tr>";
	header_element += PARTYNET.table_header_footer(my_columns);
	header_element += "</tr></thead>"
	header_element += "<tfoot><tr>";
	header_element += PARTYNET.table_header_footer(my_columns);
	header_element += "</tr></tfoot>";
	
	table_element += header_element;
	table_element += '</table>';

	//add the table_element html to the table view
  $('#' + table_view).html(table_element);
  
	//display the table
	$('#' + table_id).dataTable( {
		data: data,
		'columns': my_columns,
		'dom': 'Bfrtip',
		'buttons': [
			'copy','csv','excel','pdf','print'
		]
		
	});
	
}

PARTYNET.table_header_maker = function (column_names) {
  var header_element = '';
  for (i in column_names) {
    header_element += "<th>" + column_names[i] + "</th>";
  }
  return header_element;
}

PARTYNET.table_header_footer = function (my_columns) {
	
	var header_element = '';
	for (var key in my_columns) {
		
		for (var key2 in my_columns[key]) {
			header_element += "<th>" + my_columns[key][key2] + "</th>";
		}
	}
	return header_element
	
}

PARTYNET.generate_report = function (data) {
  //TODO: modularize this function
  //TODO: Handle connected parties
  //headers will store all the keys of the API
      var headers=[];
      $.each(data, function(i, e){
          headers.push(i);
      });
      //columns will hold all the data of value to be populated in rows
      var columns=[];
      $.each(data, function(i, e){
          columns.push(e);
      });

      /* Table Headers */
      var account=["acct_id","acct_relation","end_date","fin_agr_code","open_date"];
      var address=["address","city","end_date","latitude","longitude","state","type","valid","zipcode"];
      var cdd_alert=["alert_id","alert_status","alert_status_date","period_date","qy_id"];
      var email=["email","start_date","end_date","type","valid"];
      var party_info=["party_id","name","cin","country","ssn"];
      var phone=["phone","start_date","end_date","type","valid"];
      var sam_alert=["alert_id","alert_status","alert_status_date","period_date","qy_id"];
      var sar=["sar_id","sar_date","sar_narrative"];
      var counterparty=["ctrparty_id","ctrparty_country_code","dr_cr","transaction_id","transaction_amount","transaction_date"];
      var transactions=['party_id', 'acct_id', 'tran_date', 'tran_amt', 'tran_type'];
      var sam_transactions=['party_id', 'acct_id', 'fin_agr_code', 'tran_date', 'tran_cd', 'tran_type', 'tran_desc', 'tran_amount', 'narrative']


      var tableRow1=[]; //for Accounts
      var tableRow2=[]; //for Address
      var tableRow3=[]; //for CDD Alert
      var tableRow4=[]; //for email
      var tableRow5=[]; //for party_info
      var tableRow6=[]; //for phone
      var tableRow7=[]; //for sam alert
      var tableRow8=[]; //for sar
      var tableRow9=[];  //for counterparty
      var tableRow10=[]; //for transactions
      var tableRow11=[]; // for sam transactions

      /* Populating Rows with the data from API */
      for (var i in headers) {

          if (headers[i] === 'account') {
              jQuery(columns[i]).each(function(i, item) {
                  jQuery(item).each(function(i, item) {
                      tableRow1.push([item.acct_id, item.acct_relation, item.end_date, item.fin_agr_code, item.open_date]);
                  })
              })
          } else if (headers[i] === 'address') {
              jQuery(columns[i]).each(function(i, item) {
                  jQuery(item).each(function(i, item) {
                      tableRow2.push([item.address, item.city, item.end_date, item.latitude, item.longitude, item.state, item.type, item.valid, item.zipcode]);
                  })
              })
          } else if (headers[i] === 'cdd_alert') {
              jQuery(columns[i]).each(function(i, item) {
                  jQuery(item).each(function(i, item) {

                      tableRow3.push([item.alert_id, item.alert_status, item.alert_status_date, item.period_date, item.qy_id]);
                  })
              })
          } else if (headers[i] === 'email') {
              jQuery(columns[i]).each(function(i, item) {
                  jQuery(item).each(function(i, item) {
                      tableRow4.push([item.email, item.start_date, item.end_date, item.type, item.valid]);
                  })
              })
          } else if (headers[i] === 'party_info') {
              jQuery(columns[i]).each(function(i, item) {
                  jQuery(item).each(function(i, item) {
                      tableRow5.push([item.party_id, item.name, item.cin, item.country, item.ssn]);
                  })
              })
          } else if (headers[i] === 'phone') {
              jQuery(columns[i]).each(function(i, item) {
                  jQuery(item).each(function(i, item) {
                      tableRow6.push([item.phone, item.start_date, item.end_date, item.type, item.valid]);
                  })
              })
          } else if (headers[i] === 'sam_alert') {
              jQuery(columns[i]).each(function(i, item) {
                  jQuery(item).each(function(i, item) {
                      tableRow7.push([item.alert_id, item.alert_status, item.alert_status_date, item.period_date, item.qy_id]);
                  })
              })
          }
          else if (headers[i] === 'sar') {
              jQuery(columns[i]).each(function(i, item) {
                  jQuery(item).each(function(i, item) {
                      tableRow8.push([item.sar_id, item.sar_date, item.sar_narrative]);
                  })
              })
          }
          else if (headers[i] === 'counterparty') {
              jQuery(columns[i]).each(function(i, item) {
                  jQuery(item).each(function(i, item) {
                      tableRow9.push([item.ctrparty_id, item.ctrparty_country_code, item.dr_cr,item.transaction_id,item.transaction_amount,item.transaction_date]);
                  })
              })
          }
          else if (headers[i] === 'transactions') {
              jQuery(columns[i]).each(function(i, item) {
                  jQuery(item).each(function(i, item) {
                      tableRow10.push([item.party_id, item.acct_id, item.tran_date,item.tran_amt,item.tran_type]);
                  })
              })
          }
          else if (headers[i] === 'sam_transactions') {
              jQuery(columns[i]).each(function(i, item) {
                  jQuery(item).each(function(i, item) {
                      tableRow11.push([item.party_id, item.acct_id, item.fin_agr_code,item.tran_date,item.tran_cd,item.tran_type,item.tran_desc,item.tran_amount,item.narrative]);
                  })
              })
          }
      }

      var doc = new jsPDF('p', 'pt');
      var startingPage = doc.internal.getCurrentPageInfo().pageNumber;
      doc.setFontSize(10);
      doc.setFontStyle('bold');
      var height=40;
      var style= {fontSize:8,lineWidth:0,cellPadding:5,halign:'left',valign:'middle',columnWidth:'auto',overflow:'linebreak'};
      var cell = function(x, y, width, height, key, value, row, settings) {
          var style = 'S';
          doc.setLineWidth(0.1);
          doc.setDrawColor(240);
          doc.rect(x, y, width, height, style);
          y += settings.lineHeight / 2 + doc.internal.getLineHeight() / 2 - 2.5;
          doc.text(value, x + settings.padding, y);
          doc.setTextColor(50);
      };
      /* Functions to create individual tables for each header*/
      accountT=function() {
          doc.text('Account Details', height, 15);
          doc.autoTable(account, tableRow1, {startY: 20,
              styles:style,
              renderCell: cell});
          return doc;
      }
      addressT=function () {
          doc.text('Address Info', height, doc.autoTable.previous.finalY + 10);
          doc.autoTable(address, tableRow2,{startY: doc.autoTable.previous.finalY + 14,
              styles: style,
              theme: 'grid',
              renderCell: cell});
          return doc;
      }
      cdd_alertT= function(){
          doc.text('CDD Alerts', height, doc.autoTable.previous.finalY + 10);
          doc.autoTable(cdd_alert, tableRow3,{startY: doc.autoTable.previous.finalY + 14,
              styles: style,
              renderCell: cell,
              theme: 'striped'});
          return doc;
      }

      emailT= function(){
      doc.text('Emails', height, doc.autoTable.previous.finalY + 10);
      doc.autoTable(email, tableRow4,{startY: doc.autoTable.previous.finalY + 14,
          styles:style,
          renderCell: cell,
          theme: 'grid'});
      return doc;
      }

      party_infoT= function(){
      doc.text('Party Info', height, doc.autoTable.previous.finalY + 10);
      doc.autoTable(party_info, tableRow5,{startY: doc.autoTable.previous.finalY + 14,
          styles:style,
          renderCell: cell,
          theme: 'striped'});
      return doc;
      }

      phoneT= function(){
      doc.text('Phone Info', height, doc.autoTable.previous.finalY + 10);
      doc.autoTable(phone, tableRow6,{startY: doc.autoTable.previous.finalY + 14,
          styles:style,
          renderCell: cell,
          theme: 'grid'});
      return doc;
      }

      sam_alertT= function(){
      doc.text('SAM Alerts', height, doc.autoTable.previous.finalY + 10);
      doc.autoTable(sam_alert, tableRow7,{startY: doc.autoTable.previous.finalY + 14,
          styles:style,
          renderCell: cell,
          theme: 'striped'});
      return doc;
      }
      sarT= function(){
          doc.text('SAR Details', height, doc.autoTable.previous.finalY + 10);
          doc.autoTable(sar, tableRow8,{startY: doc.autoTable.previous.finalY + 14,
              styles:style,
              renderCell: cell,
              theme: 'grid'});
          return doc;
      }
      counterpartyT= function(){
          doc.text('Counterparties', height, doc.autoTable.previous.finalY + 10);
          doc.autoTable(counterparty, tableRow9,{startY: doc.autoTable.previous.finalY + 14,
              styles:style,
              renderCell: cell,
              theme: 'striped'});
          return doc;
      }
      transactionsT= function(){
          doc.text('Transactions', height, doc.autoTable.previous.finalY + 10);
          doc.autoTable(transactions, tableRow10,{startY: doc.autoTable.previous.finalY + 14,
              styles:style,
              renderCell: cell,
              theme: 'grid'});
          return doc;
      }
      sam_transactionsT= function(){
          doc.text('SAM Transactions', height, doc.autoTable.previous.finalY + 10);
          doc.autoTable(sam_transactions, tableRow11,{startY: doc.autoTable.previous.finalY + 14,
              styles:style,
              renderCell: cell,
              theme: 'striped'});
          return doc;
      }

      for (var i in headers) {
          if (headers[i] === 'account') {
              accountT();
          } else if (headers[i] === 'address') {
              addressT();
          } else if (headers[i] === 'cdd_alert') {
              cdd_alertT();
          } else if (headers[i] === 'email') {
              emailT();
          } else if (headers[i] === 'party_info') {
              party_infoT();
          } else if (headers[i] === 'phone') {
              phoneT();
          } else if (headers[i] === 'sam_alert') {
              sam_alertT();
          } else if (headers[i] === 'sar') {
              sarT();
          } else if (headers[i] === 'counterparty') {
              counterpartyT();
          } else if (headers[i] === 'transactions') {
              counterpartyT();
          } else if (headers[i] === 'sam_transactions') {
              counterpartyT();
          }
      }

      doc.save('sar_report.pdf');
}


PARTYNET.basic_spinner = function (element,msg) {

	//assemble the element
	element = '#' + element;
	
	//clear the area
	$(element).empty();
	
	//var spinner_html = '<img src="{% static "partynet/img/ajax-loader.gif" %}" />';
	//this should probably refer to something in the core.js
	var spinner_html = '<img src="http://' + PARTYNET.config.service_hostname + ':' + PARTYNET.config.service_port + '/static/partynet/img/ajax-loader.gif" />';
	
	//add the spinner
	//$('#er_results_view').html(spinner_html);
	$(element).html('<div>' + msg + ' ...</div>' + spinner_html);
}

PARTYNET.basic_error_display = function (element, message) {
  element = '#' + element;
  $(element).empty();
  var error_html = '<div class="alert alert-warning">' + message + '</div>';
  $(element).html(error_html);
}


// d3 stuff
PARTYNET.make_network = function (party_id) {

  d3.contextMenu = function (menu, openCallback) {

	// create the div element that will hold the context menu
	d3.selectAll('.d3-context-menu').data([1])
		.enter()
		.append('div')
		.attr('class', 'd3-context-menu');

	// close menu
	d3.select('body').on('click.d3-context-menu', function() {
		d3.select('.d3-context-menu').style('display', 'none');
	});

	// this gets executed when a contextmenu event occurs
	return function(data, index) {	
		var elm = this;

		d3.selectAll('.d3-context-menu').html('');
		var list = d3.selectAll('.d3-context-menu').append('ul');
		list.selectAll('li').data(menu(data)).enter()
			.append('li')
			.html(function(d) {
				return d.title;
			})
			.on('click', function(d, i) {
				d.action(elm, data, index);
				d3.select('.d3-context-menu').style('display', 'none');
			});

		// the openCallback allows an action to fire before the menu is displayed
		// an example usage would be closing a tooltip
		if (openCallback) openCallback(data, index);

		// display context menu
		d3.select('.d3-context-menu')
			.style('left', (d3.event.pageX - 2) + 'px')
			.style('top', (d3.event.pageY - 2) + 'px')
			.style('display', 'block');

		d3.event.preventDefault();
	};
};

var svg = d3.select("svg"),
  width = +svg.attr("width"),
 height = +svg.attr("height");

var xScale = d3.scaleLinear()
              .domain([0, width])
              .range([0, width]);

var yScale = d3.scaleLinear()
              .domain([0, height])
              .range([0, height]);

var menu = function(d) {

    if (parseInt(d.group) == 1) {
        return [{
            title: 'Search on Google',
            action: function(elm, d, i) {
                return window.open('https://www.google.com/search?q=' + d.name);

            }
        }, 

        {
            title: 'Get more info from Omni',
            action: function(elm, d, i) {
                // Get your parameters here
                var party_id = d['party_id'];
                var party_name = d['name'];

                $.ajax({
                  // replace this line to get actual data:
                  'url': 'http://' + PARTYNET.config.service_hostname + ':' + PARTYNET.config.service_port + '/partynet/omnicrawler/' + party_id,
                  'beforeSend': function() {
                    // don't know where to put the spinner for now 
		        		    PARTYNET.basic_spinner('er_results_view', 'Getting info from Omni. This will take some time');
                },
                  'success': function(data) {
                	console.log('data: ' + data)
                	var response_obj = JSON.parse(data);
                	for (var key in response_obj) {
                		console.log('key: ' + key);
                	}
                    PARTYNET.empty_er_view();
                    // Quick hack to show something, need to revist:
                    jumbotron_html = $("#jumbotron_view").html();
                    jumbotron_html += "<br><br><h4>More from Omni:</h4>";
                    //alert(Object.keys(response_obj['findthecompany_return']).length);
                    //if (response_obj['findthecompany_return'].length != 0) {
                    if (Object.keys(response_obj['findthecompany_return']).length != 0) {
                    	var entries = response_obj.findthecompany_return;
                        for (key in entries) {
                          jumbotron_html += "<br><b>" + key + ":</b> " + entries[key];
                        }
                        $("#jumbotron_view").html(jumbotron_html);
                    } else if (Object.keys(response_obj['manta_return']).length != 0) {
                    	var entries = response_obj.findthecompany_return;
                        for (key in entries) {
                          jumbotron_html += "<br><b>" + key + ":</b> " + entries[key];
                        }
                        $("#jumbotron_view").html(jumbotron_html);
                    
                    } else if (Object.keys(response_obj['yelp_return']).length != 0) {
                    	var entries = response_obj.findthecompany_return;
                        for (key in entries) {
                          jumbotron_html += "<br><b>" + key + ":</b> " + entries[key];
                        }
                        $("#jumbotron_view").html(jumbotron_html);
                    
                    } else if (Object.keys(response_obj['facebook_return']).length != 0) {
                    	var entries = response_obj.findthecompany_return;
                        for (key in entries) {
                          jumbotron_html += "<br><b>" + key + ":</b> " + entries[key];
                        }
                        $("#jumbotron_view").html(jumbotron_html);
                    } else {
                    	jumbotron_html += "<br>No additional info was found";
                        $("#jumbotron_view").html(jumbotron_html);
                    }
                  }
                });

            }
        },
        {
            title: 'Find similar parties in the network',
            action: function(elm, d, i) {
            	
              var party_id = d['party_id'];
              var party_name = d['name'];
				

				console.log('party_id: ' + party_id);
				
				if (PARTYNET.config.er_testing == 'True') {
					
					
					$.ajax({
			        	
			        	'url': 'http://' + PARTYNET.config.service_hostname + ':' + PARTYNET.config.service_port + '/partynet/er_information_test/' + party_id,
			        	'beforeSend': function() {
			        		PARTYNET.basic_spinner('er_results_view','Crunching the numbers. This can take several minutes');
			        	},
			        	'success': function(data) {
			        		
			        		
			        		//alert('successful test');
			        		
			        		var candidates_list = data['candidates_list'];
			        		var candidates_score_list = data['candidates_score_list'];
			        		
			        		
			        		//var output_html = '<div>More Like This ' + party_id + '</div>';
			        		var output_html = '';
			        		var title = "<div class='table-title'><h4>Parties resembling party ID " + party_id + " (" + party_name + ")</h4><div class='h-divider'></div></div>";
			        		output_html += title;
			        		for (var i=0;i<candidates_list.length;i++) {
			        			//console.log(candidates_score_list[i]);
			        			//output_html += '<hr />';
			        			output_html += '<div id="' + party_id + '">';
	                  output_html += '<b>Party ID: ' + candidates_list[i] + '</b><br>'
	                  output_html += '<em>Score: </em>' + Number(candidates_score_list[i]).toFixed(5) + " ";
	                  output_html += '<a href="#" class="temp-network-view" style="cursor:pointer" id="network_' +  candidates_list[i] + '">View Network</a>'
			        			output_html += '<br><a href="#" class="unify" style="cursor:pointer" id="' + candidates_list[i] + '">' + 'Click here to unify' + '</a>'
			        			output_html += '</div>';
			        			output_html += '<hr />';
			        		}
			        		
			        		output_html += "<div class='h-divider'></div>";
			        		$('#er_results_view').html(output_html);
			        		
	
			        		
			        	},
			        	'error': function() {
			        		alert('error');
			        	}
			        	
			        });
					
					
				} else {
					
				
					$.ajax({
			        	
			        	'url': 'http://' + PARTYNET.config.service_hostname + ':' + PARTYNET.config.service_port + '/partynet/er_information/' + party_id,
			        	'beforeSend': function() {
			        		PARTYNET.basic_spinner('er_results_view','Crunching the numbers. This can take several minutes');
			        	},
			        	'success': function(data) {
			        		
			        		
			        		
			        		var candidates_list = data['candidates_list'];
			        		var candidates_score_list = data['candidates_score_list'];
			        		
			        		
			        		//var output_html = '<div>More Like This ' + party_id + '</div>';
			        		var output_html = '';
			        		var title = "<div class='table-title'><h4>Parties resembling party ID " + party_id + " (" + party_name + ")</h4><div class='h-divider'></div></div>";
			        		output_html += title;
			        		for (var i=0;i<candidates_list.length;i++) {
			        			//console.log(candidates_score_list[i]);
			        			//output_html += '<hr />';
			        			output_html += '<div id="' + party_id + '">';
	                  output_html += '<b>Party ID: ' + candidates_list[i] + '</b><br>'
	                  output_html += '<em>Score: </em>' + Number(candidates_score_list[i]).toFixed(5) + " ";
	                  output_html += '<a href="#" class="temp-network-view" style="cursor:pointer" id="network_' +  candidates_list[i] + '">View Network</a>'
			        			output_html += '<br><a href="#" class="unify" style="cursor:pointer" id="' + candidates_list[i] + '">' + 'Click here to unify' + '</a>'
			        			output_html += '</div>';
			        			output_html += '<hr />';
			        		}
			        		
			        		output_html += "<div class='h-divider'></div>";
			        		$('#er_results_view').html(output_html);
			        		
	
			        		
			        	},
			        	'error': function() {
			        		alert('error');
			        	}
			        	
			        });
			    	
				}

				/*
				$.ajax({
		        	
		        	'url': 'http://' + PARTYNET.config.service_hostname + ':' + PARTYNET.config.service_port + '/partynet/er_information/' + party_id,
		        	'beforeSend': function() {
		        		PARTYNET.basic_spinner('er_results_view','Crunching the numbers. This can take several minutes');
		        	},
		        	'success': function(data) {
		        		
		        		
		        		
		        		var candidates_list = data['candidates_list'];
		        		var candidates_score_list = data['candidates_score_list'];
		        		
		        		
		        		//var output_html = '<div>More Like This ' + party_id + '</div>';
		        		var output_html = '';
		        		var title = "<div class='table-title'><h4>Parties resembling party ID " + party_id + " (" + party_name + ")</h4><div class='h-divider'></div></div>";
		        		output_html += title;
		        		for (var i=0;i<candidates_list.length;i++) {
		        			//console.log(candidates_score_list[i]);
		        			//output_html += '<hr />';
		        			output_html += '<div id="' + party_id + '">';
                  output_html += '<b>Party ID: ' + candidates_list[i] + '</b><br>'
                  output_html += '<em>Score: </em>' + Number(candidates_score_list[i]).toFixed(5) + " ";
                  output_html += '<a href="#" class="temp-network-view" style="cursor:pointer" id="network_' +  candidates_list[i] + '">View Network</a>'
		        			output_html += '<br><a href="#" class="unify" style="cursor:pointer" id="' + candidates_list[i] + '">' + 'Click here to unify' + '</a>'
		        			output_html += '</div>';
		        			output_html += '<hr />';
		        		}
		        		
		        		output_html += "<div class='h-divider'></div>";
		        		$('#er_results_view').html(output_html);
		        		

		        		
		        	},
		        	'error': function() {
		        		alert('error');
		        	}
		        	
		        });
		    	*/
            	

            }
        }];
    } else if (parseInt(d.group) == 3) {
        return [{
            title: 'Search on Google',
            action: function(elm, d, i) {
                return window.open('https://www.google.com/search?q=' + d.address);

            }
        }, {
            title: 'View on Maps',
            action: function(elm, d, i) {
                return window.open('https://maps.google.com?q=' + "'" + d.address + "'");

            }
        }];
    } else if (parseInt(d.group) == 5) {
        return [{
            title: 'Search on Google',
            action: function(elm, d, i) {
                return window.open('https://www.google.com/search?q=' + d.phone);

            }
        }, {
            title: 'Reverse lookup phone number',
            action: function(elm, d, i) {
                return window.open('https://www.google.com/search?q=' + d.phone);

            }
        }];
    } else {
        return [{
            title: 'Search on google',
            action: function(elm, d, i) {
                console.log(d)
            }
        }];
    }
};

var color = d3.scaleOrdinal(d3.schemeCategory10);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.node_id; }).distance(100).strength(1))
    .force("collide",d3.forceCollide().radius(function(d){return d.x+0.7}).iterations(2))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

var attractForce = d3.forceManyBody().strength(20).distanceMax(500).distanceMin(60);
var repelForce = d3.forceManyBody().strength(-200).distanceMax(100).distanceMin(100);

var link, nodes, legend;
var shiftKey;

var infobox = d3.select("body")
    .append("div") 
    .attr("class", "tooltip")             
    .style("opacity",0);

var json_location = 'http://' + PARTYNET.config.service_hostname + ':' + PARTYNET.config.service_port + '/partynet/network_view/' + party_id;

d3.json(json_location, function(error, graph) {
  if (error) throw error;

  link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "link")
      .attr("stroke-width", "1.5px");

  nodes = svg.append("g")
                .attr("class", "nodes")
                .selectAll(".node")
                .data(graph.nodes)
                .enter()
                .append("g")
                .attr("class", "node");

  var groups = [];
  graph.nodes.forEach(function(d){
    if (!(groups.includes(d.group))) {
      groups.push(d.group);
    }
  });

  function fontawesome_mapping(number){
    switch(number) {
      case 1:
        return "\uf007"
      case 2:
        return "\uf0d6"
      case 3:
        return "\uf124"
      case 4:
        return "\uf0e0"
      case 5:
        return "\uf095"
      case 6:
        return "\uf06a"
      case 7:
        return "\uf1e5"
      case 8:
        return "\uf06d"
      case 9:
        return "\uf21b"
      default:
        return "\uf128"
    }
  };

  function nodetype_mapping(number){
    switch(number) {
      case 1:
        return "Party";
      case 2:
        return "Account";
      case 3:
        return "Address";
      case 4:
        return "Email";
      case 5:
        return "Phone";
      case 6:
        return "SAR";
      case 7:
        return "SAM";
      case 8:
        return "CDD";
      case 9:
        return "CounterParty";
      default:
        return "Unknown";
    }
  };
  
  function tooltip_content(d) {
    var content = ''
    switch(d.group) {
      case 1:
        content = '<b>Party: ' + d.name + '</b><br>';
        content += '<br>Party ID: ' + d.party_id;
        content += '<br>CIN: ' + d.cin;
        content += '<br>Country: ' + d.country;
        content += '<br> SSN: ' + d.ssn;
        return content;
      case 2:
        content = '<b>Account: ' + d.fin_agr_code + '</b><br>';
        content += '<br>Account ID: ' + d.acct_id;
        return content;
      case 3:
        content = '<b>Address:</b><br>'
        content += '<br>Address: ' + d.address;
        content += '<br>City: ' + d.city;
        content += '<br>State: ' + d.state;
        content += '<br>Zip: ' + d.zipcode;
        content += '<br>(Lon/Lat): (' + d.longitude + ', ' + d.latitude + ')';
        return content;
      case 4:
        content = '<b>Email: ' + d.email + '</b><br>';
        return content;
      case 5:
        content = '<b>Phone: ' + d.phone + '</b><br>';
        return content;
      case 6:
        content = '<b>SAR: ' + d.sar_narrative + '</b><br>';
        content += '<br>SAR ID: ' + d.sar_id;
        content += '<br>SAR Date: ' + d.sar_date;
        return content;
      case 7:
        content = '<b>' + d.alert_status + ' SAM Alert</b>:<br>';
        content += '<br>Alert ID: ' + d.alert_id;
        content += '<br>Status Date: ' + d.alert_status_date;
        content += '<br>QY ID: ' + d.qy_id;
        content += '<br>Period Date: ' + d.period_date;
        return content;
      case 8:
        content = '<b>' + d.alert_status + ' CDD Alert</b>:<br>';
        content += '<br>Alert ID: ' + d.alert_id;
        content += '<br>Status Date: ' + d.alert_status_date;
        content += '<br>QY ID: ' + d.qy_id;
        content += '<br>Period Date: ' + d.period_date;
        return content;
      case 9:
        content = '<b>Counterparty Transaction:</b><br>';
        content += '<br>Counterparty ID: ' + d.ctrparty_id;
        content += '<br>Country: ' + d.ctrparty_country_code;
        content += '<br>Transaction ID: ' + d.transaction_id;
        content += '<br>Transaction date: ' + d.transaction_date;
        return content;
      default:
        content = ''
        return content;
    }
  }

  legend = svg.append("g")
              .attr("class", "legend")
              .selectAll(".lnode")
              .data(groups)
              .enter()
              .append("g")
              .attr("class", "lnode")
              .attr("transform", function(d){
                var lx = width - 100;
                var ly = 40*d+20;
                return "translate(" + lx + "," + ly + ")";
              });

  legend.append("circle")
        .attr("r", 15)
        .style("fill", function(d) { return color(d);});

  legend.append("text")
        .attr("class", "licon")
        .attr("text-anchor", "middle")
        .attr("y", ".3em")
        .text(function(d){
          return fontawesome_mapping(d);
        });

  legend.append("text")
        .attr("class", "llabel")
        .attr("text-anchor", "left")
        .attr("x", "25")
        .attr("y", ".3em")
        .text(function(d){
          return nodetype_mapping(d);
        });
  
  nodes.append("circle")
      .attr("r", 15)
      .style("fill", function(d) { return color(d.group); })
      //.style("stroke", function(d) { //return d3.rgb(color(d.group)).darker();
      //  return "#ffffff"; 
      //})
      .on("dblclick", releasenode)
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
          .on("contextmenu", d3.contextMenu(menu));

  nodes.append("text")
        .attr("text-anchor", "middle")
        .attr("y", ".3em")
        .text(function(d){
          return fontawesome_mapping(d.group);
        });

  simulation
      .restart()
      .alpha(2)
      .nodes(graph.nodes)
      .force("attractForce", attractForce)
      .force("repelForce",repelForce)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
        .style("stroke", function(d) { 
          //return color(d.source.group);
          if ('valid' in d) {
            if (d.valid == 'Y') {
              return '#000';
            }
            else {
            return '#e3d8d8';
            }
          }
          return "#d12828";
        })
        //.style("stroke-opacity", .3);

    nodes.attr("transform", function(d, i) {
                  return "translate(" + d.x + "," + d.y + ")";
                });
  }

   var linkedByIndex = {};
      graph.links.forEach(function(d) {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
      });

  function isConnected(a, b) {
        return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index];
      }

  nodes.on("mouseover", function(d) {
        var node = d3.select(this);
        
        nodes.classed("node-active", function(o) {
          return isConnected(d, o) ? true : false;
        });
        node.classed("node-active", true);

        link.classed("link-active", function(o) {
          return o.source === d || o.target === d ? true : false;
        });

        var nodetype = nodetype_mapping(d.group);

        infobox.transition()
              .duration(200)
              .style("opacity", 0.9);

        var display_text = tooltip_content(d);

        infobox.html(display_text)
            .style("left", (d3.event.pageX+20) + "px")
            .style("top", (d3.event.pageY - 28) + "px");

      })
      .on("mouseout", function(d) {
        var node = d3.select(this);
        nodes.classed("node-active", false);
        link.classed("link-active", false);
        
        infobox.transition()
              .duration(500)
              .style("opacity", 0);
      });


});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  // Disabling the next two lines fixes the node in place upon click
  //d.fx = null;
  //d.fy = null;
}

function releasenode(d) {
  d.fx = null;
  d.fy = null;

}

}

//-----------------------------






// ----MAKE TEMP NETWORK (used in ER views): Not the main network viz!

PARTYNET.make_temp_network = function (party_id) {


var svg = d3.select("#temp_er_network_view").select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var xScale = d3.scaleLinear()
              .domain([0, width])
              .range([0, width]);

var yScale = d3.scaleLinear()
              .domain([0, height])
              .range([0, height]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.node_id; }).distance(100).strength(1))
    .force("collide",d3.forceCollide().radius(function(d){return d.x+0.7}).iterations(2))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

var attractForce = d3.forceManyBody().strength(20).distanceMax(500).distanceMin(60);
var repelForce = d3.forceManyBody().strength(-200).distanceMax(100).distanceMin(100);

var link, nodes, legend;
var shiftKey;

var infobox = d3.select("body")
    .append("div") 
    .attr("class", "tooltip")             
    .style("opacity",0);

var json_location = 'http://' + PARTYNET.config.service_hostname + ':' + PARTYNET.config.service_port + '/partynet/network_view/' + party_id;

d3.json(json_location, function(error, graph) {
  if (error) throw error;

  link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "link")
      .attr("stroke-width", "1.5px");

  nodes = svg.append("g")
                .attr("class", "nodes")
                .selectAll(".node")
                .data(graph.nodes)
                .enter()
                .append("g")
                .attr("class", "node");

  var groups = [];
  graph.nodes.forEach(function(d){
    if (!(groups.includes(d.group))) {
      groups.push(d.group);
    }
  });

  function fontawesome_mapping(number){
    switch(number) {
      case 1:
        return "\uf007"
      case 2:
        return "\uf0d6"
      case 3:
        return "\uf124"
      case 4:
        return "\uf0e0"
      case 5:
        return "\uf095"
      case 6:
        return "\uf06a"
      case 7:
        return "\uf1e5"
      case 8:
        return "\uf06d"
      case 9:
        return "\uf21b"
      default:
        return "\uf128"
    }
  };

  function nodetype_mapping(number){
    switch(number) {
      case 1:
        return "Party";
      case 2:
        return "Account";
      case 3:
        return "Address";
      case 4:
        return "Email";
      case 5:
        return "Phone";
      case 6:
        return "SAR";
      case 7:
        return "SAM";
      case 8:
        return "CDD";
      case 9:
        return "CounterParty";
      default:
        return "Unknown";
    }
  };
  
  function tooltip_content(d) {
    var content = ''
    switch(d.group) {
      case 1:
        content = '<b>Party: ' + d.name + '</b><br>';
        content += '<br>Party ID: ' + d.party_id;
        content += '<br>CIN: ' + d.cin;
        content += '<br>Country: ' + d.country;
        content += '<br> SSN: ' + d.ssn;
        return content;
      case 2:
        content = '<b>Account: ' + d.fin_agr_code + '</b><br>';
        content += '<br>Account ID: ' + d.acct_id;
        return content;
      case 3:
        content = '<b>Address:</b><br>'
        content += '<br>Address: ' + d.address;
        content += '<br>City: ' + d.city;
        content += '<br>State: ' + d.state;
        content += '<br>Zip: ' + d.zipcode;
        content += '<br>(Lon/Lat): (' + d.longitude + ', ' + d.latitude + ')';
        return content;
      case 4:
        content = '<b>Email: ' + d.email + '</b><br>';
        return content;
      case 5:
        content = '<b>Phone: ' + d.phone + '</b><br>';
        return content;
      case 6:
        content = '<b>SAR: ' + d.sar_narrative + '</b><br>';
        content += '<br>SAR ID: ' + d.sar_id;
        content += '<br>SAR Date: ' + d.sar_date;
        return content;
      case 7:
        content = '<b>' + d.alert_status + ' SAM Alert</b>:<br>';
        content += '<br>Alert ID: ' + d.alert_id;
        content += '<br>Status Date: ' + d.alert_status_date;
        content += '<br>QY ID: ' + d.qy_id;
        content += '<br>Period Date: ' + d.period_date;
        return content;
      case 8:
        content = '<b>' + d.alert_status + ' CDD Alert</b>:<br>';
        content += '<br>Alert ID: ' + d.alert_id;
        content += '<br>Status Date: ' + d.alert_status_date;
        content += '<br>QY ID: ' + d.qy_id;
        content += '<br>Period Date: ' + d.period_date;
        return content;
      case 9:
        content = '<b>Counterparty Transaction:</b><br>';
        content += '<br>Counterparty ID: ' + d.ctrparty_id;
        content += '<br>Country: ' + d.ctrparty_country_code;
        content += '<br>Transaction ID: ' + d.transaction_id;
        content += '<br>Transaction date: ' + d.transaction_date;
        return content;
      default:
        content = ''
        return content;
    }
  }

  legend = svg.append("g")
              .attr("class", "legend")
              .selectAll(".lnode")
              .data(groups)
              .enter()
              .append("g")
              .attr("class", "lnode")
              .attr("transform", function(d){
                var lx = width - 100;
                var ly = 40*d+20;
                return "translate(" + lx + "," + ly + ")";
              });

  legend.append("circle")
        .attr("r", 15)
        .style("fill", function(d) { return color(d);});

  legend.append("text")
        .attr("class", "licon")
        .attr("text-anchor", "middle")
        .attr("y", ".3em")
        .text(function(d){
          return fontawesome_mapping(d);
        });

  legend.append("text")
        .attr("class", "llabel")
        .attr("text-anchor", "left")
        .attr("x", "25")
        .attr("y", ".3em")
        .text(function(d){
          return nodetype_mapping(d);
        });
  
  nodes.append("circle")
      .attr("r", 15)
      .style("fill", function(d) { return color(d.group); })
      //.style("stroke", function(d) { //return d3.rgb(color(d.group)).darker();
      //  return "#ffffff"; 
      //})
      .on("dblclick", releasenode)
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  nodes.append("text")
        .attr("text-anchor", "middle")
        .attr("y", ".3em")
        .text(function(d){
          return fontawesome_mapping(d.group);
        });

  simulation
      .restart()
      .alpha(2)
      .nodes(graph.nodes)
      .force("attractForce", attractForce)
      .force("repelForce",repelForce)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
        //.style("stroke", function(d) { //return color(d.source.group); 
        //  return "#555";
        //})
        //.style("stroke-opacity", .3);

    nodes.attr("transform", function(d, i) {
                  return "translate(" + d.x + "," + d.y + ")";
                });
  }

   var linkedByIndex = {};
      graph.links.forEach(function(d) {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
      });

  function isConnected(a, b) {
        return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index];
      }

  nodes.on("mouseover", function(d) {
        var node = d3.select(this);
        
        nodes.classed("node-active", function(o) {
          return isConnected(d, o) ? true : false;
        });
        node.classed("node-active", true);

        link.classed("link-active", function(o) {
          return o.source === d || o.target === d ? true : false;
        });

        var nodetype = nodetype_mapping(d.group);

        infobox.transition()
              .duration(200)
              .style("opacity", 0.9);

        var display_text = tooltip_content(d);

        infobox.html(display_text)
            .style("left", (d3.event.pageX+20) + "px")
            .style("top", (d3.event.pageY - 28) + "px");

      })
      .on("mouseout", function(d) {
        var node = d3.select(this);
        nodes.classed("node-active", false);
        link.classed("link-active", false);
        
        infobox.transition()
              .duration(500)
              .style("opacity", 0);
      });


});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  // Disabling the next two lines fixes the node in place upon click
  //d.fx = null;
  //d.fy = null;
}

function releasenode(d) {
  d.fx = null;
  d.fy = null;

}

}