/* 정지은 일산 ABA — 프론트 런타임 설정.
 * 프론트(Vercel)와 백엔드(EC2)가 다른 도메인이면, 백엔드 공개 주소를 여기에 넣으세요.
 *   예) window.ABA_API_BASE = "https://api.도메인.com";   또는   "http://<EC2-공인IP>";
 * 프론트와 API가 같은 도메인이면 ""(빈 문자열) 그대로 두세요.
 */
// localhost 미리보기에서는 로컬 API(:4000, 실 백엔드 또는 mock)를, 배포 환경에서는 운영 API를 사용.
window.ABA_API_BASE =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:4000"
    : "https://jungaba-api.onrender.com";
