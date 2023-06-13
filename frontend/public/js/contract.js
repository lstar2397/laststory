// MetaMask 계정 값 가져오기
async function getMetaMaskAccount() {
  // MetaMask 계정에 연결된 웹3 프로바이더 객체 가져오기
  const provider = window.ethereum;

  // MetaMask 계정 사용자 권한 요청
  await provider.enable();

  // 연결된 계정 주소 가져오기
  const accounts = await provider.request({ method: "eth_accounts" });

  // 첫 번째 계정 주소 반환 (MetaMask는 여러 계정 지원)
  if (accounts.length > 0) {
    return accounts[0];
  } else {
    throw new Error("MetaMask 계정을 찾을 수 없습니다.");
  }
}
