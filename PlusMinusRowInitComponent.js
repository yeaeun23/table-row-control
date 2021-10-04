/* 테이블 행 추가/삭제 플러그인 컴포넌트 초기화 테스트 js */

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
			
			$("#dynamic_table1").PlusMinusRow({
				tableId : "dynamic_table1",
				plusBtnId : "plusRow1",
				minusBtnId : "minusRow1",
				copyRowClass : "copyRow1"
			});
			
			$("#dynamic_table2").PlusMinusRow({
				tableId : "dynamic_table2",
				plusBtnId : "plusRow2",
				minusBtnId : "minusRow2",
				copyRowClass : "copyRow2"
			});
		},


		renderViewMode : function(){
			$('.viewModeHiddenPart').hide();
		},

		onEditDocument : function(){
			$('.viewModeHiddenPart').show();
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
