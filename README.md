# table-row-controller

- 개발 100%
- 2017.01~2017.02 (2개월)

## 1. 기능

- 테이블 행 추가/삭제하기
- 자동 순번 매기기

## 2. 화면 예시

![_D__SEOULADM_My%20Documents_Documents_%EC%9E%85%EC%82%AC%EC%9E%90%EB%A3%8C_160818_%EB%8B%A4%EC%9A%B0%EA%B8%B0%EC%88%A0_%ED%94%8C%EB%9F%AC%EA%B7%B8%EC%9D%B8%EA%B0%9C%EB%B0%9C_index html](https://user-images.githubusercontent.com/14077108/135856670-494428cc-12bc-4eb2-9992-f2c8b23abad8.png)

## 3. 업데이트 히스토리

    ***** Ver 1.0.0     √
    - 행(1줄) 추가/삭제
    - 컴포넌트 초기화(일부 제외)
    - 순번(No) 자동 기입
    - 순번(No) 증가량 설정
    - rowspan 자동 적용
    - 행 추가 최대수 설정
    - 행 추가/삭제 콜백 함수 호출

    ***** Ver 1.0.1     √
    - 행 추가시 rowspan 처리 logic 개선

    ***** Ver 1.1.0     √
    - 다중 행 추가/삭제 구현

    ***** Ver 1.2.0	√
    - 셀렉터 구체적으로 설정 (ex. '해당 테이블'의 클래스..)
    - 순번 계산 오류 수정 (다중행)
    - 컴포넌트 name, id 지정 로직 변경
    - maxRow 처리 로직 변경
    - rowspan 옵션 추가
    - maxNo 옵션 추가

    ***** Ver 1.2.1	√
    - radio, check 초기화 로직 개선
    - 순번 계산 오류 수정 (다중행+rowspan)
    - rowspan 처리 로직 수정 (다중행+rowspan)
    - 컴포넌트 name, id 초기화 오류 수정

    ***** Ver 1.2.2	√
    - currency 컴포넌트 소수점(digits) 초기화 오류 수정 
    - 문서 수정시 plusCnt 계산 오류 수정 (rowspan 테이블도 고려)
    - 문서 수정 모드에서 플러그인 테스트

    ***** Ver 1.2.3
    - rowspanClass 처리 오류 수정
    - radio, check 컴포넌트 id 지정법 수정 (3개 이상일 때)
    - 코드 정리
