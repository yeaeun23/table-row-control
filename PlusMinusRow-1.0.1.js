/*  전자결재 양식 - 행 추가/삭제 Plug-In
                  Ver 1.0.1 (17.01.04) - 행 추가시 rowspan 처리 logic 개선  */


$.fn.PlusMinusRow = function(options){
	// defaults - 사용자가 정의하지 않은 옵션 변수의 기본값
	var defaults = {
		maxRow : 0,																		// 행 추가 최대수 (0: 무제한)
		copyRowNoSize : 1															// 행 순번(No) 증가량
	};

	// options - 사용자가 정의할 수 있는 옵션 변수
	var options = {
		tableId : options.tableId,										// 행 추가/삭제 수행 테이블 id (*필수)

		plusBtnId : options.plusBtnId,								// 행 추가 버튼 id (*필수)
		minusBtnId : options.minusBtnId,							// 행 삭제 버튼 id (*필수)

		copyRowClass : options.copyRowClass,					// 복사할 행(tr)의 class (*필수)
		copyRowNoClass : options.copyRowNoClass,			// 순번(No) 열(td)의 class
		copyRowNoSize : options.copyRowNoSize,				// 순번(No) 증가량 - int

		maxRow : options.maxRow,											// 행 추가 최대수 - int

		plusRowCallback : options.plusRowCallback,		// 행 추가 콜백 함수명
		minusRowCallback : options.minusRowCallback		// 행 삭제 콜백 함수명
	};

	var settings = $.extend( {}, defaults, options );



	// 행 추가 함수 실행 (행 추가 최대수까지 or 무제한으로)
	$("#"+settings.plusBtnId).on('click', function() {
		if($("."+settings.copyRowClass).length < settings.maxRow || settings.maxRow == 0)
			plusRow();
	});
	// 행 삭제 함수 실행
	$("#"+settings.minusBtnId).on('click', minusRow);



	function plusRow(){
		var $tr = $("."+settings.copyRowClass+":last").clone(true);		// 마지막 행 복사 (이벤트도)

		// ① rowspan 처리
		var $rowSpan = $("."+settings.copyRowClass+":first").find("td[rowspan]");

		if($rowSpan){
			$.each($rowSpan, function(k, v){
				$(v).attr("rowspan", parseInt($(v).attr("rowspan")) + 1);
			});
			$.each($tr.find("td[rowspan]"), function(k, v){
				$(v).remove();		// 최초 추가시 수행
			});
		}

		// ② 순번(No) 처리 - 옵션. 순번 클래스가 한 행에 두 개 이상 있을 경우 고려
		//    ex) 1  ...     2  ...             ex) 1  ...     1  ...
		//        3  ...     4  ...     or          2  ...     2  ...
		var copyRowNoCnt = $tr.find("."+settings.copyRowNoClass).length;

		if(copyRowNoCnt){
			for (var i=0; i<copyRowNoCnt; i++) {
				var newNo = parseInt($($tr.find("."+settings.copyRowNoClass)[i]).text())+settings.copyRowNoSize;
				$($tr.find("."+settings.copyRowNoClass)[i]).text(newNo);
			}
		}

		// ③ 각 컴포넌트들의 값을 초기화한 후,  ④ 마지막 행으로 추가
		$("."+settings.copyRowClass+":last").after(initComponent($tr));

		// ⑤ 행 추가 콜백 함수 실행
		if(typeof settings.plusRowCallback == 'function') {
			settings.plusRowCallback(this);
		}
	}



	function initComponent($tr){
		$.each($tr.find("td input"), function(k, v){
			var componentType = $(v).attr("data-dsl");
			var componentId = $(v).attr("id");

			if(!(componentType.search("check") > -1) && !(componentType.search("radio") > -1)){
				var newId = "editorFormCopied_" + (parseInt(componentId.split("_")[1])+20);

				$(v).attr( { name : newId, id : newId } );
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
				var newId = "editorFormCopied_" + (parseInt(componentId.split("_")[1])+20) + "_" +componentId.split("_")[2];

				$(v).attr( { name : newId, id : newId } );
				$(v).attr('checked', false);
			}
		});

		// select 초기화 (id 속성 존재 X)
		$.each($tr.find("td select"), function(k, v){
			var componentName = $(v).attr("name");
			var newName = "editorFormCopied_" + (parseInt(componentName.split("_")[1])+20);

			$(v).attr( { name : newName } );
		});

		// textarea 초기화
		$.each($tr.find("td textarea"), function(k, v){
			var componentId = $(v).attr("id");
			var newId = "editorFormCopied_" + (parseInt(componentId.split("_")[1])+20);

			$(v).attr( { name : newId, id : newId } );
			$(v).val("");
		});

		// TODO : org 초기화
		// TODO : cSum, rSum 초기화

		return $tr;
	}



	function minusRow(){
		// copy된 행이 존재하면
		if($("."+settings.copyRowClass).length > 1){
			// ① rowspan 처리
			var $rowSpan = $("."+settings.copyRowClass+":first").find("td[rowspan]");

			if($rowSpan) {
				$.each($rowSpan, function(k, v){
					$(v).attr("rowspan", parseInt($(v).attr("rowspan")) - 1);
				});
			}

			// ② 마지막 행 삭제
			$("."+settings.copyRowClass+":last").remove();
		}

		// copy된 행이 없으면 (모두 삭제되었으면)
		else if($("."+settings.copyRowClass).length == 1){
			// ①② 마지막 행 초기화
			initComponent($("."+settings.copyRowClass+":last"));
		}


		// ③ 행 삭제 콜백 함수 실행
		if(typeof settings.minusRowCallback == 'function') {
			settings.minusRowCallback(this);
		}
	}
}