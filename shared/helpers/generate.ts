export function generateQRImage(
  bank: string,
  accountBank: string,
  accountName: string,
  amount: number,
  addInfo?: string
) {

  const bankType = () => {
    switch (bank) {
      case "vpbank": {
        return "vpb"
      }
      default: {
        return bank;
      }
    }
  }

  return `https://img.vietqr.io/image/${bankType()}-${accountBank}-compact2.jpg?amount=${amount}&addInfo=${decodeURIComponent(addInfo ?? '')}&accountName=${decodeURIComponent(accountName ?? '')}`
}