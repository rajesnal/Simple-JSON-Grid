/*******************************************************************************
 * 
 * Name 	: Rajesh Kumar Nallabanda 
 * Email 	: rajeshkumar.nallabanda@gmail.com
 * License 	: MIT
 * 
 ******************************************************************************/

(function($) {
	var opts = null;
	var settings = {
		default_Table : {
			ColoumnSorting : true,
			IndexColoumn : true,
			CheckBoxColoumn : true,
			DefaultDisplayRowCount : 10,
			PerPageRowCount : 100,
			MappingWithJson : [],
			MaxTableHeight : 360,
			EmptyIconClass : "",
			EmptyIconCalback : null,
			JSONArrayObject : null,
			ShiftSelectFlag : true,
			TableEditable : false,
			ThemePrefix : "ui",
			SearchEnableFlag : true
		},
		default_Header : {
			MappedJsonVar : "",
			HeaderLabel : "Header",
			IsEditable : false
		},
		default_Labels : {
			FooterShowing_Lbl : "",
			FooterSelected_Lbl : "",
			FooterModified_Lbl : "",
			FooterTotal_Lbl : "",
			ColHeader_Lbls : []
		}
	};
	function createHtmlTable(object) {
		object.tableObj = document.createElement("div");
		$(object.tableObj).addClass("gridTable").addClass(
				object.p.cssPrefix + "-table-layout");
		if (opts.SearchEnableFlag) {
			var searchHeaderHold = document.createElement("div");
			$(searchHeaderHold).addClass("gridsearchHeaderHold").addClass(
					object.p.cssPrefix + "-header-row").addClass(
					object.p.cssPrefix + "-state-default").appendTo(
					object.tableObj);
			var searchInput = document.createElement("input");
			$(searchInput).attr("type", "text").addClass("gridSearchInput")
					.keydown(function(event) {
						if (event.which == 13) {
							event.preventDefault();
						}
					}).keyup(function(event) {
						if (event.which == 13) {
							event.preventDefault();
						}
						object.searchJsonText();
					});
			var searchCountDiv = document.createElement("div");
			$(searchCountDiv).addClass("gridTableHeaderSearchCount").addClass(
					object.p.cssPrefix + "-state-active").addClass(
					object.p.cssPrefix + "-search-count");
			$("<div></div>").addClass("gridTableHeaderSearchHold").addClass(
					object.p.cssPrefix + "-state-default").addClass(
					object.p.cssPrefix + "-search-hold").append(searchCountDiv)
					.append(searchInput).appendTo(searchHeaderHold).click(
							function() {
								$(searchInput).focus();
								return false;
							});
		}
		var tableHoldObj = document.createElement("div");
		$(tableHoldObj).addClass("gridTableHold").appendTo(object.tableObj);
		object = createHeaderRow(object, tableHoldObj);
		object = createDataRows(object, tableHoldObj);
		object = createFooterRow(object);
		object.$this.html(object.tableObj);
		if (object.jsonArrObj != null) {
			if (opts.SearchEnableFlag) {
				$(object.tableObj).find(".gridTableHeaderSearchCount").html(
						object.jsonArrObj.length);
			}
			object.updateFooterDropDown();
			object.updateFooterSelectIndex(object.p.PageIndex);
			object.updateTableLayout.call();
			object.showTable();
		} else {
			$(object.tableObj).hide();
		}
		$(document)
				.mousemove(
						function(e) {
							if (object.p.dragEvent.state) {
								var deltaX = e.pageX - object.p.dragEvent.x;
								var colIndex = object.p.dragEvent.colIndex;
								var colElem = $(object.tableObj).find(
										".gridTableHeader .gridTableHeaderCell:eq("
												+ (colIndex - 1) + ")");
								var colWidth = colElem.width();
								var minWidth = parseInt(colElem
										.css("min-width"));
								if (minWidth == 0) {
									minWidth += parseInt(colElem.find(
											".gridTableHeaderCellLabel").css(
											"min-width"));
									minWidth += colElem.find(
											".gridTableHeaderCellIconHold")
											.width() + 2;
								}
								colWidth = colWidth + deltaX;
								if (minWidth < colWidth) {
									colElem.width(colWidth);
									colElem
											.find(".gridTableHeaderCellLabel")
											.width(
													colWidth
															- (colElem
																	.find(
																			".gridTableHeaderCellIconHold")
																	.width() + 4));
								}
								object.p.dragEvent.x = e.pageX;
							}
						}).mouseup(function() {
					if (object.p.dragEvent.state) {
						object.p.dragEvent.state = false;
						object.resize();
					}
				});
		return object;
	}
	;
	function createHeaderRow(object, holdObj) {
		var headerObj = document.createElement("div");
		$(headerObj).addClass("gridTableHeader").addClass(
				object.p.cssPrefix + "-header-row").addClass(
				object.p.cssPrefix + "-state-default").appendTo(holdObj);
		var colIndex = 1;
		if (opts.IndexColoumn) {
			var indexHeaderCell = document.createElement("div");
			$(indexHeaderCell).addClass("gridTableHeaderSno").addClass(
					"gridTableHeaderCell").addClass(
					object.p.cssPrefix + "-header-cell").addClass(
					object.p.cssPrefix + "-state-default").mouseover(
					function() {
						$(this).addClass(object.p.cssPrefix + "-state-hover");
					}).mouseout(function() {
				$(this).removeClass(object.p.cssPrefix + "-state-hover");
			}).appendTo(headerObj);
			$("<div></div>").addClass("gridHeaderCellSeperator").attr(
					"colIndex", colIndex).mousedown(function(e) {
				if (!object.p.dragEvent.state) {
					object.p.dragEvent.elem = this;
					object.p.dragEvent.x = e.pageX;
					object.p.dragEvent.state = true;
					object.p.dragEvent.colIndex = $(this).attr("colIndex");
				}
				return false;
			}).appendTo(headerObj);
			colIndex++;
		}
		if (opts.CheckBoxColoumn) {
			var checkBoxHeaderCell = document.createElement("div");
			$(checkBoxHeaderCell).addClass("gridTableHeaderCell").addClass(
					"gridTableHeaderCb").addClass(
					object.p.cssPrefix + "-header-cell").addClass(
					object.p.cssPrefix + "-state-default").mouseover(
					function() {
						$(this).addClass(object.p.cssPrefix + "-state-hover");
					}).mouseout(function() {
				$(this).removeClass(object.p.cssPrefix + "-state-hover");
			}).appendTo(headerObj);
			if (!object.TableEditable) {
				var checkBoxHeaderInput = document.createElement("input");
				$(checkBoxHeaderInput).attr("name", "gridSelectAll").attr(
						"type", "checkbox").addClass("gridSelectAll").click(
						function() {
							object.toogleHeaderCheckBox();
						}).appendTo(checkBoxHeaderCell);
				var checkBoxAscIcon = document.createElement("span");
				$(checkBoxAscIcon).addClass("gridTableHeaderCellIcon")
						.addClass(object.p.cssPrefix + "-icon").addClass(
								object.p.cssPrefix + "-icon-triangle-1-n");
				var checkBoxDescIcon = document.createElement("span");
				$(checkBoxDescIcon).addClass("gridTableHeaderCellIcon")
						.addClass(object.p.cssPrefix + "-icon").addClass(
								object.p.cssPrefix + "-icon-triangle-1-s");
				$("<div></div>").addClass("gridIconHold").append(
						checkBoxAscIcon).append(checkBoxDescIcon).click(
						function() {
							var sortOrder = 'asc';
							if ($(checkBoxAscIcon).is(":hidden")
									&& $(checkBoxDescIcon).is(":hidden")) {
								$(headerObj).find(".gridTableHeaderCellIcon")
										.hide();
								$(checkBoxAscIcon).show();
							} else if ($(checkBoxAscIcon).is(":visible")
									&& $(checkBoxDescIcon).is(":hidden")) {
								$(headerObj).find(".gridTableHeaderCellIcon")
										.hide();
								sortOrder = 'desc';
								$(checkBoxDescIcon).show();
							} else if ($(checkBoxAscIcon).is(":hidden")
									&& $(checkBoxDescIcon).is(":visible")) {
								$(headerObj).find(".gridTableHeaderCellIcon")
										.hide();
								sortOrder = 'asc';
								$(checkBoxAscIcon).show();
							}
							object.tableRowSort('c', sortOrder);
							return false;
						}).appendTo(checkBoxHeaderCell);
			}
			$("<div></div>").addClass("gridHeaderCellSeperator").addClass(
					object.p.cssPrefix + "-state-default").attr("colIndex",
					colIndex).mousedown(function(e) {
				if (!object.p.dragEvent.state) {
					object.p.dragEvent.elem = this;
					object.p.dragEvent.x = e.pageX;
					object.p.dragEvent.state = true;
					object.p.dragEvent.colIndex = $(this).attr("colIndex");
				}
				return false;
			}).appendTo(headerObj);
			colIndex++;
		}
		$
				.each(
						opts.MappingWithJson,
						function(index, obj) {
							if (opts.MappingWithJson[index] !== undefined) {
								opts.MappingWithJson[index] = $.extend({},
										settings.default_Header,
										opts.MappingWithJson[index]);
								var tableColoumnHeader = document
										.createElement("div");
								$(tableColoumnHeader)
										.addClass("gridTableHeaderCell")
										.addClass(
												object.p.cssPrefix
														+ "-header-cell")
										.addClass(
												object.p.cssPrefix
														+ "-state-default")
										.mouseover(
												function() {
													$(this)
															.addClass(
																	object.p.cssPrefix
																			+ "-state-hover");
												})
										.mouseout(
												function() {
													$(this)
															.removeClass(
																	object.p.cssPrefix
																			+ "-state-hover");
												}).attr("mappedjsonvar",
												obj.MappedJsonVar).appendTo(
												headerObj);
								if (object.TableEditable) {
									$(tableColoumnHeader).attr("IsEditable",
											obj.IsEditable);
								}
								$("<label>" + obj.HeaderLabel + "</label>")
										.addClass("gridTableHeaderCellLabel")
										.attr("mappedjsonvar",
												obj.MappedJsonVar).appendTo(
												tableColoumnHeader);
								if (opts.ColoumnSorting
										&& !object.TableEditable) {
									var tableColoumnHeaderSortIcon = document
											.createElement("div");
									$(tableColoumnHeaderSortIcon).addClass(
											"gridTableHeaderCellIconHold")
											.appendTo(tableColoumnHeader);
									var SortAscIcon = document
											.createElement("span");
									$(SortAscIcon)
											.addClass("gridTableHeaderCellIcon")
											.addClass(
													object.p.cssPrefix
															+ "-icon")
											.addClass(
													object.p.cssPrefix
															+ "-icon-triangle-1-n")
											.appendTo(
													tableColoumnHeaderSortIcon);
									var SortDescIcon = document
											.createElement("span");
									$(SortDescIcon)
											.addClass("gridTableHeaderCellIcon")
											.addClass(
													object.p.cssPrefix
															+ "-icon")
											.addClass(
													object.p.cssPrefix
															+ "-icon-triangle-1-s")
											.appendTo(
													tableColoumnHeaderSortIcon);
									$(tableColoumnHeader)
											.click(
													function() {
														var sortOrder = 'asc';
														if ($(SortAscIcon).is(
																":hidden")
																&& $(
																		SortDescIcon)
																		.is(
																				":hidden")) {
															$(headerObj)
																	.find(
																			".gridTableHeaderCellIcon")
																	.hide();
															$(SortAscIcon)
																	.show();
														} else if ($(
																SortAscIcon)
																.is(":visible")
																&& $(
																		SortDescIcon)
																		.is(
																				":hidden")) {
															$(headerObj)
																	.find(
																			".gridTableHeaderCellIcon")
																	.hide();
															sortOrder = 'desc';
															$(SortDescIcon)
																	.show();
														} else if ($(
																SortAscIcon)
																.is(":hidden")
																&& $(
																		SortDescIcon)
																		.is(
																				":visible")) {
															$(headerObj)
																	.find(
																			".gridTableHeaderCellIcon")
																	.hide();
															sortOrder = 'asc';
															$(SortAscIcon)
																	.show();
														}
														object
																.tableRowSort(
																		opts.MappingWithJson[index].MappedJsonVar,
																		sortOrder);
														return false;
													});
								}
								$("<div></div>")
										.addClass("gridHeaderCellSeperator")
										.addClass(
												object.p.cssPrefix
														+ "-state-default")
										.attr("colIndex", colIndex)
										.mousedown(
												function(e) {
													if (!object.p.dragEvent.state) {
														object.p.dragEvent.elem = this;
														object.p.dragEvent.x = e.pageX;
														object.p.dragEvent.state = true;
														object.p.dragEvent.colIndex = $(
																this).attr(
																"colIndex");
													}
													return false;
												}).appendTo(headerObj);
								colIndex++;
							}
						});
		return object;
	}
	;
	function createDataRows(object, holdObj) {
		var dataRowsObj = document.createElement("div");
		$(dataRowsObj).addClass("gridTableContents").css("max-height",
				opts.MaxTableHeight).addClass(
				object.p.cssPrefix + "-state-default").appendTo(holdObj);
		for ( var idx = 0; idx < opts.PerPageRowCount; idx++) {
			object = createDataRow(idx, dataRowsObj, object);
		}
		if (opts.CheckBoxColoumn && opts.ShiftSelectFlag) {
			if (!window.ActiveXObject) {
				$(window).keydown(function(e) {
					if (e.shiftKey) {
						object.p.ShiftFlag = true;
					}
				});
			} else {
				$(object.tableObj).keydown(function(e) {
					if (e.shiftKey) {
						object.p.ShiftFlag = true;
					}
				});
			}
		}
		return object;
	}
	;
	function createDataRow(idx, dataRowsObj, object) {
		var rowClass = object.p.cssPrefix + "-row-odd";
		if (idx % 2 == 0) {
			rowClass = object.p.cssPrefix + "-row-even";
		}
		var dataRowObj = document.createElement("div");
		$(dataRowObj).addClass(object.p.cssPrefix + "-state-default").addClass(
				"dataGridRow").addClass(rowClass).css("display", "none")
				.mouseover(function() {
					$(this).addClass(object.p.cssPrefix + "-state-hover");
					$(this).addClass(object.p.cssPrefix + "-row-hover");
					$(this).focus();
				}).mouseout(function() {
					$(this).removeClass(object.p.cssPrefix + "-state-hover");
					$(this).removeClass(object.p.cssPrefix + "-row-hover");
				}).appendTo(dataRowsObj);
		if (opts.CheckBoxColoumn && !object.TableEditable) {
			$(dataRowObj).click(function() {
				object.toogleRowCheckBox(idx);
			});
		}
		if (opts.IndexColoumn) {
			$("<div></div>").addClass("dataGridRowCell").addClass(
					"dataGridRowSnoCell").addClass(
					object.p.cssPrefix + "-row-cell").appendTo(dataRowObj);
		}
		if (opts.CheckBoxColoumn) {
			var dataCbObj = document.createElement("div");
			$(dataCbObj).addClass("dataGridRowCell").addClass(
					object.p.cssPrefix + "-row-cell").addClass(
					"dataGridRowCbCell").appendTo(dataRowObj);
			if (object.TableEditable) {
				$(dataCbObj).click(function() {
					object.toogleRowCheckBox(idx);
				});
			}
		}
		$.each(opts.MappingWithJson, function(index, obj) {
			if (opts.MappingWithJson[index] !== undefined) {
				var datacolObj = document.createElement("div");
				$(datacolObj).addClass("dataGridRowCell").addClass(
						object.p.cssPrefix + "-row-cell").attr("MappedJsonVar",
						obj.MappedJsonVar).appendTo(dataRowObj);
				if (object.TableEditable) {
					$(datacolObj).attr("IsEditable", obj.IsEditable);
				}
			}
		});
		object.p.divRowElems.push(dataRowObj);
		return object;
	}
	;
	function createFooterRow(object) {
		var footerObj = document.createElement("div");
		$(footerObj).addClass("gridTableFooter").addClass(
				object.p.cssPrefix + "-footer-row").addClass(
				object.p.cssPrefix + "-state-default")
				.appendTo(object.tableObj);
		var footerNavInfoHold = document.createElement("div");
		$(footerNavInfoHold).addClass("gridTableFooterNavInfoHold").appendTo(
				footerObj);
		if (opts.IndexColoumn) {
			$(footerNavInfoHold)
					.append(
							"(<label class='footerShowingLbl'>Showing</label> : <label class='footerRecordInfoLabel1'></label>)");
		}
		if (opts.CheckBoxColoumn) {
			if (object.TableEditable) {
				$(footerNavInfoHold)
						.append(
								"( <label class='footerModifiedLbl'>Modified</label> : ");
			} else {
				$(footerNavInfoHold)
						.append(
								"( <label class='footerSelectedLbl'>Selected</label> : ");
			}
			$(footerNavInfoHold).append(
					"<label class='footerSelectedLabel'>0</label>").append(")");
		}
		$(footerNavInfoHold)
				.append(
						"(<label class='footerTotalLbl'>Total</label> : <label class='footerRecordInfoLabel2'></label>)");
		var footerPageNavObj = document.createElement("div");
		$(footerPageNavObj).addClass("gridTableFooterNavHold").appendTo(
				footerObj);
		$("<div></div>").addClass("gridTableFooterNavIcon").addClass(
				object.p.cssPrefix + "-state-default").addClass(
				object.p.cssPrefix + "-corner-all").html(
				'<span class="gridIconHold ' + object.p.cssPrefix + '-icon '
						+ object.p.cssPrefix + '-icon-seek-first"></span>')
				.mouseover(function() {
					$(this).addClass(object.p.cssPrefix + "-state-hover");
				}).mouseout(function() {
					$(this).removeClass(object.p.cssPrefix + "-state-hover");
				}).click(function() {
					object.gotoFirstPage();
					return false;
				}).appendTo(footerPageNavObj);
		$("<div></div>").addClass("gridTableFooterNavIcon").addClass(
				object.p.cssPrefix + "-state-default").addClass(
				object.p.cssPrefix + "-corner-all").html(
				'<span class="gridIconHold ' + object.p.cssPrefix + '-icon '
						+ object.p.cssPrefix + '-icon-seek-prev"></span>')
				.mouseover(function() {
					$(this).addClass(object.p.cssPrefix + "-state-hover");
				}).mouseout(function() {
					$(this).removeClass(object.p.cssPrefix + "-state-hover");
				}).click(function() {
					object.gotoPrevPage();
					return false;
				}).appendTo(footerPageNavObj);
		var footerPageNavSelectHold = document.createElement("div");
		$(footerPageNavSelectHold).addClass("gridTableFooterNavSelectHold")
				.appendTo(footerPageNavObj);
		$("<select></select>").addClass("footerPageDropDownHold").change(
				function() {
					object.gotoPage($(this).val());
					return false;
				}).appendTo(footerPageNavSelectHold);
		$("<label></label>").addClass("footerPageTotalLabel").appendTo(
				footerPageNavSelectHold);
		$("<div></div>").addClass("gridTableFooterNavIcon").addClass(
				object.p.cssPrefix + "-state-default").addClass(
				object.p.cssPrefix + "-corner-all").html(
				'<span class="gridIconHold ' + object.p.cssPrefix + '-icon '
						+ object.p.cssPrefix + '-icon-seek-next"></span>')
				.mouseover(function() {
					$(this).addClass(object.p.cssPrefix + "-state-hover");
				}).mouseout(function() {
					$(this).removeClass(object.p.cssPrefix + "-state-hover");
				}).click(function() {
					object.gotoNextPage();
					return false;
				}).appendTo(footerPageNavObj);
		$("<div></div>").addClass("gridTableFooterNavIcon").addClass(
				object.p.cssPrefix + "-state-default").addClass(
				object.p.cssPrefix + "-corner-all").html(
				'<span class="gridIconHold ' + object.p.cssPrefix + '-icon '
						+ object.p.cssPrefix + '-icon-seek-end"></span>')
				.mouseover(function() {
					$(this).addClass(object.p.cssPrefix + "-state-hover");
				}).mouseout(function() {
					$(this).removeClass(object.p.cssPrefix + "-state-hover");
				}).click(function() {
					object.gotoLastPage();
					return false;
				}).appendTo(footerPageNavObj);
		var footerPageCountSelectHold = document.createElement("div");
		$(footerPageCountSelectHold).addClass(
				"gridTableFooterPageCountSelectHold").appendTo(footerObj);
		$("<select>" + getSelectOptions() + "</select>").addClass(
				"footerPageCountDropDownHold").change(function() {
			object.updateDisplayCount($(this).val());
			return false;
		}).appendTo(footerPageCountSelectHold);
		if (opts.EmptyIconClass != undefined && opts.EmptyIconClass != "") {
			var emptyHeaderCell = document.createElement("div");
			$(emptyHeaderCell)
					.addClass("gridTableFooterEmpty")
					.addClass(object.p.cssPrefix + "-header-cell")
					.addClass(object.p.cssPrefix + "-state-default")
					.mouseover(function() {
						$(this).addClass(object.p.cssPrefix + "-state-hover");
					})
					.mouseout(
							function() {
								$(this).removeClass(
										object.p.cssPrefix + "-state-hover");
							})
					.append("<span class='" + opts.EmptyIconClass + "'></span>")
					.click(
							function(event) {
								event.preventDefault();
								if (opts.EmptyIconCalback != null
										&& $.isFunction(opts.EmptyIconCalback)) {
									opts.EmptyIconCalback.call(this);
								}
								return false;
							}).appendTo(footerObj);
		}
		return object;
	}
	;
	function getSelectOptions() {
		var optionStr = '';
		var id = opts.DefaultDisplayRowCount;
		var itr = 1;
		while (id < opts.PerPageRowCount) {
			id = opts.DefaultDisplayRowCount + (itr - 1)
					* opts.DefaultDisplayRowCount;
			optionStr += '<option>' + id + '</option>';
			itr++;
		}
		return optionStr;
	}
	;
	function genTableSpecificJSON(JSONArrObj, searchFlag) {
		if (JSONArrObj == null) {
			return null;
		}
		var JQArray = [];
		for ( var idx = 0; idx < JSONArrObj.length; idx++) {
			if (JSONArrObj[idx] !== undefined) {
				if (searchFlag) {
					JQArray.push(jQuery.extend(true, {
						c : false,
						t : idx
					}, JSONArrObj[idx]));
				} else {
					JQArray.push(jQuery.extend(true, {
						c : false
					}, JSONArrObj[idx]));
				}
			}
		}
		return JQArray;
	}
	;
	$.fn.htmltable = function(options) {
		var objects = [], return_data;

		this
				.each(function() {
					var object;
					if ($(this).data('object') === undefined) {
						if (options === undefined) {
							return null;
						}
						object = {};
						object.$this = $(this);
						object.$this.data('object', object);
						opts = $.extend({}, settings.default_Table, options);
						object.TableEditable = false;
						if (opts.TableEditable) {
							object.TableEditable = true;
							object.modifiedRows = {};
							opts.ShiftSelectFlag = false;
						}
						object.jsonArrObj = genTableSpecificJSON(
								opts.JSONArrayObject, opts.SearchEnableFlag);
						object.p = {
							TotalRowCount : (object.jsonArrObj != null) ? object.jsonArrObj.length
									: 0,
							DefaultRowCount : opts.DefaultDisplayRowCount,
							StartIndex : 0,
							PageIndex : 1,
							SelectedRows : 0,
							ShiftFlag : false,
							ShiftSelIndex : -1,
							ShiftSelrowIndex : -1,
							ShiftActionType : -1
						};
						object.p.Rowcount = (object.p.TotalRowCount < object.p.DefaultRowCount) ? object.p.TotalRowCount
								: object.p.DefaultRowCount;
						object.p.EndIndex = object.p.Rowcount - 1;
						object.p.PagesCount = Math.ceil(object.p.TotalRowCount
								/ object.p.Rowcount);
						object.p.StartSerial = object.p.StartIndex + 1;
						object.p.EndSerial = object.p.EndIndex + 1;
						object.p.divRowElems = [];
						object.p.dragEvent = {
							elem : null,
							x : 0,
							colIndex : 0,
							state : false
						};
						if (opts.SearchEnableFlag) {
							object.SearchEnableFlag = true;
							object.originalJson = object.jsonArrObj;
						}
						if ($.trim(opts.ThemePrefix) != '') {
							object.p.cssPrefix = opts.ThemePrefix;
						} else {
							object.p.cssPrefix = settings.default_Table.ThemePrefix;
						}
						object.toogleHeaderCheckBox = function() {
							if ($(object.tableObj).find(".gridSelectAll").prop(
									'checked')) {
								var loopindex = 0;
								for ( var idx = object.p.StartIndex; idx <= object.p.EndIndex; idx++) {
									object.jsonArrObj[idx].c = true;
									$(object.p.divRowElems[loopindex]).find(
											".dataGridRowCb").prop('checked',
											true);
									$(object.p.divRowElems[loopindex])
											.addClass(
													object.p.cssPrefix
															+ "-state-active")
											.addClass(
													object.p.cssPrefix
															+ "-row-selected");
									loopindex++;
								}
								for ( var idx1 = 0; idx1 < object.p.StartIndex; idx1++) {
									object.jsonArrObj[idx1].c = true;
								}
								for ( var idx2 = object.p.EndIndex + 1; idx2 < object.p.TotalRowCount; idx2++) {
									object.jsonArrObj[idx2].c = true;
								}
								object.p.SelectedRows = object.p.TotalRowCount;
							} else {
								var loopindex = 0;
								for ( var idx = object.p.StartIndex; idx <= object.p.EndIndex; idx++) {
									object.jsonArrObj[idx].c = false;
									$(object.p.divRowElems[loopindex]).find(
											".dataGridRowCb").prop('checked',
											false);
									$(object.p.divRowElems[loopindex])
											.removeClass(
													object.p.cssPrefix
															+ "-state-active")
											.removeClass(
													object.p.cssPrefix
															+ "-row-selected");
									loopindex++;
								}
								for ( var idx1 = 0; idx1 < object.p.StartIndex; idx1++) {
									object.jsonArrObj[idx1].c = false;
								}
								for ( var idx2 = object.p.EndIndex + 1; idx2 < object.p.TotalRowCount; idx2++) {
									object.jsonArrObj[idx2].c = false;
								}
								object.p.SelectedRows = 0;
							}
							object.p.ShiftSelIndex = -1;
							object.p.ShiftSelrowIndex = -1;
							object.updateFooterSelectedRows();
							return false;
						};
						object.toogleRowCheckBox = function(id) {
							var jsonIdx = $(object.p.divRowElems[id]).attr(
									'target');
							if (object.p.ShiftFlag) {
								object.p.ShiftFlag = false;
								if (object.jsonArrObj[jsonIdx].c) {
									if (object.p.ShiftSelIndex == -1) {
										object.jsonArrObj[jsonIdx].c = false;
										$(object.p.divRowElems[id]).find(
												".dataGridRowCb").prop(
												'checked', false);
										$(object.p.divRowElems[id])
												.removeClass(
														object.p.cssPrefix
																+ "-state-active")
												.removeClass(
														object.p.cssPrefix
																+ "-row-selected");
										object.p.SelectedRows--;
										object.p.ShiftSelIndex = jsonIdx;
										object.p.ShiftSelrowIndex = id;
										object.p.ShiftActionType = 2;
									} else {
										if (object.p.ShiftActionType != 2) {
											object.jsonArrObj[jsonIdx].c = false;
											$(object.p.divRowElems[id])
													.removeClass(
															object.p.cssPrefix
																	+ "-state-active")
													.removeClass(
															object.p.cssPrefix
																	+ "-row-selected");
											$(object.p.divRowElems[id]).find(
													".dataGridRowCb").prop(
													'checked', false);
											object.p.SelectedRows--;
										} else {
											var delta = object.p.ShiftSelIndex
													- jsonIdx;
											if (delta < 0) {
												// forward
												if (object.p.ShiftSelIndex >= object.p.StartIndex
														&& jsonIdx <= object.p.EndIndex) {
													var loopindex = object.p.ShiftSelrowIndex + 1;
													for ( var idx = parseInt(object.p.ShiftSelIndex) + 1; idx <= jsonIdx; idx++) {
														if (object.jsonArrObj[idx].c) {
															object.jsonArrObj[idx].c = false;
															$(
																	object.p.divRowElems[loopindex])
																	.find(
																			".dataGridRowCb")
																	.prop(
																			'checked',
																			false);
															$(
																	object.p.divRowElems[loopindex])
																	.removeClass(
																			object.p.cssPrefix
																					+ "-state-active")
																	.removeClass(
																			object.p.cssPrefix
																					+ "-row-selected");
															object.p.SelectedRows--;
														}
														loopindex++;
													}
												} else {
													var loopindex = 0;
													for ( var idx = object.p.StartIndex; idx <= jsonIdx; idx++) {
														if (object.jsonArrObj[idx].c) {
															object.jsonArrObj[idx].c = false;
															$(
																	object.p.divRowElems[loopindex])
																	.find(
																			".dataGridRowCb")
																	.prop(
																			'checked',
																			false);
															$(
																	object.p.divRowElems[loopindex])
																	.removeClass(
																			object.p.cssPrefix
																					+ "-state-active")
																	.removeClass(
																			object.p.cssPrefix
																					+ "-row-selected");
															object.p.SelectedRows--;
														}
														loopindex++;
													}
													for ( var idx = parseInt(object.p.ShiftSelIndex) + 1; idx < object.p.StartIndex; idx++) {
														if (object.jsonArrObj[idx].c) {
															object.jsonArrObj[idx].c = false;
															object.p.SelectedRows--;
														}
													}
												}
											} else {
												// backward
												if (jsonIdx >= object.p.StartIndex
														&& object.p.ShiftSelIndex <= object.p.EndIndex) {
													var loopindex = id;
													for ( var idx = jsonIdx; idx < parseInt(object.p.ShiftSelIndex); idx++) {
														if (object.jsonArrObj[idx].c) {
															object.jsonArrObj[idx].c = false;
															$(
																	object.p.divRowElems[loopindex])
																	.find(
																			".dataGridRowCb")
																	.prop(
																			'checked',
																			false);
															$(
																	object.p.divRowElems[loopindex])
																	.removeClass(
																			object.p.cssPrefix
																					+ "-state-active")
																	.removeClass(
																			object.p.cssPrefix
																					+ "-row-selected");
															object.p.SelectedRows--;
														}
														loopindex++;
													}
												} else {
													var loopindex = id;
													for ( var idx = jsonIdx; idx <= object.p.EndIndex; idx++) {
														if (object.jsonArrObj[idx].c) {
															object.jsonArrObj[idx].c = false;
															$(
																	object.p.divRowElems[loopindex])
																	.find(
																			".dataGridRowCb")
																	.prop(
																			'checked',
																			false);
															$(
																	object.p.divRowElems[loopindex])
																	.removeClass(
																			object.p.cssPrefix
																					+ "-state-active")
																	.removeClass(
																			object.p.cssPrefix
																					+ "-row-selected");
															object.p.SelectedRows--;
														}
														loopindex++;
													}
													for ( var idx = object.p.EndIndex + 1; idx < object.p.ShiftSelIndex; idx++) {
														if (object.jsonArrObj[idx].c) {
															object.jsonArrObj[idx].c = false;
															object.p.SelectedRows--;
														}
													}
												}
											}
										}
										object.p.ShiftSelIndex = -1;
										object.p.ShiftSelrowIndex = -1;
										object.p.ShiftActionType = -1;
									}
								} else {
									if (object.p.ShiftSelIndex == -1) {
										object.jsonArrObj[jsonIdx].c = true;
										$(object.p.divRowElems[id]).find(
												".dataGridRowCb").prop(
												'checked', true);
										$(object.p.divRowElems[id])
												.addClass(
														object.p.cssPrefix
																+ "-state-active")
												.addClass(
														object.p.cssPrefix
																+ "-row-selected");
										object.p.SelectedRows++;
										object.p.ShiftSelIndex = jsonIdx;
										object.p.ShiftSelrowIndex = id;
										object.p.ShiftActionType = 1;
									} else {
										if (object.p.ShiftActionType != 1) {
											object.jsonArrObj[jsonIdx].c = true;
											$(object.p.divRowElems[id])
													.addClass(
															object.p.cssPrefix
																	+ "-state-active")
													.addClass(
															object.p.cssPrefix
																	+ "-row-selected");
											$(object.p.divRowElems[id]).find(
													".dataGridRowCb").prop(
													'checked', true);
											object.p.SelectedRows++;
										} else {
											var delta = object.p.ShiftSelIndex
													- jsonIdx;
											if (delta < 0) {
												// forward
												if (object.p.ShiftSelIndex >= object.p.StartIndex
														&& jsonIdx <= object.p.EndIndex) {
													var loopindex = object.p.ShiftSelrowIndex + 1;
													for ( var idx = parseInt(object.p.ShiftSelIndex) + 1; idx <= jsonIdx; idx++) {
														if (!object.jsonArrObj[idx].c) {
															object.jsonArrObj[idx].c = true;
															$(
																	object.p.divRowElems[loopindex])
																	.find(
																			".dataGridRowCb")
																	.prop(
																			'checked',
																			true);
															$(
																	object.p.divRowElems[loopindex])
																	.addClass(
																			object.p.cssPrefix
																					+ "-state-active")
																	.addClass(
																			object.p.cssPrefix
																					+ "-row-selected");
															object.p.SelectedRows++;
														}
														loopindex++;
													}
												} else {
													var loopindex = 0;
													for ( var idx = object.p.StartIndex; idx <= jsonIdx; idx++) {
														if (!object.jsonArrObj[idx].c) {
															object.jsonArrObj[idx].c = true;
															$(
																	object.p.divRowElems[loopindex])
																	.find(
																			".dataGridRowCb")
																	.prop(
																			'checked',
																			true);
															$(
																	object.p.divRowElems[loopindex])
																	.addClass(
																			object.p.cssPrefix
																					+ "-state-active")
																	.addClass(
																			object.p.cssPrefix
																					+ "-row-selected");
															object.p.SelectedRows++;
														}
														loopindex++;
													}
													for ( var idx = parseInt(object.p.ShiftSelIndex) + 1; idx < object.p.StartIndex; idx++) {
														if (!object.jsonArrObj[idx].c) {
															object.jsonArrObj[idx].c = true;
															object.p.SelectedRows++;
														}
													}
												}
											} else {
												// backward
												if (jsonIdx >= object.p.StartIndex
														&& object.p.ShiftSelIndex <= object.p.EndIndex) {
													var loopindex = id;
													for ( var idx = jsonIdx; idx < parseInt(object.p.ShiftSelIndex); idx++) {
														if (!object.jsonArrObj[idx].c) {
															object.jsonArrObj[idx].c = true;
															$(
																	object.p.divRowElems[loopindex])
																	.find(
																			".dataGridRowCb")
																	.prop(
																			'checked',
																			true);
															$(
																	object.p.divRowElems[loopindex])
																	.addClass(
																			object.p.cssPrefix
																					+ "-state-active")
																	.addClass(
																			object.p.cssPrefix
																					+ "-row-selected");
															object.p.SelectedRows++;
														}
														loopindex++;
													}
												} else {
													var loopindex = id;
													for ( var idx = jsonIdx; idx <= object.p.EndIndex; idx++) {
														if (!object.jsonArrObj[idx].c) {
															object.jsonArrObj[idx].c = true;
															$(
																	object.p.divRowElems[loopindex])
																	.find(
																			".dataGridRowCb")
																	.prop(
																			'checked',
																			true);
															$(
																	object.p.divRowElems[loopindex])
																	.addClass(
																			object.p.cssPrefix
																					+ "-state-active")
																	.addClass(
																			object.p.cssPrefix
																					+ "-row-selected");
															object.p.SelectedRows++;
														}
														loopindex++;
													}
													for ( var idx = object.p.EndIndex + 1; idx < object.p.ShiftSelIndex; idx++) {
														if (!object.jsonArrObj[idx].c) {
															object.jsonArrObj[idx].c = true;
															object.p.SelectedRows++;
														}
													}
												}
											}
										}
										object.p.ShiftSelIndex = -1;
										object.p.ShiftSelrowIndex = -1;
										object.p.ShiftActionType = -1;
									}
								}
							} else {
								// without shift functionality
								object.p.ShiftSelIndex = -1;
								object.p.ShiftSelrowIndex = -1;
								object.p.ShiftActionType = -1;
								if (object.jsonArrObj[jsonIdx].c) {
									object.jsonArrObj[jsonIdx].c = false;
									$(object.p.divRowElems[id]).removeClass(
											object.p.cssPrefix
													+ "-state-active")
											.removeClass(
													object.p.cssPrefix
															+ "-row-selected");
									$(object.p.divRowElems[id]).find(
											".dataGridRowCb").prop('checked',
											false);
									object.p.SelectedRows--;
									if (object.TableEditable) {
										var idx = jsonIdx;
										if (object.SearchEnableFlag) {
											idx = object.jsonArrObj[jsonIdx].t;
										}
										delete object.modifiedRows[idx];
										$(object.p.divRowElems[id])
												.find(".dataGridRowCell")
												.each(
														function() {
															if (!($(this)
																	.hasClass(
																			"dataGridRowSnoCell") || $(
																	this)
																	.hasClass(
																			"dataGridRowCbCell"))) {
																var objIndex = $(
																		this)
																		.attr(
																				"MappedJsonVar");
																if (typeof objIndex !== 'undefined'
																		&& objIndex !== false) {
																	$(this)
																			.html(
																					object.jsonArrObj[jsonIdx][objIndex]);
																}
															}
														});
									}
								} else {
									object.jsonArrObj[jsonIdx].c = true;
									$(object.p.divRowElems[id]).addClass(
											object.p.cssPrefix
													+ "-state-active")
											.addClass(
													object.p.cssPrefix
															+ "-row-selected");
									$(object.p.divRowElems[id]).find(
											".dataGridRowCb").prop('checked',
											true);
									object.p.SelectedRows++;
									if (object.TableEditable) {
										var newObject = jQuery.extend({},
												object.jsonArrObj[jsonIdx]);
										delete newObject.c;
										var idx = jsonIdx;
										if (object.SearchEnableFlag) {
											idx = object.jsonArrObj[jsonIdx].t;
											delete newObject.t;
										}
										object.modifiedRows[idx] = newObject;
										$(object.p.divRowElems[id])
												.find(".dataGridRowCell")
												.each(
														function() {
															if (!($(this)
																	.hasClass(
																			"dataGridRowSnoCell") || $(
																	this)
																	.hasClass(
																			"dataGridRowCbCell"))) {
																var objIndex = $(
																		this)
																		.attr(
																				"MappedJsonVar");
																var editableFlag = $(
																		this)
																		.attr(
																				"IsEditable");
																if (typeof objIndex !== 'undefined'
																		&& objIndex !== false) {
																	if (editableFlag == "true") {
																		var inputObj = document
																				.createElement("input");
																		$(
																				inputObj)
																				.attr(
																						"type",
																						"text")
																				.addClass(
																						"inputCtrl")
																				.attr(
																						"target",
																						idx)
																				.val(
																						object.jsonArrObj[jsonIdx][objIndex])
																				.blur(
																						function() {
																							object.modifiedRows[$(
																									this)
																									.attr(
																											"target")][objIndex] = $
																									.trim($(
																											this)
																											.val());
																							return false;
																						});
																		$(this)
																				.html(
																						inputObj);
																	} else {
																		$(this)
																				.html(
																						object.jsonArrObj[jsonIdx][objIndex]);
																	}
																}
															}
														});
									}
								}
							}
							object.updateFooterSelectedRows();
							return false;
						};
						object.tableRowSort = function(prop, sortOrder) {
							object.jsonArrObj = object.jsonArrObj
									.sort(function(a, b) {
										if (sortOrder == 'asc')
											return (a[prop] > b[prop]) ? 1
													: ((a[prop] < b[prop]) ? -1
															: 0);
										else
											return (b[prop] > a[prop]) ? 1
													: ((b[prop] < a[prop]) ? -1
															: 0);
									});
							object.p.Rowcount = (object.p.TotalRowCount < object.p.DefaultRowCount) ? object.p.TotalRowCount
									: object.p.DefaultRowCount;
							object.p.StartIndex = 0;
							object.p.EndIndex = object.p.Rowcount - 1;
							object.p.PageIndex = 1;
							object.p.StartSerial = object.p.StartIndex + 1;
							object.p.EndSerial = object.p.EndIndex + 1;
							object.updateFooterSelectIndex(object.p.PageIndex);
							object.updateTableLayout();
						};
						object.gotoFirstPage = function() {
							object.gotoPage(1);
							object.updateFooterSelectIndex(1);
						};
						object.gotoLastPage = function() {
							object.gotoPage(object.p.PagesCount);
							object.updateFooterSelectIndex(object.p.PagesCount);
						};
						object.gotoPrevPage = function() {
							if (object.p.PageIndex == 1) {
								return;
							}
							object.gotoPage(parseInt(object.p.PageIndex) - 1);
							object.updateFooterSelectIndex(object.p.PageIndex);
						};
						object.gotoNextPage = function() {
							if (object.p.PageIndex == object.p.PagesCount) {
								return;
							}
							object.gotoPage(parseInt(object.p.PageIndex) + 1);
							object.updateFooterSelectIndex(object.p.PageIndex);
						};
						object.gotoPage = function(toPageIndex) {
							toPageIndex = parseInt(toPageIndex);
							if (toPageIndex == object.p.PageIndex) {
								return;
							}
							object.p.StartIndex = (toPageIndex - 1)
									* object.p.Rowcount;
							var delta1 = object.p.TotalRowCount
									- object.p.StartIndex - 1;
							var delta2 = object.p.Rowcount - 1;
							object.p.EndIndex = object.p.StartIndex
									+ ((delta1 < delta2) ? delta1 : delta2);
							object.p.StartSerial = object.p.StartIndex + 1;
							object.p.EndSerial = object.p.EndIndex + 1;
							object.p.PageIndex = toPageIndex;
							object.updateTableLayout();
						};
						object.updateTableLabels = function(labels) {
							var lbls = $.extend({}, settings.default_Labels,
									labels);
							var lblFlag = false;
							if ($.trim(lbls.FooterShowing_Lbl) != "") {
								$(object.tableObj).find(".footerShowingLbl")
										.html(lbls.FooterShowing_Lbl);
								lblFlag = true;
							}
							if ($.trim(lbls.FooterSelected_Lbl) != "") {
								$(object.tableObj).find(".footerSelectedLbl")
										.html(lbls.FooterSelected_Lbl);
								lblFlag = true;
							}
							if ($.trim(lbls.FooterModified_Lbl) != "") {
								$(object.tableObj).find(".footerModifiedLbl")
										.html(lbls.FooterModified_Lbl);
								lblFlag = true;
							}
							if ($.trim(lbls.FooterTotal_Lbl) != "") {
								$(object.tableObj).find(".footerTotalLbl")
										.html(lbls.FooterTotal_Lbl);
								lblFlag = true;
							}
							$.each(lbls.ColHeader_Lbls, function(i, obj) {
								var mappedVar = $.trim(obj.MappedJsonVar);
								var headerLabel = $.trim(obj.HeaderLabel);
								if (headerLabel != "" && mappedVar != "") {
									$(object.tableObj).find(
											".gridTableHeaderCellLabel[mappedjsonvar='"
													+ mappedVar + "']").html(
											headerLabel);
									lblFlag = true;
								}
							});
							if (lblFlag) {
								object.resize();
							}
						};
						object.updateDisplayCount = function(val) {
							object.p.DefaultRowCount = parseInt(val);
							object.p.Rowcount = (object.p.TotalRowCount < object.p.DefaultRowCount) ? object.p.TotalRowCount
									: object.p.DefaultRowCount;
							object.p.EndIndex = object.p.Rowcount - 1;
							object.p.StartIndex = 0;
							object.p.PageIndex = 1;
							object.p.PagesCount = Math
									.ceil(object.p.TotalRowCount
											/ object.p.Rowcount);
							object.p.StartSerial = object.p.StartIndex + 1;
							object.p.EndSerial = object.p.EndIndex + 1;
							object.p.ShiftFlag = false;
							object.p.ShiftSelIndex = -1;
							object.p.ShiftSelrowIndex = -1;
							object.p.ShiftActionType = -1;
							object.updateFooterSelectedRows();
							object.updateFooterDropDown();
							object.updateTableLayout();
						};
						object.updateFooterSelectIndex = function(id) {
							$(object.tableObj).find(".footerPageDropDownHold")
									.val(id);
						};
						object.updateFooterDropDown = function() {
							var footerPageOptions = '';
							for ( var pC = 1; pC <= object.p.PagesCount; pC++) {
								footerPageOptions += '<option value="' + pC
										+ '">' + pC + '</option>';
							}
							$(object.tableObj).find(".footerPageDropDownHold")
									.html(footerPageOptions);
							$(object.tableObj).find(".footerPageTotalLabel")
									.html(" / " + object.p.PagesCount);
						};
						object.updateFooterSelectedRows = function() {
							$(object.tableObj).find(".footerSelectedLabel")
									.html(object.p.SelectedRows);

							if (object.p.SelectedRows == object.p.TotalRowCount) {
								$(object.tableObj).find(".gridSelectAll").prop(
										'checked', true);
								$(object.tableObj).find(".gridSelectAll").prop(
										'indeterminate', false);
							} else if (object.p.SelectedRows == 0) {
								$(object.tableObj).find(".gridSelectAll").prop(
										'checked', false);
								$(object.tableObj).find(".gridSelectAll").prop(
										'indeterminate', false);
							} else {
								$(object.tableObj).find(".gridSelectAll").prop(
										'indeterminate', true);
							}
						};
						object.updateTableLayout = function() {
							var fromIndex = 0;
							for ( var idx = object.p.StartIndex; idx <= object.p.EndIndex; idx++) {
								var displayFlag = false;
								$(object.p.divRowElems[fromIndex])
										.find(".dataGridRowCell")
										.each(
												function() {
													if ($(this)
															.hasClass(
																	"dataGridRowSnoCell")) {
														$(this).html(idx + 1);
													} else if ($(this)
															.hasClass(
																	"dataGridRowCbCell")) {
														$(this).html('');
														$(
																"<input type='checkbox' class='dataGridRowCb'/>")
																.prop(
																		'checked',
																		object.jsonArrObj[idx].c)
																.appendTo(
																		$(this));
														$(
																object.p.divRowElems[fromIndex])
																.attr('target',
																		idx);
														if (object.jsonArrObj[idx].c) {
															$(
																	object.p.divRowElems[fromIndex])
																	.addClass(
																			object.p.cssPrefix
																					+ "-state-active")
																	.addClass(
																			object.p.cssPrefix
																					+ "-row-selected");
														} else {
															$(
																	object.p.divRowElems[fromIndex])
																	.removeClass(
																			object.p.cssPrefix
																					+ "-state-active")
																	.removeClass(
																			object.p.cssPrefix
																					+ "-row-selected");
														}
													} else {
														var objIndex = $(this)
																.attr(
																		"MappedJsonVar");
														var editableFlag = $(
																this).attr(
																"IsEditable");
														var idx1 = idx;
														if (object.SearchEnableFlag) {
															idx1 = object.jsonArrObj[idx].t;
														}
														if (typeof objIndex !== 'undefined'
																&& objIndex !== false) {
															if (object.jsonArrObj[idx].c
																	&& object.TableEditable
																	&& editableFlag == "true") {
																var inputObj = document
																		.createElement("input");
																$(inputObj)
																		.attr(
																				"type",
																				"text")
																		.addClass(
																				"inputCtrl")
																		.attr(
																				"target",
																				idx1)
																		.val(
																				object.modifiedRows[idx1][objIndex])
																		.blur(
																				function() {
																					object.modifiedRows[$(
																							this)
																							.attr(
																									"target")][objIndex] = $
																							.trim($(
																									this)
																									.val());
																					return false;
																				});
																$(this)
																		.html(
																				inputObj);
															} else {
																$(this)
																		.html(
																				object.jsonArrObj[idx][objIndex]);
															}
															displayFlag = true;
														}
													}
												});
								if (displayFlag) {
									$(object.p.divRowElems[fromIndex]).show();
									fromIndex++;
								}
							}
							$(object.tableObj).find(".footerRecordInfoLabel1")
									.html(
											object.p.StartSerial + " - "
													+ object.p.EndSerial);
							if (object.SearchEnableFlag) {
								$(object.tableObj).find(
										".footerRecordInfoLabel2").html(
										object.originalJson.length);
							} else {
								$(object.tableObj).find(
										".footerRecordInfoLabel2").html(
										object.p.TotalRowCount);
							}
							object.emptyTable(fromIndex);
						};
						object.emptyTable = function(fromIndex) {
							if (fromIndex == null) {
								fromIndex = 0;
								$(object.tableObj).find(
										".gridTableHeaderCellIcon").hide();
							}
							for (; fromIndex < opts.PerPageRowCount; fromIndex++) {
								if ($(object.p.divRowElems[fromIndex]).is(
										":hidden")) {
									break;
								}
								$(object.p.divRowElems[fromIndex]).hide();
								$(object.p.divRowElems[fromIndex]).find(
										".dataGridRowCell").html('');
								$(object.p.divRowElems[fromIndex]).removeClass(
										object.p.cssPrefix + "-state-active")
										.removeClass(
												object.p.cssPrefix
														+ "-row-selected");
							}
						};
						object.populateNewJson = function(newJsonArrObj) {
							object.jsonArrObj = genTableSpecificJSON(
									newJsonArrObj, object.SearchEnableFlag);
							if (object.TableEditable) {
								delete object.modifiedRows;
								object.modifiedRows = new Object();
							}
							if (object.SearchEnableFlag) {
								object.originalJson = object.jsonArrObj;
							}
							object.p.TotalRowCount = object.jsonArrObj.length;
							object.p.Rowcount = (object.p.TotalRowCount < object.p.DefaultRowCount) ? object.p.TotalRowCount
									: object.p.DefaultRowCount;
							object.p.StartIndex = 0;
							object.p.EndIndex = object.p.Rowcount - 1;
							object.p.PagesCount = Math
									.ceil(object.p.TotalRowCount
											/ object.p.Rowcount);
							object.p.PageIndex = 1;
							object.p.StartSerial = object.p.StartIndex + 1;
							object.p.EndSerial = object.p.EndIndex + 1;
							object.p.SelectedRows = 0;
							for ( var idx = 0; idx < object.p.DefaultRowCount; idx++) {
								$(object.p.divRowElems[idx]).hide();
							}
							$(object.tableObj).find(".gridSelectAll").prop(
									'checked', false);
							$(object.tableObj).find(".gridSelectAll").prop(
									'indeterminate', false);
							object.updateFooterSelectedRows();
							object.updateFooterDropDown();
							object.updateTableLayout();
						};
						object.changeTheme = function(newCSSPrefix) {
							$(object.table).find(
									object.p.cssPrefix + "-table-layout")
									.removeClass(
											object.p.cssPrefix
													+ "-table-layout")
									.addClass(newCSSPrefix + "-table-layout");
							$(object.table).find(
									object.p.cssPrefix + "-header-row")
									.removeClass(
											object.p.cssPrefix + "-header-row")
									.addClass(newCSSPrefix + "-header-row");
							$(object.table).find(
									object.p.cssPrefix + "-row-odd")
									.removeClass(
											object.p.cssPrefix + "-row-odd")
									.addClass(newCSSPrefix + "-row-odd");
							$(object.table).find(
									object.p.cssPrefix + "-row-even")
									.removeClass(
											object.p.cssPrefix + "-row-layout")
									.addClass(newCSSPrefix + "-table-layout");
							$(object.table).find(
									object.p.cssPrefix + "-row-hover")
									.removeClass(
											object.p.cssPrefix + "-row-layout")
									.addClass(newCSSPrefix + "-table-layout");
							$(object.table).find(
									object.p.cssPrefix + "-row-selected")
									.removeClass(
											object.p.cssPrefix
													+ "-row-selected")
									.addClass(newCSSPrefix + "-row-selected");
							$(object.table).find(
									object.p.cssPrefix + "-footer-row")
									.removeClass(
											object.p.cssPrefix + "-footer-row")
									.addClass(newCSSPrefix + "-footer-row");
							$(object.table).find(object.p.cssPrefix + "-icon")
									.removeClass(object.p.cssPrefix + "-icon")
									.addClass(newCSSPrefix + "-icon");
							$(object.table)
									.find(
											object.p.cssPrefix
													+ "-icon-seek-first")
									.removeClass(
											object.p.cssPrefix
													+ "-icon-seek-first")
									.addClass(newCSSPrefix + "-icon-seek-first");
							$(object.table).find(
									object.p.cssPrefix + "-icon-seek-prev")
									.removeClass(
											object.p.cssPrefix
													+ "-icon-seek-prev")
									.addClass(newCSSPrefix + "-icon-seek-prev");
							$(object.table).find(
									object.p.cssPrefix + "-icon-seek-next")
									.removeClass(
											object.p.cssPrefix
													+ "-icon-seek-next")
									.addClass(newCSSPrefix + "-icon-seek-next");
							$(object.table).find(
									object.p.cssPrefix + "-icon-seek-end")
									.removeClass(
											object.p.cssPrefix
													+ "-icon-seek-end")
									.addClass(newCSSPrefix + "-icon-seek-end");
							$(object.table)
									.find(
											object.p.cssPrefix
													+ "-icon-triangle-1-n")
									.removeClass(
											object.p.cssPrefix
													+ "-icon-triangle-1-n")
									.addClass(
											newCSSPrefix + "-icon-triangle-1-n");
							$(object.table)
									.find(
											object.p.cssPrefix
													+ "-icon-triangle-1-s")
									.removeClass(
											object.p.cssPrefix
													+ "-icon-triangle-1-s")
									.addClass(
											newCSSPrefix + "-icon-triangle-1-s");
							object.p.cssPrefix = opts.newCSSPrefix;
						};
						object.deleteSelectedRecords = function() {
							if (!object.TableEditable) {
								return;
							}
							if (object.SearchEnableFlag) {
								var len = object.originalJson.length;
								var idx = 0;
								while (idx < len) {
									if (object.originalJson[idx] != undefined
											&& object.originalJson[idx].c) {
										object.originalJson.splice(idx, 1);
									} else {
										idx++;
									}
								}
								object.jsonArrObj = object.originalJson;
							} else {
								var idx1 = 0;
								while (idx1 < object.p.TotalRowCount) {
									if (object.jsonArrObj[idx1] != undefined
											&& object.jsonArrObj[idx1].c) {
										object.jsonArrObj.splice(idx1, 1);
									} else {
										idx1++;
									}
								}
							}
							delete object.modifiedRows;
							object.modifiedRows = new Object();
							object.p.TotalRowCount = object.jsonArrObj.length;
							object.p.Rowcount = (object.p.TotalRowCount < object.p.DefaultRowCount) ? object.p.TotalRowCount
									: object.p.DefaultRowCount;
							object.p.StartIndex = 0;
							object.p.EndIndex = object.p.Rowcount - 1;
							object.p.PagesCount = Math
									.ceil(object.p.TotalRowCount
											/ object.p.Rowcount);
							object.p.PageIndex = 1;
							object.p.StartSerial = object.p.StartIndex + 1;
							object.p.EndSerial = object.p.EndIndex + 1;
							object.p.SelectedRows = 0;
							object.updateFooterSelectedRows();
							object.updateFooterDropDown();
							object.updateTableLayout();
						};
						object.saveModifiedRows = function() {
							if (!object.TableEditable) {
								return;
							}
							$
									.each(
											object.modifiedRows,
											function(idx, obj) {
												$
														.each(
																obj,
																function(objId,
																		objVal) {
																	if (object.SearchEnableFlag) {
																		object.originalJson[idx][objId] = objVal;
																		object.originalJson[idx].c = false;
																	} else {
																		object.jsonArrObj[idx][objId] = objVal;
																		object.jsonArrObj[idx].c = false;
																	}
																});
											});
							delete object.modifiedRows;
							object.modifiedRows = new Object();
							object.p.SelectedRows = 0;
							object.updateFooterSelectedRows();
							object.updateTableLayout();
						};
						object.searchJsonText = function() {
							var sInput = $.trim($(object.tableObj).find(
									".gridSearchInput").val());
							if (sInput == '') {
								object.jsonArrObj = object.originalJson;
								object.p.TotalRowCount = object.jsonArrObj.length;
								object.p.Rowcount = (object.p.TotalRowCount < object.p.DefaultRowCount) ? object.p.TotalRowCount
										: object.p.DefaultRowCount;
								object.p.StartIndex = 0;
								object.p.EndIndex = object.p.Rowcount - 1;
								object.p.PageIndex = 1;
								object.p.StartSerial = object.p.StartIndex + 1;
								object.p.EndSerial = object.p.EndIndex + 1;
								object
										.updateFooterSelectIndex(object.p.PageIndex);
								object.updateTableLayout();
							} else {
								var coloumns = [];
								$(object.tableObj)
										.find(".gridTableHeaderCell")
										.each(
												function() {
													if (!($(this)
															.hasClass(
																	"gridTableHeaderSno")
															|| $(this)
																	.hasClass(
																			"gridTableHeaderCb") || $(
															this)
															.hasClass(
																	"gridTableHeaderEmpty"))) {
														var objIndex = $(this)
																.attr(
																		"MappedJsonVar");
														var editflag = 'false';
														if (object.TableEditable) {
															editflag = $(this)
																	.attr(
																			"IsEditable");
														}
														if (typeof objIndex !== 'undefined'
																&& objIndex !== false
																&& editflag == 'false') {
															coloumns
																	.push(objIndex);
														}
													}
												});
								var jsonArray = [];
								var re = new RegExp(sInput, "gi");
								for ( var idx = 0; idx < object.originalJson.length; idx++) {
									var foundflag = false;
									innerLoop: for ( var colId = 0; colId < coloumns.length; colId++) {
										if (object.originalJson[idx].c
												|| object.originalJson[idx][coloumns[colId]]
														.match(re)) {
											foundflag = true;
											break innerLoop;
										}
									}
									if (foundflag) {
										jsonArray
												.push(object.originalJson[idx]);
									}
								}
								object.jsonArrObj = jsonArray;
								object.p.TotalRowCount = object.jsonArrObj.length;
								object.p.Rowcount = (object.p.TotalRowCount < object.p.DefaultRowCount) ? object.p.TotalRowCount
										: object.p.DefaultRowCount;
								object.tableRowSort('c', 'desc');
							}
							$(object.tableObj).find(
									".gridTableHeaderSearchCount").html(
									object.p.TotalRowCount);
							object.p.PagesCount = 0;
							if (object.p.Rowcount != 0) {
								object.p.PagesCount = Math
										.ceil(object.p.TotalRowCount
												/ object.p.Rowcount);
							}
							object.updateFooterDropDown();
						};
						object.getSelectedorModifiedRows = function() {
							var jsonSelectedArray = [];
							if (object.TableEditable) {
								$.each(object.modifiedRows, function(key, obj) {
									jsonSelectedArray.push(obj);
								});
							} else {
								if (object.SearchEnableFlag) {
									for ( var idx1 = 0; idx1 < object.originalJson.length; idx1++) {
										if (object.jsonArrObj[idx1].c) {
											var newObject = jQuery.extend({},
													object.originalJson[idx1]);
											delete newObject.c;
											delete newObject.t;
											jsonSelectedArray.push(newObject);
										}
									}
								} else {
									for ( var idx1 = 0; idx1 < object.p.TotalRowCount; idx1++) {
										if (object.jsonArrObj[idx1].c) {
											var newObject = jQuery.extend({},
													object.jsonArrObj[idx1]);
											delete newObject.c;
											jsonSelectedArray.push(newObject);
										}
									}
								}
							}
							return jsonSelectedArray;
						};
						object.getRows = function() {
							var jsonArray = [];
							if (object.SearchEnableFlag) {
								for ( var idx = 0; idx < object.originalJson.length; idx++) {
									var newObject = jQuery.extend({},
											object.object.originalJson[idx]);
									delete newObject.c;
									delete newObject.t;
									jsonArray.push(newObject);
								}
							} else {
								for ( var idx1 = 0; idx1 < object.p.TotalRowCount; idx1++) {
									var newObject = jQuery.extend({},
											object.jsonArrObj[idx1]);
									delete newObject.c;
									jsonArray.push(newObject);
								}
							}
							return jsonArray;
						};
						object.destroy = function() {
							$(object.tableObj).remove();
							object.$this.data('object', undefined);
							object.$this.removeData();
						};
						object.resize = function() {
							var maxWidth = $(object.tableObj).parent().width() - 5;
							var maxHeaderWidth = 0;
							$(object.tableObj).find(".gridTableHeaderCell")
									.each(
											function(index) {
												var colWidth = $(this).width();
												$(object.tableObj).find(
														".dataGridRow .dataGridRowCell:nth-child("
																+ (index + 1)
																+ ")").width(
														colWidth);
												maxHeaderWidth += colWidth + 7;
											});
							maxHeaderWidth += 20;
							var srhCntWdh = $(object.tableObj).find(
									".gridTableHeaderSearchCount").width();
							if (maxHeaderWidth > maxWidth) {
								$(object.tableObj).find(
										".gridTableHeaderSearchHold").width(
										maxWidth - 7);
								$(object.tableObj).find(".gridSearchInput")
										.width(maxWidth - (39 + srhCntWdh));
								$(object.tableObj).find(".gridTableHold")
										.width(maxWidth);
								$(object.tableObj).find(".gridTableFooter")
										.width(maxWidth - 2);
								$(object.tableObj)
										.find(".gridsearchHeaderHold").width(
												maxWidth - 2);
								$(object.tableObj).width(maxWidth);
							} else {
								$(object.tableObj).find(
										".gridTableHeaderSearchHold").width(
										maxHeaderWidth - 7);
								$(object.tableObj).find(".gridSearchInput")
										.width(
												maxHeaderWidth
														- (39 + srhCntWdh));
								$(object.tableObj).find(".gridTableHold")
										.width(maxHeaderWidth + 2);
								$(object.tableObj).find(".gridTableFooter")
										.width(maxHeaderWidth);
								$(object.tableObj)
										.find(".gridsearchHeaderHold").width(
												maxHeaderWidth);
								$(object.tableObj).width(maxHeaderWidth + 2);
							}
							$(object.tableObj).find(".gridTableHeader").width(
									maxHeaderWidth);
							$(object.tableObj).find(".dataGridRow").width(
									maxHeaderWidth - 20);
							$(object.tableObj).find(".gridTableContents")
									.width(maxHeaderWidth);
							return maxHeaderWidth;
						};
						object.showTable = function() {
							$(object.tableObj).show();
							var maxHeaderHeight = 0;
							$(object.tableObj).find(".gridTableHeaderCell")
									.each(function(index) {
										var elemHeight = $(this).height();
										if (elemHeight > maxHeaderHeight) {
											maxHeaderHeight = elemHeight;
										}
									});
							$(object.tableObj).find(".gridHeaderCellSeperator")
									.height(maxHeaderHeight);
							$(object.tableObj).find(".gridTableHeaderCell")
									.height(maxHeaderHeight);
							$(object.tableObj).find(".gridTableHeader").height(
									maxHeaderHeight + 3);
							var maxRowHeight = 0;
							$(object.tableObj).find(".dataGridRow:first").find(
									".dataGridRowCell").each(function(index) {
								var elemHeight = $(this).height();
								if (elemHeight > maxRowHeight) {
									maxRowHeight = elemHeight;
								}
							});
							$(object.tableObj).find(".dataGridRowCell").height(
									maxRowHeight);
							$(object.tableObj).find(".dataGridRow").height(
									maxRowHeight + 8);
							object.resize();
						};
						if (opts.MappingWithJson != null
								&& $.isArray(opts.MappingWithJson)
								&& opts.MappingWithJson.length > 0) {
							object = createHtmlTable(object);
						}
					} else {
						object = $(this).data('object');
					}
					objects.push(object);
				});
		if (objects.length === 1) {
			return_data = objects[0];
		} else {
			return_data = objects;
		}
		return_data.all = function(callback) {
			$.each(objects, function(i) {
				callback.call(this, i);
			});
		};
		return return_data;
	};
})(jQuery);