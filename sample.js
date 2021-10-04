/* 테이블 행 추가/삭제 플러그인 사용 Sample js Code */

define(function(require) {
	var $ = require("jquery");
	var app = require("app");
	var Backbone = require("backbone");
	var PlusMinusRow = require("plugins/approval/forms/PlusMinusRow");		// 플러그인 파일 경로

	var Integration = Backbone.View.extend({
		initialize : function(options){
			this.options = options || {};
			this.docModel = this.options.docModel;
			this.variables = this.options.variables;
			this.infoData = this.options.infoData;
		},

		render : function() {

			$('.viewModeHiddenPart').show();	//버튼 숨기기

			// Plug-In 옵션 설정
			$('#dynamic_table').PlusMinusRow({
				/* 필수 옵션 */
				tableId : "dynamic_table",
				plusBtnId : "plusRow",
				minusBtnId : "minusRow",
				copyRowClass : "copyRow",
				/* 선택 옵션 */
				// copyRowNoClass : "copyRowNo",
				// copyRowNoSize : 2,
				// maxRow : 10,
				// maxNo : 10,
				// rowspanClass : "rowspan",
				// plusRowCallback : function() {},
				// minusRowCallback : function() {}
			});

			// 행 추가/삭제 테이블이 여러개일 때
			$('#dynamic_table2').PlusMinusRow({
				/* 필수 옵션 */
				tableId : "dynamic_table2",
				plusBtnId : "plusRow2",
				minusBtnId : "minusRow2",
				copyRowClass : "copyRow2",
				/* 선택 옵션 */
				// copyRowNoClass : "copyRowNo2",
				// copyRowNoSize : 2,
				// maxRow : 10,
				// maxNo : 10,
				// rowspanClass : "rowspan2",
				// plusRowCallback : function() {},
				// minusRowCallback : function() {}
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