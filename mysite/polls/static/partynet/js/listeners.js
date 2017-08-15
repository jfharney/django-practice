$(document).ready(function () {
	
	$('#search_submit').click(function() {
		node_id = $('#search_id_input').val();
		var e = document.getElementById("partyDetails");
		var node_type = e.options[e.selectedIndex].value;
		var url = 'http://' + PARTYNET.config.service_hostname + ':' + PARTYNET.config.service_port + '/partynet/party_summary_box/'+node_id;
		if (node_type !== "party") {
			url = 'http://' + PARTYNET.config.service_hostname + ':' + PARTYNET.config.service_port + '/partynet/generic_box/' + node_type + '/' + node_id;
		}
		PARTYNET.empty_er_view()
		$.ajax({
			'url': url,
			'beforeSend': function() {
				PARTYNET.empty_network_view();
				PARTYNET.empty_temp_network_view(); 
				PARTYNET.empty_er_view();
				PARTYNET.empty_summary_view();

        		PARTYNET.basic_spinner('network_view','Searching');
        	},
			'success': function(data) {
				if (data.status == 404) {
					PARTYNET.basic_error_display('network_view', 'Party not found');
				}
				else {
					party_id = data.party_info.party_id;
					console.log(party_id);
				sessionStorage.setItem("party_id", party_id);
				PARTYNET.generate_summary_box(data);
				PARTYNET.generate_network_view(party_id);
				}
			},
			'error': function() {
        		PARTYNET.basic_error_display('network_view', 'Party not found');
        	}
		});
	});
	
	
	$("#sar_download").click(function() {
    $.ajax({
        'url': 'http://' + PARTYNET.config.service_hostname + ':' + PARTYNET.config.service_port + '/partynet/party_summary_box/' + sessionStorage.getItem("party_id"),
        'dataType': "json",
        'success': function(data) {
            PARTYNET.generate_report(data);
		},
		'error': function() {
			alert('report could not be generated');
		}
    });
	});


	$('#party_info_checkbox').change(function() {
		//alert('party_information checkbox changed');
		if (this.checked) {
			$.ajax({
            	'url': 'http://' + PARTYNET.config.service_hostname + ':' + PARTYNET.config.service_port + '/partynet/party_information/' + sessionStorage.getItem("party_id"),
				'beforeSend': function() {
        			PARTYNET.basic_spinner('party_information_table_view','Loading party info');
        		},
				'success': function(data) {
					var table_name = 'party_information';
					var col_order = ['party_id', 'name', 'address', 'email', 'phone'];
					var table_pretty_name = 'Party Information';
					var table_pretty_columns = ['Party ID', 'Name', 'Address', 'Email', 'Phone'];
            		PARTYNET.generate_table_v2(data, table_name, col_order, table_pretty_name, table_pretty_columns);
				},
				'error': function() {
					PARTYNET.basic_error_display('party_information_table_view', 'No info found for this party');
				}
            });
		} else {
			//alert('unchecked - remove the party_information table')
			var table_name = 'party_information';
			PARTYNET.clear_table(table_name);
		}
	});

	$('#account_details_checkbox').change(function() {
		//alert('party_information checkbox changed');
		if (this.checked) {
			$.ajax({
            	'url': 'http://' + PARTYNET.config.service_hostname + ':' + PARTYNET.config.service_port + '/partynet/party_to_accounts/' + sessionStorage.getItem("party_id"),
				'beforeSend': function() {
        			PARTYNET.basic_spinner('party_to_accounts_table_view','Loading account details');
        		},
				'success': function(data) {
            		var table_name = 'party_to_accounts';
					var col_order = ['party_id', 'name', 'acct_id', 'fin_agr_code', 'acct_relation', 'open_date', 'end_date'];
					var table_pretty_name = 'Account Details';
					var table_pretty_columns = ['Party ID', 'Name', 'Account ID', 'Type', 'Relation', 'Open Date', 'End Date'];
            		PARTYNET.generate_table_v2(data, table_name, col_order, table_pretty_name, table_pretty_columns);
				},
				'error': function() {
					PARTYNET.basic_error_display('party_to_accounts_table_view', 'No info found for this party');
				}
            });
		} else {
			var table_name = 'party_to_accounts';
			PARTYNET.clear_table(table_name);
		}
	});

	$('#transactions_checkbox').change(function() {
		//alert('party_information checkbox changed');
		if (this.checked) {
			$.ajax({
            	'url': 'http://' + PARTYNET.config.service_hostname + ':' + PARTYNET.config.service_port + '/partynet/transaction/' + sessionStorage.getItem("party_id"),
				'beforeSend': function() {
        			PARTYNET.basic_spinner('transaction_table_view', 'Fetching transactions');
        		},
				'success': function(data) {
            		var table_name = 'transaction';
					var col_order = ['party_id', 'acct_id', 'tran_date', 'tran_amt', 'tran_type'];
					var table_pretty_name = 'Transaction Details';
					var table_pretty_columns = ['Party ID', 'Account ID', 'Date', 'Amount', 'Type'];
            		PARTYNET.generate_table_v2(data, table_name, col_order, table_pretty_name, table_pretty_columns);
				},
				'error': function() {
					PARTYNET.basic_error_display('transaction_table_view', 'No info found for this party');
				}
            	
            });
			
		} else {
			
			var table_name = 'transaction';
			PARTYNET.clear_table(table_name);
			
		}
	});

	$('#local_statistics_checkbox').change(function() {
		//alert('party_information checkbox changed');
		if (this.checked) {
			
			$.ajax({
            	
            	'url': 'http://' + PARTYNET.config.service_hostname + ':' + PARTYNET.config.service_port + '/partynet/local_statistics',
				'beforeSend': function() {
        			PARTYNET.basic_spinner('network_statistics_table_view', 'Crunching the numbers');
        		},
				'success': function(data) {
            		var table_name = 'local_statistics';
            		//generates table info - in utils.js
            		PARTYNET.generate_table(data,table_name);
            	},
				'error': function() {
					PARTYNET.basic_error_display('network_statistics_table_view', 'No info found for this party');
				}
            	
            });
			
		} else {
			
			var table_name = 'local_statistics';
			PARTYNET.clear_table(table_name);
			
		}
	});

	$('#sam_artifacts_checkbox').change(function() {
		//alert('party_information checkbox changed');
		if (this.checked) {
			$.ajax({
            	
            	'url': 'http://' + PARTYNET.config.service_hostname + ':' + PARTYNET.config.service_port + '/partynet/sam_artifacts/' + sessionStorage.getItem("party_id"),
				'beforeSend': function() {
        			PARTYNET.basic_spinner('sam_artifacts_table_view', 'Getting the alerts');
        		},
				'success': function(data) {
            		var table_name = 'sam_artifacts';
					var col_order = ['party_id', 'name', 'alert_id', 'alert_status_date', 'alert_status', 'period_date', 'qy_id'];
					var table_pretty_name = 'SAM Artifcats';
					var table_pretty_columns = ['Party ID', 'Name', 'Alert ID', 'Alert Status Date', 'Alert Status', 'Period Date', 'QY ID'];
            		PARTYNET.generate_table_v2(data, table_name, col_order, table_pretty_name, table_pretty_columns);
            	},
				'error': function() {
					PARTYNET.basic_error_display('sam_artifacts_table_view', 'No info found for this party');
				}
            	
            });
			
		} else {
			
			var table_name = 'sam_artifacts';
			PARTYNET.clear_table(table_name);
			
		}
	});

	$('#cdd_artifacts_checkbox').change(function() {
		//alert('party_information checkbox changed');
		if (this.checked) {
			//console.log('http://' + PARTYNET.config.service_hostname + ':' + PARTYNET.config.service_port + '/partynet/cdd_artifacts/' + $('#search_id_input').val());
			$.ajax({
            	
            	'url': 'http://' + PARTYNET.config.service_hostname + ':' + PARTYNET.config.service_port + '/partynet/cdd_artifacts/' + sessionStorage.getItem("party_id"),
				'beforeSend': function() {
        			PARTYNET.basic_spinner('cdd_artifacts_table_view', 'Getting the alerts');
        		},
				'success': function(data) {
            		var table_name = 'cdd_artifacts';
            		var col_order = ['party_id', 'name', 'alert_id', 'alert_status_date', 'alert_status', 'period_date', 'qy_id'];
					var table_pretty_name = 'CDD Artifcats';
					var table_pretty_columns = ['Party ID', 'Name', 'Alert ID', 'Alert Status Date', 'Alert Status', 'Period Date', 'QY ID'];
            		PARTYNET.generate_table_v2(data, table_name, col_order, table_pretty_name, table_pretty_columns);
            	},
				'error': function() {
					PARTYNET.basic_error_display('cdd_artifacts_table_view', 'No info found for this party');
				}
            	
            });
			
		} else {
			
			var table_name = 'cdd_artifacts';
			PARTYNET.clear_table(table_name);
			
		}
	});

	$('#sam_transactions_checkbox').change(function() {
		//alert('party_information checkbox changed');
		if (this.checked) {
			
			$.ajax({
            	
            	'url': 'http://' + PARTYNET.config.service_hostname + ':' + PARTYNET.config.service_port + '/partynet/sam_transactions/' + sessionStorage.getItem("party_id"),
				'beforeSend': function() {
        			PARTYNET.basic_spinner('sam_transactions_table_view', 'Getting the transactions');
        		},
				'success': function(data) {
            		var table_name = 'sam_transactions';
            		var col_order = ['party_id', 'acct_id', 'fin_agr_code', 'tran_date', 'tran_cd', 'tran_type', 'tran_desc', 'tran_amount', 'narrative'];
					var table_pretty_name = 'SAM Transactions';
					var table_pretty_columns = ['Party ID', 'Account ID', 'Account Type', 'Tran Date', 'Tran Code', 'Tran Type', 'Description', 'Amount', 'Narrative'];
            		PARTYNET.generate_table_v2(data, table_name, col_order, table_pretty_name, table_pretty_columns);
            	},
				'error': function() {
					PARTYNET.basic_error_display('sam_transactions_table_view', 'No info found for this party');
				}
            	
            });
			
		} else {
			
			var table_name = 'sam_transactions';
			PARTYNET.clear_table(table_name);
			
		}
	});

	$('#party_history').change(function() {
		//alert('party_information checkbox changed');
		if (this.checked) {
			
			$.ajax({
            	
            	'url': 'http://' + PARTYNET.config.service_hostname + ':' + PARTYNET.config.service_port + '/partynet/party_history',
            	'success': function(data) {
            		
            		var table_name = 'party_history';
            		//generates table info - in utils.js
            		PARTYNET.generate_table(data,table_name);
            	}
            	
            });
			
		} else {
			
			var table_name = 'party_history';
			PARTYNET.clear_table(table_name);
			
		}
	});
	
	if (PARTYNET.config.er_testing == 'True') {
		
		$('#er_submit').click(function() {
			// DEPRECATED FEATURE
			var partyID = $('#er_id_input').val();
			$.ajax({
	        	
	        	'url': 'http://' + PARTYNET.config.service_hostname + ':' + PARTYNET.config.service_port + '/partynet/er_information_test/' + partyID,
	        	'beforeSend': function() {
	        		PARTYNET.basic_spinner('er_results_view','loading');
	        	},
	        	'success': function(data) {
	        		
	        		
	        		
	        		var candidates_list = data['candidates_list'];
	        		var candidates_score_list = data['candidates_score_list'];
	        		
	        		
	        		var output_html = '<div>More Like This ' + partyID + '</div>';
	        		
	        		
	        		for (var i=0;i<candidates_list.length;i++) {
	        			//console.log(candidates_score_list[i]);
	        			output_html += '<div id="' + partyID + '">';
	        			output_html += 'candidate ' + candidates_list[i] + ' score: ' + candidates_score_list[i];
	        			output_html += ' unify <a href="#" class="unify" style="cursor:pointer" id="' + candidates_list[i] + '">' + candidates_list[i] + '</a>'
	        			output_html += '</div>';
	        		}
	        		
	
	        		$('#er_results_view').html(output_html);
	        		
	
	        		
	        	},
	        	'error': function() {
	        		alert('error');
	        	}
	        	
	        });
	    	
	    });
		
		
	} else {
	
		$('#er_submit').click(function() {
			// DEPRECATED FEATURE
			var partyID = $('#er_id_input').val();
			$.ajax({
	        	
	        	'url': 'http://' + PARTYNET.config.service_hostname + ':' + PARTYNET.config.service_port + '/partynet/er_information/' + partyID,
	        	'beforeSend': function() {
	        		PARTYNET.basic_spinner('er_results_view','loading');
	        	},
	        	'success': function(data) {
	        		
	        		
	        		
	        		var candidates_list = data['candidates_list'];
	        		var candidates_score_list = data['candidates_score_list'];
	        		
	        		
	        		var output_html = '<div>More Like This ' + partyID + '</div>';
	        		
	        		
	        		for (var i=0;i<candidates_list.length;i++) {
	        			//console.log(candidates_score_list[i]);
	        			output_html += '<div id="' + partyID + '">';
	        			output_html += 'candidate ' + candidates_list[i] + ' score: ' + candidates_score_list[i];
	        			output_html += ' unify <a href="#" class="unify" style="cursor:pointer" id="' + candidates_list[i] + '">' + candidates_list[i] + '</a>'
	        			output_html += '</div>';
	        		}
	        		
	
	        		$('#er_results_view').html(output_html);
	        		
	
	        		
	        	},
	        	'error': function() {
	        		alert('error');
	        	}
	        	
	        });
	    	
	    });
    
	}
	
	
	
    
    
    
    /*
    $('#txtParty').click(function () {
        var requestData=$('#txtPartyid').val();
    	///alert('requestData: ' + requestData);
        var resultElement=$('#resultDiv');
        $.ajax({
            //url:'http://localhost:3000/api/v.0/emailinfo/'+requestData,
            url: 'http://localhost:8080/partynet/101000011/emailinfo/',
            method:'get',
            //data:{emailinfo:requestData},
            dataType:'json',
            success:function(data){
            	alert('data ' + data);
            	for (var key in data) {
            		//console.log(key);
            	}
            	var obj = JSON.parse(data);
            	for (var key in obj) {
            		console.log(key);
            		var value = obj[key];
            		console.log(value);
            	}
            	data = JSON.parse(data);
                resultElement.html(
                    'Country: '+data[0].ctry+ '<br/>' +
                    'Party_Id: ' + data[0].party_id+'<br/>' +
                    'Name:'+ data[0].name+'<br/>' +
                    'cin: ' + data[0].cin+'<br/>' +
                    'ssn: ' + data[0].ssn+'<br/>'+
                    'email_id: ' + data[0].email.email_id+'<br/>'+
                    'email_valid_to: ' + data[0].email.email_valid_to+'<br/>'+
                    'email_valid_from: ' + data[0].email.email_valid_from+'<br/>'+
                    'email_type: ' + data[0].email.email_type +'<br/>');
            }
        });
    });
    */
    
    
    
});
        