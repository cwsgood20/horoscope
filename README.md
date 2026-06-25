# 오늘의 운세를 음성과 자막으로 듣기

모바일에서 바로 즐기는 작은 웹게임입니다. 버튼을 누르면 산신령, 제우스, 플라톤, 시저, 헤라클레스 같은 설명자가 랜덤으로 등장하고, 오늘의 운세를 음성과 자막으로 들려줍니다.

## 실행하기

이 폴더의 `index.html`을 브라우저로 열면 바로 실행됩니다. GitHub Pages에 올려도 정적 사이트로 동작합니다.

## GitHub 무료 LLM 모델 사용 방식

브라우저에 GitHub 토큰을 넣으면 노출되기 때문에, 이 프로젝트는 GitHub Actions에서 GitHub Models를 호출해 `data/fortune.json`을 매일 생성합니다. 웹게임은 그 JSON을 읽어서 사용자에게 보여줍니다.

워크플로 파일은 `.github/workflows/daily-fortune.yml`입니다.

## GitHub에 올리는 방법

1. GitHub에서 새 저장소를 만듭니다.
2. 이 폴더에서 아래 명령을 실행합니다.

```bash
git init
git add .
git commit -m "Create daily fortune voice game"
git branch -M main
git remote add origin https://github.com/아이디/저장소이름.git
git push -u origin main
```

3. GitHub 저장소의 `Settings` → `Pages`로 이동합니다.
4. `Build and deployment`에서 `Deploy from a branch`를 선택합니다.
5. Branch는 `main`, 폴더는 `/root`로 선택하고 저장합니다.
6. `Actions` 탭에서 `Generate daily fortunes` 워크플로를 한 번 수동 실행하면 GitHub Models가 오늘 운세를 생성합니다.

## 참고

GitHub Models 워크플로는 `models: read` 권한과 자동 제공되는 `GITHUB_TOKEN`을 사용합니다. 무료 API 사용량은 GitHub 정책에 따라 제한될 수 있습니다.
