/*  전자결재 양식 - 테이블 행 추가/삭제 Plug-In
								Ver 1.2.2 (17.02.03) - 로직 개선 및 버그 수정 */

$.fn.PlusMinusRow = function(options){
	// 사용자가 정의하지 않은 일부 옵션 변수의 기본값
	var defaults = {
		maxRow : 0,																			// 행 추가 최대수 (0: 무제한)
		copyRowNoSize : 1																// 행 순번(No) 증가량
	};

	// 사용자가 정의할 수 있는 옵션 변수
	var options = {
		tableId : options.tableId,											// 행 추가/삭제 수행 테이블 id (*필수)

		plusBtnId : options.plusBtnId,									// 행 추가 버튼 id (*필수)
		minusBtnId : options.minusBtnId,								// 행 삭제 버튼 id (*필수)

		copyRowClass : options.copyRowClass,						// 복사할 행(tr)의 class (*필수)
		copyRowNoClass : options.copyRowNoClass,				// 순번(No) 열(td)의 class
		copyRowNoSize : options.copyRowNoSize,					// 순번(No) 증가량 :int

		maxRow : options.maxRow,												// 행 추가 최대수 :int
		maxNo : options.maxNo,													// 행 추가 최대 순번 :int

		rowspanClass : options.rowspanClass,						// 처리할 rowspan이 있는 열(td)의 class

		plusRowCallback : options.plusRowCallback,			// 행 추가 콜백 함수명
		minusRowCallback : options.minusRowCallback			// 행 삭제 콜백 함수명
	};

	var settings = $.extend( {}, defaults, options );
	
	
	// 행 추가 수행 횟수 계산 (순번 계산시 필요) - 문서 수정하는 경우 고려
	var plusCnt;
	if($("#"+settings.tableId+" .copiedRow")[0] === undefined ){
		plusCnt = 1;
	}
	else{
		// 다중행일 경우 고려
		if(!$($("#"+settings.tableId+" ."+settings.copyRowClass+" td")[0]).attr("rowspan")){
			plusCnt = $("#"+settings.tableId+" .copiedRow").length + 1;
		}
		else{
			var rowCnt = parseInt($($("#"+settings.tableId+" ."+settings.copyRowClass+" td")[0]).attr("rowspan"));
			plusCnt = ($("#"+settings.tableId+" .copiedRow").length + rowCnt) / rowCnt;
		}
	}


	// 행 추가 수행 (행 추가 최대수까지 or 무제한으로)
	$("#"+settings.plusBtnId).on('click', function() {
		if($("#"+settings.tableId+" ."+settings.copyRowClass).length + $("#"+settings.tableId+" .copiedRow").length < settings.maxRow || settings.maxRow == 0){
			if(settings.maxNo !== undefined){
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
	// 행 삭제 수행
	$("#"+settings.minusBtnId).on('click', minusRow);



	function plusRow(){
		var $tr = $("#"+settings.tableId+" ."+settings.copyRowClass).clone(true);		// 추가할 행 복사 (이벤트도)

		// ① rowspan 처리
		if($("#"+settings.tableId+" ."+settings.rowspanClass)[0] !== undefined){
			$.each($("#"+settings.tableId+" ."+settings.rowspanClass), function(k, v){
				$(v).attr("rowspan", parseInt($(v).attr("rowspan")) + $tr.length);
			});
			
			if(plusCnt == 1){			// 행 추가 최초 수행시
				$.each($tr.find("td[rowspan]"), function(k, v){
					if($(v).hasClass(settings.rowspanClass)){
						$(v).remove();	// rowspan을 가진 행(td) 삭제
					}
				});
			}
		}

		// ② 순번(No) 처리 - 순번 클래스가 한 행에 두 개 이상 있을 경우 고려 (optional)
		//    ex) 1  ...     2  ...             ex) 1  ...     1  ...
		//        3  ...     4  ...     or          2  ...     2  ...
		if($("#"+settings.tableId+" ."+settings.copyRowNoClass)[0] !== undefined){
			var copyRowNoCnt = $tr.find("."+settings.copyRowNoClass).length;		// 한 행에 존재하는 순번 클래스의 수
			
			for (var i=0; i<copyRowNoCnt; i++) {
				if(!$tr.find("."+settings.copyRowNoClass).attr('rowspan')){
					var newNo = parseInt($($tr.find("."+settings.copyRowNoClass)[i]).text())+settings.copyRowNoSize*plusCnt*$tr.length;
				}
				else{
					var newNo = parseInt($($tr.find("."+settings.copyRowNoClass)[i]).text())+settings.copyRowNoSize*plusCnt;
				}
				$($tr.find("."+settings.copyRowNoClass)[i]).text(newNo);
			}
		}

		// ③ class명 재설정 및 컴포넌트 초기화
		var i = 1;		// 다중행 복사일 때 컴포넌트 name/id 처리시 필요
		$.each($tr, function(k, v){
			$(v).removeClass(settings.copyRowClass);
			$(v).addClass('copiedRow');
			initComponent($(v), i++);
		});

		// ④ 처리 완료된 복사행을 테이블에 추가
		if($("#"+settings.tableId+" .copiedRow")[0] === undefined){
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
		var editorFormCnt = 1;		// 각 tr에 존재하는 컴포넌트 name/id 처리시 필요
		var flag = true;					// radio, check 컴포넌트 name/id 처리시 필요

		$.each($tr.find("td input"), function(k, v){
			var componentType = $(v).attr("data-dsl");
			var componentId = $(v).attr("id");

			if(!(componentType.search("check") > -1) && !(componentType.search("radio") > -1)){
				var newId = $(".copiedRow").length+i + "_" + editorFormCnt;

				$(v).attr( { name : newId, id : newId } );
				$(v).val("");

				// currency 초기화
				if(componentType.search("currency") > -1){
					var parseKey;
					componentType.replace(/{{([^}}]*)}}/g, function(m, key){
						parseKey = key;
					});
					var precision = parseKey.split('_');
					
					$(v).inputmask({
						'alias' : 'decimal',
						'groupSeparator' : ',',
						'autoGroup' : true,
						'digits' : parseInt(precision[1] ? precision[1] : '0'),		// 소수점 처리 (ex. {{currency_3}}일 때)
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
			
			// radio 초기화 - 기본 형식 고려: {{radio_A_B}} → editorForm_0_A, editorForm_0_B
			else if(componentType.search("radio") > -1){
				var newName = $(".copiedRow").length+i + "_" + editorFormCnt;
				var newId = $(".copiedRow").length+i + "_" + editorFormCnt + "_" +componentId.split("_")[2];

				if(flag == true){
					editorFormCnt--;
					flag = false;
				}
				else if(flag == false){
					flag = true;
				}

				$(v).attr( { name : newName, id : newId } );
				$(v).attr('checked', false);
			}
			
			// check 초기화 - 기본 형식 고려: {{check_A_B}} → editorForm_1_A, editorForm_1_B
			else if(componentType.search("check") > -1){
				var newId = $(".copiedRow").length+i + "_" + editorFormCnt + "_" +componentId.split("_")[2];

				if(flag == true){
					editorFormCnt--;
					flag = false;
				}
				else if(flag == false){
					flag = true;
				}

				$(v).attr( { name : newId, id : newId } );
				$(v).attr('checked', false);
			}

			editorFormCnt++;
		});

		// select 초기화
		$.each($tr.find("td select"), function(k, v){
			var componentName = $(v).attr("name");		// 기본 형식에서 id 속성이 존재하지 않으므로 name 값을 가져옴
			var newName = $(".copiedRow").length+i + "_" + editorFormCnt;

			$(v).attr( { name : newName, id : newName } );
			editorFormCnt++;
		});

		// textarea 초기화
		$.each($tr.find("td textarea"), function(k, v){
			var componentId = $(v).attr("id");
			var newId = $(".copiedRow").length+i + "_" + editorFormCnt;

			$(v).attr( { name : newId, id : newId } );
			$(v).val("");
			editorFormCnt++;
		});

		// TODO : cOrg 초기화
		// TODO : cSum, rSum 초기화


		return $tr;
	}



	function minusRow(){
		// 추가된 행(copiedRow 클래스)이 존재하면
		if($("#"+settings.tableId+" .copiedRow")[0] !== undefined){
			// ① rowspan 처리 후
			if($("#"+settings.tableId+" ."+settings.rowspanClass)[0] !== undefined){
				$.each($("#"+settings.tableId+" ."+settings.rowspanClass), function(k, v){
					$(v).attr("rowspan", parseInt($(v).attr("rowspan")) - $("#"+settings.tableId+" ."+settings.copyRowClass).length);
				});
			}
			// ① 마지막 행 삭제
			for (var i=0; i<$('.'+settings.copyRowClass).length; i++){
				$("#"+settings.tableId+" .copiedRow:last").remove();
			}
			plusCnt--;
		}

		// ② 행 삭제 콜백 함수 실행
		if(typeof settings.minusRowCallback == 'function') {
			settings.minusRowCallback(this);
		}
	}
}