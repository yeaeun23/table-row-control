/* 테이블 행 추가/삭제 플러그인 적용 예시 js */

define(function(require) {
	var $ = require("jquery");
	var app = require("app");
	var Backbone = require("backbone");
	var PlusMinusRow = require("plugins/approval/forms/PlusMinusRow");

	var Integration = Backbone.View.extend({
		initialize : function(options){
			this.options = options || {};
			this.docModel = this.options.docModel;
			this.variables = this.options.variables;
			this.infoData = this.options.infoData;
		},

		render : function() {

			$('.viewModeHiddenPart').show();
			
			$('#table1'+this.tableId).PlusMinusRow({
				tableId : "table1",
				plusBtnId : "plusRow1",
				minusBtnId : "minusRow1",
				copyRowClass : "copyRow1",
				copyRowNoClass : "copyRowNo1"
			});
			
			$('#table2'+this.tableId).PlusMinusRow({
				tableId : "table2",
				plusBtnId : "plusRow2",
				minusBtnId : "minusRow2",
				copyRowClass : "copyRow2",
				copyRowNoClass : "copyRowNo2"
			});
			
			$('#table3'+this.tableId).PlusMinusRow({
				tableId : "table3",
				plusBtnId : "plusRow3",
				minusBtnId : "minusRow3",
				copyRowClass : "copyRow3",
				copyRowNoClass : "copyRowNo3",
				copyRowNoSize : 2
			});
			
			$('#table4'+this.tableId).PlusMinusRow({
				tableId : "table4",
				plusBtnId : "plusRow4",
				minusBtnId : "minusRow4",
				copyRowClass : "copyRow4",
			});
			
			$('#table5'+this.tableId).PlusMinusRow({
				tableId : "table5",
				plusBtnId : "plusRow5",
				minusBtnId : "minusRow5",
				copyRowClass : "copyRow5",
				copyRowNoClass : "copyRowNo5",
				maxNo : 3
			});
			
			$('#table6'+this.tableId).PlusMinusRow({
				tableId : "table6",
				plusBtnId : "plusRow6",
				minusBtnId : "minusRow6",
				copyRowClass : "copyRow6",
				copyRowNoClass : "copyRowNo6",
				maxRow : 5
			});
			
			$('#table7'+this.tableId).PlusMinusRow({
				tableId : "table7",
				plusBtnId : "plusRow7",
				minusBtnId : "minusRow7",
				copyRowClass : "copyRow7",
				copyRowNoClass : "copyRowNo7"
			});
			
			$('#table8'+this.tableId).PlusMinusRow({
				tableId : "table8",
				plusBtnId : "plusRow8",
				minusBtnId : "minusRow8",
				copyRowClass : "copyRow8",
				rowspanClass : "rowspan8" 
			});
			
			$('#table9'+this.tableId).PlusMinusRow({
				tableId : "table9",
				plusBtnId : "plusRow9",
				minusBtnId : "minusRow9",
				copyRowClass : "copyRow9",
				rowspanClass : "rowspan9",
				copyRowNoClass : "copyRowNo9",
			});
			
			$('#table10'+this.tableId).PlusMinusRow({
				tableId : "table10",
				plusBtnId : "plusRow10",
				minusBtnId : "minusRow10",
				copyRowClass : "copyRow10"
			});
			
			$('#table11'+this.tableId).PlusMinusRow({
				tableId : "table11",
				plusBtnId : "plusRow11",
				minusBtnId : "minusRow11",
				copyRowClass : "copyRow11"
			});
			
		},


		renderViewMode : function(){
			$('.viewModeHiddenPart').hide();
		},

		onEditDocument : function(){
			this.render();
		},

		beforeSave :function() {
			$('.viewModeHiddenPart').hide();
		},

		afterSave :function() {
			$('.viewModeHiddenPart').hide();
		},

		validate :function() {
			return true;
		},

		getDocVariables : function(){
		}
	});

	return Integration;
});
