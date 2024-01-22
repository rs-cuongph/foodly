export function generateQRImage(
  bank: string,
  accountBank: string,
  accountName: string,
  amount: number,
  addInfo?: string
) {
  return `https://img.vietqr.io/image/${bank}-${accountBank}-compact2.jpg?amount=${amount}&addInfo=${decodeURIComponent(addInfo ?? '')}&accountName=${decodeURIComponent(accountName ?? '')}`
}