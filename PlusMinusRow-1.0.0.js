/*****  행 추가/삭제 Plug-In  Ver 1.0  *****/
// [메가젠임플란트] 적용

$.fn.PlusMinusRow = function(options){

	var defaults = { 
		maxRow : 0,				// 행 추가 최대수 - 0 : 무제한
		copyRowNoSize : 1		// 순번(No) 증가량
	};
	
	var options = {
		tableId : options.tableId,									// 행 추가/삭제 기능을 수행할 테이블의 id (필수)

		plusBtnId : options.plusBtnId,								// 행 추가 버튼 id (필수)
		minusBtnId : options.minusBtnId,						// 행 삭제 버튼 id (필수)

		copyRowClass : options.copyRowClass,				// 복사할 행(tr)의 class (필수)
		copyRowNoClass : options.copyRowNoClass,		// 순번(No) 열(td)의 class
		copyRowNoSize : options.copyRowNoSize,			// 순번(No) 증가량 (int)

		maxRow : options.maxRow,								// 행 추가 최대수 (int)

		plusRowCallback : options.plusRowCallback,		// 행 추가 콜백 함수명
		minusRowCallback : options.minusRowCallback	// 행 삭제 콜백 함수명
	 };
	
	var settings = $.extend( {}, defaults, options );



	$("#"+settings.plusBtnId).on('click', function() {
		if($(" ."+settings.copyRowClass).length < settings.maxRow || settings.maxRow == 0)
			plusRow();
	});
	$("#"+settings.minusBtnId).on('click', minusRow);



	function plusRow(){
		var $tr = $(" ."+settings.copyRowClass+":last").clone(true);
		
		var $rowSpan = $("#"+settings.tableId).find("td[rowspan]");
		var copyRowNoCnt = $tr.find("."+settings.copyRowNoClass).length;
		
		// rowspan 속성 처리
		if($rowSpan){
			$.each($rowSpan, function(k, v){
				$(v).attr("rowspan", parseInt($(v).attr("rowspan")) + 1);
			});
			$.each($tr.find("td"), function(k, v){
				if($(v).attr("rowspan"))
					$(v).remove();
			});
		}
		
		// '순번(No)' 클래스가 한 행에 두 개 이상 있을 경우를 고려한 순번 처리
		//      ex) 1  ...     2  ...             ex) 1  ...     1  ...
		//           3  ...     4  ...     or          2  ...     2  ...
		if(copyRowNoCnt){
			for (var i=0; i<copyRowNoCnt; i++) {
				var newNo = parseInt($($tr.find("."+settings.copyRowNoClass)[i]).text())+settings.copyRowNoSize;
				$($tr.find("."+settings.copyRowNoClass)[i]).text(newNo);
			}
		}
		
		
		$(" ."+settings.copyRowClass+":last").after(initComponent($tr));
		
		
		if(typeof settings.plusRowCallback == 'function') { 
			settings.plusRowCallback(this);
		}
	}


	function initComponent($tr){
		$.each($tr.find("td input"), function(k, v){
			var componentType = $(v).attr("data-dsl");
			var componentId = $(v).attr("id");
			
			if(!(componentType.search("check") > -1) && !(componentType.search("radio") > -1)){
				var newName = "editorFormCopied_" + (parseInt(componentId.split("_")[1])+20);
	
				$(v).attr( { name : newName, id : newName } );
				$(v).val("");
	
				// currency 초기화
				if(componentType.search("currency") > -1){
					$(v).inputmask({
						'alias': 'decimal',
						'groupSeparator': ',',
						'autoGroup': true,
						'digits' : '0',
						'allowMinus' : true
					});
				}
				// calendar 초기화
				else if(componentType.search("calendar") > -1){
					$(v).datepicker("destroy").removeClass('hasDatepicker');
					$(v).datepicker({
						dateFormat : "yy-mm-dd(D)",
						changeMonth: true,
						changeYear : true,
						yearSuffix: "",
					});
				}
			}
			// radio, check 초기화
			else{
				var newName = "editorFormCopied_" + (parseInt(componentId.split("_")[1])+20) + "_" +componentId.split("_")[2];
				
				$(v).attr( { name : newName, id : newName } );
				$(v).attr('checked', false);
			}
		});
		
		// select 초기화
		$.each($tr.find("td select"), function(k, v){
			var componentName = $(v).attr("name");
			var newName = "editorFormCopied_" + (parseInt(componentName.split("_")[1])+20);

			$(v).attr( { name : newName, id : newName } );
		});
		
		// textarea 초기화
		$.each($tr.find("td textarea"), function(k, v){
			var componentName = $(v).attr("name");
			var newName = "editorFormCopied_" + (parseInt(componentName.split("_")[1])+20);

			$(v).attr( { name : newName, id : newName } );
			$(v).val("");
		});
		
		return $tr;
	}


	function minusRow(){
		if($(" ."+settings.copyRowClass).length > 1){
			var $rowSpan = $("#"+settings.tableId).find("td[rowspan]");
			
			if($rowSpan) {
				$.each($rowSpan, function(k, v){
					$(v).attr("rowspan", parseInt($(v).attr("rowspan")) - 1);
				});
			}

			$(" ."+settings.copyRowClass+":last").remove();
		}
		
		else if($(" ."+settings.copyRowClass).length == 1){
			var $tr = $(" ."+settings.copyRowClass+":last");
			initComponent($tr);
		}
		
		
		if(typeof settings.minusRowCallback == 'function') { 
			settings.minusRowCallback(this);
		}
	}
}
