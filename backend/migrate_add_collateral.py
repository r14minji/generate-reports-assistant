"""
데이터베이스 마이그레이션 스크립트: additional_info 테이블에 collateral_data 컬럼 추가

실행 방법:
python migrate_add_collateral.py
"""

import sqlite3

def migrate():
    # 데이터베이스 연결
    conn = sqlite3.connect('./corporate_loan.db')
    cursor = conn.cursor()

    try:
        # collateral_data 컬럼이 이미 존재하는지 확인
        cursor.execute("PRAGMA table_info(additional_info)")
        columns = [column[1] for column in cursor.fetchall()]

        if 'collateral_data' in columns:
            print("✓ collateral_data 컬럼이 이미 존재합니다. 마이그레이션을 건너뜁니다.")
            return

        # collateral_data 컬럼 추가
        cursor.execute("""
            ALTER TABLE additional_info
            ADD COLUMN collateral_data TEXT
        """)

        conn.commit()
        print("✓ collateral_data 컬럼이 성공적으로 추가되었습니다.")

    except Exception as e:
        print(f"✗ 마이그레이션 중 오류 발생: {e}")
        conn.rollback()

    finally:
        conn.close()

if __name__ == "__main__":
    print("데이터베이스 마이그레이션을 시작합니다...")
    migrate()
    print("마이그레이션이 완료되었습니다.")
