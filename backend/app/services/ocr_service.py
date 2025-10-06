import os
import tempfile
from pathlib import Path
from typing import Optional
from pdf2image import convert_from_path
import pytesseract
from PIL import Image
import cv2
import numpy as np


# Tesseract 실행 파일 경로 지정 (macOS)
pytesseract.pytesseract.tesseract_cmd = "/opt/homebrew/bin/tesseract"


class OCRService:
    """PDF 문서에서 텍스트를 추출하는 OCR 서비스"""

    def __init__(self):
        pass

    def preprocess_image(self, image: Image.Image) -> Image.Image:
        """OCR 정확도를 높이기 위한 이미지 전처리"""
        # PIL Image를 OpenCV 형식으로 변환
        opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        # 그레이스케일 변환
        gray = cv2.cvtColor(opencv_image, cv2.COLOR_BGR2GRAY)

        # 노이즈 제거
        denoised = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)

        # 이진화 (Otsu's method)
        _, binary = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        # OpenCV 이미지를 PIL Image로 변환
        processed_image = Image.fromarray(binary)

        return processed_image

    def extract_text_from_image(self, image: Image.Image, lang: str = "kor+eng") -> str:
        """이미지에서 텍스트 추출"""
        try:
            # 이미지 전처리
            processed_image = self.preprocess_image(image)

            # OCR 수행 (한국어 + 영어)
            text = pytesseract.image_to_string(processed_image, lang=lang)

            return text.strip()
        except Exception as e:
            print(f"OCR 오류: {str(e)}")
            return ""

    def extract_text_from_pdf(self, pdf_path: str, dpi: int = 300) -> str:
        """PDF 파일에서 텍스트 추출"""
        try:
            if not os.path.exists(pdf_path):
                raise FileNotFoundError(f"PDF 파일을 찾을 수 없습니다: {pdf_path}")

            # macOS에서 poppler 경로 설정
            poppler_path = "/opt/homebrew/bin"

            # PDF를 이미지로 변환
            images = convert_from_path(pdf_path, dpi=dpi, poppler_path=poppler_path)

            extracted_texts = []

            # 각 페이지에서 텍스트 추출
            for i, image in enumerate(images):
                print(f"페이지 {i+1}/{len(images)} 처리 중...")
                text = self.extract_text_from_image(image)
                if text:
                    extracted_texts.append(f"--- 페이지 {i+1} ---\n{text}")

            # 모든 페이지의 텍스트 결합
            full_text = "\n\n".join(extracted_texts)

            return full_text

        except Exception as e:
            raise Exception(f"PDF 텍스트 추출 실패: {str(e)}")

    def extract_text_from_image_file(self, image_path: str) -> str:
        """이미지 파일에서 텍스트 추출"""
        try:
            if not os.path.exists(image_path):
                raise FileNotFoundError(f"이미지 파일을 찾을 수 없습니다: {image_path}")

            image = Image.open(image_path)
            text = self.extract_text_from_image(image)

            return text

        except Exception as e:
            raise Exception(f"이미지 텍스트 추출 실패: {str(e)}")

    def extract_text_from_file(self, file_path: str) -> str:
        """파일 형식에 따라 텍스트 추출"""
        file_ext = Path(file_path).suffix.lower()

        if file_ext == ".pdf":
            return self.extract_text_from_pdf(file_path)
        elif file_ext in [".jpg", ".jpeg", ".png", ".gif", ".bmp"]:
            return self.extract_text_from_image_file(file_path)
        else:
            raise ValueError(f"지원하지 않는 파일 형식입니다: {file_ext}")
