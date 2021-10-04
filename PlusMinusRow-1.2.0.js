/*  전자결재 양식 - 행 추가/삭제 Plug-In
                  Ver 1.2.0 (17.01.10) -  옵션 추가 및 로직,버그 수정 */

$.fn.PlusMinusRow = function(options){
	// defaults - 사용자가 정의하지 않은 일부 옵션 변수의 기본값
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
		copyRowNoSize : options.copyRowNoSize,				// 순번(No) 증가량 :int

		maxRow : options.maxRow,											// 행 추가 최대수 :int
		maxNo : options.maxNo,												// 행 추가 최대 순번 :int

		rowspanClass : options.rowspanClass,					// 처리할 rowspan이 존재하는 열(td)의 class

		plusRowCallback : options.plusRowCallback,		// 행 추가 콜백 함수명
		minusRowCallback : options.minusRowCallback		// 행 삭제 콜백 함수명
	};

	var settings = $.extend( {}, defaults, options );
	var plusCnt = 1;		// 행 추가 수행 횟수 (순번 계산시 필요)


	// 행 추가 함수 실행 (행 추가 최대수까지 or 무제한으로)
	$("#"+settings.plusBtnId).on('click', function() {
		if($("#"+settings.tableId+" ."+settings.copyRowClass).length + $("#"+settings.tableId+" .copiedRow").length < settings.maxRow || settings.maxRow == 0){
			if(settings.maxNo != undefined){
				if(parseInt($("#"+settings.tableId+" ."+settings.copyRowNoClass+":last").text()) < settings.maxNo){
					plusRow();
					plusCnt++;
				}
			}
			else{
				plusRow();
				plusCnt++;
			}
		}
	});
	// 행 삭제 함수 실행
	$("#"+settings.minusBtnId).on('click', minusRow);



	function plusRow(){
		var $tr = $("."+settings.copyRowClass).clone(true);		// 추가할 행 복사 (이벤트도)

		// ① rowspan 처리
		if($("."+settings.rowspanClass)[0] != undefined){
			$.each($("."+settings.rowspanClass), function(k, v){
				$(v).attr("rowspan", parseInt($(v).attr("rowspan")) + $tr.length);
			});
			$.each($tr.find("td[rowspan]"), function(k, v){
				$(v).remove();		// 최초 추가시 수행
			});
		}

		// ② 순번(No) 처리 - 옵션. 순번 클래스가 한 행에 두 개 이상 있을 경우 고려
		//    ex) 1  ...     2  ...             ex) 1  ...     1  ...
		//        3  ...     4  ...     or          2  ...     2  ...
		var copyRowNoCnt = $tr.find("."+settings.copyRowNoClass).length;

		if(copyRowNoCnt != 0){
			for (var i=0; i<copyRowNoCnt; i++) {
				var newNo = parseInt($($tr.find("."+settings.copyRowNoClass)[i]).text())+settings.copyRowNoSize*plusCnt*$tr.length;
				$($tr.find("."+settings.copyRowNoClass)[i]).text(newNo);
			}
		}

		// ③ 각 컴포넌트들의 값을 초기화한 후,  ④ 마지막 행으로 추가
		var i=1;
		$.each($tr, function(k, v){
			$(v).removeClass(settings.copyRowClass);
			$(v).addClass('copiedRow');
			initComponent($(v), i++);
		});

		if($("#"+settings.tableId+" .copiedRow")[0] == undefined){
			$("#"+settings.tableId+" ."+settings.copyRowClass+":last").after($tr);
		}
		else{
			$("#"+settings.tableId+" .copiedRow:last").after($tr);
		}

		// ⑤ 행 추가 콜백 함수 실행
		if(typeof settings.plusRowCallback == 'function') {
			settings.plusRowCallback(this);
		}
	}



	function initComponent($tr, i){
		var editorFormCnt = 1;

		$.each($tr.find("td input"), function(k, v){
			var componentType = $(v).attr("data-dsl");
			var componentId = $(v).attr("id");

			if(!(componentType.search("check") > -1) && !(componentType.search("radio") > -1)){
				var newId = $(".copiedRow").length+i + "_" + editorFormCnt;

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
			// radio 초기화
			else if(componentType.search("radio") > -1){
				var newName = $(".copiedRow").length+"_" + editorFormCnt;
				var newId = $(".copiedRow").length+"_" + editorFormCnt + "_" +componentId.split("_")[2];

				$(v).attr( { name : newName, id : newId } );
				$(v).attr('checked', false);
				editorFormCnt--;
			}
			// check 초기화
			else if(componentType.search("check") > -1){
				var newId = $(".copiedRow").length+"_" + editorFormCnt + "_" +componentId.split("_")[2];

				$(v).attr( { name : newId, id : newId } );
				$(v).attr('checked', false);
				editorFormCnt--;
			}

			editorFormCnt++;
		});

		// select 초기화 (id 속성 존재 X)
		$.each($tr.find("td select"), function(k, v){
			var componentName = $(v).attr("name");
			var newName = $(".copiedRow").length+"_" + editorFormCnt;

			$(v).attr( { name : newName } );
			editorFormCnt++;
		});

		// textarea 초기화
		$.each($tr.find("td textarea"), function(k, v){
			var componentId = $(v).attr("id");
			var newId = $(".copiedRow").length+"_" + editorFormCnt;

			$(v).attr( { name : newId, id : newId } );
			$(v).val("");
			editorFormCnt++;
		});

		// TODO : org 초기화
		// TODO : cSum, rSum 초기화

		return $tr;
	}



	function minusRow(){
		// copy된 행이 존재하면
		if($("#"+settings.tableId+" .copiedRow")[0] != undefined){
			// ① rowspan 처리
			if($("."+settings.rowspanClass)[0] != undefined){
				$.each($("."+settings.rowspanClass), function(k, v){
					$(v).attr("rowspan", parseInt($(v).attr("rowspan")) - $("."+settings.copyRowClass).length);
				});
			}

			// ② 마지막 행 삭제
			for (var i=0; i<$('.'+settings.copyRowClass).length; i++){
				$("#"+settings.tableId+" .copiedRow:last").remove();
			}
			plusCnt--;
		}

		// copy된 행이 없으면 (모두 삭제되었으면)
		else{
			// ①② 마지막 행 초기화
			$.each($("."+settings.copyRowClass), function(k, v){
				initComponent($(v));
			});
		}


		// ③ 행 삭제 콜백 함수 실행
		if(typeof settings.minusRowCallback == 'function') {
			settings.minusRowCallback(this);
		}
	}
}