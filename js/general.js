var JSONArrayObject = [
					   { col1 : "data10", col2 : "data12", col3 : "data13", col4 : "data14"	},
					   { col1 : "data20", col2 : "data22", col3 : "data23", col4 : "data24"	},
					   { col1 : "data30", col2 : "data32", col3 : "data33", col4 : "data34"	},
					   { col1 : "data40", col2 : "data42", col3 : "data43", col4 : "data44"	},
					   { col1 : "data50", col2 : "data52", col3 : "data53", col4 : "data54"	},
					   { col1 : "data60", col2 : "data62", col3 : "data63", col4 : "data64"	},
					   { col1 : "data70", col2 : "data72", col3 : "data73", col4 : "data74"	},
					   { col1 : "data80", col2 : "data82", col3 : "data83", col4 : "data84"	},
					   { col1 : "data90", col2 : "data92", col3 : "data93", col4 : "data94"	},
               		   { col1 : "data11", col2 : "data12", col3 : "data13", col4 : "data14"	},
               		   { col1 : "data21", col2 : "data22", col3 : "data23", col4 : "data24"	},
               		   { col1 : "data31", col2 : "data32", col3 : "data33", col4 : "data34"	},
               		   { col1 : "data41", col2 : "data42", col3 : "data43", col4 : "data44"	},
               		   { col1 : "data51", col2 : "data52", col3 : "data53", col4 : "data54"	},
               		   { col1 : "data61", col2 : "data62", col3 : "data63", col4 : "data64"	},
               		   { col1 : "data71", col2 : "data72", col3 : "data73", col4 : "data74"	},
               		   { col1 : "data81", col2 : "data82", col3 : "data83", col4 : "data84"	},
               		   { col1 : "data91", col2 : "data92", col3 : "data93", col4 : "data94"	},
               		   { col1 : "data12", col2 : "data12", col3 : "data13", col4 : "data14"	},
					   { col1 : "data22", col2 : "data22", col3 : "data23", col4 : "data24"	},
					   { col1 : "data32", col2 : "data32", col3 : "data33", col4 : "data34"	},
					   { col1 : "data42", col2 : "data42", col3 : "data43", col4 : "data44"	},
					   { col1 : "data52", col2 : "data52", col3 : "data53", col4 : "data54"	},
					   { col1 : "data62", col2 : "data62", col3 : "data63", col4 : "data64"	},
					   { col1 : "data72", col2 : "data72", col3 : "data73", col4 : "data74"	},
					   { col1 : "data82", col2 : "data82", col3 : "data83", col4 : "data84"	},
					   { col1 : "data92", col2 : "data92", col3 : "data93", col4 : "data94"	},
            		   { col1 : "data13", col2 : "data12", col3 : "data13", col4 : "data14"	},
            		   { col1 : "data23", col2 : "data22", col3 : "data23", col4 : "data24"	},
            		   { col1 : "data33", col2 : "data32", col3 : "data33", col4 : "data34"	},
            		   { col1 : "data43", col2 : "data42", col3 : "data43", col4 : "data44"	},
            		   { col1 : "data53", col2 : "data52", col3 : "data53", col4 : "data54"	},
            		   { col1 : "data63", col2 : "data62", col3 : "data63", col4 : "data64"	},
            		   { col1 : "data73", col2 : "data72", col3 : "data73", col4 : "data74"	},
            		   { col1 : "data83", col2 : "data82", col3 : "data83", col4 : "data84"	},
            		   { col1 : "data93", col2 : "data92", col3 : "data93", col4 : "data94"	},
            		  ];
var MappingWithJson = [
		                { MappedJsonVar : "col1", HeaderLabel : "Coloumn1Coloumn1", IsEditable : false },
		                { MappedJsonVar : "col2", HeaderLabel : "Coloumn2Coloumn2", IsEditable : false },
		                { MappedJsonVar : "col3", HeaderLabel : "Coloumn3Coloumn3", IsEditable : false },
		                { MappedJsonVar : "col4", HeaderLabel : "Coloumn4Coloumn4", IsEditable : false }
	 	              ];

