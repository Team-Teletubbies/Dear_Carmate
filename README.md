# Dear_Carmate

## 1기 NbSprint 1팀

[Notion 1기 NbSprint 중급 프로젝트] (https://www.notion.so/Dear-Carmate-1da92958e4d48059895ac3ddcf8b8ede)

[GitHub 1기 NbSprint 중급 프로젝트] (https://github.com/Team-Teletubbies/Dear_Carmate)

## 팀원 구성

김한솔 (https://github.com/kimhansol2)

신민수 (https://github.com/minso0317)

박정은 (https://github.com/June-Park-developer)

석기현 (https://github.com/SeokGyeon)

## 프로젝트 소개

- B2B 형식의 중고차, 고객 및 거래 계약 관리 서비스
- 프로젝트 기간: 2025-04-16 ~ 2025-05-13

## 팀원별 구현 기능 상세

### 김한솔

- 계약 CRUD
- 계약서 CRUD
- 계약서 업로드/ 다운로드

### 신민수

- 차량 CRUD 구현
- 차량 대용량 데이터 CSV 파일 업로드 구현
- 이미지 업로드 구현

### 박정은

- 유저 구현
- 인증 인가 구현
- 회사 CRUD

### 석기현

- 고객 CRUD 구현
- 고객 대용량 업로드 구현
- 대시보드 구현

## 파일 구조

.github\ISSUE_TEMPLATE
┗ 이슈-템플릿.md
prisma
┣ schema.prisma
┗ seed.ts
src
┣ controllers
┃ ┣ carController.ts
┃ ┣ companyController.ts
┃ ┣ contractController.ts
┃ ┣ contractDocumentController.ts
┃ ┣ customerController.ts
┃ ┣ dashboardController.ts
┃ ┣ errorController.ts
┃ ┣ imageController.ts
┃ ┗ userController.ts
┣ dto
┃ ┣ carDTO.ts
┃ ┣ companyDto.ts
┃ ┣ contractDocumentDTO.ts
┃ ┣ contractDTO.ts
┃ ┣ customer.dto.ts
┃ ┗ userDTO.ts
┣ lib
┃ ┣ auth
┃ ┃ ┣ hash.ts
┃ ┃ ┣ jwt.ts
┃ ┃ ┗ redis.ts
┃ ┣ errors
┃ ┃ ┣ badRequestError.ts
┃ ┃ ┣ conflictError.ts
┃ ┃ ┣ forbiddenError.ts
┃ ┃ ┣ notFoundError.ts
┃ ┃ ┗ unauthorizedError.ts
┃ ┣ utils
┃ ┃ ┣ customers
┃ ┃ ┃ ┣ customerEnumConverter.ts
┃ ┃ ┃ ┣ customerInputConverter.ts
┃ ┃ ┃ ┗ customerMapper.ts
┃ ┃ ┣ formatLocalDateTime.ts
┃ ┃ ┗ statusMap.ts
┃ ┣ async-handler.ts
┃ ┣ constants.ts
┃ ┣ multerError.ts
┃ ┗ prisma.ts
┣ middleware
┃ ┣ requireAdmin.ts
┃ ┣ uploadMiddleware.ts
┃ ┣ verifyAccessToken.ts
┃ ┗ verifyRefreshToken.ts
┣ repositories
┃ ┣ carRepository.ts
┃ ┣ companyRepository.ts
┃ ┣ contractDocumentRepository.ts
┃ ┣ contractRepository.ts
┃ ┣ customerRepository.ts
┃ ┗ userRepository.ts
┣ routes
┃ ┣ authRouter.ts
┃ ┣ carRouter.ts
┃ ┣ companyRouter.ts
┃ ┣ contractDocumentRouter.ts
┃ ┣ contractRouter.ts
┃ ┣ customerRouter.ts
┃ ┣ dashboardRouter.ts
┃ ┣ imageRouter.ts
┃ ┗ userRouter.ts
┣ services
┃ ┣ carService.ts
┃ ┣ companyService.ts
┃ ┣ contractDocumentService.ts
┃ ┣ contractService.ts
┃ ┣ customerService.ts
┃ ┣ dashboardService.ts
┃ ┗ userService.ts
┣ structs
┃ ┣ carStruct.ts
┃ ┣ commonStruct.ts
┃ ┣ companyStruct.ts
┃ ┣ contractDocumentStruct.ts
┃ ┣ contractStruct.ts
┃ ┣ customerStruct.ts
┃ ┗ userStruct.ts
┣ types
┃ ┣ companyType.ts
┃ ┣ contractDocumentType.ts
┃ ┣ contractType.ts
┃ ┣ customerType.ts
┃ ┣ express.d.ts
┃ ┗ userType.ts
┗ app.ts
uploads\contracts
.env
.gitignore
.prettierrc
package.json
README.md
tsconfig.json

## 구현 홈페이지

https://twotim-dearcarmatefe.onrender.com/

## 프로젝트 회고록
