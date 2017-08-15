var PARTYNET = PARTYNET || {};


PARTYNET.namespace = function (ns_string) {

	var parts = ns_string.split('.'),
		parent = PARTYNET,
		i;
	
	//strip redundant leading global
	if (parts[0] === "PARTYNET") {
		parts = parts.slice(1);
	}
	
	for (i=0;i<parts.length;i+=1) {
		
		//create a property if it doesnt exist
		if (typeof parent[parts[i]] === 'undefined') {
			parent[parts[i]] = {};
		}
		parent = parent[parts[i]];
		
	}
	return parent;

};

var partynet_config = PARTYNET.namespace("PARTYNET.config");



PARTYNET.config.temp_data_addr = 'http://localhost:8080/partynet/network_response/';
PARTYNET.config.service_hostname = 'localhost';
PARTYNET.config.service_port = '8080';

PARTYNET.config.er_testing = 'True';

//PARTYNET.config.party_accounts.headers = ['Name','Designation','Salary','Joining Date','Office','Extension'];