function deleteEntries(){
	try { $("#resultsTable").htmltable().deleteSelectedRecords();
	} catch(err) { alert("Table not found , please create table."); }
	return false;
}
function saveModifiedEntries(){
	$("#resultsTable").htmltable().saveModifiedRows();
	try { 
	} catch(err) { alert("Table not found , please create table."); }
	return false;
}
function destroyTable(){
	try { $("#resultsTable").htmltable().destroy();
	} catch(err) { alert("Table not found , please create table."); }
	return false;
}
function showSelectedRows(){
	try {
		var jsonArray = $("#resultsTable").htmltable().getSelectedorModifiedRows();
		var selectedRows = "";
		$.each(jsonArray,function(i,obj){
			var record = "";
			$.each( obj, function( key, value ) {  
				record += "  " + key + " : " + value + "  "; 
			});
			selectedRows += record + "\n";
		});	
		alert(selectedRows);
	} catch(err){ alert("Table not found , please create table."); }
	return false;
}
function updateLabels(lableId){
	try { $("#resultsTable").htmltable().updateTableLabels(labels[lableId]);
	} catch(err){ alert("Table not found , please create table."); }
	return false;
}
function createTable(){	
	$("#tabs").tabs("option", "active", 1);
	$("#tableHoldCtl").show();
	try{ $("#resultsTable").htmltable().destroy(); } catch(err){}
	var options = {};
	options.ThemePrefix = $("#ThemePrefix").val();
	options.SearchEnableFlag = $("#SearchEnableFlag").prop('checked');
	options.IndexColoumn = $("#IndexColoumn").prop('checked');
	options.ColoumnSorting = $("#ColoumnSorting").prop('checked');
	options.CheckBoxColoumn = $("#CheckBoxColoumn").prop('checked');
	options.TableEditable = $("#TableEditable").prop('checked');
	options.ShiftSelectFlag = $("#ShiftSelectFlag").prop('checked');
	options.JSONArrayObject = JSONArrayObject;
	if($("#DefaultDisplayRowCount").val() != "--"){
		options.DefaultDisplayRowCount = parseInt($("#DefaultDisplayRowCount").val());
	}
	if($("#PerPageRowCount").val() != "--"){
		options.PerPageRowCount = parseInt($("#PerPageRowCount").val());
	}
	if($("#MaxTableHeight").val() != "--"){
		options.MaxTableHeight = parseInt($("#MaxTableHeight").val());
	}
	options.MappingWithJson = MappingWithJson;
	if($.trim($("#col1Header").val()) != ''){
		options.MappingWithJson[0].HeaderLabel = $.trim($("#col1Header").val());
	}
	options.MappingWithJson[0].IsEditable = returnBoolean($("#col1editflag").val());
	if($.trim($("#col2Header").val()) != ''){
		options.MappingWithJson[1].HeaderLabel = $.trim($("#col2Header").val());
	}
	options.MappingWithJson[1].IsEditable = returnBoolean($("#col2editflag").val());
	if($.trim($("#col3Header").val()) != ''){
		options.MappingWithJson[2].HeaderLabel = $.trim($("#col3Header").val());
	}
	options.MappingWithJson[2].IsEditable = returnBoolean($("#col3editflag").val());
	if($.trim($("#col4Header").val()) != ''){
		options.MappingWithJson[3].HeaderLabel = $.trim($("#col4Header").val());
	}
	options.MappingWithJson[3].IsEditable = returnBoolean($("#col4editflag").prop('checked'));
	
	$("#resultsTable").htmltable(options);	
	return false;
}
function returnBoolean(val){
	var ret = true;
	if(val == 'false'){
		ret = false;
	}
	return ret;
}
function updateTableLabels(){
	var labels = {
			FooterShowing_Lbl : "",
			FooterSelected_Lbl : "",
			FooterModified_Lbl : "",
			FooterTotal_Lbl : "",
			ColHeader_Lbls : [
								{ MappedJsonVar : "col1", HeaderLabel : "" },
								{ MappedJsonVar : "col2", HeaderLabel : "" },
								{ MappedJsonVar : "col3", HeaderLabel : "" },
								{ MappedJsonVar : "col4", HeaderLabel : "" }		                  
			                  ]	
		};
	
	if($.trim($("#FooterShowing_Lbl").val()) != ''){
		labels.FooterShowing_Lbl = $.trim($("#FooterShowing_Lbl").val());
	}
	if($.trim($("#FooterSelected_Lbl").val()) != ''){
		labels.FooterSelected_Lbl = $.trim($("#FooterSelected_Lbl").val());
	}
	if($.trim($("#FooterModified_Lbl").val()) != ''){
		labels.FooterModified_Lbl = $.trim($("#FooterModified_Lbl").val());
	}
	if($.trim($("#FooterTotal_Lbl").val()) != ''){
		labels.FooterTotal_Lbl = $.trim($("#FooterTotal_Lbl").val());
	}
	
	if($.trim($("#Headercol1").val()) != ''){
		labels.ColHeader_Lbls[0].HeaderLabel = $.trim($("#Headercol1").val());
	}
	if($.trim($("#Headercol2").val()) != ''){
		labels.ColHeader_Lbls[1].HeaderLabel = $.trim($("#Headercol2").val());
	}
	if($.trim($("#Headercol3").val()) != ''){
		labels.ColHeader_Lbls[2].HeaderLabel = $.trim($("#Headercol3").val());
	}
	if($.trim($("#Headercol4").val()) != ''){
		labels.ColHeader_Lbls[3].HeaderLabel = $.trim($("#Headercol4").val());
	}
	
	try { $("#resultsTable").htmltable().updateTableLabels(labels);
	} catch(err){ alert("Table not found , please create table."); }
	return false;
}
